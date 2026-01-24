#!/bin/bash

echo "======================================"
echo "🧪 TESTS MAIALINK APPLICATION"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Check if servers are running
echo "1️⃣  Vérification des serveurs..."
if lsof -ti:3000 >/dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Web server running on port 3000"
else
    echo -e "${RED}✗${NC} Web server NOT running on port 3000"
fi

if lsof -ti:3001 >/dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} API server running on port 3001"
else
    echo -e "${RED}✗${NC} API server NOT running on port 3001"
fi
echo ""

# Test 2: Check web app responds
echo "2️⃣  Test réponse application web..."
if curl -s http://localhost:3000 | grep -q "MaiaLink"; then
    echo -e "${GREEN}✓${NC} Web app responds correctly"
else
    echo -e "${RED}✗${NC} Web app not responding"
fi
echo ""

# Test 3: Check database templates
echo "3️⃣  Vérification templates en base de données..."
TEMPLATE_COUNT=$(PGPASSWORD='npg_vgtpYy61uCWQ' psql -h ep-broad-silence-af1gq2v4-pooler.c-2.us-west-2.aws.neon.tech -U neondb_owner -d neondb -t -c "SELECT COUNT(*) FROM ordonnance_templates WHERE is_system_template = true;" 2>/dev/null)
if [ "$TEMPLATE_COUNT" -ge 68 ]; then
    echo -e "${GREEN}✓${NC} 68 templates système trouvés en base"
else
    echo -e "${YELLOW}⚠${NC} Seulement $TEMPLATE_COUNT templates système trouvés"
fi
echo ""

# Test 4: Check key files exist
echo "4️⃣  Vérification fichiers clés..."
FILES=(
    "apps/web/src/pages/ordonnances/NewOrdonnancePage.tsx"
    "apps/web/src/hooks/usePractitionerData.ts"
    "apps/web/src/lib/documentTemplates.ts"
    "apps/api/src/routes/ordonnances.ts"
    "drizzle/templates_ordonnances_sages_femmes.sql"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
    else
        echo -e "${RED}✗${NC} $file manquant"
    fi
done
echo ""

# Test 5: Check TypeScript compilation
echo "5️⃣  Vérification compilation TypeScript..."
cd apps/web
if npm run type-check 2>&1 | grep -q "error"; then
    echo -e "${RED}✗${NC} Erreurs TypeScript détectées"
else
    echo -e "${GREEN}✓${NC} Pas d'erreur TypeScript"
fi
cd ../..
echo ""

# Test 6: Check node_modules integrity
echo "6️⃣  Vérification dépendances..."
DEPS=(
    "apps/web/node_modules/jspdf"
    "apps/web/node_modules/@tanstack/react-query"
    "apps/api/node_modules/drizzle-orm"
)

for dep in "${DEPS[@]}"; do
    if [ -d "$dep" ]; then
        echo -e "${GREEN}✓${NC} $(basename $dep) installé"
    else
        echo -e "${RED}✗${NC} $(basename $dep) manquant"
    fi
done
echo ""

echo "======================================"
echo "✅ TESTS TERMINÉS"
echo "======================================"
