#!/usr/bin/env bash
set -euo pipefail

BRANCH="deploy/pages"

usage() {
  cat <<'USAGE'
Uso: apply_deploy_pages.sh [directorio_del_proyecto]

Si el proyecto (package.json, carpeta .kit, etc.) no está en la raíz del repo,
puedes indicar el subdirectorio donde vive.
USAGE
}

if [ "${1-}" = "-h" ] || [ "${1-}" = "--help" ]; then
  usage
  exit 0
fi

echo "🔎 Comprobando repo..."

# Ensure git repo
if ! git rev-parse --show-toplevel >/dev/null 2>&1; then
  echo "❌ Aquí no hay un repositorio Git iniciado."
  echo "   Ejecuta: git init -b main && git remote add origin <tu-remote>"
  exit 1
fi

REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

PROJECT_DIR="."
if [ $# -gt 1 ]; then
  usage
  exit 1
elif [ $# -eq 1 ]; then
  PROJECT_DIR="$1"
elif [ ! -f package.json ]; then
  # Intento automático: buscar un subdirectorio inmediato con package.json
  mapfile -t candidates < <(find . -mindepth 1 -maxdepth 1 -type d ! -name '.git' -print)
  found=()
  for dir in "${candidates[@]}"; do
    if [ -f "$dir/package.json" ]; then
      found+=("$dir")
    fi
  done
  if [ ${#found[@]} -eq 1 ]; then
    PROJECT_DIR="${found[0]}"
    echo "ℹ️  Detectado proyecto en '$PROJECT_DIR'."
  elif [ ${#found[@]} -gt 1 ]; then
    echo "❌ Se encontraron múltiples subdirectorios con package.json."
    echo "   Ejecuta: $0 <directorio_del_proyecto>"
    exit 1
  else
    echo "❌ Ejecuta este script en la RAÍZ del repo o indica el subdirectorio del proyecto."
    echo "   Ejemplo: $0 app"
    exit 1
  fi
fi

cd "$PROJECT_DIR"

if [ ! -f package.json ]; then
  echo "❌ No se encontró package.json en '$PROJECT_DIR'."
  exit 1
fi

if [ ! -d .kit ]; then
  echo "❌ No se encontró la carpeta .kit en '$PROJECT_DIR'."
  exit 1
fi

echo "🌿 Creando/actualizando rama $BRANCH..."
git fetch origin || true
if git show-ref --verify --quiet refs/heads/$BRANCH; then
  git checkout "$BRANCH"
else
  git checkout -b "$BRANCH"
fi

echo "🧹 Eliminando README.md anterior (si existe)..."
rm -f README.md

echo "➕ Copiando archivos de configuración de Pages..."
mkdir -p .github/workflows scripts public
cp -f ./.kit/.github/workflows/pages.yml .github/workflows/pages.yml
cp -f ./.kit/scripts/copy-404.js scripts/copy-404.js
cp -f ./.kit/public/manifest.webmanifest public/manifest.webmanifest
cp -f ./.kit/vite.config.ts vite.config.ts
cp -f ./.kit/README.md README.md
cp -f ./.kit/CHANGELOG.md CHANGELOG.md

echo "📦 Commit de cambios..."
git add .github/workflows/pages.yml scripts/copy-404.js public/manifest.webmanifest vite.config.ts README.md CHANGELOG.md
git commit -m "ci(pages): configuración de despliegue + README actualizado"

echo "🚀 Push de la rama $BRANCH"
git push -u origin "$BRANCH"

echo "✅ Listo. Abre un PR de '$BRANCH' a 'main' y activa Pages con GitHub Actions."
