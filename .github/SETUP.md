# CI/CD Setup Guide

This guide will help you complete the setup of your CI/CD pipeline with GitHub Actions and Netlify.

## ⚠️ BELANGRIJK: Deployment Veiligheid

**ZONDER branch protection zal Netlify elke push naar `main` automatisch deployen, ZELFS ALS TESTS FALEN!**

Dit betekent:
- ❌ Directe push naar `main` → Deploy naar productie (zonder checks!)
- ✅ Pull Request → CI checks draaien → Alleen merge als tests slagen → Deploy naar productie

**Volg stap 1.2 "Configure Branch Protection" VERPLICHT om dit te voorkomen!**

## Prerequisites

- [x] GitHub repository created
- [x] Netlify account
- [ ] Netlify site connected to repository
- [ ] Branch protection ingeschakeld (VERPLICHT!)

## Setup Steps

### 1. GitHub Repository Settings

#### Enable GitHub Actions

1. Go to **Settings** > **Actions** > **General**
2. Under "Actions permissions", select:
   - ✅ "Allow all actions and reusable workflows"
3. Under "Workflow permissions", select:
   - ✅ "Read and write permissions"
   - ✅ "Allow GitHub Actions to create and approve pull requests"
4. Click **Save**

#### Configure Branch Protection (VERPLICHT!)

**Dit voorkomt dat code met falende tests naar productie gaat!**

1. Go to **Settings** > **Branches**
2. Click **Add branch protection rule**
3. Branch name pattern: `main`
4. Configure de volgende opties:

   **Required settings:**
   - ✅ **Require a pull request before merging**
     - Dit forceert je om via PRs te werken (geen directe pushes naar main)

   - ✅ **Require status checks to pass before merging**
     - Click "Search for status checks" en zoek: `Test & Lint`
     - ✅ Require branches to be up to date before merging
     - **BELANGRIJK:** Hierdoor kan je alleen mergen als CI slaagt!

   - ✅ **Require conversation resolution before merging**
     - Lost alle PR comments op voor merge

   **Optional (voor solo development):**
   - ⚠️ **Do NOT enable** "Require approvals" (tenzij je met team werkt)
   - ⚠️ **Do NOT enable** "Require review from Code Owners"

   **Extra beveiliging (aanbevolen):**
   - ✅ **Do not allow bypassing the above settings**
     - Zelfs admins moeten deze regels volgen

   - ✅ **Require linear history**
     - Houdt git history clean

5. Click **Create** of **Save changes**

**Na deze stap:** Je kan niet meer direct naar `main` pushen! Alleen via Pull Requests die eerst door CI checks moeten.

#### Create PR Labels

The auto-labeler workflow requires these labels to exist. Create them manually:

1. Go to **Issues** > **Labels**
2. Create the following labels:

| Label | Color | Description |
|-------|-------|-------------|
| `dependencies` | `#0366d6` | Dependency updates |
| `documentation` | `#0075ca` | Documentation updates |
| `styling` | `#d876e3` | CSS/SCSS changes |
| `vue-components` | `#42b883` | Vue component changes |
| `views` | `#4fc08d` | View changes |
| `tests` | `#28a745` | Test changes |
| `ci/cd` | `#ff9800` | CI/CD changes |
| `assets` | `#fbca04` | Asset changes |
| `config` | `#d4c5f9` | Configuration changes |
| `automated` | `#c5def5` | Automated PRs |

### 2. Netlify Configuration

#### Connect Repository

1. Log in to [Netlify](https://app.netlify.com)
2. Click **Add new site** > **Import an existing project**
3. Choose **GitHub** and authorize Netlify
4. Select your portfolio repository
5. Configure build settings:
   - **Build command**: `pnpm run build`
   - **Publish directory**: `dist`
   - **Base directory**: (leave empty)
6. Click **Deploy site**

#### Enable Branch Deploys

1. Go to your site in Netlify
2. Navigate to **Site settings** > **Build & deploy** > **Continuous Deployment**
3. Under **Deploy contexts**:
   - **Production branch**: `main`
   - **Branch deploys**: Select "All branches"
   - **Deploy previews**: Select "Any pull request against your production branch"
4. Click **Save**

#### Configure Build Settings

1. Go to **Site settings** > **Build & deploy** > **Environment**
2. Add environment variables (if needed):
   - `NODE_VERSION`: `20`
   - Any Sanity.io API keys
   - Any other environment variables your app needs

#### Get Netlify Badge

1. Go to **Site settings** > **General** > **Status badges**
2. Copy the markdown badge
3. Update `README.md` line 11:
   ```markdown
   [![Netlify Status](https://api.netlify.com/api/v1/badges/YOUR-ACTUAL-SITE-ID/deploy-status)](https://app.netlify.com/sites/YOUR-ACTUAL-SITE-NAME/deploys)
   ```

### 3. Verify Setup

#### Test CI Pipeline

1. Create a test branch:
   ```bash
   git checkout -b test/ci-setup
   ```

2. Make a small change (e.g., update README)
   ```bash
   echo "# Test" >> test.md
   git add test.md
   git commit -m "test: verify CI pipeline"
   git push -u origin test/ci-setup
   ```

3. Check GitHub Actions:
   - Go to **Actions** tab
   - Verify "CI Pipeline" workflow runs successfully
   - All jobs should be green ✅

#### Test PR Workflow

1. Create a Pull Request from your test branch
2. Verify:
   - ✅ CI Pipeline runs automatically
   - ✅ Auto-labeler adds appropriate labels
   - ✅ Netlify bot posts preview URL
   - ✅ Build Information comment is posted

3. Click the Netlify preview URL to verify deployment

#### Test Dependabot

1. Wait for Monday 09:00 or manually trigger
2. Check for dependency update PRs
3. Verify they have correct labels

### 4. Update README Badge URLs

After Netlify setup, update the badges in `README.md`:

1. Get your Netlify site ID from the URL when you're viewing your site
2. Replace `YOUR-NETLIFY-SITE-ID` and `YOUR-NETLIFY-SITE-NAME` in line 11

### 5. Clean Up Test Branch

After verifying everything works:

```bash
# Go back to main
git checkout main

# Delete test branch locally
git branch -D test/ci-setup

# Delete test branch remotely
git push origin --delete test/ci-setup

# Close the test PR on GitHub
```

## Troubleshooting

### CI Fails: Permission Denied

**Solution:** Enable workflow permissions (see Step 1)

### Labels Not Applied

**Solution:** Create labels manually (see "Create PR Labels" section)

### Netlify Build Fails

**Solution:**
1. Check build logs in Netlify dashboard
2. Verify `netlify.toml` is committed
3. Ensure pnpm is supported (should be automatic)
4. Check environment variables are set

### Dependabot Not Running

**Solution:**
1. Verify `dependabot.yml` is in `.github/` folder
2. Check repository settings allow Dependabot
3. Wait until Monday 09:00 for first run

## Next Steps

After setup is complete:

1. ✅ Start using feature branches for all work
2. ✅ Create PRs for all changes to main
3. ✅ Review Netlify preview before merging
4. ✅ Monitor CI status before merging
5. ✅ Keep dependencies updated via Dependabot PRs

## Support

For issues:
- Check `.github/workflows/README.md` for workflow details
- Review Netlify build logs
- Check GitHub Actions logs
- Review main `README.md` for workflow usage

## Workflow Overview

```
Feature Branch → Push → CI Runs → Create PR → Netlify Preview
                                        ↓
                                   Review & Test
                                        ↓
                                   Merge to main
                                        ↓
                              Production Deploy (Netlify)
```
