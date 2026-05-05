$ErrorActionPreference = "Stop"

$baseDatos = "pixara"
$uri = "mongodb://localhost:27017"
$carpeta = Join-Path $PSScriptRoot "colecciones"

$colecciones = @(
  "usuarios",
  "publicaciones",
  "comentarios",
  "megustas",
  "guardados",
  "seguidores",
  "notificaciones",
  "preferencias",
  "sesiones",
  "reportes",
  "feedback",
  "newsletter"
)

foreach ($coleccion in $colecciones) {
  $archivo = Join-Path $carpeta "$coleccion.json"
  Write-Host "Importando $coleccion desde $archivo"
  mongoimport --uri "$uri/$baseDatos" --collection $coleccion --file $archivo --jsonArray --drop
}

Write-Host "Base de datos pixara importada correctamente."
