# Puestos de artesanía

Aplicación web para registrar puestos de una feria de artesanía, filtrar por rubro y consultar la ubicación de cada puesto en Google Maps.

## Tecnologías
- HTML, CSS y JavaScript.
- Supabase como base de datos.
- Google Maps mediante mapa incrustado por coordenadas (no requiere API key de Google).
- Render como alojamiento web estático.

## Campos de la tabla
- `id`: identificador único UUID.
- `nombre_punto`: nombre del punto.
- `latitud` y `longitud`: coordenadas GPS.
- `numero_puesto`: número del puesto.
- `sector`: sector de la feria.
- `rubro`: cerámica o tejido.

## Configuración de Supabase
1. Abrir el proyecto Supabase.
2. Ir a **SQL Editor** y crear una consulta nueva.
3. Copiar y ejecutar el contenido de `supabase.sql`. Crea la tabla y carga tres ejemplos.
4. En Supabase, abrir **Project Settings > API** (o API Keys).
5. Copiar la **Project URL** y la clave **anon/public**. Nunca usar `service_role`.
6. En GitHub, abrir `app.js`, tocar el lápiz y reemplazar `PEGAR_AQUI_LA_CLAVE_ANON_PUBLIC` por la clave anon/public. La URL ya está configurada en este proyecto.
7. Guardar con **Commit changes**.

> Este proyecto de práctica habilita acceso público de lectura y escritura mediante una política RLS. Es apropiado solo para una demostración académica sin datos privados. Para producción, restringir las políticas y agregar autenticación.

## Publicación en Render
1. Subir estos archivos a un repositorio GitHub.
2. En Render elegir **New + > Static Site**.
3. Conectar el repositorio.
4. Build Command: dejar vacío.
5. Publish Directory: `.`
6. Crear el sitio y esperar que Render publique el enlace.

## Pruebas solicitadas
1. Verificar que aparezcan los tres registros iniciales.
2. Elegir el filtro **Cerámica** y comprobar que aparezca Cerámica Guaraní.
3. Elegir **Tejido** y comprobar que aparezcan los dos puestos de tejido.
4. Seleccionar **Ver** en dos registros distintos y comparar que cambien las coordenadas del mapa.
5. Editar un registro, cambiar latitud o longitud y guardar. Recargar la página y verificar que el cambio siga guardado.
6. Intentar guardar latitud `95`. La aplicación debe rechazarla y mostrar el mensaje de coordenadas inválidas.
7. Editar y eliminar un registro de prueba.

## Consulta realizada a Gemini (modelo de IA)
**Consulta:** “Revisá esta aplicación web de puestos de artesanía hecha con HTML, CSS, JavaScript y Supabase. Verificá que permita crear, listar, editar y eliminar puestos; filtrar por los rubros cerámica y tejido; mostrar el marcador según latitud y longitud en Google Maps; y rechazar latitudes fuera de -90 a 90 y longitudes fuera de -180 a 180. Indicá errores posibles y sugerí mejoras sin cambiar los requisitos del examen.”

**Sugerencia aplicada:** Se incorporó validación de coordenadas tanto en el formulario del navegador como mediante restricciones `CHECK` en la tabla de Supabase. También se agregó confirmación antes de eliminar un registro.

**Prueba de verificación:** Se deben realizar las siete pruebas anteriores desde la URL publicada en Render y anotar el resultado observado. No declarar una prueba como aprobada hasta ejecutarla en el sitio publicado.

## Enlaces de entrega
- Sitio en Render: PEGAR_AQUI_EL_ENLACE_DE_RENDER
- Repositorio GitHub: PEGAR_AQUI_EL_ENLACE_DE_GITHUB
