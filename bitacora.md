## Diccionario de datos

Cada registro de `ventas` contiene las siguientes propiedades:

| Propiedad | Tipo | Significado |
|---|---|---|
| `id` | Número (`number`) | Identificador único del registro de venta. |
| `fecha` | Cadena (`string`, formato `AAAA-MM-DD`) | Fecha en que se realizó la venta. |
| `cliente` | Cadena (`string`) | Código que identifica al cliente, por ejemplo, `C01`. |
| `producto` | Cadena (`string`) | Nombre o descripción del producto vendido. |
| `ciudad` | Cadena (`string`) | Ciudad asociada al registro de venta. |
| `cantidad` | Número (`number`) | Unidades del producto registradas en la venta. |
| `precio` | Número (`number`) | Precio por unidad del producto, registrado en pesos colombianos. |

## Casos borde detectados

| Caso | Problema de calidad | Decisión |
|---|---|---|
| Venta `id: 8`, ciudad `cali` | La ciudad aparece en minúsculas, mientras que en la venta `id: 9` aparece como `Cali`. Esto puede separar una misma ciudad en agrupaciones y reportes. | Normalizar las ciudades con mayúscula inicial (`Cali`) al preparar los datos para análisis; conservar el valor original en la fuente. |
| Venta `id: 8`, cantidad `0` | Una venta con cero unidades puede ser un dato inválido o representar una anulación/registro sin despacho; la tabla no permite distinguirlo. | No contarla como unidades vendidas hasta verificarla. Mantener el registro y marcarlo para revisión, sin cambiarlo ni eliminarlo automáticamente. |
| Propiedad `cliente` | Los clientes solo aparecen como códigos (`C01`–`C08`) y no hay un catálogo de referencia para validar que existan o conocer su significado. Que un código se repita en varias ventas no es por sí mismo un error. | Tratar el código como identificador opaco, preservar sus repeticiones y validar los códigos contra un catálogo de clientes antes de enriquecer o corregirlos. |

## Preguntas de análisis por función

### Total vendido con ciclo (`verificar.js`)

- **¿Qué recorro?** Todos los registros del arreglo `ventas`.
- **¿Qué filtro?** No filtro registros; cada venta contribuye al cálculo.
- **¿Qué transformo?** Convierto cada registro en su valor vendido, multiplicando `precio` por `cantidad`.
- **¿Qué acumulo?** La suma de los valores vendidos, en `totalVendidoCiclo`.
- **¿Cómo agrupo?** No agrupo por ninguna propiedad; calculo un único total general.

### Total vendido con métodos (`reduce` en `analitica.js` y `verificar.js`)

- **¿Qué recorro?** Todos los registros del arreglo `ventas`, mediante `reduce`.
- **¿Qué filtro?** No filtro registros; cada venta contribuye al cálculo.
- **¿Qué transformo?** Cada registro en `precio * cantidad`.
- **¿Qué acumulo?** La suma de esos valores en el acumulador de `reduce`, iniciando en cero.
- **¿Cómo agrupo?** No agrupo por ninguna propiedad; calculo un único total general, que se compara con el total obtenido con ciclo en `verificar.js`.

### `topProductosPorValor(ventas, k)` (`analitica.js`)

- **¿Qué recorro?** Todos los registros de venta recibidos en `ventas`.
- **¿Qué filtro?** No filtro ventas antes de calcular el valor; el parámetro `k` limita cuántos productos se devuelven al final.
- **¿Qué transformo?** Normalizo el nombre del producto (quito espacios al inicio y al final y convierto a minúsculas para la clave) y calculo el valor de cada venta como `precio * cantidad`.
- **¿Qué acumulo?** El valor vendido de cada producto en un mapa.
- **¿Cómo agrupo?** Por nombre de producto normalizado, de modo que diferencias de mayúsculas y espacios externos no creen grupos separados; luego ordeno los grupos de mayor a menor valor y devuelvo los primeros `k`.
### Duplicidad de ciudades

**Síntoma:** Al agrupar o listar las ventas por ciudad, una misma localidad podía aparecer fragmentada en varias entradas (por ejemplo, «Medellín» y «medellín»).

**Entrada que lo produce:** Transacciones con variaciones tipográficas en la propiedad `ciudad`, como diferencias entre mayúsculas y minúsculas o espacios adicionales.

**Hipótesis:** El objeto utilizado como acumulador evaluaba las claves de forma literal y estricta, tratando cada variante como una clave distinta.

**Prueba realizada:** Simulación de la inserción de claves con distintas mayúsculas en un objeto acumulador e inspección de las claves resultantes en la consola.

**Causa:** Falta de normalización de las cadenas antes de utilizarlas como claves de agrupación.

**Corrección y demostración en la versión actual:** Antes de agrupar, se aplica `.trim()` y `.toLocaleLowerCase()`. Así, variantes como «medellín» y «Medellín» se unifican. Esta normalización no elimina tildes, por lo que «Bogotá» y «Bogota» todavía se consideran claves diferentes.

### Error de `NaN` en el ticket promedio de días sin ventas

**Síntoma:** Al filtrar o calcular indicadores para una fecha sin transacciones, el ticket promedio u otra métrica relacionada podía arrojar `NaN` («Not a Number»).

**Entrada que lo produce:** Una fecha de consulta sin registros en `datos.js` (por ejemplo, `2025-12-25`), que da como resultado un arreglo vacío.

**Hipótesis:** El sistema intentó calcular un promedio dividiendo el total acumulado (0) entre la cantidad de transacciones (0). JavaScript representa esa operación como `NaN`.

**Prueba realizada:** Se filtró una fecha sin ventas y se intentó dividir directamente el total entre la cantidad de transacciones, sin validar previamente el divisor.

**Causa:** Falta de una validación para comprobar que el divisor fuera distinto de cero antes de realizar la división.

**Corrección y demostración en la versión actual:** Se agregó una condición ternaria para calcular el promedio solo cuando hay transacciones:

```js
const promedioDia =
  transacciones.length > 0 ? totalVendidoDia / transacciones.length : 0;
```

Si el arreglo está vacío, el resultado es `0` y se evita la división entre cero.

### Predicción inicial

Si `n` se multiplica por 10, se espera que el número de operaciones de `totalVendidoInstrumentado`, `ventaMayorInstrumentada` y `totalPorCiudadInstrumentado` también aumente aproximadamente 10 veces.

## Complejidad: predicciones y mediciones

Se compararon los contadores de operaciones y comparaciones para arreglos de 100, 1.000, 10.000 y 100.000 ventas. `primeraVentaInstrumentada` se agregó como referencia de tiempo constante. Los contadores son operaciones instrumentadas por el código, no una medición de tiempo real.

| Función | Predicción según el código | Operaciones medidas (n = 100, 1.000, 10.000, 100.000) | Clasificación |
|---|---|---|---|
| `primeraVentaInstrumentada` | Accede solo a `ventas.length` y al índice `0`; no recorre el arreglo. | 1, 1, 1, 1 | O(1) |
| `totalVendidoInstrumentado` | Un ciclo visita cada venta una vez y acumula su importe. | 100, 1.000, 10.000, 100.000 | O(n) |
| `ventaMayorInstrumentada` | Un ciclo desde el segundo registro realiza una cantidad fija de trabajo por venta restante. | 198, 1.998, 19.998, 199.998 | O(n) |
| `totalPorCiudadInstrumentado` | Un ciclo visita cada venta y actualiza un `Map`; con las cinco ciudades del generador, cada actualización tiene un costo promedio constante. | 200, 2.000, 20.000, 200.000 | O(n) promedio |

Al multiplicar `n` por 10, `primeraVentaInstrumentada` mantiene 1 operación; el total vendido y el agrupamiento por ciudad multiplican sus conteos por 10. `ventaMayorInstrumentada` pasa de 198 a 1.998 en el primer salto (aproximadamente 10,1 veces) y luego también crece aproximadamente 10 veces; su cuenta es `2 * (n - 1)`. Esto coincide con las predicciones. Ninguna función medida presenta crecimiento O(n²): el código no contiene ciclos anidados sobre las ventas.

## Clientes recurrentes

La función `clientesRecurrentes(ventas)` en `src/analitica.js` devuelve los identificadores de cliente que aparecen en más de una venta. Compara cada pareja de registros una sola vez (índices `i < j`) y agrega a un conjunto el cliente de las parejas iguales, evitando devolver el mismo cliente más de una vez.

Con los 12 registros del Día 1, el resultado esperado y verificado es `["C01", "C02", "C03"]`.

### Traza con 5 ventas

Ejemplo de clientes, en el orden de las ventas: `C01`, `C02`, `C03`, `C01`, `C02`.

| Venta comparada (i, j) | Clientes | ¿Coinciden? |
|---|---|---|
| 1, 2 | C01, C02 | No |
| 1, 3 | C01, C03 | No |
| 1, 4 | C01, C01 | Sí |
| 1, 5 | C01, C02 | No |
| 2, 3 | C02, C03 | No |
| 2, 4 | C02, C01 | No |
| 2, 5 | C02, C02 | Sí |
| 3, 4 | C03, C01 | No |
| 3, 5 | C03, C02 | No |
| 4, 5 | C01, C02 | No |

La traza realiza 10 comparaciones y devuelve `["C01", "C02"]`. Para `n` ventas se comparan todos los pares distintos: `(n - 1) + (n - 2) + ... + 1 = n(n - 1) / 2` comparaciones. Por tanto, el crecimiento es O(n²).

### Costo oculto de `recurrentes.includes`

Si se guarda el resultado en un arreglo `recurrentes` y, para cada venta, se consulta `recurrentes.includes(cliente)`, esa búsqueda recorre el arreglo elemento por elemento hasta encontrar el cliente o llegar al final. En el peor caso, cuando el cliente no está en el arreglo, una llamada puede hacer hasta `r` comparaciones, donde `r` es la cantidad de clientes ya guardados (y puede crecer hasta `n`). Repetir esa búsqueda para las `n` ventas puede sumar `1 + 2 + ... + (n - 1) = n(n - 1) / 2` comparaciones: O(n²), aunque el código tenga un solo ciclo visible. Por eso, reemplazar un ciclo anidado por `includes` no garantiza complejidad lineal.

La implementación actual de `clientesRecurrentes` usa un `Set`, no `recurrentes.includes`; así evita esa búsqueda lineal de pertenencia. Sin embargo, compara cada pareja de ventas, por lo que su complejidad sigue siendo O(n²) debido al ciclo anidado.

Al observar la tabla de tiempos, cuando `n` se duplica, el tiempo de ejecución tiende a cuadruplicarse (o a multiplicarse por un factor cercano a 4).

### Estimación para n = 100.000

- **Proporción de crecimiento:** `100.000 / 4.000 = 25`.
- **Factor cuadrático:** `25² = 625`.
- **Tiempo estimado:** `43,21 ms × 625 = 27.006,25 ms` (aproximadamente 27 segundos).
- **Evaluación:** Como 27 segundos es menos de dos minutos (120.000 ms), el tiempo estimado está por debajo del límite establecido para ejecutar esta cantidad de registros en la terminal.

### Estimación para n = 1.000.000 (historial anual masivo)

- **Proporción de crecimiento:** `1.000.000 / 4.000 = 250`.
- **Factor cuadrático:** `250² = 62.500`.
- **Tiempo estimado:** `43,21 ms × 62.500 = 2.700.625 ms` (aproximadamente 45 minutos).

Procesar un millón de registros con ciclos anidados de complejidad O(n²) podría tomar cerca de 45 minutos según esta estimación. Por ello, para ese volumen conviene una solución de complejidad lineal O(n).

## Conclusión para la gerente

El reporte se vuelve lento cuando aumentan las ventas porque, para encontrar clientes recurrentes, el sistema compara cada venta con muchas otras. Al crecer la cantidad de registros, esas revisiones aumentan mucho más rápido que las ventas: si se duplica el volumen, el tiempo puede acercarse a cuatro veces más. Para mantener el reporte ágil a medida que crece el negocio, conviene cambiar esa búsqueda por un método que revise cada venta una sola vez.

## Comparación de las dos versiones para totalizar por ciudad

Sea `n` la cantidad de ventas y `m` la cantidad de ventas que coinciden con la ciudad buscada (`m <= n`).

- `totalCiudadCadena` hace dos recorridos sobre todas las ventas (`map` y `filter`) y dos sobre las coincidencias (el segundo `map` y `reduce`): `2n + 2m` operaciones, como máximo `4n`. Al eliminar la constante multiplicativa, su tiempo es **O(n)**. Crea tres arreglos intermedios, por lo que su espacio adicional es **O(n)**.
- `totalCiudadUnaPasada` revisa cada venta una sola vez: `n` operaciones, así que su tiempo también es **O(n)**. Solo mantiene variables de acumulación y no crea arreglos intermedios, por lo que su espacio adicional es **O(1)**.

Ambas tienen el mismo orden de crecimiento temporal. La versión encadenada realiza más trabajo por sus recorridos adicionales, pero Big O omite factores constantes (por ejemplo, `4n` se simplifica a `O(n)`); por eso no se clasifica como `O(4n)`. Esto no significa que tarden exactamente lo mismo, sino que ambas crecen linealmente con el tamaño del arreglo.

## Complejidad espacial de las funciones del motor

Se considera memoria adicional, sin contar el arreglo `ventas` que recibe cada función. Sea `n` la cantidad de ventas, `u` la cantidad de ciudades distintas y `p` la cantidad de productos distintos.

| Función | Espacio adicional | Motivo |
|---|---|---|
| `ventasDelDia` | **O(n)** | `filter` crea un arreglo nuevo con las ventas que coinciden; en el peor caso contiene las `n` ventas. |
| `clientesRecurrentes` | **O(n)** | El `Set` de clientes recurrentes y el arreglo devuelto pueden crecer con la cantidad de ventas. |
| `topProductosPorValor` | **O(n)** | El `Map` guarda hasta `p` productos y `Array.from` crea un arreglo para ordenarlos y devolverlos. En el peor caso `p = n`. |
| `totalCiudadCadena` | **O(n)** | Crea tres arreglos intermedios que, en el peor caso, pueden contener hasta `n` elementos. |
| `totalCiudadUnaPasada` | **O(1)** | Solo usa variables escalares para la ciudad actual y el total; no crea colecciones proporcionales a los datos. |
| `totalVendidoInstrumentado` | **O(1)** | Mantiene un total, un índice y una referencia a la venta actual. |
| `primeraVentaInstrumentada` | **O(1)** | Devuelve una referencia a una venta, sin crear una colección. |
| `ventaMayorInstrumentada` | **O(1)** | Mantiene la referencia a la venta mayor y valores temporales escalares. |
| `totalPorCiudadInstrumentado` | **O(n)** en el peor caso | El `Map` guarda un registro por ciudad distinta y `Array.from` crea otro arreglo con esos registros: **O(u)**, donde `u <= n`. |
| `generarVentasNo` | **O(n)** | Construye y devuelve un arreglo con `n` ventas. |

`totalPorCiudadInstrumentado` y `topProductosPorValor` no usan espacio constante en el caso general: sus mapas y arreglos pueden crecer con los valores distintos presentes en los datos. Si el dominio está acotado (por ejemplo, el generador siempre usa exactamente cinco ciudades o cinco productos), el espacio de esas colecciones es **O(1)** respecto de `n`; sin esa garantía, su clasificación de peor caso es **O(n)**.

## Decisión de implementación para totalizar por ciudad

Dejaré `totalCiudadUnaPasada` como la versión recomendada para el motor. Aunque `totalCiudadCadena` expresa la transformación de forma declarativa y puede resultar más familiar de leer, crea tres arreglos intermedios y usa **O(n)** de espacio adicional. La versión de una pasada requiere seguir explícitamente el ciclo, pero sus variables nombradas hacen clara la normalización y la acumulación; además, evita esos arreglos y usa **O(1)** de espacio adicional. Ambas son **O(n)** en tiempo, pero la versión de una pasada reduce las asignaciones y el consumo de memoria al crecer el número de ventas. Se conserva `totalCiudadCadena` como referencia para la comparación de resultados en `medir.js`, no como la opción recomendada para el uso normal del motor.
- **Observación recibida:**                                    
   *"En la tabla y en la sección de Riesgos, mencionas que `clientesRecurrentes` con `Map` es $O(n)$ en tiempo y $O(n)$ en espacio, pero ¿qué pasa si los nombres de los clientes vienen con espacios extras o mayúsculas distintas como `'Ana'` y `' ana '`? ¿Eso afectaría el conteo o la memoria del `Map`?"*

   ## Optimizacion de Clientes Recurrentes ('0(n)')
# 1. Entender el problema
- **Entradas:** Un arreglo 'ventas' donde cada elemento representa una venta (por ejemplo, con propiedades como 'cliente', 'ciudad', 'total', 'precio', 'cantidad').

**Salida:** Un arreglo con los identificadores/nombres de los **clientes recurrentes**(aquellos que registran **2 o mas compras**, sin duplicar nombres en la respuesta).

**Restricciones y metas:**
-Tiempo de respuesta **menor a 1 segundo** (< '1000 ms') con 'n = 100.000' ventas.
-Evitar busquedas repetitivas que disparen el tiempo de ejecucion al crecer 'n'.
-Manejar datos incompletos o irregulares sin que la funcion reviente.
# 2. Ejemplos y casos borde
**Caso normal:** `ventas` con `'Ana'`, `'Luis'`, `'Ana'`, `'Sofía'`, `'Ana'`

**Arreglo vacio ('[]'):**
**Sin recurrencias:**

**Casos borde / datos sucios:**
-Ventas sin propiedad 'cliente', con 'null', 'undefined' o cadena vacia '""'
-Variaciones de escritura o espacios (ej. `'Ana'` y `' ana '` o `'ANA'`)
-Exactamente 2 compras vs. 3 o mas compras

# 3. Fuerza bruta y su complejidad 
**Idea de fuerza bruta:** Recorrer 'ventas' con un ciclo externp y por cada venta, volver a recorrer o buscar en estructuras acumuladas usando metodos como `.includes()` o ciclos anidados para verificar si ya había comprado antes y si ya estaba en `recurrentes`.

**Complejidad temporal:** **$O(n^2)$** en el peor caso, porque por cada uno de los 'n' elementos se realizan comparaciones adicionales que crecen con 'n'. con '100.000' ventas esto escala a decenas de miles de millones de operaciones (minutos de espera).
- **Complejidad espacial:** **$O(n)$** por el arreglo `recurrentes` (y posibles arreglos intermedios).

### 4. Idea de optimización (Búsqueda en tiempo constante)        
- **Estructura elegida:** Un **`Map`** (o diccionario/tabla hash) para llevar el conteo de compras por cliente, más un arreglo `recurrentes` para el resultado final.
- **Por qué funciona:** En JavaScript, `map.get(clave)` y `map.set(clave, valor)` operan en **tiempo promedio constante $O(1)$**, sin importar si hay 10 o 100.000 clientes distintos.
- **Cómo elimina el trabajo repetido:**
  - En una **sola pasada** `O(n)` sobre `ventas`, consultamos cuántas compras lleva el cliente en el `Map`, sumamos `1` y guardamos el nuevo conteo.
  - Solo cuando el conteo pasa de `1` a `2` (`nuevoConteo === 2`), agregamos el cliente a `recurrentes`. Así nunca repetimos búsquedas con `.includes()` ni duplicamos entradas.
- - **Complejidad resultante:** Tiempo **$O(n)$** (con `100.000` ventas corre en pocos milisegundos, muy por debajo de 1 segundo) y espacio **$O(n)$** acotado por la cantidad de clientes únicos.

