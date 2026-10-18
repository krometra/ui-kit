<script setup>
/**
 * KBadge — статусная метка: состояние записи, тег, признак.
 *
 *   tone — 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
 *   dot  — точка-индикатор перед текстом (для состояний «идёт сейчас»)
 *   icon — семантическое имя KIcon перед текстом
 */
import KIcon from './KIcon.vue'

defineProps({
  tone: { type: String, default: 'neutral' },
  size: { type: String, default: 'md' }, // md | sm
  dot: { type: Boolean, default: false },
  icon: { type: String, default: '' },
})
</script>

<template>
  <span class="k-badge" :class="[`k-badge--${tone}`, `k-badge--${size}`]">
    <span v-if="dot" class="k-badge__dot" />
    <KIcon v-if="icon" :name="icon" :size="size === 'sm' ? 11 : 13" />
    <slot />
  </span>
</template>

<style scoped>
.k-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.4;
  white-space: nowrap;
}
.k-badge--sm { font-size: 0.6875rem; padding: 0.1rem 0.4rem; }
.k-badge__dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; flex: none; }
.k-badge--neutral { background: var(--k-surface-muted); color: var(--k-text-muted); }
.k-badge--primary { background: var(--k-primary-soft); color: var(--k-primary); }
.k-badge--success { background: var(--k-success-soft); color: var(--k-success-strong); }
.k-badge--warning { background: var(--k-warning-soft); color: var(--k-warning-strong); }
.k-badge--danger { background: var(--k-danger-soft); color: var(--k-danger-strong); }
.k-badge--info { background: var(--k-info-soft); color: var(--k-info-strong); }
</style>
