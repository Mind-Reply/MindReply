#!/bin/bash
# Automated git branch merge and cleanup
# Merges all feature branches to main, updates, cleans up

set -e

echo "🔄 Starting branch merge and cleanup..."

# Pull latest
git pull origin main
git fetch origin

# Get all branches
BRANCHES=$(git branch -r | grep -v 'main\|HEAD\|develop' | sed 's/origin\///')

echo "📋 Found branches: $BRANCHES"

# Merge each branch
for branch in $BRANCHES; do
  echo "🔀 Merging $branch into main..."
  
  git checkout $branch
  git pull origin $branch
  git checkout main
  
  # Merge with commit message
  git merge --no-ff $branch -m "Merge branch '$branch' into main [automated]" || {
    echo "⚠️  Merge conflict in $branch. Skipping..."
    git merge --abort
    continue
  }
  
  # Push
  git push origin main
  
  # Delete branch
  git push origin --delete $branch
  git branch -D $branch
  
  echo "✅ $branch merged and deleted"
done

# Clean up local branches
git branch -vv | grep 'origin/.*: gone' | awk '{print $1}' | xargs -r git branch -D

echo "✅ All branches merged and cleaned up!"
git log --oneline -10
