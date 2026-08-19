#!/bin/sh
# Refuse un commit qui casse quelque chose d'irréversible.
#
# Cinq gardes, toutes sur des faits que le dépôt garde pour toujours :
#   1. un poème en clair (plis-source/)
#   2. un fichier de poème supprimé ou renommé (son lien est déjà parti)
#   3. design/, l'archive figée — elle peut s'agrandir, jamais changer
#   4. l'empreinte du seuil accompagnée de sa date en clair
#   5. un numéro de téléphone français
#
# Lit l'entrée du hook sur stdin, ne dépend ni de jq ni de node.
# Sortie muette et exit 0 quand ce n'est pas un commit, ou quand tout va bien.

entree=$(cat)

# Ce n'est pas un commit : rien à faire.
printf '%s' "$entree" | grep -q 'git commit' || exit 0

cd "${CLAUDE_PROJECT_DIR:-.}" 2>/dev/null || exit 0
git rev-parse --git-dir >/dev/null 2>&1 || exit 0

# Les deux gardes de contenu ne regardent que le code : docs/ et design/ portent des
# exemples délibérés — la date du seuil et un numéro gabarit — qui ne sont pas des fuites.
HORS_PROSE=". :(exclude)docs/ :(exclude)design/ :(exclude)*.md"

# `git commit -a` prend aussi les fichiers suivis non indexés.
if printf '%s' "$entree" | grep -qE 'git commit[^"]*-[A-Za-z]*a'; then
  fichiers=$(git diff --cached --name-only 2>/dev/null; git diff --name-only 2>/dev/null)
  contenu=$(git diff --cached -U0 -- $HORS_PROSE 2>/dev/null; git diff -U0 -- $HORS_PROSE 2>/dev/null)
  etats=$(git diff --cached --name-status 2>/dev/null; git diff --name-status 2>/dev/null)
else
  fichiers=$(git diff --cached --name-only 2>/dev/null)
  contenu=$(git diff --cached -U0 -- $HORS_PROSE 2>/dev/null)
  etats=$(git diff --cached --name-status 2>/dev/null)
fi
[ -z "$fichiers" ] && exit 0

griefs=""
ajoute() { griefs="$griefs$1\\n"; }

echo "$fichiers" | grep -q '^plis-source/' &&
  ajoute "plis-source/ est sur le point d'entrer dans l'historique. Un poeme commite en clair une fois y reste pour toujours. Le desindexer, verifier .gitignore, et ne jamais forcer avec git add -f."

echo "$etats" | grep -qE '^(D|R[0-9]*)[[:space:]]+public/plis/' &&
  ajoute "Un fichier de public/plis/ est supprime ou renomme. Son nom est une adresse publique depuis le premier envoi : le lien deja parti tomberait en 404. Retirer un poeme est un geste manuel et delibere, jamais un effet de bord."

# design/ est une archive figee : elle peut S'AGRANDIR, jamais changer. Un canevas du
# projet design qui n'etait pas encore dans le depot y entre (A) ; un fichier deja archive
# qui serait modifie, supprime ou renomme (M, D, R) est refuse comme avant. Assoupli le
# 19/08/2026, quand les six canevas sont entres.
echo "$etats" | grep -qE '^(M|D|R[0-9]*|T)[[:space:]]+design/' &&
  ajoute "Un fichier deja dans design/ est modifie, supprime ou renomme. L'archive peut s'agrandir, jamais changer : quand le design se trompe, on corrige docs/ et on note l'ecart dans docs/integration.md."

printf '%s' "$contenu" | grep -qE '^\+.*pli\.seuil\.[0-9]' &&
  ajoute "La date du seuil apparait en clair a cote du prefixe pli.seuil. Seule l'empreinte sha-256 entre dans le depot (voir /seuil)."

printf '%s' "$contenu" | grep -qE '^\+.*([^0-9]|^)(\+|00)?33[0-9]{9}([^0-9]|$)' &&
  ajoute "Un numero de telephone francais apparait dans le diff. Le numero de reponse w ne vit que dans le tiroir (localStorage) et dans le lien d'une invitation deja envoyee : jamais un fichier, jamais une variable de build. Tout ce qui est builde est public."

[ -z "$griefs" ] && exit 0

printf '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"Commit refuse. Un lien parti na plus de version.\\n\\n%s\\nCorriger, puis recommiter. Ne pas contourner la garde."}}' "$griefs"
