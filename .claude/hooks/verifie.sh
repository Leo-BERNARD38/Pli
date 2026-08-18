#!/bin/sh
# Après chaque écriture, la relecture déterministe sur le fichier écrit.
#
# Elle ne dit rien quand tout va bien : un rappel qui parle à chaque écriture devient du
# bruit, et le bruit coûte du contexte. Deux cas la font parler — un refus de
# scripts/verifie.mjs, ou la naissance d'un écran, qui est le seul moment où un rappel de
# relecture vaut son prix.

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

# Les refus d'abord : ils l'emportent sur tout le reste.
sortie=$(node scripts/verifie.mjs --fichier "$chemin" --hook 2>/dev/null)
if [ -n "$sortie" ]; then
  printf '%s' "$sortie"
  exit 0
fi

# Un fichier d'écran encore inconnu de git : il vient de naître.
case "$chemin" in
  */src/lecteur/*|*/src/atelier/*) ;;
  *) exit 0 ;;
esac
git ls-files --error-unmatch "$chemin" >/dev/null 2>&1 && exit 0

printf '{"hookSpecificOutput":{"hookEventName":"PostToolUse","additionalContext":"Nouvel ecran. A la fin du lot — pas a chaque fichier — le passer a revue-ecran. Un seul relecteur suffit."}}'
