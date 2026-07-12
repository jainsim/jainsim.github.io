#!/usr/bin/env bash
#
# Fails if an em dash (—, U+2014) appears in any .tsx or .md file.
# Em dashes belong in prose editors, not shipped copy — we normalize to
# hyphens (or commas, when joining full clauses) by hand.
#
# En dashes (–, U+2013) in date ranges like 2023–2024 are intentional and
# are NOT flagged.
#
# Internal design/notes docs are exempt (they quote em dashes on purpose).
#
# Usage:
#   scripts/check-em-dash.sh            # scan the whole working tree
#   scripts/check-em-dash.sh --staged   # scan only git-staged files (pre-commit)

set -eu

EXCLUDE_REGEX='^(CLAUDE\.md|DESIGN-.*\.md|\.claude/|scripts/check-em-dash\.sh)'

if [ "${1:-}" = "--staged" ]; then
  file_list=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(tsx|md)$' || true)
else
  file_list=$(git ls-files '*.tsx' '*.md')
fi

fail=0
while IFS= read -r f; do
  [ -z "$f" ] && continue
  printf '%s\n' "$f" | grep -Eq "$EXCLUDE_REGEX" && continue
  [ -f "$f" ] || continue
  if grep -Hn $'\xe2\x80\x94' "$f"; then
    fail=1
  fi
done <<EOF
$file_list
EOF

if [ "$fail" -ne 0 ]; then
  echo ""
  echo "✗ Em dash (—) found in the files above. Replace with a hyphen (-)," >&2
  echo "  or a comma if it joins two full clauses, then re-stage." >&2
  exit 1
fi

echo "✓ No em dashes in .tsx/.md copy."
