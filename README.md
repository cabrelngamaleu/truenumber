# 🎯 TrueNumber Game

**TrueNumber** est une application web full-stack de jeu de prédiction où les utilisateurs tentent leur chance avec des nombres aléatoires. 

🎲 **Principe Simple** : Un nombre entre 0 et 100 est généré aléatoirement
- ✅ **Nombre > 70** → Victoire (+50 points)
- ❌ **Nombre ≤ 70** → Défaite (-35 points)

Testez votre chance et accumulez un maximum de points dans ce jeu addictif aux couleurs du Cameroun ! 🇨🇲

## ✨ Fonctionnalités

### 👤 Pour les Utilisateurs
- **🔐 Inscription & Connexion** : Authentification sécurisée avec tokens JWT
- **🎮 Jeu TrueNumber** : Génération de nombres aléatoires avec système de points
- **💰 Suivi du Solde** : Visualisation du solde de points actuel
- **📊 Historique des Parties** : Consultation de l'historique personnel avec résultats

### 👨‍💼 Pour les Administrateurs
- **👥 Gestion des Utilisateurs** : Créer, lire, modifier et supprimer des utilisateurs
- **📈 Statistiques Système** : Vue d'ensemble des utilisateurs, parties jouées et métriques
- **🌍 Historique Global** : Consultation de l'historique de tous les utilisateurs
- **🔑 Gestion des Rôles** : Attribution des rôles utilisateur ou administrateur

## 🛠️ Stack Technologique

### Backend
- **Node.js** avec Express.js
- **MongoDB** avec Mongoose ODM
- **JWT** pour l'authentification
- **bcryptjs** pour le hachage des mots de passe
- **Joi** pour la validation des entrées
- **Swagger** pour la documentation API
- **CORS** et middleware de sécurité

### Frontend
- **Next.js 14** avec App Router
- **TypeScript** pour la sécurité des types
- **Tailwind CSS** pour le styling
- **React Hook Form** pour la gestion des formulaires
- **Axios** pour les appels API
- **React Hot Toast** pour les notifications
- **Lucide React** pour les icônes

## 📁 Structure du Projet

```
TrueNumber/
├── server/                 # API Backend
│   ├── middleware/        # Authentification et validation
│   ├── models/           # Schémas MongoDB
│   ├── routes/           # Routes API
│   ├── db-setup.js       # Configuration base de données
│   └── index.js          # Fichier serveur principal
├── client/               # Application Frontend Next.js
│   ├── src/
│   │   ├── app/          # Pages Next.js
│   │   ├── components/   # Composants réutilisables
│   │   ├── contexts/     # Contextes React
│   │   ├── services/     # Services API
│   │   └── types/        # Types TypeScript
│   └── package.json
└── README.md
```

## 🚀 Installation & Configuration

### Prérequis
- Node.js (v18 ou supérieur)
- MongoDB (instance locale ou cloud)
- npm ou yarn

### Configuration Backend

1. Naviguez vers le répertoire serveur :
```bash
cd server
```

2. Installez les dépendances :
```bash
npm install
```

3. Créez un fichier `.env` dans le répertoire server :
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/truenumber
JWT_SECRET=votre-clé-jwt-super-secrète-ici
NODE_ENV=development
```

4. Démarrez le serveur :
```bash
node index.js
```

L'API sera disponible sur `http://localhost:5000`

### Configuration Frontend

1. Naviguez vers le répertoire client :
```bash
cd client
```

2. Installez les dépendances :
```bash
npm install
```

3. Créez un fichier `.env.local` dans le répertoire client :
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

4. Démarrez le serveur de développement :
```bash
npm run dev
```

Le frontend sera disponible sur `http://localhost:3000`

## 🎲 Principe et Règles du Jeu

### 🎯 Comment Jouer à TrueNumber

**TrueNumber** est un jeu de prédiction simple et addictif basé sur la génération de nombres aléatoires.

#### 📋 Règles Détaillées

1. **🎲 Génération du Nombre**
   - Le système génère automatiquement un nombre aléatoire entre **0 et 100** (inclus)
   - Chaque nombre a une probabilité égale d'être généré
   - Le nombre généré est affiché immédiatement après chaque partie

2. **🎯 Principe de Victoire/Défaite**
   - **✅ VICTOIRE** : Si le nombre généré est **SUPÉRIEUR à 70** (71, 72, 73, ..., 99, 100)
     - Votre solde **augmente de +50 points**
     - Message de félicitations affiché
   
   - **❌ DÉFAITE** : Si le nombre généré est **INFÉRIEUR ou ÉGAL à 70** (0, 1, 2, ..., 69, 70)
     - Votre solde **diminue de -35 points**
     - Message d'encouragement affiché

3. **💰 Système de Points**
   - **Solde Initial** : Tous les nouveaux utilisateurs commencent avec **0 points**
   - **Gain par Victoire** : +50 points ajoutés au solde
   - **Perte par Défaite** : -35 points retirés du solde
   - **Solde Minimum** : Aucune limite (le solde peut devenir négatif)
   - **Solde Maximum** : Aucune limite (accumulation illimitée)

4. **📊 Probabilités**
   - **Chance de Victoire** : 29,7% (30 nombres de 71 à 100 sur 101 possibles)
   - **Chance de Défaite** : 70,3% (71 nombres de 0 à 70 sur 101 possibles)
   - Jeu avec avantage à la maison, rendant les victoires plus précieuses

#### 🎮 Déroulement d'une Partie

1. **Connexion** : L'utilisateur se connecte à son compte
2. **Clic "Jouer"** : Appui sur le bouton "Générer un nombre"
3. **Génération** : Le système génère instantanément un nombre aléatoire entre 0 et 100
4. **Résultat** : Affichage du nombre et du résultat (victoire/défaite)
5. **Mise à jour** : Le solde est automatiquement mis à jour (+50 ou -35 points)
6. **Historique** : La partie est enregistrée dans l'historique personnel

#### 🏆 Objectif du Jeu

L'objectif est d'**accumuler le maximum de points** en espérant que les nombres supérieurs à 70 sortent plus souvent. Avec seulement 30% de chances de gagner, chaque victoire est précieuse et rapporte gros ! C'est un jeu de chance qui teste votre persévérance et votre stratégie de gestion des risques.

## 📚 Documentation API

Une fois le serveur démarré, visitez `http://localhost:5000/api-docs` pour voir la documentation Swagger de l'API.

### Endpoints Principaux

#### Authentification
- `POST /api/auth/register` - Inscription nouvel utilisateur
- `POST /api/auth/login` - Connexion utilisateur
- `POST /api/auth/logout` - Déconnexion utilisateur
- `GET /api/auth/me` - Obtenir l'utilisateur actuel

#### Jeu
- `POST /api/game/play` - Jouer au jeu TrueNumber

#### Solde
- `GET /api/balance` - Obtenir le solde utilisateur

#### Historique
- `GET /api/history` - Obtenir l'historique utilisateur
- `GET /api/history/all` - Obtenir tout l'historique (admin uniquement)

#### Utilisateurs (Admin Uniquement)
- `GET /api/users` - Obtenir tous les utilisateurs
- `GET /api/users/:id` - Obtenir un utilisateur par ID
- `POST /api/users` - Créer un nouvel utilisateur
- `PUT /api/users/:id` - Modifier un utilisateur
- `DELETE /api/users/:id` - Supprimer un utilisateur

## 👨‍💼 Compte Administrateur par Défaut

Après le démarrage du serveur, un compte administrateur par défaut est créé :
- **Email** : `admin@truenumber.com`
- **Mot de passe** : `admin123`
- **Rôle** : `admin`

## 🔧 Développement

### Lancement en Mode Développement
```bash
# Backend
cd server
node index.js

# Frontend
cd client
npm run dev
```

### Construction pour la Production
```bash
# Backend
cd server
npm start

# Frontend
cd client
npm run build
npm start
```

## 🔒 Fonctionnalités de Sécurité

- Authentification par token JWT
- Hachage des mots de passe avec bcryptjs
- Validation des entrées avec Joi
- Protection CORS
- Limitation du taux de requêtes
- En-têtes de sécurité Helmet
- Routes protégées sur le frontend
- Contrôle d'accès basé sur les rôles

## 🎨 Design & UX

- **Interface Futuriste** : Design moderne avec effets de verre
- **Couleurs du Cameroun** : Palette inspirée du drapeau camerounais
- **Responsive Design** : Optimisé pour tous les appareils
- **Animations Fluides** : Transitions et effets visuels
- **Accessibilité** : Interface accessible et intuitive

## 🤝 Contribution

1. Forkez le repository
2. Créez une branche de fonctionnalité
3. Effectuez vos modifications
4. Ajoutez des tests si applicable
5. Soumettez une pull request

## 📄 Licence

Ce projet est sous licence MIT.

## 📞 Support

Pour le support ou les questions, veuillez ouvrir une issue dans le repository.

---

## 📝 Copyright

**© 2024 Cabrel Ngamaleu. Tous droits réservés.**

*TrueNumber Game - Application de jeu de nombres développée avec passion au Cameroun 🇨🇲*

---

### 🌟 Remerciements

Merci d'utiliser TrueNumber Game ! Ce projet a été développé avec amour et dédication pour offrir une expérience de jeu unique et moderne.

**Développé par Cabrel Ngamaleu** 🚀