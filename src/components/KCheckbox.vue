<script setup>
/**
 * KCheckbox — чекбокс на @zag-js/checkbox. Скрытый нативный input остаётся в
 * потоке фокуса и участвует в формах, а видимый квадрат рисуется из токенов
 * темы. v-model — булево или массив (тогда нужен `value`).
 *
 *   <KCheckbox v-model="agree" label="Принимаю условия" />
 *   <KCheckbox v-model="selected" value="pdf" label="PDF" />
 */
import * as checkbox from '@zag-js/checkbox'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { computed, useId } from 'vue'
import KIcon from './KIcon.vue'

const props = defineProps({
  modelValue: { type: [Boolean, Array], default: false },
  value: { type: [String, Number, Boolean], default: undefined },
  label: { type: String, default: '' },
  hint: { type: String, default: '' },
  name: { type: String, default: '' },
  indeterminate: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue'])

const isArray = computed(() => Array.isArray(props.modelValue))
const checked = computed(() => (isArray.value ? props.modelValue.includes(props.value) : props.modelValue))

const service = useMachine(checkbox.machine, {
  id: useId(),
  get checked() {
    return props.indeterminate ? 'indeterminate' : checked.value
  },
  get disabled() {
    return props.disabled
  },
  get required() {
    return props.required
  },
  get name() {
    return props.name || undefined
  },
  get value() {
    return props.value != null ? String(props.value) : undefined
  },
  onCheckedChange({ checked: next }) {
    const on = next === true
    if (!isArray.value) {
      emit('update:modelValue', on)
      return
    }
    emit(
      'update:modelValue',
      on ? [...props.modelValue, props.value] : props.modelValue.filter((v) => v !== props.value),
    )
  },
})

const api = computed(() => checkbox.connect(service, normalizeProps))
</script>

<template>
  <label class="k-check" v-bind="api.getRootProps()">
    <input v-bind="api.getHiddenInputProps()" />
    <span class="k-check__control" v-bind="api.getControlProps()">
      <span class="k-check__indicator" v-bind="api.getIndicatorProps()">
        <KIcon :name="api.indeterminate ? 'remove' : 'check'" :size="12" :stroke-width="3" />
      </span>
    </span>
    <span v-if="label || hint || $slots.default" class="k-check__body">
      <span class="k-check__label" v-bind="api.getLabelProps()"><slot>{{ label }}</slot></span>
      <span v-if="hint" class="k-check__hint">{{ hint }}</span>
    </span>
  </label>
</template>

<style scoped>
.k-check { display: inline-flex; align-items: flex-start; gap: 0.5rem; margin: 0; cursor: pointer; font-weight: 400; }
.k-check[data-disabled] { cursor: not-allowed; opacity: 0.6; }
.k-check__control {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.05rem;
  height: 1.05rem;
  margin-top: 0.15rem;
  flex: none;
  background: var(--k-surface);
  border: 1px solid var(--k-border-strong);
  border-radius: calc(var(--k-radius-sm) - 2px);
  color: var(--k-on-primary);
  transition: background 0.12s, border-color 0.12s, box-shadow 0.12s;
}
.k-check__control[data-hover]:not([data-disabled]) { border-color: var(--k-primary); }
.k-check__control[data-focus-visible] { box-shadow: 0 0 0 3px var(--k-primary-soft); border-color: var(--k-primary); }
.k-check__control[data-state="checked"],
.k-check__control[data-state="indeterminate"] { background: var(--k-primary); border-color: var(--k-primary); }
.k-check__indicator { display: inline-flex; }
.k-check__indicator[hidden] { display: none; }
.k-check__body { display: flex; flex-direction: column; gap: 0.1rem; min-width: 0; }
.k-check__label { font-size: 0.9375rem; color: var(--k-text); }
.k-check__hint { font-size: 0.75rem; color: var(--k-text-muted); }
</style>
