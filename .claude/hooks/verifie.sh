#!/bin/sh
# Après chaque écriture, la relecture déterministe sur le fichier écrit.
#
# Elle ne dit rien quand tout va bien : un rappel qui parle à chaque écriture devient
# du bruit, et du bruit coûte du contexte. Elle ne parle que si elle a trouvé.

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

node scripts/verifie.mjs --fichier "$chemin" --hook 2>/dev/null
exit 0
