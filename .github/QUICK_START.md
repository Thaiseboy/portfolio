# Quick Start: Veilig werken met CI/CD

## ⚠️ JE HEBT DIT NOG NIET GEFIXT!

Momenteel deployt Netlify **alles automatisch naar productie**, zelfs als tests falen!

## Fix dit NU in 3 stappen:

### Stap 1: Push deze changes eerst

```bash
git add .
git commit -m "feat: add CI/CD pipeline with branch protection"
git push origin main
```

⚠️ **Dit is de LAATSTE keer dat je direct naar main pusht!**

### Stap 2: Schakel Branch Protection in (5 minuten)

1. Ga naar je GitHub repo
2. **Settings** > **Branches** > **Add branch protection rule**
3. Branch name pattern: `main`
4. Vink aan:
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass before merging
     - Zoek en selecteer: `Test & Lint`
     - ✅ Require branches to be up to date before merging
   - ✅ Do not allow bypassing the above settings
5. **Create** of **Save**

### Stap 3: Maak de GitHub labels (2 minuten)

1. Ga naar **Issues** > **Labels** > **New label**
2. Maak deze labels:

```
dependencies     - #0366d6
documentation    - #0075ca
styling          - #d876e3
vue-components   - #42b883
views            - #4fc08d
tests            - #28a745
ci/cd            - #ff9800
assets           - #fbca04
config           - #d4c5f9
automated        - #c5def5
```

## Klaar! Hoe je vanaf nu werkt:

### ❌ NIET MEER DOEN:
```bash
git add .
git commit -m "changes"
git push origin main  # ← Dit werkt niet meer!
```

### ✅ VANAF NU ZO WERKEN:

```bash
# 1. Maak feature branch
git checkout -b feature/nieuwe-functie

# 2. Werk aan je feature
# ... maak changes ...

# 3. Commit en push
git add .
git commit -m "feat: nieuwe functie"
git push -u origin feature/nieuwe-functie

# 4. Maak PR op GitHub.com
# 5. Wacht tot CI groen is ✅
# 6. Check Netlify preview URL
# 7. Merge PR
# 8. Productie is automatisch bijgewerkt!
```

## Wat gebeurt er nu?

```
Feature branch
    ↓
Push naar GitHub
    ↓
┌─────────────────────────┐
│  GitHub Actions (CI)    │
│  • Lint check           │
│  • Run tests            │
│  • Build verification   │
└─────────────────────────┘
    ↓
✅ Tests slagen
    ↓
┌─────────────────────────┐
│  Netlify                │
│  • Preview deployment   │
│  • Unique URL           │
└─────────────────────────┘
    ↓
Review + Merge PR
    ↓
🚀 Deploy naar productie
   (getdeveloper.nl)
```

## Voordelen:

✅ Code wordt getest VOOR deployment
✅ Preview URL om te controleren
✅ Geen broken production deployments meer
✅ Automatische labels op PRs
✅ Wekelijkse dependency updates

## Test het:

```bash
# Maak test branch
git checkout -b test/pipeline

# Maak een fout opzettelijk
echo "console.log('test')" >> src/App.vue

# Push
git add .
git commit -m "test: break build"
git push -u origin test/pipeline

# Maak PR en zie dat CI faalt
# Je KAN NIET mergen! ✅
```

## Hulp nodig?

- Volledige setup: `.github/SETUP.md`
- Workflow details: `.github/workflows/README.md`
- Main README: `README.md`

## Belangrijkste regel:

**WERK ALTIJD VIA FEATURE BRANCHES EN PULL REQUESTS!**

Nooit meer direct naar `main` pushen!
