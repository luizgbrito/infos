/* Contenido del app. Editá / ampliá libremente (son tus entregables).
   Las recetas son de ejemplo con ingredientes naturales de supermercado. */
window.APP_DATA = {
  mezcla: {
    titulo: "La Mezcla de la mañana",
    intro: "Tómala en ayunas, 20 minutos antes del desayuno, durante los 21 días.",
    ingredientes: [
      "1 vaso de agua (250 ml), fría o a temperatura ambiente",
      "El jugo de 1/2 limón",
      "1 cucharadita de canela en polvo",
      "1 cucharadita de semillas de chía",
      "1 trozo pequeño de jengibre rallado (o 1/4 de cucharadita en polvo)",
      "1 cucharadita de vinagre de manzana (opcional)"
    ],
    preparacion: [
      "Deja las semillas de chía en el agua 5 minutos hasta que se hidraten.",
      "Agrega el jugo de limón, la canela, el jengibre y el vinagre.",
      "Mezcla bien con la licuadora o una cuchara y toma de inmediato.",
      "No le agregues azúcar. Si necesitas endulzar, usa unas gotas de stevia."
    ],
    nota: "Costo aproximado de los ingredientes: menos de 1 USD por porción."
  },

  plan21: [
    { s: "Semana 1 · Desinflamar", dias: [
      [1, "Arranque", "La Mezcla en ayunas + 2 litros de agua en el día."],
      [2, "Hidratación", "Repite la Mezcla. Suma 1 fruta de bajo índice glucémico en la mañana."],
      [3, "Sin azúcar visible", "Elimina azúcar de mesa y bebidas azucaradas. Mezcla + caminar 15 min."],
      [4, "Más verde", "Agrega una porción de verduras verdes al almuerzo y la cena."],
      [5, "Proteína en cada comida", "Incluye una fuente de proteína en desayuno, almuerzo y cena."],
      [6, "Corte nocturno", "Última comida 3 horas antes de dormir. Mezcla en ayunas."],
      [7, "Chequeo", "Mide cómo te sientes: hinchazón, energía y ropa. Anota tu progreso."]
    ]},
    { s: "Semana 2 · Acelerar", dias: [
      [8, "Mezcla + movimiento", "Suma 10 minutos de movimiento después de la Mezcla."],
      [9, "Platos balanceados", "Mitad verduras, un cuarto proteína, un cuarto carbohidrato bueno."],
      [10, "Snacks inteligentes", "Reemplaza ultraprocesados por fruta, frutos secos o un licuado."],
      [11, "Hidrata y descansa", "2,5 L de agua. Apunta a 7 h de sueño."],
      [12, "Día de licuado", "Cambia una comida por uno de los licuados del bono."],
      [13, "Sin picoteo nocturno", "Cierra la cocina después de la cena."],
      [14, "Chequeo", "Vuelve a medir. Compara con el día 7."]
    ]},
    { s: "Semana 3 · Consolidar", dias: [
      [15, "Rutina fija", "Mezcla + desayuno proteico ya es automático."],
      [16, "Postre que suma", "Prueba uno de los postres del bono cuando quieras dulce."],
      [17, "Más pasos", "Apunta a 7.000 pasos en el día."],
      [18, "Comer afuera", "Usa el protocolo de eventos: proteína + verduras primero."],
      [19, "Energía estable", "Nota cómo bajó la ansiedad por dulce."],
      [20, "Preparar el día 22", "Planea cómo seguís después de terminar."],
      [21, "Cierre", "Mide tu resultado final y celebra. Pasa al Plan del día 22."]
    ]}
  ],

  licuados: [
    ["Verde desinflamante", "Espinaca, pepino, 1/2 manzana verde, jengibre, agua y hielo."],
    ["Piña y jengibre", "Piña, jengibre, jugo de limón, agua de coco."],
    ["Rojo antioxidante", "Frutos rojos, 1 cucharada de chía, agua y canela."],
    ["Cremoso de avena", "Avena, canela, 1/2 banana, bebida vegetal sin azúcar."],
    ["Pepino y menta", "Pepino, menta, limón, agua y stevia."],
    ["Cacao proteico", "Cacao puro, 1/2 banana, proteína o yogur natural, bebida vegetal."]
  ],

  postres: [
    ["Mousse de cacao", "Palta, cacao puro, stevia y un toque de vainilla. A la heladera 1 h."],
    ["Helado de banana", "Banana congelada procesada con canela. Cremoso y sin azúcar."],
    ["Galletas de avena", "Avena, banana pisada y canela al horno 15 min."],
    ["Gelatina de frutos rojos", "Gelatina sin azúcar con frutos rojos frescos."],
    ["Trufas de dátil", "Dátiles, cacao y frutos secos procesados en bolitas."],
    ["Yogur con chía", "Yogur natural, chía, canela y fruta de bajo índice."]
  ],

  tips: [
    "Toma la Mezcla siempre en ayunas, es cuando mejor actúa.",
    "El agua es parte del método: apunta a 2 litros por día.",
    "Dormir poco frena el resultado. Protege tus horas de sueño.",
    "Camina después de comer: ayuda a controlar la glucosa.",
    "No te saltes comidas: eso dispara el hambre y el picoteo."
  ],

  dia22: {
    titulo: "Plan del día 22",
    texto: "Terminaste los 21 días. Para no recuperar lo que lograste: mantené la Mezcla de la mañana 3 veces por semana, seguí con platos balanceados y usá los licuados y postres del bono cuando quieras algo distinto. Esto es lo que hace el Club del Secreto todos los días con vos."
  }
};
