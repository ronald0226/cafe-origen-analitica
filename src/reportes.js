const ventas = require('./datos.js');
const { totalVendidoM } = require('./analitica.js');
console.log("=".repeat(60));
console.log("      REPORTE EJECUTIVO DE NEGOCIO");
console.log("               CAFÉ ORIGEN");
console.log("=".repeat(60));
console.log("=====================================");
console.log("    REPORTE DE NEGOCIO - CAFÉ ORIGEN");
console.log("=====================================");
console.log("/n[1]. RESUMEN GENERAL");
console.log("-".repeat(40));
console.log('•Total de registros analizados: ${ventas.length}');
const totalFormateado = totalVendidoM.toLocaleString("es-CO", {
   style: "currency",
   currency: "COP",
   maximumFractionDigits: 0
});
console.log('Total vendido en dinero      : ${totalFormateado}');
console.log("/n[2]. VENTAS POR CIUDAD");
console.log("-".repeat(40));
console.log("(pendiente de integrar la funcion de agrupación)");
console.log("/n[3]. UNIDADES POR PRODUCTO");
console.log("-".repeat(40));
console.log("(pendiente de integrar la funcion de ranking)");
console.log("/n[4]. TOP 3 PRODUCTOS QUE MAS DINERO GENERARON");
console.log("-".repeat(40));
console.log("(pendiente de integrar la funcion del Top 3)")
console.log("/n" + "=".repeat(60));
console.log("       FIN DEL REPORTE - v0.1             ");
console.log("=".repeat(60));
