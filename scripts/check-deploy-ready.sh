#!/usr/bin/env bash
# Next Chapter Travel — Deploy Readiness Check
# Run: bash scripts/check-deploy-ready.sh

ERRORS=0; WARNINGS=0

check() { eval "$2" > /dev/null 2>&1 && echo "  ✅ $1" || { echo "  ❌ $1"; ERRORS=$((ERRORS+1)); }; }
warn()  { eval "$2" > /dev/null 2>&1 && echo "  ✅ $1" || { echo "  ⚠️  $1"; WARNINGS=$((WARNINGS+1)); }; }

echo ""; echo "══════════════════════════════════════════"
echo "  Next Chapter Travel — Deploy Readiness"; echo "══════════════════════════════════════════"; echo ""
echo "── ENV VARS ──"
check "DATABASE_URL (MySQL)"    '[ -n "$DATABASE_URL" ]'
check "JWT_SECRET"              '[ -n "$JWT_SECRET" ]'
check "JWT_SECRET length >=32"  '[ "${#JWT_SECRET}" -ge 32 ]'
warn  "RESEND_API_KEY"          '[ -n "$RESEND_API_KEY" ]'
warn  "VITE_APP_ID"             '[ -n "$VITE_APP_ID" ]'
warn  "OWNER_OPEN_ID"           '[ -n "$OWNER_OPEN_ID" ]'
warn  "OAUTH_SERVER_URL"        '[ -n "$OAUTH_SERVER_URL" ]'
echo ""
echo "── BUILD ──"
check "Node >=18"    'node -e "process.exit(parseInt(process.version.slice(1))>=18?0:1)"'
check "pnpm install" 'pnpm install --frozen-lockfile 2>/dev/null'
check "Type check"   'pnpm run check 2>/dev/null'
check "Prod build"   'pnpm run build 2>/dev/null'
echo ""
if [ $ERRORS -gt 0 ]; then
  echo "❌ DEPLOY BLOCKED — $ERRORS error(s), $WARNINGS warning(s)"; exit 1
elif [ $WARNINGS -gt 0 ]; then
  echo "⚠️  DEPLOY WITH CAUTION — 0 errors, $WARNINGS warning(s)"; exit 0
else
  echo "✅ READY TO DEPLOY"; exit 0
fi
