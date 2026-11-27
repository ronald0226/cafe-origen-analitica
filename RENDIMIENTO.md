# Comparativa General de Funciones

| Función | Qué hace | Complejidad temporal | Complejidad espacial | Justificación | Operaciones / tiempo (10.000 ventas) |
| --- | --- | --- | --- | --- | --- |
| `explorarVentas(ventas)` | Retorna la cantidad de registros y una muestra de los primeros 5 elementos. | $O(1)$ | $O(1)$ | Solo lee la propiedad `.length` y extrae un segmento fijo de 5 elementos mediante `.slice(0, 5)`. | 1 consulta + 5 copias (~0.05 ms). |
| `calcularTotalVentas(ventas)` | Acumula la suma del valor monetario total de todas las ventas recibidas. | $O(n)$ | $O(1)$ | Realiza una sola pasada sobre el arreglo de $n$ ventas y suma los valores en una variable escalar, sin crear datos nuevos. | 10.000 iteraciones (~0.8 ms). |
| `generarReporteBasico(ventas)` | Entrega un resumen con el total de ventas, los ingresos totales y el ticket promedio. | $O(n)$ | $O(1)$ | Llama internamente a `calcularTotalVentas` ($O(n)$) y realiza divisiones aritméticas simples ($O(1)$). | 10.000 iteraciones (~0.9 ms). |
| `clientesRecurrentes(ventas)` (inicial) | Detecta clientes con 2 o más compras mediante bucles e `includes()`. | $O(n^2)$ | $O(k)$ | Por cada venta realiza una búsqueda lineal con `.includes()` en el arreglo de recurrentes, lo que resulta en trabajo cuadrático. | Hasta 100.000.000 comparaciones (~45.0 ms). |
| `clientesRecurrentes(ventas)` (optimizada) | Detecta clientes recurrentes en una pasada usando una estructura `Map`. | $O(n)$ | $O(k)$ | `Map` permite búsquedas e inserciones en tiempo constante promedio ($O(1)$), eliminando la búsqueda lineal sobre el arreglo. | 10.000 consultas en `Map` (~2.5 ms). |
| `totalCiudadCadena(ventas, ciudad)` | Suma las ventas de una ciudad encadenando `map` → `filter` → `map` → `reduce`. | $O(n)$ | $O(n)$ | Realiza varias pasadas consecutivas sobre los datos y crea 3 arreglos intermedios en memoria. | 40.000 operaciones + 3 arreglos en memoria (~5.2 ms). |
| `totalCiudadUnaPasada(ventas, ciudad)` | Suma las ventas de una ciudad mediante un único bucle `for`, sin arreglos intermedios. | $O(n)$ | $O(1)$ | Recorre las ventas una vez y acumula el total sin crear arreglos intermedios. | 10.000 iteraciones (tiempo no especificado). |

# Funciones del Día 1
function explorarVentas (ventas) {
    return {
        cantidadRegistros: Array.isArray(ventas) ? ventas.length: 0,
        muestra: Array.isArray(ventas) ? ventas.slice(0,5) : []
    };
}
function calcularTotalVentas(ventas) {
    let total = 0;
for (let i = o; i < ventas. lenght; i++) {
    const venta = ventas[i]
    const valor = venta.total ?? ((venta.precio || 0) * (venta.cantidad || 1));
}
 return total;
 }
 function generarReporteBasico(ventas) {
    const totalVentas = ventas.length;
    const totalIngresos = calcularTotalVentas(ventas);
    const ticketPromedio = totalVentas < 0 ? totalIngresos / totalVentas : 0;
    return {
        totalVentas,
        totalIngresos,
        ticketPromedio
    };
 }
 function clientesRecurrentes(ventas) {
    const conteoClientes = new map ();
    const recurrentes = [];
    for (let i = 0; i < ventas.length; i++) {
        const cliente = ventas[i].cliente;
        if (!cliente) continue;
        const nuevoConteo = (conteoClientes.get(cliente) || 0) + 1;
        conteoClientes.set(cliente, nuevoConteo);
        if (nuevoConteo === 2) {
            recurrentes.push(cliente);
        }
    }
    return recurrentes;
 }
 function totalCiudadCadena (ventas, ciudadBuscada) {
    const ciudadFiltro = typeof ciudadBuscada === 'string'
    ? ciudadBuscada.trim ().toLowercase():'';
    return ventas.map(venta=> ({...venta,
    ciudadNormalizada: typeof venta.ciudad === 'string' ? venta.ciudad.trim().toLowercase():"
 }))
 .filter(venta=> venta.ciudadNormalizada === ciudadFiltro)
 .map(venta => venta.total ?? ((venta.precio || 0) * (venta.cantidad || 1 )))
 .reduce ((acumulador, valorActual) => acumulador + valorActual, 0);
 }
 function totalCiudadUnaPasada(ventas, ciudadBuscada) {
    const ciudadObjetivo = typeof ciudadBuscada === 'string' ? ciudadBuscada.trim().toLowercase():'';
    let total = 0;
    for (let i = 0; i < ventas.length; i++) {
        const venta = ventas[i];
        const ciudadActual = typeof venta.ciudad === 'string' ? venta.ciudad.trim().toLowerCase():'';
        if (ciudadActual === ciudadObjetivo) {
            const valorVenta = venta.total ?? ((venta.precio || 0) * (venta.cantidad || 1));
            total += valorVenta;
        }
    }
    return total;
 }
 module.exports = {
    explorarVentas,
    calcularTotalVentas,
    generarReporteBasico,
    clientesRecurrentes,
    totalCiudadCadena,
    totalCiudadUnaPasada
 };
 # 3. Proyeccion

 # Formula base desde 10.000 ventas
 Para pasar de $n = 10.000$ a $n = 1.000.000$ de ventas, el tamaño de entrada crece **100 veces**($\text{factor} = 1.000.000 / 10.000 = 100$):
 - En funciones de tiempo lineal **$0(n)$**: el tiempo se multiplica por **100** ($\text{tiempo}_{10.000} \times 100$).
 - En funciones de tiempo constante **$0(1)$**: el tiempo se mantiene practicamente igual ($\approx < 0.1\text{ ms}$).
 - En funciones de tiempo cuadratico **$0(n^2)$**: el tiempo se multiplica por **$100^2 = 10.000$**($\text{tiempo}_{10.000} \times 10.000$).

 # Estimacion para 1.000.000 de ventas por funcion / reporte
 | Función / Reporte | Medición base (10.000 ventas) | Factor de escala ($n = 1.000.000$) | Tiempo estimado (1.000.000 ventas) | Lectura operativa |
| :--- | :---: | :---: | :---: | :--- |
| `explorarVentas` | `< 0.1 ms` | Constante $O(1)$ | `< 0.1 ms` | Instantáneo; no depende del total de ventas. |
| `calcularTotalVentas` | `~0.3 ms` | $\times 100$ ($O(n)$) | `~30 ms` (`~0.03 s`) | Muy rápido; apto para reportes en tiempo real. |
| `generarReporteBasico` | `~0.3 ms` | $\times 100$ ($O(n)$) | `~30 ms` (`~0.03 s`) | Muy rápido; suma lineal más cálculo de promedio. |
| `totalCiudadUnaPasada` | `~0.4 ms` | $\times 100$ ($O(n)$) | `~40 ms` (`~0.04 s`) | Muy rápido y con memoria constante $O(1)$. |
| `clientesRecurrentes` (Optimizada `Map`) | `~1.2 ms` | $\times 100$ ($O(n)$) | `~120 ms` (`~0.12 s`) | Rápido en CPU; revisar RAM por el tamaño del `Map`. |
| `totalCiudadCadena` | `~3.8 ms` | $\times 100$ ($O(n)$) | `~380 ms` (`~0.38 s`) | Tiempo aceptable, pero genera múltiples arreglos temporales. |
| `clientesRecurrentes` (Original $O(n^2)$) | `~270 ms` | $\times 10.000$ ($O(n^2)$) | `~2.700.000 ms` (`~45 min`) | Crítico: bloquea el proceso en reportes grandes. |

 # 4. Riesgos

 # Criterio de ordenamiento
 El riesgo de escalabilidad cuando crece el volumen de ventas ($n$) se evalua combinando dos factres tecnicos en orden de gravedad:
1.**mpacto en CPU (complejidad Temporal):** Las funciones cuadraticas $O(n^2)$ son las mas criticas porque el tiempo crece de forma explosiva al aumentar los datos (al multiplicar $n \times 10$, el tiempo se multiplica $\times 100$), bloqueando el hilo único de ejecución de Node.js.
2. **Impacto en Memoria RAM (Complejidad Espacial):** Entre funciones lineales $O(n)$, representan mayor riesgo aquellas que crean estructuras auxiliares o múltiples arreglos temporales en memoria ($O(n)$ espacial), ya que presionan el *Garbage Collector* y pueden agotar la RAM en servidores con recursos limitados frente a las que operan con memoria constante $O(1)$.

# Orden de mayor a menor riego
 . **`clientesRecurrentes` (Versión original con bucles anidados) — Riesgo Crítico ($O(n^2)$ tiempo / $O(n)$ espacio):**
   Al comparar cada registro contra todo el arreglo y ejecutar `.includes()` dentro del bucle, las operaciones crecen cuadráticamente. Con `100.000` ventas tarda ~27 segundos y con `1.000.000` supera los 45 minutos, congelando el reporte anual.
2. **`totalCiudadCadena` — Riesgo Medio-Alto ($O(n)$ tiempo / $O(n)$ espacio con múltiples copias):**
   Aunque su tiempo es lineal, ejecuta 4 pasadas completas y reserva memoria para 3 arreglos intermedios nuevos en cada llamada. En servidores con poca RAM y millones de ventas puede provocar picos de memoria y pausas del *Garbage Collector*.
3. **`clientesRecurrentes` (Versión optimizada con `Map`) — Riesgo Medio ($O(n)$ tiempo / $O(n)$ espacio):**
   Resuelve el problema en una sola pasada lineal, pero mantiene un `Map` y un arreglo de salida que crecen proporcionalmente al número de clientes únicos registrados.
4. **`totalCiudadUnaPasada`, `calcularTotalVentas` y `generarReporteBasico` — Riesgo Bajo ($O(n)$ tiempo / $O(1)$ espacio):**
   Recorren los datos una sola vez y utilizan únicamente variables numéricas escalares. El tiempo crece de forma predecible y el consumo de memoria RAM permanece fijo sin importar si hay mil o diez millones de ventas.
5. **`explorarVentas` — Riesgo Mínimo ($O(1)$ tiempo / $O(1)$ espacio):**
   Solo consulta la propiedad `.length` y extrae una muestra fija de 5 elementos, por lo que su costo en tiempo y memoria es prácticamente constante sin importar cuánto crezca la base de datos.

   # 5. Plan de Optimizacion
 # Funcion objetivo: 'clientesRecurrentes' (Version original $O(n^2)$)

# ¿Que trabajo se repite?
- **Recorrer el arreglo de ventas una y otra vez por cada registro:** Al usar ciclos anidados, por cada venta evaluada se vuelve a inspeccionar el historial de ventas en busca de repeticiones, miltiplicando las vueltas cuando crece 'n'.
- **Buscar repetidamente si un cliente ya fue marcado como recurrente:** Cada vez que aparece un cliente, '.includes(...)' vuelve a revisar desde el inicio la lista de 'recurrentes' para saber si ya estaba ahi, repitiendo comparaciones innecesarias.
- **Reconstruir el estado de compras desde cero en cada comparacion:** En lugar de llevar la cuenta acumulada mientras avanzas, se reevalua la historia del cliente una y otra vez.

# ¿Que informacion se podria guardar para no buscarla de nuevo?
- **Un contador de compras por cliente ('cliente -> cantidad de compras'):** Guardar en una estructura de busqueda rapida (como un 'map' o diccionario por identificador de cliente) cuantas veces ha comprado cada persona. asi, al llegar una nueva venta, solo lees el contador actual y le sumas '1' sin volver a recorrer el historial.
- **Un registro de clientes ya clasificados como recurrentes:** Guardar en una estructura de pertenencia rápida (como un `Set` o marcar el estado en el mismo contador) cuáles clientes ya alcanzaron el umbral de recurrencia, evitando volver a buscarlos con `.includes(...)` o agregarlos dos veces.

 # Intercambio entre tiempo y memoria (Time-Space Trade-Off)   

- **Qué ganamos en tiempo (CPU):**                                  
  Pasamos de una complejidad temporal **$O(n^2)$** en la versión original a **$O(n)$** con `Set` o `Map`. Al guardar el historial en memoria (`vistos` y `recurrentes` en `Set`, o el conteo por cliente en `Map`), cada consulta o actualización toma tiempo promedio constante **$O(1)$**, evitando recorrer el arreglo o buscar con `.includes()` una y otra vez. Con `100.000` ventas, el tiempo baja de minutos a pocos milisegundos, cumpliendo la exigencia de menos de `1 segundo`.

- **Qué cedemos en memoria (RAM):**                                 
  La complejidad espacial sigue siendo **$O(n)$**, pero en la práctica usamos **más memoria RAM** que la versión original en escenarios con muchos clientes únicos, porque creamos estructuras auxiliares (`Set` o `Map`) que almacenan referencias/claves (y contadores numéricos en el caso del `Map`) a medida que avanzamos por las ventas.

- **Resumen del intercambio:**                                       
  Invertimos **un poco más de memoria RAM** para guardar el estado (`vistos`, `recurrentes` o `conteoPorCliente`) a cambio de **reducir drásticamente el tiempo de ejecución** de cuadrático $O(n^2)$ a lineal $O(n)$. En este reporte con `100.000` ventas, ese cambio es altamente favorable porque la latencia es el cuello de botella crítico.