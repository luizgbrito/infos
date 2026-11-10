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
    front:    "#",   // checkout del producto principal (con order bump activado en Cakto)
    upsell:   "#",   // link de upsell 1-clic (Cakto genera este link)
    downsell: "#"    // link de downsell 1-clic
  },

  /* Prueba social — reemplazá por datos reales antes de publicar. */
  social: {
    mujeres: "12.847"   // cambialo si corrés en el mismo mercado que los competidores
  },

  /* Soporte */
  whatsappSoporte: "https://wa.me/000000000"
};
