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
