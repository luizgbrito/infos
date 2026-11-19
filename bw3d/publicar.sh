#!/usr/bin/env bash
# Deploy the complete Biblical World 3D site without touching other projects.
set -euo pipefail
REPO="https://github.com/luizgbrito/infos.git"
SOURCE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DRY_RUN=0
if [ "${1:-}" = "--dry-run" ]; then DRY_RUN=1; elif [ "$#" -gt 0 ]; then echo "Usage: bash publicar.sh [--dry-run]" >&2; exit 2; fi
python3 "$SOURCE/validar.py"
TEMP="$(mktemp -d)"
trap 'rm -rf "$TEMP"' EXIT
GIT_TERMINAL_PROMPT=0 git clone --depth 1 "$REPO" "$TEMP/infos"
cd "$TEMP/infos"
BRANCH="$(git symbolic-ref --short HEAD)"
if [ -z "$BRANCH" ]; then echo 'Could not identify target branch' >&2; exit 1; fi
mkdir -p bw3d
# Copy only the known, validated site files. Do not delete unknown remote files.
for entry in index.html .nojekyll README.md DEPLOY.md AUDITORIA.json validar.py publicar.sh QA_VISUAL_V9.md css js images media; do
  if [ -d "$SOURCE/$entry" ]; then
    mkdir -p "bw3d/$entry"
    cp -R "$SOURCE/$entry/." "bw3d/$entry/"
  elif [ -f "$SOURCE/$entry" ]; then
    cp "$SOURCE/$entry" "bw3d/$entry"
  fi
done
# Guard against an accidental HTML-only deployment.
for required in bw3d/index.html bw3d/js/config.js bw3d/js/checkout.js bw3d/media/app-exp.mp4 bw3d/images/app-mapa-poster.jpg; do
  if [ ! -s "$required" ]; then echo "ERROR: missing required deployed resource: $required" >&2; exit 1; fi
done
if [ "$(find bw3d/images -maxdepth 1 -type f | wc -l | tr -d ' ')" -lt 21 ]; then echo 'ERROR: image bundle incomplete' >&2; exit 1; fi
if [ "$(find bw3d/media -maxdepth 1 -type f | wc -l | tr -d ' ')" -lt 4 ]; then echo 'ERROR: video bundle incomplete' >&2; exit 1; fi
git add -- bw3d
printf '\nGit changes restricted to bw3d:\n'
git diff --cached --stat -- bw3d
if git diff --cached --quiet -- bw3d; then echo 'No changes to publish'; exit 0; fi
if [ "$DRY_RUN" -eq 1 ]; then echo 'DRY RUN: no commit and no push performed'; exit 0; fi
if [ -z "$(git config user.name || :)" ] || [ -z "$(git config user.email || :)" ]; then
  echo 'ERROR: set git user.name and user.email before deployment' >&2; exit 1
fi
git commit -m 'Publish Biblical World 3D LATAM site and complete media bundle'
git push origin "HEAD:$BRANCH"
echo 'Pushed site files. Check GitHub Pages and test purchase flow before sending traffic.'
