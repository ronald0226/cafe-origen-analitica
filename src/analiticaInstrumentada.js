function totalVendidoInstrumentado(ventas,contador) {
    let total = 0;
    for (let i = 0; i < ventas.length; i++) {
        contador.operaciones++;
        const venta = ventas [i];
        total += venta.precio * venta.cantidad;
    }
    return total;
}
function primeraVentaInstrumentada(ventas, contador) {
    contador.operaciones++;
    return ventas.length === 0 ? null : ventas[0];
}
function ventaMayorInstrumentada(ventas, contador) {
    if (ventas.length === 0) return null;
    let mayor = ventas[0];
    for (let i = 1; i < ventas.length; i++) {
        contador.operaciones++;
        const totalActual = ventas[i].precio * ventas[i].cantidad;
        const totalMayor = mayor.precio * mayor.cantidad;
        contador.comparaciones++;
        if (totalActual > totalMayor) {
            mayor = ventas[i];
        }
    }
    return mayor;
}
function totalPorCiudadInstrumentado(ventas, contador) {
    const acumuladorCiudades = new Map();
    for (let i = 0; i < ventas.length; i++) {
        contador.operaciones++;
        const venta = ventas [i];
        const claveCiudad = venta.ciudad.trim().toLocaleLowerCase('es');
        contador.comparaciones++;
        if (!acumuladorCiudades.has(claveCiudad)) {
            acumuladorCiudades.set(claveCiudad, {
                ciudadOriginal: venta.ciudad,
                totalDinero: 0,
            });
            }
            const registro = acumuladorCiudades.get(claveCiudad); registro.totalDinero += venta.precio * venta.cantidad;
        }
    return Array.from(acumuladorCiudades.values());
}
module.exports = {
    totalVendidoInstrumentado,
    primeraVentaInstrumentada,
    ventaMayorInstrumentada,
    totalPorCiudadInstrumentado
};