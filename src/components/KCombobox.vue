<script setup>
/**
 * KCombobox — поле с поиском по списку на @zag-js/combobox.
 *
 * Для длинных справочников (контрагенты, пользователи), где нативный select
 * неудобен. Фильтрует по подписи локально; для серверного поиска слушайте
 * событие `search` и подменяйте `options`.
 *
 *   <KCombobox v-model="form.counterpartyId" :options="counterparties"
 *               :get-value="c => c.id" :get-label="c => c.name" label="Контрагент" />
 */
import * as combobox from '@zag-js/combobox'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { computed, ref, useAttrs, useId, watch } from 'vue'
import KIcon from './KIcon.vue'

defineOptions({ inheritAttrs: false })

const attrs = useAttrs()
const rootAttrs = computed(() => ({ class: attrs.class, style: attrs.style }))

const props = defineProps({
  modelValue: { type: [String, Number, null], default: null },
  options: { type: Array, default: () => [] },
  getValue: { type: Function, default: (o) => o.value ?? o.id },
  getLabel: { type: Function, default: (o) => o.label ?? o.name ?? '' },
  label: { type: String, default: '' },
  placeholder: { type: String, default: 'Начните вводить…' },
  hint: { type: String, default: '' },
  error: { type: String, default: '' },
  emptyText: { type: String, default: 'Ничего не найдено' },
  name: { type: String, default: '' },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  clearable: { type: Boolean, default: true },
})

const emit = defineEmits(['update:modelValue', 'search'])

const items = computed(() =>
  props.options.map((o) => (typeof o === 'object' && o !== null ? o : { value: o, label: String(o) })),
)
const keyOf = (item) => String(props.getValue(item))
const labelOf = (item) => String(props.getLabel(item))

const filtered = ref([])
watch(items, (next) => { filtered.value = next }, { immediate: true })

function applyFilter(text) {
  const q = (text || '').toLowerCase().trim()
  filtered.value = q ? items.value.filter((i) => labelOf(i).toLowerCase().includes(q)) : items.value
}

const collection = computed(() =>
  combobox.collection({ items: filtered.value, itemToValue: keyOf, itemToString: labelOf }),
)

function itemFor(raw) {
  if (raw == null || raw === '') return undefined
  return items.value.find((i) => keyOf(i) === String(raw))
}

const service = useMachine(combobox.machine, {
  id: useId(),
  positioning: { sameWidth: true },
  get collection() {
    return collection.value
  },
  get disabled() {
    return props.disabled
  },
  get invalid() {
    return !!props.error
  },
  get required() {
    return props.required
  },
  get name() {
    return props.name || undefined
  },
  get placeholder() {
    return props.placeholder
  },
  get value() {
    const match = itemFor(props.modelValue)
    return match ? [keyOf(match)] : []
  },
  onOpenChange({ open }) {
    if (!open) filtered.value = items.value
  },
  onInputValueChange({ inputValue }) {
    applyFilter(inputValue)
    emit('search', inputValue)
  },
  onValueChange({ value }) {
    const item = itemFor(value[0])
    emit('update:modelValue', item !== undefined ? props.getValue(item) : null)
  },
})

const api = computed(() => combobox.connect(service, normalizeProps))
</script>

<template>
  <div class="k-combobox" v-bind="{ ...rootAttrs, ...api.getRootProps() }">
    <label v-if="label" class="k-combobox__label" v-bind="api.getLabelProps()">
      {{ label }}<span v-if="required" class="k-combobox__req">*</span>
    </label>
    <div
      class="k-combobox__box"
      :class="{ 'k-combobox__box--error': error, 'k-combobox__box--disabled': disabled }"
      v-bind="api.getControlProps()"
    >
      <input class="k-combobox__input" v-bind="api.getInputProps()" />
      <button
        v-if="clearable && api.hasSelectedItems"
        class="k-combobox__clear"
        aria-label="Очистить"
        v-bind="api.getClearTriggerProps()"
      >
        <KIcon name="close" :size="14" />
      </button>
      <button class="k-combobox__trigger" aria-label="Показать список" v-bind="api.getTriggerProps()">
        <KIcon name="chevron-down" :size="16" />
      </button>
    </div>
    <span v-if="error" class="k-combobox__error">{{ error }}</span>
    <span v-else-if="hint" class="k-combobox__hint">{{ hint }}</span>

    <Teleport to="body">
      <div v-bind="api.getPositionerProps()">
        <ul class="k-combobox__content" v-bind="api.getContentProps()">
          <li
            v-for="item in filtered"
            :key="keyOf(item)"
            class="k-combobox__item"
            v-bind="api.getItemProps({ item })"
          >
            <span class="k-combobox__item-text" v-bind="api.getItemTextProps({ item })">{{ labelOf(item) }}</span>
            <span class="k-combobox__item-check" v-bind="api.getItemIndicatorProps({ item })">
              <KIcon name="check" :size="15" />
            </span>
          </li>
          <li v-if="!filtered.length" class="k-combobox__empty">{{ emptyText }}</li>
        </ul>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.k-combobox { display: flex; flex-direction: column; gap: 0.25rem; margin: 0; min-width: 0; }
.k-combobox__label { font-size: 0.8125rem; color: var(--k-text-muted); }
.k-combobox__req { color: var(--k-danger); margin-left: 2px; }
.k-combobox__box {
  display: flex;
  align-items: center;
  height: var(--k-control-h);
  padding-right: 0.25rem;
  background: var(--k-surface);
  border: 1px solid var(--k-border-strong);
  border-radius: var(--k-radius-sm);
  transition: border-color 0.15s, box-shadow 0.15s;
}
.k-combobox__box:focus-within { border-color: var(--k-primary); box-shadow: 0 0 0 3px var(--k-primary-soft); }
.k-combobox__box--error { border-color: var(--k-danger); }
.k-combobox__box--error:focus-within { box-shadow: 0 0 0 3px var(--k-danger-soft); }
.k-combobox__box--disabled { background: var(--k-surface-muted); }
.k-combobox__input {
  flex: 1;
  min-width: 0;
  height: 100%;
  padding: 0 0.625rem;
  border: none;
  background: none;
  outline: none;
  font: inherit;
  font-size: 0.9375rem;
  color: inherit;
}
.k-combobox__input::placeholder { color: var(--k-text-faint); }
.k-combobox__input:disabled { cursor: not-allowed; color: var(--k-text-muted); }
.k-combobox__clear,
.k-combobox__trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.2rem;
  border: none;
  border-radius: var(--k-radius-sm);
  background: none;
  color: var(--k-text-faint);
  cursor: pointer;
}
.k-combobox__clear:hover,
.k-combobox__trigger:hover:not(:disabled) { color: var(--k-text); background: var(--k-surface-muted); }
.k-combobox__trigger:disabled { cursor: not-allowed; }
.k-combobox__hint { font-size: 0.75rem; color: var(--k-text-muted); }
.k-combobox__error { font-size: 0.75rem; color: var(--k-danger); }

.k-combobox__content {
  z-index: 1100;
  list-style: none;
  margin: 0;
  padding: 0.25rem;
  max-height: 260px;
  overflow-y: auto;
  min-width: var(--reference-width);
  background: var(--k-surface);
  border: 1px solid var(--k-border);
  border-radius: var(--k-radius);
  box-shadow: var(--k-shadow-md);
  outline: none;
}
.k-combobox__content[hidden] { display: none; }
.k-combobox__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.45rem 0.6rem;
  border-radius: var(--k-radius-sm);
  font-size: 0.9rem;
  cursor: pointer;
}
.k-combobox__item[data-highlighted] { background: var(--k-primary-soft); color: var(--k-primary); }
.k-combobox__item[data-state="checked"] { font-weight: 600; }
.k-combobox__item-text { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.k-combobox__item-check { display: inline-flex; flex: none; }
.k-combobox__item-check[hidden] { display: none; }
.k-combobox__empty { padding: 0.5rem 0.6rem; font-size: 0.875rem; color: var(--k-text-muted); }
</style>
