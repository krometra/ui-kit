<script setup>
/**
 * KAvatar — инициалы пользователя или сущности в кружке.
 * Оттенок детерминированно выводится из имени, чтобы не хранить его в данных;
 * сами цвета берутся из семантических токенов темы, поэтому аватары
 * перекрашиваются вместе с ней.
 */
import { computed } from 'vue'
import KIcon from './KIcon.vue'

const props = defineProps({
  name: { type: String, default: '' },
  icon: { type: String, default: '' },
  size: { type: String, default: 'md' }, // sm | md | lg
  square: { type: Boolean, default: false },
})

const initials = computed(() =>
  props.name
    .replace(/["«»]/g, '')
    .split(/[\s-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join(''),
)

const tones = ['primary', 'success', 'warning', 'info', 'danger']

const tone = computed(() => {
  let hash = 0
  for (const ch of props.name) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0
  return tones[hash % tones.length]
})
</script>

<template>
  <span
    class="k-avatar"
    :class="[`k-avatar--${size}`, `k-avatar--${tone}`, { 'k-avatar--square': square }]"
    :title="name"
  >
    <KIcon v-if="icon" :name="icon" :size="size === 'sm' ? 14 : size === 'lg' ? 22 : 17" />
    <template v-else>{{ initials }}</template>
  </span>
</template>

<style scoped>
.k-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-weight: 600;
  flex: none;
  user-select: none;
}
.k-avatar--square { border-radius: var(--k-radius-sm); }
.k-avatar--sm { width: 1.75rem; height: 1.75rem; font-size: 0.6875rem; }
.k-avatar--md { width: 2.25rem; height: 2.25rem; font-size: 0.8125rem; }
.k-avatar--lg { width: 3rem; height: 3rem; font-size: 1rem; }
.k-avatar--primary { background: var(--k-primary-soft); color: var(--k-primary); }
.k-avatar--success { background: var(--k-success-soft); color: var(--k-success-strong); }
.k-avatar--warning { background: var(--k-warning-soft); color: var(--k-warning-strong); }
.k-avatar--info { background: var(--k-info-soft); color: var(--k-info-strong); }
.k-avatar--danger { background: var(--k-danger-soft); color: var(--k-danger-strong); }
</style>
