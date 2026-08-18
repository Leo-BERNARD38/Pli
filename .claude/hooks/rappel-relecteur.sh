#!/bin/sh
# Après chaque écriture dans src/, rappelle le relecteur qui va avec ce fichier.
#
# Sous vibe coding, une revue qu'il faut penser à demander n'a jamais lieu.
# Ce rappel est court, déterministe, et ne dit rien sur un fichier hors src/.

entree=$(cat)
chemin=$(printf '%s' "$entree" \
  | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' \
  | head -1 | sed 's/.*"\([^"]*\)"$/\1/')

case "$chemin" in
  */src/*) ;;
  *) exit 0 ;;
esac

case "$chemin" in
  *codec*|*journal*|*plier*|*routeur*|*router*)
    quoi="garde-invariants (le codec, les noms de fichiers, le journal, ce qui ne se rouvre pas)" ;;
  *.css|*styles*|*lecteur*|*atelier*)
    quoi="revue-ecran et gardien-lexique" ;;
  *)
    quoi="le relecteur qui correspond — revue-ecran, gardien-lexique, garde-fluidite ou garde-invariants" ;;
esac

printf '{"hookSpecificOutput":{"hookEventName":"PostToolUse","additionalContext":"Rappel du depot : avant de dire cet ecran fini, le passer a %s. La revue complete est /revue."}}' "$quoi"
