# Configuración de Variables de Entorno para Firebase Functions

Para que las funciones de Square funcionen correctamente, necesitas configurar las siguientes variables de entorno:

## Variables Requeridas

- `SQUARE_ACCESS_TOKEN`: Tu token de acceso de Square (sandbox o producción)
- `SQUARE_LOCATION_ID`: El ID de ubicación de Square

## Configuración Local (para desarrollo)

Crea un archivo `.env` en la carpeta `functions/`:

```bash
SQUARE_ACCESS_TOKEN=tu_token_aqui
SQUARE_LOCATION_ID=tu_location_id_aqui
```

## Configuración en Firebase (para producción)

Usa el Firebase CLI para configurar las variables:

```bash
firebase functions:config:set square.access_token="tu_token_aqui"
firebase functions:config:set square.location_id="tu_location_id_aqui"
```

O usa variables de entorno en el proyecto de Firebase:

```bash
firebase functions:secrets:set SQUARE_ACCESS_TOKEN
firebase functions:secrets:set SQUARE_LOCATION_ID
```

## Verificar Configuración

Para ver la configuración actual:

```bash
firebase functions:config:get
```
