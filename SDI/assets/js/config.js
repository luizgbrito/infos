/* =====================================================================
   CONFIGURACIÓN CENTRAL DEL FUNNEL
   Cambiá acá todo: nombre del mecanismo, precios (USD) y links de Cakto.
   Todo el funnel lee de este objeto, así que no hace falta tocar el HTML.
   ===================================================================== */
window.FUNNEL_CONFIG = {
  /* Nombre del mecanismo / producto. Alternativas sugeridas:
     "El Método de la Saciedad" · "El Protocolo de las 3 Señales" · "La Mezcla de los 21 Días" */
  mecanismo: "El Secreto de la Insulina",
  nombreClub: "Club del Secreto",

  /* Precios en USD. Localizá manteniendo la proporción entre etapas. */
  precios: {
    insumo:        "$1",       // costo de los ingredientes (debe sonar trivial)
    ozempic:       "$900",     // costo mensual de la pluma (ancla alta)
    semanal:       "$3",       // gasto semanal en ingredientes
    consulta:      "$80",      // consulta nutricional (ancla del upsell)

    front:         "$9",
    frontAncla:    "$47",

    bump:          "$5",
    bumpAncla:     "$15",

    upsell:        "$17",
    upsellAncla:   "$49",

    downsell:      "$11.90"
  },

  /* Links de checkout de Cakto. Pegá acá las URLs cuando tengas los productos creados. */
  checkout: {
    front:    "https://pay.cakto.com.br/36um3jj_1303524",   // checkout del producto principal (con order bump "Las Fiestas sin Picos" ya activado en Cakto)
    upsell:   "#",   // Club del Secreto ($17) — pegá el link de checkout (Ver links) o usá el upsell nativo de Cakto
    downsell: "#"    // Club del Secreto - Oferta ($11,90) — idem
  },

  /* Prueba social — reemplazá por datos reales antes de publicar. */
  social: {
    mujeres: "12.847"   // cambialo si corrés en el mismo mercado que los competidores
  },

  /* Soporte */
  whatsappSoporte: "https://wa.me/000000000",

  /* Backend de acceso del app. Vacío = modo demo (contraseña secreto21).
     Seteá la URL base de tus funciones (ej "https://TU-BACKEND.vercel.app/api")
     para liberar el app SOLO a quien compró (valida en la base de Supabase). */
  authApi: ""
};
