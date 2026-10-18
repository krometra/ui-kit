<script setup>
/**
 * KDropdown — кнопка, раскрывающая плавающую панель, на @zag-js/popover.
 *
 * Позиционирование, закрытие по клику вне и Esc, возврат фокуса — от машины.
 * Панель рендерится в <body>, поэтому не обрезается таблицами и модалками.
 *
 * Триггер — либо собственная кнопка кита (пропы label/icon/variant/size), либо
 * слот #trigger, который обязан привязать `props` к своему элементу:
 *
 *   <KDropdown label="Экспорт" v-slot="{ close }">
 *     <KMenuItem icon="download">PDF</KMenuItem>
 *   </KDropdown>
 *
 *   <KDropdown #trigger="{ props }">
 *     <KButton v-bind="props" variant="ghost" icon="more" />
 *   </KDropdown>
 *
 * Клик по KMenuItem закрывает панель (`close-on-select`); для панелей с
 * формой внутри используйте `close` из слота.
 */
import * as popover from '@zag-js/popover'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { computed, useId } from 'vue'
import KButton from './KButton.vue'

const props = defineProps({
  modelValue: { type: Boolean, default: undefined },
  label: { type: String, default: '' },
  icon: { type: String, default: '' },
  iconEnd: { type: String, default: undefined },
  variant: { type: String, default: 'secondary' },
  size: { type: String, default: 'md' },
  align: { type: String, default: 'end' }, // start | end
  placement: { type: String, default: '' },
  width: { type: String, default: '13rem' },
  closeOnSelect: { type: Boolean, default: true },
  disabled: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue'])

const triggerIcon = computed(() => (props.label ? props.icon : props.icon || 'more'))
const triggerIconEnd = computed(() => (props.label ? props.iconEnd ?? 'chevron-down' : ''))

const service = useMachine(popover.machine, {
  id: useId(),
  get positioning() {
    return { placement: props.placement || (props.align === 'start' ? 'bottom-start' : 'bottom-end') }
  },
  get open() {
    return props.modelValue
  },
  onOpenChange(details) {
    emit('update:modelValue', details.open)
  },
})

const api = computed(() => popover.connect(service, normalizeProps))

function close() {
  api.value.setOpen(false)
}

function onContentClick(event) {
  if (props.closeOnSelect && event.target.closest('[data-k-menu-item]')) close()
}
</script>

<template>
  <span class="k-dropdown">
    <slot name="trigger" :props="api.getTriggerProps()" :open="api.open">
      <KButton
        v-bind="api.getTriggerProps()"
        :variant="variant"
        :size="size"
        :icon="triggerIcon"
        :icon-end="triggerIconEnd"
        :disabled="disabled"
      >
        <template v-if="label" #default>{{ label }}</template>
      </KButton>
    </slot>
    <Teleport to="body">
      <div v-bind="api.getPositionerProps()">
        <div
          class="k-dropdown__menu"
          :style="{ minWidth: width }"
          v-bind="api.getContentProps()"
          @click="onContentClick"
        >
          <slot :close="close" />
        </div>
      </div>
    </Teleport>
  </span>
</template>

<style scoped>
.k-dropdown { display: inline-flex; }
.k-dropdown__menu {
  z-index: 1100;
  padding: 0.3rem;
  background: var(--k-surface);
  border: 1px solid var(--k-border);
  border-radius: var(--k-radius);
  box-shadow: var(--k-shadow-md);
  outline: none;
}
.k-dropdown__menu[hidden] { display: none; }
</style>
