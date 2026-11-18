const ventas = require('./datos.js');
const totalVendidoM = ventas.reduce(
  (acumulador, venta) => acumulador + venta.precio * venta.cantidad,
  0
);
console.log("total vendido ($): " + totalVendidoM);
function ventasDelDia(ventas, fechaBuscada) {
  return ventas.filter(venta => venta.fecha === fechaBuscada);
}
function clientesRecurrentes(ventas, contador = { comparaciones: 0 }) {
  const recurrentes = new Set();

  for (let i = 0; i < ventas.length; i++) {
    for (let j = i + 1; j < ventas.length; j++) {
      contador.comparaciones++;
      if (ventas[i].cliente === ventas[j].cliente) {
        recurrentes.add(ventas[i].cliente);
      }
    }
  }

  return Array.from(recurrentes);
}
function topProductosPorValor(ventas, k) {
  const valorPorProducto = new Map();

  for (const venta of ventas) {
    const claveProducto = venta.producto.trim().toLocaleLowerCase('es');
    const producto = valorPorProducto.get(claveProducto) || {
      producto: venta.producto,
      valor: 0
    };
    producto.valor += venta.precio * venta.cantidad;
    valorPorProducto.set(claveProducto, producto);
  }

  return Array.from(valorPorProducto.values())
    .sort((a, b) => b.valor - a.valor)
    .slice(0, Math.max(0, Math.floor(k)));
}

module.exports = {
  totalVendidoM,
  ventasDelDia,
  clientesRecurrentes,
  topProductosPorValor,
};
