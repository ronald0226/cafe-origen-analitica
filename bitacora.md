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