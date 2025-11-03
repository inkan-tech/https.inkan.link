# CodeQL Manager - Documentation

Script de gestion de CodeQL via l'API GitHub pour automatiser la configuration, le monitoring et l'analyse de sécurité.

## Table des matières

- [Vue d'ensemble](#vue-densemble)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Commandes](#commandes)
- [Exemples d'utilisation](#exemples-dutilisation)
- [Configuration avancée](#configuration-avancée)
- [Référence API](#référence-api)
- [Troubleshooting](#troubleshooting)

## Vue d'ensemble

Ce script permet de gérer la configuration **CodeQL Default Setup** de GitHub via l'API REST. Il est conçu pour:

- ✅ Vérifier l'état et la configuration de CodeQL
- ✅ Monitorer les alertes de sécurité
- ✅ Suivre l'historique des analyses
- ✅ Mettre à jour la configuration de manière programmatique
- ✅ Être réutilisable pour tous vos projets GitHub

### Pourquoi ce script ?

GitHub propose deux modes de configuration CodeQL:

1. **Default Setup** (recommandé) - Configuration automatique gérée par GitHub
2. **Advanced Setup** - Workflow personnalisé `.github/workflows/codeql.yml`

Ce script gère le **Default Setup** via l'API, évitant les conflits avec les workflows personnalisés.

## Prérequis

### Outils requis

```bash
# GitHub CLI (obligatoire)
brew install gh
# ou
curl -sS https://webi.sh/gh | sh

# jq pour le parsing JSON (obligatoire)
brew install jq
# ou
sudo apt-get install jq
```

### Authentification

Le script nécessite une authentification GitHub avec les permissions appropriées:

```bash
# Authentification interactive
gh auth login

# Vérifier l'authentification
gh auth status

# Vérifier les permissions
gh auth status --show-token
```

**Permissions requises:**
- `repo` (accès complet au repository)
- `security_events` (lecture/écriture des événements de sécurité)

## Installation

### Installation locale

```bash
# Cloner ou copier le script
cd /chemin/vers/votre/projet
mkdir -p scripts
cp codeql-manager.sh scripts/

# Rendre le script exécutable
chmod +x scripts/codeql-manager.sh

# Optionnel: Ajouter au PATH
echo 'export PATH="$PATH:$(pwd)/scripts"' >> ~/.bashrc
source ~/.bashrc
```

### Installation globale

```bash
# Copier vers un répertoire dans le PATH
sudo cp codeql-manager.sh /usr/local/bin/codeql-manager
sudo chmod +x /usr/local/bin/codeql-manager

# Utilisation depuis n'importe où
codeql-manager status owner/repo
```

## Utilisation

### Syntaxe générale

```bash
./codeql-manager.sh <commande> [repository] [options]
```

### Détection automatique du repository

Si vous êtes dans un repository Git cloné depuis GitHub, le script détecte automatiquement le repository:

```bash
# Depuis le répertoire du projet
cd /chemin/vers/votre/repo
./codeql-manager.sh status
# Équivaut à: ./codeql-manager.sh status owner/repo
```

### Spécifier un repository explicitement

```bash
# Format: owner/repo
./codeql-manager.sh status microsoft/vscode
./codeql-manager.sh alerts thomnico/https.inkan.link
```

## Commandes

### `status` - Afficher la configuration

Affiche l'état actuel de CodeQL pour un repository.

```bash
./codeql-manager.sh status [repository]
```

**Sortie:**
- État de CodeQL (configured, not-configured, etc.)
- Langages analysés
- Suite de requêtes utilisée
- Modèle de menace
- Fréquence des scans
- Type de runner
- Date de dernière mise à jour

**Exemple:**
```bash
$ ./codeql-manager.sh status

=== CodeQL Configuration for thomnico/https.inkan.link ===

State:          configured
Languages:      actions, javascript, javascript-typescript, typescript
Query Suite:    default
Threat Model:   remote
Schedule:       weekly
Runner Type:    standard
Last Updated:   2025-08-04T21:06:46Z
✓ CodeQL is properly configured
```

### `alerts` - Lister les alertes de sécurité

Liste les alertes de sécurité détectées par CodeQL.

```bash
./codeql-manager.sh alerts [repository] [état] [sévérité]
```

**Paramètres:**
- `état`: `open`, `closed`, `dismissed`, `all` (défaut: `all`)
- `sévérité`: `critical`, `high`, `medium`, `low`, `all` (défaut: `all`)

**Exemples:**
```bash
# Toutes les alertes
./codeql-manager.sh alerts

# Alertes ouvertes uniquement
./codeql-manager.sh alerts "" open

# Alertes critiques ouvertes
./codeql-manager.sh alerts "" open critical

# Alertes d'un autre repository
./codeql-manager.sh alerts microsoft/vscode open high
```

**Sortie:**
```
=== CodeQL Security Alerts for owner/repo ===

Total Alerts: 3

Alert #42
  State:    open
  Severity: high
  Rule:     js/sql-injection
  Location: src/database.js:125
  Created:  2025-10-15 14:32

Alert #43
  State:    dismissed
  Severity: medium
  Rule:     js/xss
  Location: src/render.js:89
  Created:  2025-10-14 09:15
```

### `analyses` - Historique des analyses

Affiche l'historique des analyses CodeQL exécutées.

```bash
./codeql-manager.sh analyses [repository] [limite]
```

**Paramètres:**
- `limite`: Nombre d'analyses récentes à afficher (défaut: 10)

**Exemples:**
```bash
# 10 dernières analyses
./codeql-manager.sh analyses

# 20 dernières analyses
./codeql-manager.sh analyses "" 20

# Analyses d'un autre repository
./codeql-manager.sh analyses microsoft/vscode 5
```

**Sortie:**
```
=== Recent CodeQL Analyses for owner/repo ===

Showing last 5 analyses:

Analysis ID: 12345678
  Date:     2025-10-20 03:15
  Tool:     CodeQL
  Results:  3
  Commit:   a1b2c3d
  Branch:   main

Analysis ID: 12345677
  Date:     2025-10-13 03:10
  Tool:     CodeQL
  Results:  2
  Commit:   e4f5g6h
  Branch:   main
```

### `update` - Mettre à jour la configuration

Met à jour la configuration CodeQL de manière interactive.

```bash
./codeql-manager.sh update [repository]
```

**Configuration modifiable:**
- **Languages**: Langages à analyser (javascript, typescript, python, ruby, go, java, cpp, csharp)
- **Query Suite**:
  - `default` - Requêtes standard
  - `extended` - Requêtes étendues
  - `security-extended` - Requêtes de sécurité avancées
- **Schedule**:
  - `daily` - Analyse quotidienne
  - `weekly` - Analyse hebdomadaire
- **Threat Model**:
  - `remote` - Menaces à distance uniquement
  - `local` - Menaces locales et à distance

**Exemple de session interactive:**
```bash
$ ./codeql-manager.sh update

=== Update CodeQL Configuration for owner/repo ===

⚠ This will modify the CodeQL Default Setup configuration.
Continue? (y/N): y

Available options (press Enter to skip and keep current value):

Languages:
Available: javascript, typescript, python, ruby, go, java, cpp, csharp
Multiple languages: comma-separated (e.g., javascript,typescript,python)
Languages: javascript,typescript,python

Query Suite:
Options: default, extended, security-extended
Query Suite: security-extended

Schedule:
Options: daily, weekly
Schedule: daily

Threat Model:
Options: remote, local
Threat Model: remote

ℹ Updating configuration...
✓ Configuration updated successfully!
```

### `help` - Aide

Affiche l'aide complète du script.

```bash
./codeql-manager.sh help
# ou
./codeql-manager.sh --help
# ou
./codeql-manager.sh -h
```

## Exemples d'utilisation

### Workflow de monitoring quotidien

```bash
#!/bin/bash
# daily-security-check.sh

echo "=== Daily Security Check ==="

# Vérifier la configuration
./codeql-manager.sh status

# Vérifier les nouvelles alertes ouvertes
./codeql-manager.sh alerts "" open

# Vérifier les alertes critiques
echo -e "\n=== Critical Alerts ==="
./codeql-manager.sh alerts "" open critical

# Envoyer une notification si des alertes critiques existent
alert_count=$(gh api "/repos/$(gh repo view --json nameWithOwner -q .nameWithOwner)/code-scanning/alerts?state=open" | \
    jq '[.[] | select(.rule.severity_level == "critical")] | length')

if [[ $alert_count -gt 0 ]]; then
    echo "⚠️ WARNING: $alert_count critical alerts found!"
    # Envoyer notification (Slack, email, etc.)
fi
```

### Configuration multi-projets

```bash
#!/bin/bash
# configure-all-repos.sh

repos=(
    "owner/repo1"
    "owner/repo2"
    "owner/repo3"
)

for repo in "${repos[@]}"; do
    echo "Configuring $repo..."

    # Activer CodeQL avec configuration standard
    # Note: Nécessite que CodeQL soit déjà activé manuellement
    # Ce script met à jour la configuration existante

    ./codeql-manager.sh status "$repo"
done
```

### Audit de sécurité hebdomadaire

```bash
#!/bin/bash
# weekly-audit.sh

OUTPUT_DIR="security-reports/$(date +%Y-%m-%d)"
mkdir -p "$OUTPUT_DIR"

REPO="owner/repo"

# Générer rapport de configuration
./codeql-manager.sh status "$REPO" > "$OUTPUT_DIR/config.txt"

# Générer rapport des alertes
./codeql-manager.sh alerts "$REPO" all > "$OUTPUT_DIR/all-alerts.txt"
./codeql-manager.sh alerts "$REPO" open > "$OUTPUT_DIR/open-alerts.txt"

# Historique des analyses
./codeql-manager.sh analyses "$REPO" 50 > "$OUTPUT_DIR/analyses.txt"

echo "Reports generated in $OUTPUT_DIR"
```

## Configuration avancée

### Variables d'environnement

```bash
# Spécifier le repository par défaut
export GITHUB_REPOSITORY="owner/repo"

# Utiliser un token GitHub spécifique
export GITHUB_TOKEN="ghp_xxxxxxxxxxxx"

# Utiliser le script sans spécifier le repo
./codeql-manager.sh status
```

### Intégration CI/CD

#### GitHub Actions

```yaml
name: CodeQL Security Check

on:
  schedule:
    - cron: '0 9 * * 1'  # Tous les lundis à 9h
  workflow_dispatch:

jobs:
  security-check:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Install dependencies
        run: |
          sudo apt-get update
          sudo apt-get install -y jq

      - name: Check CodeQL alerts
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          chmod +x scripts/codeql-manager.sh

          # Afficher les alertes critiques
          ./scripts/codeql-manager.sh alerts "" open critical

          # Fail si des alertes critiques existent
          alert_count=$(gh api "/repos/${{ github.repository }}/code-scanning/alerts?state=open" | \
            jq '[.[] | select(.rule.severity_level == "critical")] | length')

          if [[ $alert_count -gt 0 ]]; then
            echo "::error::Found $alert_count critical security alerts"
            exit 1
          fi
```

### Automatisation avec cron

```bash
# Ajouter au crontab
crontab -e

# Vérification quotidienne des alertes à 9h
0 9 * * * /chemin/vers/scripts/codeql-manager.sh alerts owner/repo open >> /var/log/codeql-alerts.log 2>&1

# Rapport hebdomadaire le lundi à 8h
0 8 * * 1 /chemin/vers/scripts/weekly-audit.sh >> /var/log/codeql-weekly.log 2>&1
```

## Référence API

### Endpoints GitHub utilisés

Le script utilise les endpoints suivants de l'API GitHub REST:

#### GET /repos/{owner}/{repo}/code-scanning/default-setup
Récupère la configuration CodeQL actuelle.

**Réponse:**
```json
{
  "state": "configured",
  "languages": ["javascript", "typescript"],
  "query_suite": "default",
  "threat_model": "remote",
  "updated_at": "2025-08-04T21:06:46Z",
  "schedule": "weekly",
  "runner_type": "standard"
}
```

#### PATCH /repos/{owner}/{repo}/code-scanning/default-setup
Met à jour la configuration CodeQL.

**Payload:**
```json
{
  "languages": ["javascript", "typescript", "python"],
  "query_suite": "security-extended",
  "schedule": "daily",
  "threat_model": "remote"
}
```

#### GET /repos/{owner}/{repo}/code-scanning/alerts
Liste les alertes de sécurité.

**Paramètres de requête:**
- `state`: open, closed, dismissed
- `severity`: critical, high, medium, low
- `per_page`: nombre de résultats (max 100)
- `page`: numéro de page

#### GET /repos/{owner}/{repo}/code-scanning/analyses
Liste les analyses effectuées.

**Paramètres de requête:**
- `per_page`: nombre de résultats (max 100)
- `page`: numéro de page

### Documentation officielle

- [GitHub Code Scanning API](https://docs.github.com/en/rest/code-scanning)
- [CodeQL Default Setup](https://docs.github.com/en/code-security/code-scanning/enabling-code-scanning/configuring-default-setup-for-code-scanning)
- [GitHub CLI Documentation](https://cli.github.com/manual/)

## Troubleshooting

### Erreur: "GitHub CLI is not authenticated"

```bash
# Solution: Authentifier gh
gh auth login

# Vérifier l'authentification
gh auth status
```

### Erreur: "Could not determine repository"

```bash
# Solution 1: Spécifier le repository explicitement
./codeql-manager.sh status owner/repo

# Solution 2: Définir la variable d'environnement
export GITHUB_REPOSITORY="owner/repo"
./codeql-manager.sh status

# Solution 3: Exécuter depuis un dossier Git cloné depuis GitHub
cd /chemin/vers/repo-github
./codeql-manager.sh status
```

### Erreur: "Failed to retrieve CodeQL configuration"

**Causes possibles:**
1. CodeQL n'est pas activé sur le repository
2. Permissions insuffisantes
3. Repository n'existe pas ou nom incorrect

**Solutions:**
```bash
# Vérifier que CodeQL est activé sur GitHub
# Settings > Security > Code scanning > Configure

# Vérifier les permissions du token
gh auth status --show-token

# Vérifier que le repository existe
gh repo view owner/repo
```

### Erreur: "jq: command not found"

```bash
# macOS
brew install jq

# Ubuntu/Debian
sudo apt-get install jq

# CentOS/RHEL
sudo yum install jq
```

### Conflit avec workflow personnalisé

Si vous avez un fichier `.github/workflows/codeql.yml`, vous devez choisir:

**Option 1: Utiliser Default Setup (recommandé)**
```bash
# Supprimer le workflow personnalisé
rm .github/workflows/codeql.yml
git commit -am "Remove custom CodeQL workflow"
git push

# Utiliser le script pour gérer la configuration
./codeql-manager.sh status
```

**Option 2: Utiliser Advanced Setup**
```bash
# Désactiver Default Setup dans GitHub Settings
# Settings > Security > Code scanning > Set up > Advanced

# Garder votre workflow personnalisé
```

**⚠️ Ne jamais utiliser les deux en même temps !**

### Permissions insuffisantes

Si vous obtenez des erreurs 403 ou 404:

```bash
# Vérifier les permissions actuelles
gh auth status

# Re-login avec les bonnes permissions
gh auth login --scopes "repo,security_events"
```

### Analyses ne se déclenchent pas

```bash
# Vérifier la configuration
./codeql-manager.sh status

# Vérifier que le schedule est correct
# weekly = une fois par semaine
# daily = une fois par jour

# Forcer une analyse (via GitHub UI)
# Actions > CodeQL > Run workflow
```

## Support

### Ressources
- [Issues GitHub](https://github.com/owner/repo/issues)
- [Documentation CodeQL](https://codeql.github.com/docs/)
- [GitHub Security Lab](https://securitylab.github.com/)

### Contribuer

Les contributions sont bienvenues ! Pour contribuer:

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/amélioration`)
3. Commit vos changements (`git commit -am 'Add: nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/amélioration`)
5. Créer une Pull Request

### Licence

Ce script est fourni "tel quel" sans garantie. Utilisez-le à vos propres risques.

---

**Dernière mise à jour:** 2025-10-21
**Version:** 1.0.0
**Auteur:** Nicolas Thomas
