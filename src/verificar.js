const ventas = require('./datos');

let totalVendidoCiclo = 0;
for (const venta of ventas) {
  totalVendidoCiclo += venta.precio * venta.cantidad;
}

const totalVendidoMetodos = ventas.reduce(
  (total, venta) => total + venta.precio * venta.cantidad,
  0
);

console.log(
  `Total vendido: ${totalVendidoCiclo === totalVendidoMetodos ? 'OK' : 'DIFERENTE'}`
);
const generarVentas = requiere('./generador');
const {
  clientesRecurrentesOriginal,
  clientesRecurrentesSet,
  clientesRecurrentesMap
} = require('./analitica');
function ordenarRecurrentes(lista) {
  return [...lista].sort((a,b) => a.localeCompare(b));
}
function verificarRecurrentes (etiqueta,datos) {
  const orig = ordenarRecurrentes(clientesRecurrentesOriginal(datos));
  const conSet = ordenarRecurrentes(clientesRecurrentesSet(datos));
  const conMap = ordenarRecurrentes(clientesRecurrentesMap(datos));
  const okSet = JSON.stringify(orig) === JSON.stringify(conSet);
  const okMap = JSON.stringify(orig) === JSON.stringify(conMap);
  console.log('${etiqueta} -> Set OK: ${okSet} | Map OK: ${okMap}')
}
verificarRecurrentes("Dia 1", ventas);
const ventas5000 = generarVentas(5000);
verificarRecurrentes("5.000 ventas", ventas5000);
