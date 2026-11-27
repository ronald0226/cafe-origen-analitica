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
function totalCiudadCadena (ventas, ciudadBuscada) {
  const ciudadFiltro = typeof ciudadBuscada === 'string'
    ? ciudadBuscada.trim().toLowerCase()
    : '';
  return ventas
    .map(venta => ({
      ...venta,
      ciudadNormalizada: typeof venta.ciudad === 'string'
        ? venta.ciudad.trim().toLowerCase()
        : ''
    }))
    .filter(venta => venta.ciudadNormalizada === ciudadFiltro)
    .map(venta => venta.total ?? ((venta.precio || 0) * (venta.cantidad || 0)))
    .reduce((acumulador, valorActual) => acumulador + valorActual, 0);
}
function totalCiudadUnaPasada(ventas, ciudadBuscada) {
  const ciudadFiltro = typeof ciudadBuscada === 'string'
    ? ciudadBuscada.trim().toLowerCase()
    : '';
  let total = 0;
  for (let i = 0; i < ventas.length; i++) {
    const venta = ventas[i];
    const ciudadActual = typeof venta.ciudad === 'string'
      ? venta.ciudad.trim().toLowerCase()
      : '';
    if (ciudadActual === ciudadFiltro) {
      const valorVenta = venta.total ?? ((venta.precio || 0) * (venta.cantidad || 0));
      total += valorVenta;
    }
  }
  return total;
}
function clientesRecurrentesOptimizada (ventas) {
  if (!Array.isArray(ventas)) return [];
  const conteoPorCliente = new map ();
  const recurrentes = [];
  for (let i = 0; i < ventas.length; i++) {
    const rawCliente = ventas[i]?.cliente;
    if (typeof rawCliente !== "string") continue;
    const cliente = rawCliente.trim().toLowerCase();
    if (!cliente) continue;
    const comprasPrevias = conteoPorCliente.get(cliente) || 0;
    const totalCompras = comprasPrevias + 1;
    conteoPorCliente.set(cliente, totalCompras);
    if (totalCompras === 2) {
      recurrentes.push(cliente);
    }
  }
  return recurrentes;
}
function clientesRecurrentesSet(ventas) {
  if (!Array.isArray(ventas)) return [];
  const vistos = new set ();
  const recurrentes = new set ();
  for (let i = 0; i < ventas.length; i++) {
    const rawCliente = ventas[i]?.cliente;
    if (typeof rawCliente !== "string") continue;
    const cliente = rawCliente.trim().toLowerCase();
    if (!cliente) continue;
    if (vistos.has(cliente)) {
      recurrentes.add(cliente);
    } else {
      vistos.add(cliente);
    }
  }
  return Array.from(recurrentes);
}
function comprasPorCliente(ventas) {
  const conteo = new map();
  if (!Array.isArray(ventas)) return conteo;
  for (let i = 0; i < ventas.length; i++) {
    const rawCliente = ventas[i]?.cliente;
    if (typeof rawCliente !== "string") continue;
    const cliente =rawCliente.trim().toLowerCase();
    if (!cliente) continue;
    const cantidadActual = conteo.get(cliente) || 0;
    conteo.set(cliente, cantidadActual + 1);
  }
  return conteo;
}
function recurrentesDesdeCompras (ventas) {
  const mapaCompras = comprasPorcliente (ventas);
  const recurrentes = [];
  for (const [cliente, totalcompras] of mapaCompras.entries()) {
    if (totalCompras >= 2) {
      recurrentes.push(cliente);
    }
  }
  return recurrentes;
}
module.exports = {
  totalVendidoM,
  ventasDelDia,
  clientesRecurrentes,
  topProductosPorValor,
  totalCiudadCadena,
  totalCiudadUnaPasada,
};
