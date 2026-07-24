# Relevé de prix — Carnet

Application web statique, 100% locale (aucun serveur, aucune API), pour suivre
tes propres prix de produits et les comparer à un export du dataset
[webtruffle/retail-product-catalog-prices](https://github.com/webtruffle/retail-product-catalog-prices)
(ODbL 1.0, Open Food Facts / Open Prices / OpenStreetMap).

Tout tourne dans le navigateur : tes fichiers `prix.json` et l'export du
dataset restent sur ton disque, rien n'est envoyé à un serveur.

## Utilisation rapide

1. Ouvre `index.html` (double-clic ou via GitHub Pages, voir plus bas).
2. Clique **Importer prix.json** pour charger ta liste de produits
   (voir `prix.example.json` pour le format attendu, ou pars de zéro en créant
   les tiens directement dans l'appli).
3. Télécharge `retail-product-prices.jsonl` (ou `.json`) depuis la
   [dernière release du dataset](https://github.com/webtruffle/retail-product-catalog-prices/releases/latest),
   puis clique **Importer le dataset** pour le charger.
4. Clique **Faire correspondre les prix** : l'appli cherche, pour chaque
   produit de ta liste, les observations du dataset dont le nom contient tous
   les mots de ton "tag", et calcule un prix médian (au kg et/ou à l'unité).
5. Valide les nouveaux prix en cliquant sur la pastille verte (ou garde
   l'ancien prix), puis clique **Exporter prixUpdate.json** pour récupérer un
   fichier prêt à remplacer ton `prix.json`.

L'onglet **Dataset** permet de parcourir directement le fichier importé
(recherche par nom ou par code-barres), indépendamment de ta liste de
produits.

## Format de `prix.json`

Un objet JSON où chaque clé est un identifiant de produit :

```json
{
  "cle_produit": {
    "tag": "Nom affiché, utilisé pour la recherche",
    "id": "cle_produit",
    "priceUnit": 1.99,
    "priceKg": null,
    "updatedAt": "2026-07-23"
  }
}
```

- `priceUnit` et `priceKg` peuvent être `null` s'ils ne s'appliquent pas.
- `tag` est ce qui sert de base à la recherche dans le dataset (mots-clés,
  insensible aux accents et à la casse).

## Déploiement sur GitHub Pages (optionnel)

1. Crée un dépôt GitHub et pousse le contenu de ce dossier.
2. Dans **Settings → Pages**, choisis la branche `main` et le dossier `/`
   (racine).
3. L'appli sera accessible à `https://<ton-compte>.github.io/<ton-repo>/`.

Aucune étape de build n'est nécessaire : c'est un unique fichier HTML
autonome (HTML + CSS + JS inline, sans dépendance externe hormis les
polices Google Fonts).

## Vie privée et réseau

- Aucun appel réseau n'est fait pour tes données : les fichiers `prix.json`
  et le dataset sont lus localement via l'API `File`/`FileReader` du
  navigateur.
- La seule requête réseau tentée automatiquement au chargement est un
  `fetch("prix.json")` relatif (utile seulement si l'appli est servie par un
  vrai serveur HTTP et qu'un `prix.json` est présent à côté d'`index.html`) ;
  elle échoue silencieusement sinon, y compris en ouverture directe via
  `file://`.
- Les seules ressources externes chargées sont les polices Google Fonts
  (JetBrains Mono, Inter) via `fonts.googleapis.com`. Retire le `<link>`
  correspondant dans `index.html` si tu veux une appli 100% hors-ligne.

## Licence

- **Code de cette application** : voir [LICENSE](LICENSE) (MIT).
- **Données du dataset webtruffle** utilisées en entrée : distribuées sous
  ODbL 1.0 par le projet
  [webtruffle/retail-product-catalog-prices](https://github.com/webtruffle/retail-product-catalog-prices).
  Cette appli ne redistribue pas ces données ; c'est à toi de respecter la
  licence et l'attribution du dataset si tu republies quoi que ce soit basé
  dessus.
