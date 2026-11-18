# ☕ Café Origen - Motor de Analítica (v0.1)

##  ¿Qué es el proyecto?
**Café Origen - Motor de Analítica** es una aplicación desarrollada en Node.js diseñada para procesar, auditar y analizar el conjunto de datos de ventas de la marca. Este sistema implementa buenas prácticas de desarrollo backend aplicando métodos funcionales de arreglos (`reduce`, `filter`, `sort`, `slice`), estructuras de datos con diccionarios (`Map`), normalización de datos para corregir inconsistencias tipográficas (como variaciones en nombres de ciudades) y validaciones defensivas para garantizar la robustez del software ante escenarios críticos (como días sin transacciones).

---

##  ¿Qué preguntas de negocio responde?
El motor de analítica está diseñado para dar respuesta inmediata a los requerimientos de la gerencia a través de un informe ejecutivo en consola:
1. **¿Cuál es el volumen total de transacciones analizadas?** Muestra el total de registros procesados por el sistema.
2. **¿Cuál es el total de dinero vendido por la empresa?** Calcula y formatea en pesos colombianos (`COP`) los ingresos totales generados.
3. **¿Cómo se comportan las ventas en fechas específicas?** Permite filtrar y auditar las transacciones de un día determinado, evaluando tanto días con ventas como escenarios complejos de días sin transacciones.
4. **¿Cómo previene el sistema errores matemáticos críticos?** Valida de forma defensiva los cálculos de promedios para evitar el error de indeterminación `NaN` (división por cero) cuando se consultan periodos vacíos.
5. **¿Cuáles son los productos más rentables?** Genera rankings y tops basados en el valor monetario generado por cada producto mediante ordenamientos avanzados.

---

## Estructura del Proyecto
```text
/
├── datos.js              # Archivo fuente con el arreglo de transacciones y datos de ventas
└── src/
    ├── analitica.js      # Módulo con la lógica de negocio, métodos de arreglos y normalización
    └── reporte.js        # Archivo principal que integra los datos y muestra el reporte ejecutivo