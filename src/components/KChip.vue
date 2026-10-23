<script setup>
/**
 * KChip — кнопка-признак в виде таблетки: выбор вариантов, фильтры, теги.
 *
 *   v-model:pressed — нажата ли; без него чип — обычная кнопка (событие click)
 *   tone     — цвет нажатого: 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
 *   soft     — подкрашен тоном и без нажатия (кнопка меню, акцент)
 *   dashed   — пунктирная рамка (вторичный вариант)
 *   expanded — true/false рисует стрелку и ставит aria-expanded (чип открывает панель)
 *   marked   — точка перед подписью: внутри что-то выбрано
 *   size     — 'md' (по умолчанию) | 'sm'
 *   icon     — семантическое имя KIcon перед подписью
 */
import { computed } from 'vue'
import KIcon from './KIcon.vue'

const props = defineProps({
  pressed: { type: Boolean, default: undefined },
  tone: { type: String, default: 'primary' },
  soft: { type: Boolean, default: false },
  dashed: { type: Boolean, default: false },
  expanded: { type: Boolean, default: undefined },
  marked: { type: Boolean, default: false },
  size: { type: String, default: 'md' },
  icon: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
})
const emit = defineEmits(['update:pressed', 'click'])

const toggle = computed(() => props.pressed !== undefined)
const menu = computed(() => props.expanded !== undefined)

function click(event) {
  if (toggle.value) emit('update:pressed', !props.pressed)
  emit('click', event)
}
</script>

<template>
  <button
    type="button"
    class="k-chip"
    :class="[
      `k-chip--${tone}`,
      `k-chip--${size}`,
      { 'k-chip--on': pressed, 'k-chip--soft': soft, 'k-chip--dashed': dashed },
    ]"
    :aria-pressed="toggle ? String(!!pressed) : undefined"
    :aria-expanded="menu ? String(!!expanded) : undefined"
    :disabled="disabled"
    @click="click"
  >
    <span v-if="marked" class="k-chip__mark" />
    <KIcon v-if="icon" :name="icon" :size="size === 'sm' ? 13 : 15" />
    <span class="k-chip__label"><slot /></span>
    <KIcon v-if="menu" :name="expanded ? 'chevron-up' : 'chevron-down'" :size="size === 'sm' ? 13 : 14" />
  </button>
</template>

<style scoped>
.k-chip {
  --tone: var(--k-primary);
  --tone-soft: var(--k-primary-soft);
  --tone-strong: var(--k-primary);
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  max-width: 100%;
  padding: 0.25rem 0.75rem;
  border: 1px solid var(--k-border);
  border-radius: 999px;
  background: transparent;
  color: var(--k-text);
  font: inherit;
  font-size: 0.875rem;
  line-height: 1.35;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.12s, border-color 0.12s, color 0.12s;
}
.k-chip--sm { padding: 0.15rem 0.6rem; font-size: 0.8125rem; }
.k-chip__label { min-width: 0; overflow-wrap: anywhere; }
.k-chip__mark { width: 6px; height: 6px; border-radius: 50%; background: currentColor; flex: none; }
.k-chip:hover:not(:disabled) { border-color: var(--k-border-strong); }
.k-chip:focus-visible { outline: 2px solid var(--k-primary); outline-offset: 2px; }
.k-chip:disabled { opacity: 0.5; cursor: not-allowed; }
.k-chip--dashed { border-style: dashed; }
.k-chip--on,
.k-chip--soft { background: var(--tone-soft); border-color: var(--tone); color: var(--tone-strong); font-weight: 500; }
.k-chip--on:hover:not(:disabled),
.k-chip--soft:hover:not(:disabled) { border-color: var(--tone-strong); }

.k-chip--neutral { --tone: var(--k-border-strong); --tone-soft: var(--k-surface-muted); --tone-strong: var(--k-text); }
.k-chip--success { --tone: var(--k-success); --tone-soft: var(--k-success-soft); --tone-strong: var(--k-success-strong); }
.k-chip--warning { --tone: var(--k-warning); --tone-soft: var(--k-warning-soft); --tone-strong: var(--k-warning-strong); }
.k-chip--danger { --tone: var(--k-danger); --tone-soft: var(--k-danger-soft); --tone-strong: var(--k-danger-strong); }
.k-chip--info { --tone: var(--k-info); --tone-soft: var(--k-info-soft); --tone-strong: var(--k-info-strong); }

@media (prefers-reduced-motion: reduce) {
  .k-chip { transition: none; }
}
</style>
