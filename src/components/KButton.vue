<script setup>
/**
 * KButton — единственный кнопочный примитив кита.
 *
 *   variant  — 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'link'
 *   size     — 'md' (по умолчанию) | 'sm' | 'lg'
 *   icon     — семантическое имя KIcon перед подписью
 *   iconEnd  — иконка после подписи
 *   loading  — блокирует кнопку и показывает спиннер вместо иконки
 *
 * Подпись — слот по умолчанию и необязательна: с одним `icon` кнопка
 * рендерится квадратной иконочной.
 */
import { computed, useSlots } from 'vue'
import KIcon from './KIcon.vue'

const props = defineProps({
  variant: { type: String, default: 'secondary' },
  size: { type: String, default: 'md' },
  icon: { type: String, default: '' },
  iconEnd: { type: String, default: '' },
  htmlType: { type: String, default: 'button' },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  block: { type: Boolean, default: false },
})

const slots = useSlots()
const hasLabel = computed(() => !!slots.default)
const iconPx = computed(() => ({ sm: 15, md: 17, lg: 19 })[props.size] ?? 17)
</script>

<template>
  <button
    class="k-btn"
    :class="[
      `k-btn--${variant}`,
      `k-btn--${size}`,
      { 'k-btn--icon-only': (icon || loading) && !hasLabel, 'k-btn--block': block },
    ]"
    :type="htmlType"
    :disabled="disabled || loading"
  >
    <KIcon v-if="loading" name="spinner" :size="iconPx" spin />
    <KIcon v-else-if="icon" :name="icon" :size="iconPx" />
    <span v-if="hasLabel" class="k-btn__label"><slot /></span>
    <KIcon v-if="iconEnd && !loading" :name="iconEnd" :size="iconPx" />
  </button>
</template>

<style scoped>
.k-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  min-height: var(--k-control-h);
  padding: 0 0.875rem;
  border: 1px solid transparent;
  border-radius: var(--k-radius-sm);
  font: inherit;
  font-size: 0.9375rem;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  transition: background 0.15s, border-color 0.15s, color 0.15s, box-shadow 0.15s;
}
.k-btn:focus { outline: none; }
.k-btn:focus-visible { outline: 2px solid var(--k-primary); outline-offset: 2px; }
.k-btn:disabled { opacity: 0.55; cursor: not-allowed; }
.k-btn--block { width: 100%; }

.k-btn--sm { min-height: var(--k-control-h-sm); padding: 0 0.625rem; font-size: 0.8125rem; }
.k-btn--lg { min-height: 2.875rem; padding: 0 1.25rem; font-size: 1rem; }
.k-btn--icon-only { width: var(--k-control-h); padding: 0; }
.k-btn--icon-only.k-btn--sm { width: var(--k-control-h-sm); }
.k-btn--icon-only.k-btn--lg { width: 2.875rem; }

.k-btn--primary { background: var(--k-primary); color: var(--k-on-primary); box-shadow: var(--k-shadow-sm); }
.k-btn--primary:hover:not(:disabled) { background: var(--k-primary-hover); }

.k-btn--secondary { background: var(--k-surface); border-color: var(--k-border-strong); color: var(--k-text); }
.k-btn--secondary:hover:not(:disabled) { background: var(--k-surface-muted); }

.k-btn--ghost { background: transparent; color: var(--k-text-muted); }
.k-btn--ghost:hover:not(:disabled) { background: var(--k-surface-muted); color: var(--k-text); }

.k-btn--danger { background: var(--k-danger); color: var(--k-on-danger); }
.k-btn--danger:hover:not(:disabled) { background: var(--k-danger-hover); }

.k-btn--success { background: var(--k-success); color: var(--k-on-success); }
.k-btn--success:hover:not(:disabled) { background: var(--k-success-hover); }

.k-btn--link { background: none; color: var(--k-primary); padding: 0; min-height: 0; }
.k-btn--link:hover:not(:disabled) { text-decoration: underline; }
</style>
