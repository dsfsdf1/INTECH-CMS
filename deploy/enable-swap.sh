#!/usr/bin/env bash
# Включает swap-файл, если его нет.
#
# На сервере 3.8 ГБ памяти и на ней уже живут сайт и price-monitoring. Сборка
# Next с оптимизацией картинок через sharp в остаток не помещается: ядро
# вызывает oom-killer, причём убивает не сборку, а самый крупный процесс —
# в первый раз это был uvicorn чужого проекта. Swap дешевле такого соседства.
set -euo pipefail

file=/swapfile
size=4G

[[ ${EUID:-$(id -u)} -eq 0 ]] || { echo "запускать от root"; exit 1; }

if [[ -n "$(swapon --show --noheadings 2>/dev/null)" ]]; then
  echo "swap уже включён"
  swapon --show
  exit 0
fi

if ! fallocate -l "$size" "$file" 2>/dev/null; then
  # На некоторых ФС fallocate не работает — тогда медленно, но верно.
  dd if=/dev/zero of="$file" bs=1M count=4096 status=none
fi
chmod 600 "$file"
mkswap "$file" >/dev/null
swapon "$file"

# Чтобы swap вернулся после перезагрузки.
grep -q "^$file " /etc/fstab || printf '%s none swap sw 0 0\n' "$file" >>/etc/fstab

# Swap здесь — страховка на время сборки, а не постоянное место жительства.
sysctl -q -w vm.swappiness=10
grep -q '^vm.swappiness' /etc/sysctl.conf || printf 'vm.swappiness=10\n' >>/etc/sysctl.conf

echo "swap включён:"
swapon --show
