---
description: Fabrique l'empreinte du seuil de l'atelier depuis une date, en local
argument-hint: "[date — ex. 17/08/2026]"
allowed-tools: Bash(node -e:*)
---

L'atelier demande notre date d'officialisation avant de s'ouvrir. La comparaison se fait sur
`sha-256`, **jamais sur la date en clair** : sinon quelqu'un qui ouvre les sources tombe sur
une date d'anniversaire lisible. Seule l'empreinte entre dans le dépôt.

Normalise `$1` — **les chiffres seuls, dans l'ordre tapé** — puis préfixe `pli.seuil.` et
hache :

```sh
node -e 'crypto.subtle.digest("SHA-256", new TextEncoder().encode("pli.seuil."+process.argv[1]))
  .then(b=>console.log(Buffer.from(b).toString("hex")))' <chiffres>
```

Rends l'empreinte, et rappelle en une ligne : c'est un paillasson, pas une serrure — le
contrôle est côté client et il n'existe que quelques dizaines de milliers de dates plausibles.
Le détail est dans `docs/architecture.md#le-seuil-de-latelier`.

N'écris la date en clair nulle part : ni dans un fichier, ni dans un commentaire, ni dans un
message de commit.
