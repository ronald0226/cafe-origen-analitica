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
Duplicidad de ciudades (Ej: "Bogotá" aparecía dos veces)

    Síntoma: Al agrupar o listar las ventas por ciudad, una misma localidad aparecía fragmentada en múltiples entradas (ej. "Bogotá" y "Bogota", o "Medellín" y "medellín").

    Entrada que lo produce: Transacciones con variaciones tipográficas en la propiedad ciudad debido a tildes omitidas, mayúsculas o espacios adicionales.

    Hipótesis: El objeto diccionario utilizado como acumulador evaluaba las llaves de forma literal y estricta, tratando cada variante como una clave única e independiente en memoria.

    Prueba realizada: Simulación de inserción de claves mixtas en un objeto de acumulación e inspección de las llaves resultantes en la consola.

    Causa: Falta de normalización o estandarización de las cadenas de texto antes de utilizarlas como llaves de agrupación.

    Corrección y Demostración en la versión actual:

        Se aplica una limpieza previa a las cadenas de texto utilizando métodos de estandarización como .trim() y .toLocaleLowerCase().

        Por qué ya no ocurre: Al forzar que todas las entradas se comparen en minúsculas y sin espacios de sobra, variaciones como "medellín" y "Medellín" se unifican automáticamente bajo una única llave estandarizada ("medellín"), evitando duplicados en el reporte final.

- Error de NaN en ticket promedio en días sin ventas

    Síntoma: Al filtrar o calcular indicadores para una fecha que no registra transacciones, el valor del ticket promedio o métrica relacionada arrojaba NaN (Not a Number).

    Entrada que lo produce: Una fecha de consulta inexistente o sin registros en el archivo datos.js (ej. "2025-12-25"), devolviendo un arreglo filtrado con longitud 0.

    Hipótesis: El sistema intentó calcular un promedio dividiendo el total acumulado de dinero (0) entre el número total de transacciones (0), provocando una indeterminación matemática (división entre cero) que JavaScript maneja como NaN.

    Prueba realizada: Ejecución de la función de filtrado con una fecha vacía e intento de división aritmética directa sin validación previa.

    Causa: Ausencia de validación defensiva (guarda lógica) para comprobar el divisor antes de ejecutar la operación de división.

    Corrección y Demostración en la versión actual:

        Se implementó una validación condicional estricta utilizando un operador ternario antes de calcular el promedio:
        JavaScript

        const promedioDia = transacciones.length > 0 ? totalVendidoDia / transacciones.length : 0;

        Por qué ya no ocurre: Si la longitud del arreglo es 0, el sistema intercepta la operación y asigna directamente 0 como resultado en lugar de intentar la división, blindando el reporte contra el error NaN que reportó la gerencia.