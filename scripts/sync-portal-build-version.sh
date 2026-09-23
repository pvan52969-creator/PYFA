#!/usr/bin/env bash
# 把 Academic Portal 右下角版本号写成指定文案（默认：最近一次 commit 标题）
# 用法：
#   ./scripts/sync-portal-build-version.sh
#   ./scripts/sync-portal-build-version.sh "0923排课3"
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
VERSION="${1:-}"
if [[ -z "$VERSION" ]]; then
  VERSION="$(git -C "$ROOT" log -1 --pretty=%s 2>/dev/null || true)"
fi
VERSION="$(printf '%s' "$VERSION" | head -n 1 | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')"
if [[ -z "$VERSION" ]]; then
  echo "sync-portal-build-version: empty version, skip" >&2
  exit 0
fi

case "$VERSION" in
  sync:\ portal\ version*|chore:\ portal\ version*) exit 0 ;;
esac

python3 - "$VERSION" "$ROOT" <<'PY'
import pathlib, re, shutil, sys

version, root = sys.argv[1], pathlib.Path(sys.argv[2])
pat = re.compile(r'(<div class="portal-build-version"[^>]*>)(.*?)(</div>)', re.S)

def update(path: pathlib.Path) -> None:
    if not path.is_file():
        return
    text = path.read_text(encoding="utf-8")
    new, n = pat.subn(lambda m: m.group(1) + version + m.group(3), text, count=1)
    if n:
        path.write_text(new, encoding="utf-8")

proto = root / "prototype"
docs = root / "docs"
docs.mkdir(parents=True, exist_ok=True)
update(proto / "index.html")
for name in ("index.html", "styles.css", "app.js", "mock-data.js", "joint-demo-data.js"):
    src = proto / name
    if src.is_file():
        shutil.copy2(src, docs / name)
update(docs / "index.html")
print(f"portal version → {version}")
PY
