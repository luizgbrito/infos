#!/usr/bin/env python3
"""Cakto USD product setup. Dry-run by default, writes only with --create.
Requires explicit sales-page URL and account API credentials; never stores secrets.
It deliberately refuses to create a duplicate if it cannot verify the existing catalog.
"""
import argparse, json, os, sys, urllib.request, urllib.error, urllib.parse
from pathlib import Path

BASE='https://api.cakto.com.br/public_api'
HERE=Path(__file__).resolve().parent
payload=json.loads((HERE/'configuracao.json').read_text(encoding='utf-8'))['produto']
parser=argparse.ArgumentParser()
parser.add_argument('--create',action='store_true',help='Explicitly create the product in a live Cakto account')
args=parser.parse_args()
sales=os.environ.get('BW3D_SALES_PAGE','').strip()
if sales.startswith('https://'):
    payload['salesPage']=sales
print(json.dumps({'method':'POST','endpoint':BASE+'/products/','payload':payload,'mode':'LIVE' if args.create else 'PREVIEW'},ensure_ascii=False,indent=2))
if not args.create:
    print('PREVIEW ONLY: no API calls, no product created.')
    sys.exit(0)
if not sales.startswith('https://'):
    sys.exit('ERROR: BW3D_SALES_PAGE must be the real public HTTPS sales page')
client=os.environ.get('CAKTO_CLIENT_ID','')
secret=os.environ.get('CAKTO_CLIENT_SECRET','')
if not client or not secret:
    sys.exit('ERROR: CAKTO_CLIENT_ID and CAKTO_CLIENT_SECRET are required; do not place credentials in source code')

def call(method,path,data=None,headers=None,form=False):
    body=None
    if data is not None:
        body=urllib.parse.urlencode(data).encode() if form else json.dumps(data).encode()
    hdr=headers or {}
    if body:
        hdr['Content-Type']='application/x-www-form-urlencoded' if form else 'application/json'
    req=urllib.request.Request(BASE+path,data=body,headers=hdr,method=method)
    try:
        with urllib.request.urlopen(req,timeout=25) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        print('Cakto API HTTP '+str(e.code)+': '+e.read(800).decode(errors='replace'),file=sys.stderr)
        sys.exit(1)

token=call('POST','/token/',{'client_id':client,'client_secret':secret},form=True).get('access_token')
if not token: sys.exit('ERROR: no access_token received')
headers={'Authorization':'Bearer '+token}
# Refuse to create if product catalog cannot be read, to avoid accidental duplicates.
catalog=call('GET','/products/',headers=headers)
if isinstance(catalog,list): items=catalog
elif isinstance(catalog,dict):
    items=next((catalog[k] for k in ('results','data','items') if isinstance(catalog.get(k),list)),None)
else: items=None
if items is None: sys.exit('ERROR: could not inspect product catalog; no product was created')
if any(isinstance(x,dict) and x.get('name')==payload['name'] for x in items):
    sys.exit('ERROR: product with this exact name already exists; inspect Cakto instead of creating a duplicate')
result=call('POST','/products/',payload,headers)
public={k:result.get(k) for k in ('id','short_id','name','currency','price') if isinstance(result,dict) and k in result}
print('CREATED:',json.dumps(public,ensure_ascii=False))
print('NEXT: inspect product checkouts and copy the REAL payment URL into ../js/config.js')
