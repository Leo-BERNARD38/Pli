#!/bin/sh
# La moulinette, depuis mon bureau. Le détail est dans scripts/plier.mjs.
#
#   ./scripts/plier.sh        tous les poèmes de plis-source/
#   ./scripts/plier.sh 015    celui-là seulement
set -e
cd "$(dirname "$0")/.."
node scripts/plier.mjs "$@"
