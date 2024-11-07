#!/bin/bash

# Définir la couleur pour les messages
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
log() {
    echo -e "${GREEN}[DEPLOY]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "ecosystem.config.js" ]; then
    error "Le script doit être exécuté depuis le répertoire backend"
fi

log "Début du déploiement..."

# Arrêter les processus PM2 existants
log "Arrêt des processus PM2..."
pm2 stop all || error "Échec de l'arrêt des processus PM2"
pm2 delete all || error "Échec de la suppression des processus PM2"

# Installer les dépendances
log "Installation des dépendances..."
npm install || error "Échec de l'installation des dépendances"

# Générer le client Prisma et appliquer les migrations
log "Mise à jour de la base de données..."
npx prisma generate || error "Échec de la génération Prisma"
npx prisma migrate deploy || error "Échec du déploiement des migrations"

# Redémarrer le backend avec PM2
log "Redémarrage du backend..."
pm2 start ecosystem.config.js || error "Échec du démarrage PM2"
pm2 save || error "Échec de la sauvegarde PM2"

# Vérifier le statut
log "Vérification du statut..."
pm2 status

log "Déploiement terminé avec succès!"
log "Pour voir les logs en temps réel: pm2 logs raise-an-ai-backend"
