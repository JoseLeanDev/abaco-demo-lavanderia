#!/bin/bash
# Script para subir el demo de lavandería a GitHub
# Uso: ./subir-a-github.sh TU_USUARIO_DE_GITHUB

set -e

USER=$1

if [ -z "$USER" ]; then
    echo "❌ Uso: ./subir-a-github.sh TU_USUARIO_DE_GITHUB"
    echo "Ejemplo: ./subir-a-github.sh josearias96"
    exit 1
fi

REPO="abaco-demo-lavanderia"

echo "🚀 Subiendo demo de lavandería a GitHub..."
echo "   Usuario: $USER"
echo "   Repo: $REPO"

# Renombrar rama a main
git branch -m main 2>/dev/null || true

# Agregar remote
git remote remove origin 2>/dev/null || true
git remote add origin "https://github.com/$USER/$REPO.git"

# Subir código
git push -u origin main

echo ""
echo "✅ Código subido exitosamente!"
echo "   URL: https://github.com/$USER/$REPO"
echo ""
echo "📋 Próximo paso: Seguir DEPLOY_PASO_A_PASO.md para configurar en Render"
