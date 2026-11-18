const ventas = require('./datos.js');
const totalVendidoM = ventas.reduce(
  (acumulador, venta) => acumulador + venta.precio * venta.cantidad,
  0
);
console.log("total vendido ($): " + totalVendidoM);
function ventasDelDia(ventas, fechaBuscada) {
  return ventas.filter(venta => venta.fecha === fechaBuscada);
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
  topProductosPorValor,
};
