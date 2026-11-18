function generarVentasNo(n) {
    const catalogoProductos = [
        { nombre: "Café Molido Tradicional",precio: 20000 },
        { nombre: "Café en Grano Especial",precio: 35000 },
        { nombre: "Café Gourmet Origen",precio: 45000 },
        { nombre: "Café Descafeinado",precio: 28000 },
        { nombre: "Café Organico de Altura",precio: 40000 },
    ];
    const ciudadesBase = ["Medellin", "Bogotá", "Cali", "Bucaramanga", "Cartagena"];
    const ventas = [];
    const maxClientes = Math.max(1, Math.floor(n / 3));
    for ( let i = 1; i <= n; i++) {
        const productoSeleccionado = catalogoProductos [Math.floor(Math.random() * catalogoProductos.length)];
        const ciudadSeleccionada = ciudadesBase[Math.floor(Math.random() * ciudadesBase.length)];
        const idCliente = Math.floor(Math.random() * maxClientes) + 1;
        const clienteStr = `Cliente ${idCliente}`;
        const cantidadAleatoria = Math.floor(Math.random() * 5) + 1;
        const diaAleatorio = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
        const fechaSimulada = `2026-10-${diaAleatorio}`;
        ventas.push({
            id: i,
            fecha: fechaSimulada,
            cliente: clienteStr,
            producto: productoSeleccionado.nombre,
            ciudad: ciudadSeleccionada,
            cantidad: cantidadAleatoria,
            precio: productoSeleccionado.precio
        });
    }
    return ventas;
}
module.exports = { generarVentasNo };