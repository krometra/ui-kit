<script setup>
/**
 * KSegmented — компактный переключатель режимов (карточки/таблица, день/месяц)
 * на @zag-js/radio-group: семантически это радио-группа, поэтому стрелки и
 * фокус работают как у неё. В отличие от KTabs не претендует на навигацию.
 *
 *   options: [{ value, label?, icon?, title? }]
 */
import * as radio from '@zag-js/radio-group'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { computed, useId } from 'vue'
import KIcon from './KIcon.vue'

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  options: { type: Array, default: () => [] },
  size: { type: String, default: 'md' }, // sm | md
  disabled: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue'])

const service = useMachine(radio.machine, {
  id: useId(),
  orientation: 'horizontal',
  get value() {
    return props.modelValue === '' || props.modelValue == null ? null : String(props.modelValue)
  },
  get disabled() {
    return props.disabled
  },
  onValueChange({ value }) {
    const item = props.options.find((o) => String(o.value) === value)
    emit('update:modelValue', item ? item.value : value)
  },
})

const api = computed(() => radio.connect(service, normalizeProps))
</script>

<template>
  <div class="k-segmented" :class="`k-segmented--${size}`" v-bind="api.getRootProps()">
    <label
      v-for="opt in options"
      :key="opt.value"
      class="k-segmented__item"
      :title="opt.title"
      v-bind="api.getItemProps({ value: String(opt.value) })"
    >
      <input v-bind="api.getItemHiddenInputProps({ value: String(opt.value) })" />
      <KIcon v-if="opt.icon" :name="opt.icon" :size="size === 'sm' ? 14 : 16" />
      <span v-if="opt.label" v-bind="api.getItemTextProps({ value: String(opt.value) })">{{ opt.label }}</span>
    </label>
  </div>
</template>

<style scoped>
.k-segmented {
  display: inline-flex;
  padding: 0.15rem;
  background: var(--k-surface-muted);
  border: 1px solid var(--k-border);
  border-radius: var(--k-radius-sm);
  gap: 0.15rem;
}
.k-segmented__item {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.65rem;
  border-radius: calc(var(--k-radius-sm) - 2px);
  font-size: 0.875rem;
  color: var(--k-text-muted);
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.12s, color 0.12s, box-shadow 0.12s;
}
.k-segmented--sm .k-segmented__item { padding: 0.2rem 0.5rem; font-size: 0.8125rem; }
.k-segmented__item[data-hover]:not([data-disabled]) { color: var(--k-text); }
.k-segmented__item[data-focus-visible] { box-shadow: 0 0 0 2px var(--k-primary); }
.k-segmented__item[data-disabled] { cursor: not-allowed; opacity: 0.5; }
.k-segmented__item[data-state="checked"] {
  background: var(--k-surface);
  color: var(--k-text);
  font-weight: 550;
  box-shadow: var(--k-shadow-sm);
}
</style>
