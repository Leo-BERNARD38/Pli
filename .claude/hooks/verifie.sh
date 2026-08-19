#!/bin/sh
# Après chaque écriture : la relecture déterministe sur le fichier écrit.
#
# Elle ne dit rien quand tout va bien. Un rappel qui parle à chaque écriture devient du
# bruit, et le bruit coûte du contexte. Deux choses seulement la font parler :
#   1. un refus de scripts/verifie.mjs — le plus souvent, et c'est actionnable tout de suite ;
#   2. un écran NEUF, une fois, pour nommer son relecteur. C'est assez rare pour être un
#      signal ; l'oubli d'une revue, lui, ne se rattrape pas.
# Le refus l'emporte : on ne parle pas de relecture à quelqu'un qui a une faute devant lui.

entree=$(cat)
chemin=$(printf '%s' "$entree" \
  | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' \
  | head -1 | sed 's/.*"\([^"]*\)"$/\1/')

case "$chemin" in
  *.ts|*.css|*.html) ;;
  *) exit 0 ;;
esac

cd "${CLAUDE_PROJECT_DIR:-.}" 2>/dev/null || exit 0
[ -f scripts/verifie.mjs ] || exit 0

sortie=$(node scripts/verifie.mjs --fichier "$chemin" --hook 2>/dev/null)
if [ -n "$sortie" ]; then
  printf '%s' "$sortie"
  exit 0
fi

# Un fichier d'écran que git ne connaît pas encore : c'est un écran neuf.
case "$chemin" in
  */src/lecteur/*|*/src/atelier/*) ;;
  *) exit 0 ;;
esac
git ls-files --error-unmatch "$chemin" >/dev/null 2>&1 && exit 0

printf '{"hookSpecificOutput":{"hookEventName":"PostToolUse","additionalContext":"Ecran neuf. Quand le lot sera fini : npm run verifie, puis UN relecteur — revue-ecran pour un ecran, garde-fluidite pour un geste ou un chargement. Pas les deux."}}'
