#!/usr/bin/env bash
# run_git_filter_repo.sh
# Clona un espejo, ejecuta git-filter-repo con replacements.txt y fuerza push al remoto.
# REVISAR replacements.txt antes de ejecutar.
set -euo pipefail

if ! command -v git-filter-repo >/dev/null 2>&1; then
  echo "git-filter-repo no instalado. Instala con: pip install git-filter-repo" >&2
  exit 2
fi

if [ "$#" -ne 1 ]; then
  echo "Usage: $0 <mirror-repo-url>" >&2
  echo "Ejemplo: $0 https://github.com/TU_USUARIO/TU_REPO.git" >&2
  exit 1
fi

REPO_URL="$1"
WORKDIR="repo-mirror-$(date +%s)"
REPLACEMENTS_FILE="../tools/replacements.txt"

echo "Clonando espejo desde $REPO_URL into $WORKDIR"

git clone --mirror "$REPO_URL" "$WORKDIR"
cd "$WORKDIR"

echo "Ejecutando git-filter-repo con $REPLACEMENTS_FILE"
# Reemplaza texto sensible según file
git-filter-repo --replace-text "$REPLACEMENTS_FILE"

echo "Limpiando reflogs y compactando"
git reflog expire --expire=now --all || true
git gc --prune=now --aggressive || true

echo "Reemplace la URL 'origin' si necesita apuntar a otro remote o confirme origin"
# Forzar push al origin (coordinar con el equipo!)
read -p "¿Deseas forzar push al remote 'origin'? Esto reescribirá el historial remoto. (yes/NO): " confirm
if [ "$confirm" = "yes" ]; then
  git push --force --all origin
  git push --force --tags origin
  echo "Push forzado completado. Comunica a colaboradores que deben reclonar." 
else
  echo "Push cancelado. Verifica los cambios localmente en $PWD antes de empujar." 
fi

echo "Script finalizado. Si hiciste push, solicita a todos los colaboradores que reclonen el repo." 
