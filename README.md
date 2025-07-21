# TrueNumber

Une application web full-stack de jeu de prédiction où les utilisateurs tentent leur chance avec des nombres aléatoires.

## 🎮 Description

TrueNumber est un jeu de prédiction interactif où les joueurs :
- Devinent un nombre entre 1 et 100
- Placent des paris avec leur solde virtuel
- Gagnent le double de leur mise s'ils devinent correctement
- Peuvent consulter leur historique de jeux

## 🚀 Technologies

### Frontend
- **Next.js 14** - Framework React avec App Router
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS utilitaire
- **React Context** - Gestion d'état global

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **Stockage en mémoire** - Base de données simple

## 📦 Installation

### Prérequis
- Node.js 18+ 
- npm ou yarn

### Installation locale

1. **Cloner le repository**
```bash
git clone https://github.com/cabrelngamaleu/truenumber.git
cd truenumber
```

2. **Installer les dépendances du serveur**
```bash
cd server
npm install
```

3. **Installer les dépendances du client**
```bash
cd ../client
npm install
```

4. **Démarrer le serveur backend**
```bash
cd ../server
npm start
```

5. **Démarrer le client frontend**
```bash
cd ../client
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

## 🌐 Déploiement

### Frontend (Netlify)
- URL: https://truenumber2025.netlify.app/
- Déploiement automatique depuis la branche `main`

### Backend (Railway)
- URL: https://truenumber-production.up.railway.app/
- Déploiement automatique depuis la branche `main`

## 🎯 Fonctionnalités

- ✅ **Authentification** - Inscription et connexion
- ✅ **Jeu de prédiction** - Deviner des nombres aléatoires
- ✅ **Système de paris** - Gestion du solde virtuel
- ✅ **Historique** - Suivi des parties jouées
- ✅ **Interface responsive** - Compatible mobile et desktop
- ✅ **Panel admin** - Gestion des utilisateurs (admin uniquement)

## 🔧 Configuration

### Variables d'environnement

**Client (.env.local)**
```
NEXT_PUBLIC_API_URL=https://truenumber-production.up.railway.app
```

**Serveur**
```
PORT=8080
NODE_ENV=production
```

## 📱 Utilisation

1. **Inscription/Connexion** - Créer un compte ou se connecter
2. **Jouer** - Deviner un nombre entre 1 et 100
3. **Parier** - Choisir le montant à miser
4. **Gagner** - Doubler sa mise en cas de bonne prédiction
5. **Historique** - Consulter ses parties précédentes

## 🏗️ Structure du projet

```
truenumber/
├── client/                 # Frontend Next.js
│   ├── src/
│   │   ├── app/           # Pages et layouts
│   │   ├── components/    # Composants réutilisables
│   │   ├── contexts/      # Contextes React
│   │   ├── services/      # Services API
│   │   └── types/         # Types TypeScript
│   └── package.json
├── server/                # Backend Express
│   ├── routes/           # Routes API
│   ├── middleware/       # Middlewares
│   ├── models/          # Modèles de données
│   └── package.json
└── README.md
```

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
1. Fork le projet
2. Créer une branche feature
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT.

## 👨‍💻 Auteur

**Cabrel Ngamaleu**
- GitHub: [@cabrelngamaleu](https://github.com/cabrelngamaleu)
- Email: cabrelngamaleu@gmail.com

---

⭐ N'hésitez pas à donner une étoile si ce projet vous plaît !

## 🔧 Corrections Railway

- Serveur configuré pour écouter sur 0.0.0.0 en production
- Script de démarrage Railway optimisé
- Points de contrôle de santé améliorés