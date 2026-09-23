#!/usr/bin/env bash
# 把 Academic Portal 右下角写成 commit 标题；短 SHA 仅放 title / meta（悬停或看源码可核对）
# 用法：
#   ./scripts/sync-portal-build-version.sh           # 用 HEAD
#   ./scripts/sync-portal-build-version.sh "自定义"  # 标题自定义，SHA 仍用 HEAD
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SHORT="$(git -C "$ROOT" rev-parse --short=7 HEAD 2>/dev/null || echo 'unknown')"
SUBJECT="${1:-}"
if [[ -z "$SUBJECT" ]]; then
  SUBJECT="$(git -C "$ROOT" log -1 --pretty=%s 2>/dev/null || true)"
fi
SUBJECT="$(printf '%s' "$SUBJECT" | head -n 1 | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')"

case "$SUBJECT" in
  sync:\ portal\ version*|chore:\ portal\ version*) exit 0 ;;
esac

# 可见文案只保留标题；无标题时才显示短 SHA
if [[ -z "$SUBJECT" ]]; then
  LABEL="$SHORT"
else
  LABEL="$SUBJECT"
fi

python3 - "$LABEL" "$SHORT" "$ROOT" <<'PY'
import pathlib, re, shutil, sys

label, short, root = sys.argv[1], sys.argv[2], pathlib.Path(sys.argv[3])
pat = re.compile(r'(<div class="portal-build-version"[^>]*>)(.*?)(</div>)', re.S)
meta_pat = re.compile(
    r'<meta\s+name="portal-build"\s+content="[^"]*"\s*/?>',
    re.I,
)
meta_tag = f'<meta name="portal-build" content="{short}">'

def update(path: pathlib.Path) -> None:
    if not path.is_file():
        return
    text = path.read_text(encoding="utf-8")
    # 可见：标题；悬停 title：git 短 SHA
    text2, n = pat.subn(
        lambda m: (
            f'<div class="portal-build-version" aria-label="原型版本" '
            f'title="git {short}">{label}</div>'
        ),
        text,
        count=1,
    )
    if n:
        text = text2
    if meta_pat.search(text):
        text = meta_pat.sub(meta_tag, text, count=1)
    elif "</head>" in text:
        text = text.replace("</head>", f"  {meta_tag}\n</head>", 1)
    path.write_text(text, encoding="utf-8")

proto = root / "prototype"
docs = root / "docs"
docs.mkdir(parents=True, exist_ok=True)
update(proto / "index.html")
for name in ("index.html", "styles.css", "app.js", "mock-data.js", "joint-demo-data.js"):
    src = proto / name
    if src.is_file():
        shutil.copy2(src, docs / name)
# Pages 站点根=仓库 docs/；页面仍 fetch docs/*.html → 需提供 docs/docs/*
nested = docs / "docs"
nested.mkdir(parents=True, exist_ok=True)
proto_docs = proto / "docs"
if proto_docs.is_dir():
    for src in proto_docs.glob("*.html"):
        shutil.copy2(src, nested / src.name)
        shutil.copy2(src, docs / src.name)  # 同级兜底
update(docs / "index.html")
print(f"portal version → {label} (git {short})")
PY
