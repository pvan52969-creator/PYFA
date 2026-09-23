#!/usr/bin/env bash
# 安装本仓库 git hooks（不修改 git config）
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
mkdir -p "$ROOT/.git/hooks"
cp -f "$ROOT/.githooks/post-commit" "$ROOT/.git/hooks/post-commit"
cp -f "$ROOT/.githooks/pre-push" "$ROOT/.git/hooks/pre-push"
chmod +x "$ROOT/.git/hooks/post-commit" "$ROOT/.git/hooks/pre-push" \
  "$ROOT/scripts/sync-portal-build-version.sh" "$ROOT/scripts/install-git-hooks.sh"
echo "installed: post-commit, pre-push"
