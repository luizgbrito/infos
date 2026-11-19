import { createHmac, timingSafeEqual } from "node:crypto";
import { Buffer } from "node:buffer";

const maxBytes = 256 * 1024;
const uuid = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;
const attributionFields = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
];

type RecordValue = Record<string, unknown>;

function record(value: unknown): RecordValue {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as RecordValue
    : {};
}

async function readBody(request: Request) {
  const reader = request.body?.getReader();
  if (!reader) return Buffer.alloc(0);
  const chunks = [];
  let size = 0;
  for (;;) {
    const { value, done } = await reader.read();
    if (done) return Buffer.concat(chunks, size);
    size += value.byteLength;
    if (size > maxBytes) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
}

function signed(
  headers: Headers,
  body: Uint8Array,
  secret: string,
  now: number,
) {
  const timestamp = headers.get("X-Cakto-Timestamp") ?? "";
  const signature = headers.get("X-Cakto-Signature") ?? "";
  if (
    !/^\d{10}$/.test(timestamp) ||
    Math.abs(now / 1000 - Number(timestamp)) > 300
  ) {
    return false;
  }
  const expected = createHmac("sha256", secret).update(timestamp + ".").update(
    body,
  ).digest();
  return signature.split(",").some((part) => {
    const match = /^v1=([0-9a-f]{64})$/i.exec(part.trim());
    return match !== null &&
      timingSafeEqual(expected, Buffer.from(match[1], "hex"));
  });
}

type Settings = {
  secret?: string;
  productId?: string;
  offerId?: string;
  url?: string;
  serviceKey?: string;
};

export async function receive(
  request: Request,
  settings: Settings,
  fetcher = fetch,
  now = Date.now(),
) {
  const status = (code: number) =>
    new Response(null, {
      status: code,
      headers: { "Cache-Control": "no-store" },
    });
  if (request.method !== "POST") return status(405);
  const { secret, productId, offerId, url, serviceKey } = settings;
  if (
    !secret || !productId || !uuid.test(productId) || !offerId || !url ||
    !serviceKey
  ) {
    return status(503);
  }

  const body = await readBody(request).catch(() => undefined);
  if (body === null) return status(413);
  if (!body) return status(400);
  if (!signed(request.headers, body, secret, now)) return status(401);

  let envelope: RecordValue;
  try {
    envelope = record(JSON.parse(body.toString("utf8")));
  } catch {
    return status(400);
  }
  if (typeof envelope.event !== "string") return status(400);
  if (envelope.event !== "purchase_approved") return status(204);

  const data = Array.isArray(envelope.data) ? envelope.data : [envelope.data];
  const orders = new Map<string, RecordValue>();
  for (const value of data) {
    const order = record(value);
    if (
      record(order.product).id !== productId ||
      record(order.offer).id !== offerId ||
      order.offer_type !== "main" || order.status !== "paid"
    ) continue;

    const { id, amount, currency, paidAt } = order;
    if (
      typeof id !== "string" || !uuid.test(id) || typeof amount !== "number" ||
      !Number.isFinite(amount) || amount < 0 || typeof currency !== "string" ||
      !/^[A-Z]{3}$/.test(currency) || typeof paidAt !== "string" ||
      !Number.isFinite(Date.parse(paidAt))
    ) return status(400);

    const utm = Object.fromEntries(attributionFields.flatMap((field) => {
      const value = order[field];
      return typeof value === "string" && value.length <= 160 &&
          /^[\p{L}\p{N} ._:+/|~-]+$/u.test(value)
        ? [[field, value]]
        : [];
    }));
    orders.set(id.toLowerCase(), {
      order_id: id,
      offer_id: offerId,
      amount,
      currency,
      paid_at: new Date(paidAt).toISOString(),
      utm,
    });
  }
  if (!orders.size) return status(204);

  try {
    const result = await fetcher(
      new URL("/rest/v1/bw3d_cakto_purchases?on_conflict=order_id", url),
      {
        method: "POST",
        headers: {
          apikey: serviceKey,
          Authorization: "Bearer " + serviceKey,
          "Content-Type": "application/json",
          Prefer: "resolution=ignore-duplicates,return=minimal",
        },
        body: JSON.stringify([...orders.values()]),
        signal: AbortSignal.timeout(5000),
      },
    );
    await result.body?.cancel();
    return status(result.ok ? 204 : 503);
  } catch {
    return status(503);
  }
}

if (import.meta.main) {
  Deno.serve((request) =>
    receive(request, {
      secret: Deno.env.get("BW3D_CAKTO_WEBHOOK_SECRET"),
      productId: Deno.env.get("BW3D_CAKTO_PRODUCT_ID"),
      offerId: Deno.env.get("BW3D_CAKTO_OFFER_ID"),
      url: Deno.env.get("SUPABASE_URL"),
      serviceKey: Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
    })
  );
}
