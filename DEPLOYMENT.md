# Guide de Déploiement - SystemsMatic

Ce guide vous accompagne dans le déploiement de l'application SystemsMatic, une solution complète de gestion de rendez-vous avec backend NestJS, frontend Next.js, et base de données PostgreSQL.

## 📋 Table des matières

1. [Prérequis](#prérequis)
2. [Architecture du projet](#architecture-du-projet)
3. [Déploiement avec Docker Compose](#déploiement-avec-docker-compose)
4. [Déploiement sur Netlify (Frontend)](#déploiement-sur-netlify-frontend)
5. [Configuration des variables d'environnement](#configuration-des-variables-denvironnement)
6. [Configuration DNS et SSL](#configuration-dns-et-ssl)
7. [Maintenance et monitoring](#maintenance-et-monitoring)
8. [Dépannage](#dépannage)

## 🔧 Prérequis

### Sur votre machine locale

- **Docker** (version 20.10+) et **Docker Compose** (version 2.0+)
- **Node.js** (version 20.x) et **npm**
- **Git**

### Pour le déploiement en production

- **Serveur VPS/Cloud** avec Docker installé
- **Nom de domaine** configuré
- **Accès SSH** au serveur
- **Compte Resend** pour l'envoi d'emails

## 🏗️ Architecture du projet

```
SystemsMatic/
├── backend/          # API NestJS
├── frontend/         # Application Next.js
├── docker-compose.yml # Configuration Docker
├── .env             # Variables d'environnement
└── netlify.toml     # Configuration Netlify
```

### Services inclus :

- **Backend** : API NestJS sur le port 3001
- **Frontend** : Application Next.js sur le port 3000
- **PostgreSQL** : Base de données principale
- **Redis** : Cache et gestion des queues
- **Traefik** : Reverse proxy avec SSL automatique

## 🐳 Déploiement avec Docker Compose

### 1. Cloner le projet

```bash
git clone <votre-repo>
cd SystemsMatic
```

### 2. Configuration des variables d'environnement

Copiez le fichier `.env` et configurez les variables :

```bash
cp .env.example .env
```

Éditez le fichier `.env` avec vos valeurs :

```env
# Configuration de la base de données
POSTGRES_DB=systemsmatic
POSTGRES_USER=postgres
POSTGRES_PASSWORD=votre-mot-de-passe-securise
DATABASE_URL=postgresql://postgres:votre-mot-de-passe-securise@postgres:5432/systemsmatic
DIRECT_URL=postgresql://postgres:votre-mot-de-passe-securise@postgres:5432/systemsmatic

# Configuration du domaine
DOMAIN=votre-domaine.com

# Configuration JWT
JWT_SECRET=votre-cle-jwt-tres-securisee
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# Configuration Admin
ADMIN_EMAIL=admin@votre-domaine.com
ADMIN_PASSWORD=votre-mot-de-passe-admin

# Configuration Email (Resend)
RESEND_API_KEY=re_votre-cle-resend
MAIL_FROM=noreply@votre-domaine.com

# Configuration Redis
REDIS_URL=redis://redis:6379

# Configuration URLs publiques
PUBLIC_URL=https://votre-domaine.com

# Configuration CORS
CORS_ORIGIN=https://votre-domaine.com

# Configuration ACME pour Let's Encrypt
ACME_EMAIL=admin@votre-domaine.com

# Configuration Traefik (optionnel)
TRAEFIK_AUTH=admin:votre-hash-bcrypt
```

### 3. Démarrage des services

```bash
# Construire et démarrer tous les services
docker-compose up -d --build

# Vérifier le statut des services
docker-compose ps

# Voir les logs
docker-compose logs -f
```

### 4. Initialisation de la base de données

```bash
# Exécuter les migrations Prisma
docker-compose exec backend npx prisma migrate deploy

# (Optionnel) Seeder la base de données
docker-compose exec backend npm run prisma:seed
```

### 5. Vérification du déploiement

- **Site principal** : https://votre-domaine.com
- **Back Office** : https://admin.votre-domaine.com
- **API** : https://api.votre-domaine.com
- **Dashboard Traefik** : https://traefik.votre-domaine.com

## 🌐 Déploiement sur Netlify (Frontend)

### 1. Configuration Netlify

Le projet est déjà configuré avec `netlify.toml`. Pour déployer :

1. Connectez votre repository GitHub à Netlify
2. Configurez les variables d'environnement dans Netlify :
   - `NEXT_PUBLIC_API_URL` : URL de votre API backend
   - `NEXT_PUBLIC_DOMAIN` : Votre domaine principal

### 2. Variables d'environnement Netlify

```env
NEXT_PUBLIC_API_URL=https://api.votre-domaine.com
NEXT_PUBLIC_DOMAIN=votre-domaine.com
```

### 3. Déploiement automatique

Netlify déploiera automatiquement à chaque push sur la branche `main`.

## ⚙️ Configuration des variables d'environnement

### Variables obligatoires

| Variable            | Description              | Exemple                  |
| ------------------- | ------------------------ | ------------------------ |
| `POSTGRES_PASSWORD` | Mot de passe PostgreSQL  | `motdepasse123!`         |
| `DOMAIN`            | Domaine principal        | `systemsmatic.com`       |
| `JWT_SECRET`        | Clé secrète JWT          | `ma-cle-super-secrete`   |
| `ADMIN_EMAIL`       | Email administrateur     | `admin@systemsmatic.com` |
| `ADMIN_PASSWORD`    | Mot de passe admin       | `admin123!`              |
| `RESEND_API_KEY`    | Clé API Resend           | `re_abc123...`           |
| `ACME_EMAIL`        | Email pour Let's Encrypt | `admin@systemsmatic.com` |

### Variables optionnelles

| Variable                 | Description       | Défaut              |
| ------------------------ | ----------------- | ------------------- |
| `CORS_ORIGIN`            | Origine CORS      | `https://${DOMAIN}` |
| `JWT_EXPIRES_IN`         | Durée JWT         | `24h`               |
| `JWT_REFRESH_EXPIRES_IN` | Durée refresh JWT | `7d`                |
| `MAINTENANCE_MODE`       | Mode maintenance  | `false`             |

## 🌍 Configuration DNS et SSL

### 1. Configuration DNS

Créez les enregistrements DNS suivants :

```
Type    Nom                    Valeur
A       @                     IP_DE_VOTRE_SERVEUR
A       api                   IP_DE_VOTRE_SERVEUR
A       admin                 IP_DE_VOTRE_SERVEUR
A       traefik               IP_DE_VOTRE_SERVEUR
```

### 2. SSL automatique

Traefik gère automatiquement les certificats SSL avec Let's Encrypt. Aucune configuration supplémentaire n'est nécessaire.

## 🔧 Maintenance et monitoring

### Commandes utiles

```bash
# Redémarrer un service
docker-compose restart backend

# Mettre à jour l'application
git pull
docker-compose up -d --build

# Voir les logs d'un service
docker-compose logs -f backend

# Accéder au shell d'un conteneur
docker-compose exec backend sh

# Sauvegarder la base de données
docker-compose exec postgres pg_dump -U postgres systemsmatic > backup.sql

# Restaurer la base de données
docker-compose exec -T postgres psql -U postgres systemsmatic < backup.sql
```

### Monitoring

- **Health checks** : Chaque service a un health check configuré
- **Logs** : Accessibles via `docker-compose logs`
- **Traefik Dashboard** : Monitoring du trafic et des certificats SSL

### Sauvegardes

```bash
# Script de sauvegarde automatique
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker-compose exec postgres pg_dump -U postgres systemsmatic > "backup_${DATE}.sql"
```

## 🚨 Dépannage

### Problèmes courants

#### 1. Services ne démarrent pas

```bash
# Vérifier les logs
docker-compose logs

# Redémarrer tous les services
docker-compose down && docker-compose up -d
```

#### 2. Problème de base de données

```bash
# Vérifier la connexion PostgreSQL
docker-compose exec backend npx prisma db push

# Réinitialiser la base de données
docker-compose exec backend npx prisma migrate reset
```

#### 3. Problème de certificats SSL

```bash
# Vérifier les certificats Traefik
docker-compose logs traefik

# Redémarrer Traefik
docker-compose restart traefik
```

#### 4. Problème de CORS

Vérifiez que `CORS_ORIGIN` dans `.env` correspond à votre domaine frontend.

### Logs utiles

```bash
# Logs de tous les services
docker-compose logs

# Logs d'un service spécifique
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres
docker-compose logs redis
docker-compose logs traefik
```

### Support

En cas de problème :

1. Vérifiez les logs avec `docker-compose logs`
2. Consultez la documentation de chaque service
3. Vérifiez la configuration des variables d'environnement
4. Assurez-vous que tous les ports sont ouverts sur votre serveur

## 📚 Ressources supplémentaires

- [Documentation Docker Compose](https://docs.docker.com/compose/)
- [Documentation Traefik](https://doc.traefik.io/traefik/)
- [Documentation Prisma](https://www.prisma.io/docs/)
- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation NestJS](https://docs.nestjs.com/)

---

**Note** : Ce guide assume que vous avez une connaissance de base de Docker et des concepts de déploiement web. Pour toute question spécifique, consultez la documentation officielle des technologies utilisées.
