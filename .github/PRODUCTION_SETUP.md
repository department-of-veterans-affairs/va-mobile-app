# Production Setup Guide

## Overview
This workflow scans package.json changes for security issues using npm info and GuardDog, then requires manual approval before proceeding.

## Prerequisites

### 1. Configure GitHub Environment Protection

The workflow requires a GitHub Environment named `bypass-package-lock` with protection rules.

**Steps:**
1. Go to your repository → **Settings** → **Environments**
2. Click **New environment**
3. Name it: `bypass-package-lock`
4. Configure **Environment protection rules**:
   - ✅ **Required reviewers**: Add team/users who should approve package changes
   - ⚠️ Recommended: Use a security team or senior developers
5. Click **Save protection rules**

**Important:** Without this environment configured, the workflow will fail when trying to use environment protection.

### 2. Optional: Configure Slack Notifications

If you want Slack notifications when package changes are detected:

1. Uncomment lines 372-384 in the workflow file
2. Update `channel_name` to your Slack channel
3. Ensure `./.github/workflows/start_slack_thread.yml` exists in your repo
4. Configure Slack webhook secrets

## Deployment Steps

### 1. Copy the workflow to your production repo

```bash
# From this test repo
cp .github/workflows/security-scan.yml /path/to/production-repo/.github/workflows/

# Copy the detection script
cp .github/scripts/detect_package_changes.py /path/to/production-repo/.github/scripts/
```

### 2. Verify environment configuration

The workflow is now configured with:
- ✅ Environment protection enabled: `bypass-package-lock`
- ✅ Triggers on pull requests affecting package.json files
- ✅ Triggers on pushes to main/master branches
- ✅ Manual trigger via workflow_dispatch

### 3. Test the workflow

**Option A: Manual trigger**
1. Go to Actions → Select the workflow
2. Click "Run workflow"
3. Make a test package change and push

**Option B: Test PR**
1. Create a test branch
2. Modify package.json (add/update a package)
3. Create a PR to main/master
4. Workflow should trigger and show scan results

## How It Works

### When package changes are detected:

1. **Scan Phase** (Automatic)
   - Detects changes to package.json files
   - Extracts package names from changes
   - Runs npm info to get package details
   - Runs GuardDog security scan on exact versions
   - Presents results with helpful review links

2. **Review Phase** (Manual)
   - Workflow summary shows all scan results
   - Reviewers check:
     - ✅ Versions match intentions
     - ✅ No deprecation warnings
     - ✅ GuardDog findings are expected for package type
     - ✅ Good package reputation
   - Use provided links to research packages

3. **Approval Phase** (Manual)
   - Authorized reviewers approve the `bypass-package-lock` environment
   - Workflow adds `package-scan-complete` label to PR
   - Workflow continues to subsequent jobs

4. **Subsequent Pushes**
   - If PR has `package-scan-complete` label, approval is skipped
   - Allows iterating on code without re-approving same packages

## Workflow Behavior

### ✅ Approval Required When:
- package.json dependencies are added/changed/removed
- No existing `package-scan-complete` label on PR
- Node packages are detected in repository

### ⏭️ Auto-Skip When:
- No package.json changes detected
- Only package.json metadata changed (name, version, scripts)
- PR already has `package-scan-complete` label
- No Node packages in repository

## Security Features

### What Gets Scanned:
- ✅ Exact version from package.json (not latest)
- ✅ npm registry data (deprecation, vulnerabilities)
- ✅ GuardDog malware detection
- ✅ Package metadata and reputation

### What Gets Presented:
- 📦 npm info output (filtered for clarity)
- 🔒 GuardDog security scan results
- 🔗 Review links: npm page, npm trends, Snyk Advisor, GitHub repo
- 📋 Review checklist for decision-making

### What It Doesn't Do:
- ❌ No fake "AI analysis" with false positives
- ❌ Doesn't flag legitimate behavior (e.g., axios making HTTP requests)
- ❌ Doesn't auto-approve or auto-reject
- ✅ Humans make informed decisions based on clear data

## Troubleshooting

### Workflow doesn't trigger
- Check that package.json was actually modified
- Verify triggers are configured for your branch names
- Check workflow file is in `.github/workflows/` directory

### Environment not found error
- Go to Settings → Environments
- Create `bypass-package-lock` environment
- Add required reviewers

### GuardDog scan fails
- Check that `uv` installation succeeds
- Review GuardDog error messages in logs
- May need to adjust GuardDog version or flags

### npm info shows wrong version
- Verify package.json has the correct version
- Check that `jq` is available (should be on ubuntu-latest)
- Review the "Scanning version" header in output

## Customization

### Change environment name
Update line 337 in workflow file:
```yaml
environment: your-custom-environment-name
```

### Adjust triggers
Modify lines 4-20 to change when workflow runs

### Add more package managers
Currently supports npm. To add others:
- Add detection in `detect_package_changes.py`
- Add scanning sections similar to npm/GuardDog

### Skip certain packages
Add filtering logic in the while loops (lines 117+ and 172+)

## Support

- Report issues: https://github.com/anthropics/claude-code/issues
- GuardDog docs: https://github.com/DataDog/guarddog
- npm docs: https://docs.npmjs.com/

## Summary

✅ **Benefits:**
- Automatic security scanning on package changes
- Clear data presentation for informed decisions
- Environment-based approval gate
- Prevents accidental malicious package introduction

⚠️ **Remember:**
- Configure `bypass-package-lock` environment before deploying
- Add appropriate reviewers with security knowledge
- Review the scan results, don't just approve blindly
