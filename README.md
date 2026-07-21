# Le jeu des refs communes 🎇

Jeu de soirée **hors-ligne** : l'un de vous pioche un mot et doit le faire deviner
à son complice **uniquement grâce à vos souvenirs communs**, pendant que l'équipe
adverse essaie de le trouver aussi. La première équipe à démasquer le mot remporte
la manche.

Application web installable (PWA) : jouable sur **Android** et **iPhone/iPad**
**sans passer par un store**, et **sans connexion** une fois installée.

## Jouer

Version en ligne : <https://oignonmetro.github.io/lejeudesrefscommunes/>

### Installer sur le téléphone (pas besoin de store)

- **Android (Chrome)** : ouvrir le lien → menu ⋮ → *Ajouter à l'écran d'accueil*
  (ou la bannière d'installation qui apparaît).
- **iPhone / iPad (Safari)** : ouvrir le lien dans **Safari** → bouton *Partager*
  → *Sur l'écran d'accueil*.

L'icône s'ajoute comme une vraie app, s'ouvre en plein écran et fonctionne
hors-ligne.

## Comment ça marche

- 2 équipes (rose / turquoise), au moins **2 joueurs par équipe** (il faut un conteur
  et un complice).
- À chaque tour, le conteur prend le téléphone, découvre le mot, et le fait deviner
  à son complice à l'oral avec vos références communes.
- **Succès** : l'équipe marque un point. **Échec** : pas de point, au tour suivant.
  Le bouton 🔄 pioche un autre mot.
- Première équipe à atteindre le nombre de manches défini dans les **Options**.
- Les mots sont classés par **thèmes** activables dans les Options. La liste se
  modifie dans [`src/data/words.ts`](src/data/words.ts).

## Développement

```bash
npm install
npm run dev      # serveur de dev
npm run build    # build de production dans dist/
npm run preview  # prévisualise le build
```

Stack : React + TypeScript + Vite, PWA via `vite-plugin-pwa` (service worker +
manifest pour le mode hors-ligne et l'installation).

## Déploiement

Un push sur la branche `main` déclenche le workflow
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) qui build le site et
le publie sur **GitHub Pages**.

Pré-requis (une seule fois) : dans **Settings → Pages** du dépôt, choisir la source
**GitHub Actions**.

### Et un vrai fichier .apk ?

La PWA peut plus tard être emballée en application Android (`.apk`/`.aab`) avec
[Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap) (TWA) à partir de
l'URL GitHub Pages — utile pour partager un fichier ou publier sur le Play Store.
Ce n'est pas nécessaire pour jouer.
