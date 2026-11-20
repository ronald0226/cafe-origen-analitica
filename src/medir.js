const { generarVentasNo } = require('./generador');
const {
    totalVendidoInstrumentado,
    primeraVentaInstrumentada,
    ventaMayorInstrumentada,
    totalPorCiudadInstrumentado
} = require('./analiticaInstrumentada');
const { clientesRecurrentes } = require('./analitica');
const { performance } = require('node:perf_hooks');
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
const tamanosTiempos = [1000, 2000, 4000, 8000, 16000];
const resultadosTiempos = [];
console.log("=== INICIANDO CRONOMETRAJE PARA CLIENTES RECURRENTES ===")
for (const n of tamanosTiempos) {
    const ventas = generarVentasNo(n);
    const inicio = performance.now();
    clientesRecurrentes(ventas);
    const fin = performance.now();
    resultadosTiempos.push({
        'Tamaño (n)': n,
        'Tiempo (ms)': `${(fin - inicio).toFixed(2)} ms`
    });
}
const { totalCiudadCadena, totalCiudadUnaPasada } = require('./analitica');
const ventas10k = generarVentasNo (10000);
const ciudadPrueba = 'Medellin';
const resultadoCadena = totalCiudadCadena (ventas10k, ciudadPrueba);
const resultadoUnaPasada = totalCiudadUnaPasada (ventas10k, ciudadPrueba);
const sonIguales = resultadoCadena === resultadoUnaPasada;
console.log('=== COMPROBACIÓN CON 10.000 VENTAS ===');
console.log(`ciudad evaluada: ${ciudadPrueba}`);
console.log(`totalCiudadCadena: ${resultadoCadena}`);
console.log(`totalCiudadUnaPasada: ${resultadoUnaPasada}`);
console.log(`¿coinciden exactamente?: ${sonIguales}`);
if (!sonIguales) {
    console.warn('¡Atencion! Hay diferencia entre ambos resultados. Revise los campos del objeto venta (ej. total, precio, cantidad o ciudad).');
}
console.log("\n=== BENCHMARK DE ESCALABILIDAD: OPERACIONES POR FUNCION ===");
console.table(resultadosTabla);
console.log("\n=== TABLA DE TIEMPOS: CLIENTES RECURRENTES O(n²) ===");
console.table(resultadosTiempos);