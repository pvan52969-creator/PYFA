#!/usr/bin/env bash
# 安装本仓库 git hooks（不修改 git config）
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
mkdir -p "$ROOT/.git/hooks"
cp -f "$ROOT/.githooks/post-commit" "$ROOT/.git/hooks/post-commit"
chmod +x "$ROOT/.git/hooks/post-commit" "$ROOT/scripts/sync-portal-build-version.sh"
echo "installed: .git/hooks/post-commit"
