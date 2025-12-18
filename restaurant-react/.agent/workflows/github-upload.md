---
description: How to save your project to GitHub
---

# Sauvegarder votre projet sur GitHub

Suivez ces étapes pour héberger votre site sur GitHub après avoir fini les modifications.

## 1. Créer un nouveau dépôt sur GitHub
1. Connectez-vous à votre compte [GitHub](https://github.com/).
2. Cliquez sur le bouton **"New"** (ou le signe **+**) pour créer un nouveau dépôt.
3. Donnez-lui un nom (par exemple : `restaurant-app`).
4. Cliquez sur **"Create repository"** (laissez les autres options par défaut).

## 2. Initialiser Git localement
Ouvrez votre terminal dans le dossier `restaurant-react` et exécutez ces commandes :

```powershell
# Initialiser le dépôt
git init

# Ajouter tous les fichiers (le fichier .gitignore que j'ai créé exclura les dossiers lourds inutilement)
git add .

# Enregistrer les modifications
git commit -m "🚀 Version finale du site"
```

## 3. Lier au dépôt GitHub
Copiez l'URL de votre dépôt GitHub (ex: `https://github.com/votre-nom/restaurant-app.git`) et exécutez :

```powershell
# Ajouter l'adresse distante (remplacez l'URL par la vôtre)
git remote add origin https://github.com/VOTRE_NOM/REPERTOIRE.git

# Renommer la branche principale en 'main'
git branch -M main

# Envoyer vers GitHub
git push -u origin main
```

> [!TIP]
> Si c'est votre première fois, Git vous demandera peut-être de vous connecter à GitHub via une fenêtre contextuelle.
