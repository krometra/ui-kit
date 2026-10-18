<script setup>
/**
 * KToastItem — одно уведомление внутри KToast. Внутренний компонент: машина
 * тоста получает родительский сервис группы и свой индекс в стопке.
 */
import * as toast from '@zag-js/toast'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { computed } from 'vue'
import KIcon from './KIcon.vue'

const props = defineProps({
  actor: { type: Object, required: true },
  index: { type: Number, required: true },
  parent: { type: Object, required: true },
})

const machineProps = computed(() => ({ ...props.actor, parent: props.parent, index: props.index }))

const service = useMachine(toast.machine, machineProps)
const api = computed(() => toast.connect(service, normalizeProps))

const icons = { info: 'info', success: 'check-badge', warning: 'alert', error: 'reject', loading: 'spinner' }
</script>

<template>
  <div class="k-toast" v-bind="api.getRootProps()">
    <span v-bind="api.getGhostBeforeProps()" />
    <KIcon :name="icons[api.type] || 'info'" :size="18" class="k-toast__icon" :spin="api.type === 'loading'" />
    <div class="k-toast__body">
      <p v-if="api.title" class="k-toast__title" v-bind="api.getTitleProps()">{{ api.title }}</p>
      <p v-if="api.description" class="k-toast__text" v-bind="api.getDescriptionProps()">{{ api.description }}</p>
    </div>
    <button v-if="api.closable" class="k-toast__close" aria-label="Закрыть" v-bind="api.getCloseTriggerProps()">
      <KIcon name="close" :size="14" />
    </button>
    <span v-bind="api.getGhostAfterProps()" />
  </div>
</template>

<style scoped>
.k-toast {
  /* Координаты и прозрачность приходят от машины в CSS-переменных; здесь они
     только отображаются на свойства, чтобы стопка анимировалась плавно. */
  translate: var(--x) var(--y);
  scale: var(--scale, 1);
  opacity: var(--opacity);
  height: var(--height, auto);
  z-index: var(--z-index);
  will-change: translate, opacity, scale;
  transition:
    translate 400ms cubic-bezier(0.21, 1.02, 0.73, 1),
    scale 400ms,
    opacity 400ms,
    height 400ms;
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  width: min(24rem, calc(100vw - 2rem));
  padding: 0.75rem 0.875rem;
  background: var(--k-surface);
  border: 1px solid var(--k-border);
  border-left: 3px solid var(--k-primary);
  border-radius: var(--k-radius-sm);
  box-shadow: var(--k-shadow-md);
  color: var(--k-text);
}
.k-toast[data-type='success'] { border-left-color: var(--k-success); }
.k-toast[data-type='warning'] { border-left-color: var(--k-warning); }
.k-toast[data-type='error'] { border-left-color: var(--k-danger); }
.k-toast__icon { margin-top: 0.1rem; color: var(--k-text-muted); flex: none; }
.k-toast[data-type='success'] .k-toast__icon { color: var(--k-success); }
.k-toast[data-type='warning'] .k-toast__icon { color: var(--k-warning-strong); }
.k-toast[data-type='error'] .k-toast__icon { color: var(--k-danger); }
.k-toast__body { flex: 1; min-width: 0; }
.k-toast__title { font-size: 0.9375rem; font-weight: 600; }
.k-toast__text { font-size: 0.8125rem; color: var(--k-text-muted); white-space: pre-line; overflow-wrap: break-word; }
.k-toast__close {
  background: none;
  border: none;
  color: var(--k-text-faint);
  cursor: pointer;
  padding: 0;
  flex: none;
}
.k-toast__close:hover { color: var(--k-text); }
</style>
