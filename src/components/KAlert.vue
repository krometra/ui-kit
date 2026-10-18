<script setup>
/**
 * KAlert — информационная плашка: подсказка, предупреждение, сообщение об
 * ошибке.
 *
 *   tone — 'info' | 'success' | 'warning' | 'danger'
 */
import { computed } from 'vue'
import KIcon from './KIcon.vue'

const props = defineProps({
  tone: { type: String, default: 'info' },
  title: { type: String, default: '' },
  icon: { type: String, default: '' },
  closable: { type: Boolean, default: false },
})

defineEmits(['close'])

const defaultIcons = { info: 'info', success: 'check-badge', warning: 'alert', danger: 'reject' }
const iconName = computed(() => props.icon || defaultIcons[props.tone] || 'info')
</script>

<template>
  <div class="k-alert" :class="`k-alert--${tone}`" role="status">
    <KIcon :name="iconName" :size="18" class="k-alert__icon" />
    <div class="k-alert__body">
      <p v-if="title" class="k-alert__title">{{ title }}</p>
      <div v-if="$slots.default" class="k-alert__text"><slot /></div>
    </div>
    <button v-if="closable" class="k-alert__close" aria-label="Закрыть" @click="$emit('close')">
      <KIcon name="close" :size="15" />
    </button>
  </div>
</template>

<style scoped>
.k-alert {
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  padding: 0.75rem 0.875rem;
  border: 1px solid transparent;
  border-radius: var(--k-radius-sm);
  font-size: 0.875rem;
}
.k-alert__icon { margin-top: 0.1rem; flex: none; }
.k-alert__body { flex: 1; min-width: 0; }
.k-alert__title { font-weight: 600; }
.k-alert__title + .k-alert__text { margin-top: 0.15rem; }
.k-alert__close {
  background: none;
  border: none;
  color: inherit;
  opacity: 0.6;
  cursor: pointer;
  padding: 0;
  flex: none;
}
.k-alert__close:hover { opacity: 1; }
.k-alert--info { background: var(--k-primary-soft); border-color: color-mix(in srgb, var(--k-primary) 25%, transparent); color: var(--k-primary-hover); }
.k-alert--success { background: var(--k-success-soft); border-color: color-mix(in srgb, var(--k-success) 30%, transparent); color: var(--k-success-strong); }
.k-alert--warning { background: var(--k-warning-soft); border-color: color-mix(in srgb, var(--k-warning) 35%, transparent); color: var(--k-warning-strong); }
.k-alert--danger { background: var(--k-danger-soft); border-color: color-mix(in srgb, var(--k-danger) 30%, transparent); color: var(--k-danger-strong); }
</style>
