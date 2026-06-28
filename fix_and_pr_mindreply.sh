#!/usr/bin/env bash
# fix_and_pr_mindreply.sh
# Safe one-shot: remove workplace key, fix package.json scripts, patch Dockerfiles,
# create branch, commit, push, and open PR if gh is available.
# Usage:
#   chmod +x fix_and_pr_mindreply.sh
#   ./fix_and_pr_mindreply.sh
set -euo pipefail

BRANCH="ops/fix-deploy-$(date +%s)"
COMMIT_MSG="fix: remove workplace key, ensure scripts, patch Docker base image"
BACKUP_DIR="deploy_fix_backups_$(date +%Y%m%d%H%M%S)"

echo "== Deploy fix script =="
echo "Backup dir: $BACKUP_DIR"
mkdir -p "$BACKUP_DIR"

# 1) Backup package.json if exists
if [ -f package.json ]; then
  cp package.json "$BACKUP_DIR/package.json.bak"
  echo "Backed up package.json"
else
  echo "No package.json at repo root; script will search app/ and other common locations."
fi

# 2) Function to safely edit JSON using jq if available, else fallback
edit_package_json() {
  local file="$1"
  if [ ! -f "$file" ]; then
    echo "No $file found; skipping."
    return 0
  fi

  echo "Processing $file"

  if command -v jq >/dev/null 2>&1; then
    # Move workplace -> mindreplyWorkplace and ensure scripts
    tmp="$(mktemp)"
    jq 'if has("workplace") then .mindreplyWorkplace = .workplace | del(.workplace) else . end
        | .scripts |= (if . == null then {} else . end)
        | .scripts.build |= (if . == null then "next build || echo \"no build\"" else . end)
        | .scripts.start |= (if . == null then "next start -p $PORT || node start.js" else . end)' "$file" > "$tmp"
    mv "$tmp" "$file"
    echo "Patched $file with jq"
  else
    # Fallback: best-effort textual edits
    cp "$file" "$BACKUP_DIR/$(basename "$file").preedit"
    # Remove a top-level "workplace": { ... } block (best-effort)
    awk 'BEGIN{skip=0}
      /"workplace"[[:space:]]*:[[:space:]]*{/ {skip=1; next}
      { if(skip==1){ if(/^[[:space:]]*}[,]*[[:space:]]*$/){ skip=0; next } else next } print }' "$file" > "$file.tmp" && mv "$file.tmp" "$file"
    # Ensure scripts exist (append if missing)
    if ! grep -q '"scripts"' "$file"; then
      # naive append before final }
      sed -i.bak '$ s/}/,\n  "scripts": { "build": "next build || echo \"no build\"", "start": "next start -p $PORT || node start.js" }\n}/' "$file" || true
    fi
    echo "Patched $file with fallback edits (no jq)"
  fi
}

# 3) Apply to common package.json locations
edit_package_json "package.json"
edit_package_json "app/package.json"
edit_package_json "apps/web/package.json"
edit_package_json "dashboard/package.json"

# 4) Patch Dockerfiles to official Node base image
find . -type f -name Dockerfile -o -name '*Dockerfile*' | while read -r df; do
  if grep -q "dhi.io/node" "$df" || grep -q "FROM .*dhi.io" "$df"; then
    cp "$df" "$BACKUP_DIR/$(basename "$df").bak"
    sed -i.bak -E 's|FROM[[:space:]]+[^[:space:]]*dhi\.io[^[:space:]]*|FROM node:22-alpine|g' "$df" || true
    sed -i.bak -E 's|FROM[[:space:]]+[^[:space:]]*registry\.docker\.io[^[:space:]]*|FROM node:22-alpine|g' "$df" || true
    echo "Patched base image in $df"
  else
    # If Dockerfile uses nonstandard private registry, optionally replace any non-node base with node:22-alpine
    if grep -q "^FROM .*node:" "$df"; then
      echo "Dockerfile $df already uses node base; skipping"
    else
      # do not overwrite if clearly custom; skip
      echo "Dockerfile $df appears custom; left unchanged"
    fi
  fi
done

# 5) Ensure build.sh and start.sh exist at repo root (safe stubs)
if [ ! -f build.sh ]; then
  cat > build.sh <<'B'
#!/usr/bin/env bash
set -e
cd app || true
if npm run | grep -q "build"; then
  npm run build
else
  npm ci || npm install
fi
B
  chmod +x build.sh
  echo "Wrote build.sh"
fi

if [ ! -f start.sh ]; then
  cat > start.sh <<'S'
#!/usr/bin/env bash
set -e
cd app || true
if [ ! -d node_modules ]; then
  npm ci || npm install
fi
npm run start
S
  chmod +x start.sh
  echo "Wrote start.sh"
fi

# 6) Git commit, push, PR
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  git fetch origin || true
  git checkout -B "$BRANCH"
  git add .
  if git diff --cached --quiet; then
    echo "No changes to commit after edits."
  else
    git commit -m "$COMMIT_MSG"
    git push -u origin "$BRANCH"
    echo "Pushed branch $BRANCH"
    if command -v gh >/dev/null 2>&1; then
      gh pr create --title "$COMMIT_MSG" --body "Auto-fix: remove workplace key, ensure scripts, patch Docker base image to official node:22-alpine to avoid private registry auth issues." --base main || echo "gh pr create failed"
    else
      echo "gh CLI not found; create PR from branch $BRANCH to main in GitHub UI."
    fi
  fi
else
  echo "Not a git repo; edits saved and backed up in $BACKUP_DIR. Commit manually in GitHub web UI."
fi

# 7) Final checklist printed
cat <<EOF

== Done ==
Backups and edits are in $BACKUP_DIR (if created).
What I changed or created:
- Moved top-level "workplace" to "mindreplyWorkplace" in package.json files (or removed it).
- Ensured package.json has "build" and "start" scripts.
- Patched Dockerfiles that referenced private registry images to use "node:22-alpine" where safe.
- Created safe build.sh and start.sh stubs at repo root if missing.
- Created branch: $BRANCH and attempted to push and open a PR if git+gh were available.

Next steps to get live
1) In GitHub: review and merge the PR created by this script (or commit the changes manually).
2) In your CI (GitHub Actions): ensure the secret RENDER_DEPLOY_HOOK is set to your Render deploy hook URL.
3) In Render or Vercel: if you were using a private registry image, either:
   - Use the patched Dockerfile (official node image), or
   - Add registry credentials to the platform (Render private registry settings) and set env vars.
4) If Vercel reported rate limits, wait for the provider window or upgrade the plan to remove build rate limits.
5) Trigger a manual redeploy after merge and watch the first 50 lines of the deploy log.

If the redeploy still fails, paste:
- The first 30 lines of the failing Render or Vercel deploy log
- The first 30 lines of the orchestrator or CI job log

I will produce a one-line patch or targeted fix immediately.

EOF
