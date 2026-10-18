<script setup>
/**
 * KMoney — денежная сумма в русском формате.
 *
 * Вынесено в компонент, потому что суммы обычно встречаются на многих экранах
 * и должны выглядеть одинаково: неразрывные разряды, символ валюты,
 * опциональные копейки, табличные цифры для выравнивания в колонке.
 */
import { computed } from 'vue'

const props = defineProps({
  value: { type: [Number, String], default: 0 },
  currency: { type: String, default: 'RUB' },
  fraction: { type: Boolean, default: false },
  compact: { type: Boolean, default: false },
  tone: { type: String, default: '' }, // '' | muted | success | danger
  size: { type: String, default: 'md' }, // sm | md | lg
})

const formatted = computed(() => {
  const n = Number(props.value)
  if (!Number.isFinite(n)) return '—'
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: props.currency,
    minimumFractionDigits: props.fraction ? 2 : 0,
    maximumFractionDigits: props.fraction ? 2 : 0,
    notation: props.compact ? 'compact' : 'standard',
  }).format(n)
})
</script>

<template>
  <span class="k-money" :class="[tone && `k-money--${tone}`, `k-money--${size}`]">{{ formatted }}</span>
</template>

<style scoped>
.k-money { font-variant-numeric: tabular-nums; white-space: nowrap; }
.k-money--sm { font-size: 0.8125rem; }
.k-money--lg { font-size: 1.25rem; font-weight: 650; letter-spacing: -0.01em; }
.k-money--muted { color: var(--k-text-muted); }
.k-money--success { color: var(--k-success); }
.k-money--danger { color: var(--k-danger); }
</style>
