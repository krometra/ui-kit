<script setup>
/**
 * KDrawer — боковая панель на @zag-js/dialog: карточка записи, подробности,
 * фильтры. Выезжает справа или слева, закрывается по Esc и крестику.
 * Открытие управляется v-model.
 *
 *   side  — 'right' (по умолчанию) | 'left'
 *   size  — 'sm' | 'md' | 'lg'
 *   modal — с затемнением, фокус-трапом и блокировкой скролла (по умолчанию).
 *           `:modal="false"` оставляет страницу живой: можно кликать по списку
 *           и менять содержимое панели, не закрывая её.
 *
 *   <KDrawer v-model="open" :title="issue.key" :subtitle="issue.summary" :modal="false">
 *     …
 *     <template #actions><KButton variant="ghost" icon="external" /></template>
 *     <template #footer><KButton variant="primary">Сохранить</KButton></template>
 *   </KDrawer>
 */
import * as dialog from '@zag-js/dialog'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { computed, useId } from 'vue'
import KIcon from './KIcon.vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  side: { type: String, default: 'right' },
  size: { type: String, default: 'md' },
  modal: { type: Boolean, default: true },
  closable: { type: Boolean, default: true },
  closeOnOutside: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'close'])

const service = useMachine(dialog.machine, {
  id: useId(),
  get open() {
    return props.modelValue
  },
  get modal() {
    return props.modal
  },
  get trapFocus() {
    return props.modal
  },
  get preventScroll() {
    return props.modal
  },
  get closeOnInteractOutside() {
    return props.modal && props.closeOnOutside && props.closable
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
    <Transition name="k-drawer" :duration="220">
      <div v-if="api.open" class="k-drawer" :class="[`k-drawer--${side}`, { 'k-drawer--modal': modal }]">
        <div v-if="modal" class="k-drawer__backdrop" v-bind="api.getBackdropProps()" />
        <div class="k-drawer__positioner" v-bind="api.getPositionerProps()">
          <aside class="k-drawer__panel" :class="`k-drawer__panel--${size}`" v-bind="api.getContentProps()">
            <header class="k-drawer__header">
              <div class="k-drawer__heading">
                <slot name="header">
                  <h2 class="k-drawer__title" v-bind="api.getTitleProps()">{{ title }}</h2>
                  <p v-if="subtitle" class="k-drawer__subtitle" v-bind="api.getDescriptionProps()">{{ subtitle }}</p>
                </slot>
              </div>
              <div class="k-drawer__tools">
                <slot name="actions" />
                <button v-if="closable" class="k-drawer__close" aria-label="Закрыть" v-bind="api.getCloseTriggerProps()">
                  <KIcon name="close" :size="18" />
                </button>
              </div>
            </header>
            <div class="k-drawer__body"><slot /></div>
            <footer v-if="$slots.footer" class="k-drawer__footer"><slot name="footer" /></footer>
          </aside>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.k-drawer__backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: var(--k-overlay);
  backdrop-filter: blur(2px);
}
.k-drawer__positioner {
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  pointer-events: none;
}
.k-drawer--right .k-drawer__positioner { right: 0; }
.k-drawer--left .k-drawer__positioner { left: 0; }
.k-drawer__panel {
  pointer-events: auto;
  width: min(100vw, var(--k-drawer-w, 32rem));
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--k-surface);
  box-shadow: var(--k-shadow-lg);
  outline: none;
}
.k-drawer--right .k-drawer__panel { border-left: 1px solid var(--k-border); }
.k-drawer--left .k-drawer__panel { border-right: 1px solid var(--k-border); }
.k-drawer__panel--sm { --k-drawer-w: 24rem; }
.k-drawer__panel--md { --k-drawer-w: 32rem; }
.k-drawer__panel--lg { --k-drawer-w: 44rem; }
.k-drawer__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.125rem 1.25rem;
  border-bottom: 1px solid var(--k-border);
}
.k-drawer__heading { min-width: 0; }
.k-drawer__title { font-size: 1.0625rem; font-weight: 600; }
.k-drawer__subtitle { margin-top: 0.15rem; font-size: 0.8125rem; color: var(--k-text-muted); }
.k-drawer__tools { display: flex; align-items: center; gap: 0.25rem; flex: none; }
.k-drawer__close {
  background: none;
  border: none;
  color: var(--k-text-muted);
  cursor: pointer;
  padding: 0.15rem;
  border-radius: var(--k-radius-sm);
}
.k-drawer__close:hover { background: var(--k-surface-muted); color: var(--k-text); }
.k-drawer__close:focus-visible { outline: 2px solid var(--k-primary); outline-offset: 1px; }
.k-drawer__body { flex: 1; padding: 1.25rem; overflow-y: auto; }
.k-drawer__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 0.875rem 1.25rem;
  border-top: 1px solid var(--k-border);
  background: var(--k-surface-muted);
}

.k-drawer-enter-active .k-drawer__panel,
.k-drawer-leave-active .k-drawer__panel { transition: transform 0.22s ease; }
.k-drawer-enter-active .k-drawer__backdrop,
.k-drawer-leave-active .k-drawer__backdrop { transition: opacity 0.22s ease; }
.k-drawer-enter-from.k-drawer--right .k-drawer__panel,
.k-drawer-leave-to.k-drawer--right .k-drawer__panel { transform: translateX(100%); }
.k-drawer-enter-from.k-drawer--left .k-drawer__panel,
.k-drawer-leave-to.k-drawer--left .k-drawer__panel { transform: translateX(-100%); }
.k-drawer-enter-from .k-drawer__backdrop,
.k-drawer-leave-to .k-drawer__backdrop { opacity: 0; }
@media (prefers-reduced-motion: reduce) {
  .k-drawer-enter-active .k-drawer__panel,
  .k-drawer-leave-active .k-drawer__panel { transition: none; }
}
</style>
