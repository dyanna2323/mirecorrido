#!/usr/bin/env bash
set -euo pipefail

BRANCH="deploy/pages"

echo "🔎 Comprobando repo..."
if [ ! -f package.json ]; then
  echo "❌ Ejecuta este script en la RAÍZ del repo (donde está package.json)."
  exit 1
fi

# Ensure git repo
if [ ! -d .git ]; then
  echo "❌ Aquí no hay un repositorio Git iniciado."
  echo "   Ejecuta: git init -b main && git remote add origin <tu-remote>"
  exit 1
fi

echo "🌿 Creando/actualizando rama $BRANCH..."
git fetch origin || true
if git show-ref --verify --quiet refs/heads/$BRANCH; then
  git checkout $BRANCH
else
  git checkout -b $BRANCH
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
git push -u origin $BRANCH

echo "✅ Listo. Abre un PR de '$BRANCH' a 'main' y activa Pages con GitHub Actions."
