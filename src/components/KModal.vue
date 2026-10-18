<script setup>
/**
 * KModal — модальное окно на @zag-js/dialog: фокус-трап, блокировка скролла,
 * закрытие по Esc и возврат фокуса. Открытие управляется v-model.
 *
 * Клик по фону по умолчанию не закрывает окно: случайный клик мимо формы не
 * должен терять введённое. Включается пропом `close-on-outside`.
 *
 *   <KModal v-model="open" title="Новый документ" size="md">
 *     <form @submit.prevent="save">…</form>
 *     <template #footer><KButton variant="primary" @click="save">Сохранить</KButton></template>
 *   </KModal>
 */
import * as dialog from '@zag-js/dialog'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { computed, useId } from 'vue'
import KIcon from './KIcon.vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  size: { type: String, default: 'md' }, // sm | md | lg
  closable: { type: Boolean, default: true },
  closeOnOutside: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'close'])

const service = useMachine(dialog.machine, {
  id: useId(),
  get open() {
    return props.modelValue
  },
  get closeOnInteractOutside() {
    return props.closeOnOutside && props.closable
  },
  get closeOnEscape() {
    return props.closable
  },
  onOpenChange({ open }) {
    emit('update:modelValue', open)
    if (!open) emit('close')
  },
})

const api = computed(() => dialog.connect(service, normalizeProps))
</script>

<template>
  <Teleport to="body">
    <template v-if="api.open">
      <div class="k-modal__backdrop" v-bind="api.getBackdropProps()" />
      <div class="k-modal__positioner" v-bind="api.getPositionerProps()">
        <div class="k-modal__panel" :class="`k-modal__panel--${size}`" v-bind="api.getContentProps()">
          <header v-if="title || $slots.header" class="k-modal__header">
            <div class="k-modal__heading">
              <slot name="header">
                <h2 class="k-modal__title" v-bind="api.getTitleProps()">{{ title }}</h2>
                <p v-if="subtitle" class="k-modal__subtitle" v-bind="api.getDescriptionProps()">{{ subtitle }}</p>
              </slot>
            </div>
            <button v-if="closable" class="k-modal__close" aria-label="Закрыть" v-bind="api.getCloseTriggerProps()">
              <KIcon name="close" :size="18" />
            </button>
          </header>
          <div class="k-modal__body"><slot /></div>
          <footer v-if="$slots.footer" class="k-modal__footer"><slot name="footer" /></footer>
        </div>
      </div>
    </template>
  </Teleport>
</template>

<style scoped>
.k-modal__backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: var(--k-overlay);
  backdrop-filter: blur(2px);
}
.k-modal__positioner {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}
.k-modal__panel {
  width: min(92vw, var(--k-modal-w, 34rem));
  max-height: 86vh;
  display: flex;
  flex-direction: column;
  background: var(--k-surface);
  border-radius: var(--k-radius-lg);
  box-shadow: var(--k-shadow-lg);
  overflow: hidden;
  outline: none;
}
.k-modal__panel--sm { --k-modal-w: 24rem; }
.k-modal__panel--md { --k-modal-w: 34rem; }
.k-modal__panel--lg { --k-modal-w: 52rem; }
.k-modal__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.125rem 1.25rem;
  border-bottom: 1px solid var(--k-border);
}
.k-modal__title { font-size: 1.0625rem; font-weight: 600; }
.k-modal__subtitle { margin-top: 0.15rem; font-size: 0.8125rem; color: var(--k-text-muted); }
.k-modal__close {
  background: none;
  border: none;
  color: var(--k-text-muted);
  cursor: pointer;
  padding: 0.15rem;
  border-radius: var(--k-radius-sm);
  flex: none;
}
.k-modal__close:hover { background: var(--k-surface-muted); color: var(--k-text); }
.k-modal__body { padding: 1.25rem; overflow-y: auto; }
.k-modal__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 0.875rem 1.25rem;
  border-top: 1px solid var(--k-border);
  background: var(--k-surface-muted);
}
</style>
