const { generarVentasNo } = require('./generador');
const {
    totalVendidoInstrumentado,
    primeraVentaInstrumentada,
    ventaMayorInstrumentada,
    totalPorCiudadInstrumentado
} = require('./analiticaInstrumentada');
const tamanos = [100,1000,10000,100000];
const resultadosTabla = [];
for (const n of tamanos) {
    const ventas = generarVentasNo(n);
    const contadorTotal = { operaciones: 0, comparaciones: 0 }; totalVendidoInstrumentado(ventas, contadorTotal);
    const contadorPrimera = { operaciones: 0, comparaciones: 0 }; primeraVentaInstrumentada(ventas, contadorPrimera);
    const contadorMayor = { operaciones: 0, comparaciones: 0 }; ventaMayorInstrumentada(ventas, contadorMayor);
    const contadorCiudades = { operaciones: 0, comparaciones: 0 }; totalPorCiudadInstrumentado(ventas, contadorCiudades);
    resultadosTabla.push({
        n: n,
        totalVendido_ops: contadorTotal.operaciones + contadorTotal.comparaciones,
        primeraVenta_ops: contadorPrimera.operaciones + contadorPrimera.comparaciones,
        ventaMayor_ops: contadorMayor.operaciones + contadorMayor.comparaciones,
        totalPorCiudad_ops: contadorCiudades.operaciones + contadorCiudades.comparaciones
    });
}
console.log("=== BENCHMARK DE ESCALABILIDAD: OPERACIONES POR FUNCION ===");
console.table(resultadosTabla);