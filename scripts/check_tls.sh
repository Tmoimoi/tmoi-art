#!/usr/bin/env bash
# 检测自定义域名的 HTTPS 证书是否已由 GitHub Pages 签发并生效。
#
# 用法：
#   ./scripts/check_tls.sh                 检测一次，立即出结论
#   ./scripts/check_tls.sh --watch         每 30 秒检测一次，直到全部生效（默认 15 分钟超时）
#   ./scripts/check_tls.sh --watch 60      自定义轮询间隔（秒）
#   ./scripts/check_tls.sh --api           额外查一次 GitHub Pages API（https_enforced 状态）
#
# 退出码：0 = 全部域名证书已生效；1 = 仍有域名未生效；2 = 参数错误

set -uo pipefail

DOMAINS=("www.tmoi.cn" "tmoi.cn")
REPO="Tmoimoi/tmoi-art"
WATCH=0
INTERVAL=30
MAX_WAIT=900
USE_API=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --watch) WATCH=1
      shift
      if [[ $# -gt 0 && "$1" =~ ^[0-9]+$ ]]; then INTERVAL="$1"; shift; fi
      ;;
    --api) USE_API=1; shift ;;
    -h|--help) sed -n '2,12p' "$0"; exit 0 ;;
    *) echo "未知参数：$1（用 --help 看用法）" >&2; exit 2 ;;
  esac
done

C_OFF=$'\033[0m'; C_OK=$'\033[32m'; C_WAIT=$'\033[33m'; C_BAD=$'\033[31m'; C_DIM=$'\033[2m'
# 输出不是终端时（比如重定向到文件）去掉颜色
[[ -t 1 ]] || { C_OFF=""; C_OK=""; C_WAIT=""; C_BAD=""; C_DIM=""; }

# 取回对端证书的文本详情（subject / 有效期 / SAN）
cert_text() {
  printf '\n' | openssl s_client -connect "$1:443" -servername "$1" 2>/dev/null \
    | openssl x509 -noout -text 2>/dev/null
}

field() { grep -m1 -E "^[[:space:]]*$1" <<<"$2" | sed -E "s/^[[:space:]]*$1[[:space:]]*:?[[:space:]]*//" | sed 's/[[:space:]]*$//'; }

pages_api() {
  local token="${GITHUB_TOKEN:-}"
  # remote 里若内嵌了 token（https://<token>@github.com/...）也直接复用
  if [[ -z "$token" ]]; then
    token="$(git config --get remote.origin.url 2>/dev/null | sed -nE 's#^https://([^@]+)@github\.com/.*#\1#p')"
  fi
  if [[ -z "$token" ]]; then
    echo "  ${C_DIM}(跳过：需要 token。用法 GITHUB_TOKEN=ghp_xxx $0 --api)${C_OFF}"
    return
  fi
  token="${token#*:}"
  token="$(python3 -c 'import sys,urllib.parse;print(urllib.parse.unquote(sys.argv[1]))' "$token" 2>/dev/null || echo "$token")"
  curl -sS --max-time 20 \
    -H "Authorization: Bearer ${token}" \
    -H "Accept: application/vnd.github+json" \
    "https://api.github.com/repos/${REPO}/pages" \
  | python3 -c '
import json,sys
try: d=json.load(sys.stdin)
except Exception: print("  API 读取失败"); raise SystemExit
print("  Pages 状态  :", "built" if d.get("status")=="built" else d.get("status"))
print("  CNAME       :", d.get("cname"))
print("  HTTPS 强制  :", d.get("https_enforced"))
print("  证书        :", (d.get("https_certificate") or {}).get("state", "-"))
' 2>/dev/null || echo "  API 读取失败"
}

check_domain() {
  local host="$1" text subject expiry san_list http_code loc

  echo "── ${host} ─────────────────────────────"

  # 1. DNS：apex 需要 A 记录指向 GitHub，www 需要 CNAME
  local cname a_rec
  cname="$(dig +short CNAME "$host" 2>/dev/null | head -1)"
  a_rec="$(dig +short A "$host" 2>/dev/null | tr '\n' ' ' | sed 's/[[:space:]]*$//')"
  if [[ -n "$cname" ]]; then
    echo "  DNS   CNAME → ${cname}"
  elif [[ -n "$a_rec" ]]; then
    echo "  DNS   A → ${a_rec}"
  else
    echo "  DNS   ${C_BAD}没有解析记录${C_OFF}（去域名商后台添加）"
  fi

  # 2. TLS：握手 + 证书内容
  text="$(cert_text "$host")"
  if [[ -z "$text" ]]; then
    echo "  TLS   ${C_BAD}443 端口连不上${C_OFF}（DNS 还没生效，或域名没配好）"
    return 1
  fi

  subject="$(field "Subject:" "$text")"
  expiry="$(field "Not After" "$text")"
  san_list="$(grep -o 'DNS:[^,[:space:]]*' <<<"$text" | sed 's/DNS://' | paste -sd ' ' -)"
  echo "  证书  ${subject}"
  echo "  覆盖  ${san_list:-（无 SAN）}"
  echo "  到期  ${expiry}"

  # 3. 浏览器视角：curl 默认会验证证书链，失败就说明「不安全」
  if ! curl -sS -o /dev/null --max-time 15 "https://${host}/" 2>/dev/null; then
    echo "  结论  ${C_BAD}浏览器仍会显示「不安全」${C_OFF} —— 证书不含 ${host}"
    return 1
  fi
  http_code="$(curl -sS -o /dev/null -w '%{http_code}' --max-time 15 "https://${host}/" 2>/dev/null)"
  echo "  HTTPS ${C_OK}验证通过${C_OFF}（HTTP ${http_code}）"

  # 4. http → https 是否自动跳转
  loc="$(curl -sSI -o /dev/null -w '%{http_code} %{redirect_url}' --max-time 15 "http://${host}/" 2>/dev/null)"
  echo "  HTTP  ${loc%% *} ${loc#* }"

  echo "  结论  ${C_OK}证书已生效${C_OFF}"
  return 0
}

run_once() {
  local failed=0
  for d in "${DOMAINS[@]}"; do
    check_domain "$d" || failed=1
    echo
  done
  if [[ "$USE_API" == 1 ]]; then
    echo "── GitHub Pages API ───────────────────"
    pages_api
    echo
  fi
  return $failed
}

if [[ "$WATCH" == 0 ]]; then
  run_once
  code=$?
  [[ $code -eq 0 ]] && echo "${C_OK}全部生效。${C_OFF}" || echo "${C_WAIT}还没生效。GitHub 签发证书通常要 5–15 分钟，用 --watch 挂着等：./scripts/check_tls.sh --watch${C_OFF}"
  exit $code
fi

echo "开始轮询，每 ${INTERVAL}s 一次，最多等 $((MAX_WAIT / 60)) 分钟。Ctrl+C 可中断。"
elapsed=0
while :; do
  clear 2>/dev/null || true
  echo "t=$(date '+%H:%M:%S')  已等待 $((elapsed / 60)) 分钟"
  if run_once; then
    echo "${C_OK}全部域名的 HTTPS 证书已生效。${C_OFF}"
    exit 0
  fi
  echo "${C_WAIT}未生效，${INTERVAL}s 后重试…${C_OFF}"
  sleep "$INTERVAL"
  elapsed=$((elapsed + INTERVAL))
  if (( elapsed >= MAX_WAIT )); then
    echo "${C_BAD}超过 $((MAX_WAIT / 60)) 分钟仍未生效。${C_OFF}"
    echo "建议：仓库 Settings → Pages → 把 Custom domain 删掉点 Save，再重新填 www.tmoi.cn 点 Save，强制重走签发流程。"
    exit 1
  fi
done
