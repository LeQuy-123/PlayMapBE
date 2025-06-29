#!/bin/bash

# Define root
ROOT="playmap-backend"
mkdir -p $ROOT/src

# Define folders inside /src
FOLDERS=("config" "controllers" "middlewares" "models" "routes" "services" "utils")

# Create folders and placeholder .ts files
for folder in "${FOLDERS[@]}"
do
  mkdir -p "$ROOT/src/$folder"
  touch "$ROOT/src/$folder/${folder%?}.ts"  # e.g., controllers => controller.ts
done

# Create main entry files
touch "$ROOT/src/app.ts"
touch "$ROOT/src/index.ts"

# Create root files
touch "$ROOT/.env"
touch "$ROOT/tsconfig.json"
touch "$ROOT/package.json"

echo "✅ PlayMap Express+TS folder structure created."
