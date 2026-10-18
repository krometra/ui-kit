<script setup>
/**
 * KSelect — выпадающий список с одиночным выбором на @zag-js/select.
 *
 * Опции — массив строк или любых объектов; ключ и подпись извлекаются через
 * `getValue`/`getLabel`, поэтому в v-model живёт исходное значение (число,
 * строка, id), а не его строковое представление. Список рендерится в <body>,
 * чтобы не обрезаться внутри модалок и карточек с overflow.
 *
 *   <KSelect v-model="role" label="Роль" :options="[{ value: 'admin', label: 'Администратор' }]" />
 *   <KSelect v-model="volumeId" :options="volumes" :get-value="v => v.id" :get-label="v => v.name" clearable />
 */
import * as select from '@zag-js/select'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { computed, ref, useAttrs, useId } from 'vue'
import KIcon from './KIcon.vue'

defineOptions({ inheritAttrs: false })

const attrs = useAttrs()
const rootAttrs = computed(() => ({ class: attrs.class, style: attrs.style }))

const props = defineProps({
  modelValue: { type: [String, Number, Boolean, null], default: null },
  options: { type: Array, default: () => [] },
  getValue: { type: Function, default: (o) => o.value },
  getLabel: { type: Function, default: (o) => o.label },
  label: { type: String, default: '' },
  placeholder: { type: String, default: 'Выберите…' },
  hint: { type: String, default: '' },
  error: { type: String, default: '' },
  name: { type: String, default: '' },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  clearable: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue'])

const box = ref(null)

const items = computed(() =>
  props.options.map((o) => (typeof o === 'object' && o !== null ? o : { value: o, label: String(o) })),
)

const keyOf = (item) => String(props.getValue(item))
const labelOf = (item) => String(props.getLabel(item))

const collection = computed(() =>
  select.collection({ items: items.value, itemToValue: keyOf, itemToString: labelOf }),
)

function itemFor(raw) {
  if (raw == null || raw === '') return undefined
  return items.value.find((i) => keyOf(i) === String(raw))
}

const service = useMachine(select.machine, {
  id: useId(),
  positioning: { sameWidth: true, getAnchorElement: () => box.value },
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
  get value() {
    const match = itemFor(props.modelValue)
    return match ? [keyOf(match)] : []
  },
  onValueChange({ value }) {
    const item = itemFor(value[0])
    emit('update:modelValue', item !== undefined ? props.getValue(item) : null)
  },
})

const api = computed(() => select.connect(service, normalizeProps))
</script>

<template>
  <div class="k-select" v-bind="{ ...rootAttrs, ...api.getRootProps() }">
    <label v-if="label" class="k-select__label" v-bind="api.getLabelProps()">
      {{ label }}<span v-if="required" class="k-select__req">*</span>
    </label>
    <div
      ref="box"
      class="k-select__box"
      :class="{ 'k-select__box--error': error, 'k-select__box--disabled': disabled }"
      v-bind="api.getControlProps()"
    >
      <button class="k-select__trigger" v-bind="api.getTriggerProps()">
        <span
          class="k-select__value"
          :class="{ 'k-select__value--placeholder': !api.hasSelectedItems }"
          v-bind="api.getValueTextProps()"
        >{{ api.hasSelectedItems ? api.valueAsString : placeholder }}</span>
      </button>
      <button
        v-if="clearable && api.hasSelectedItems"
        class="k-select__clear"
        aria-label="Очистить"
        v-bind="api.getClearTriggerProps()"
      >
        <KIcon name="close" :size="14" />
      </button>
      <span class="k-select__chevron" v-bind="api.getIndicatorProps()">
        <KIcon name="chevron-down" :size="16" />
      </span>
    </div>
    <select v-bind="api.getHiddenSelectProps()">
      <option v-for="item in items" :key="keyOf(item)" :value="keyOf(item)">{{ labelOf(item) }}</option>
    </select>
    <span v-if="error" class="k-select__error">{{ error }}</span>
    <span v-else-if="hint" class="k-select__hint">{{ hint }}</span>

    <Teleport to="body">
      <div v-bind="api.getPositionerProps()">
        <ul class="k-select__content" v-bind="api.getContentProps()">
          <li
            v-for="item in items"
            :key="keyOf(item)"
            class="k-select__item"
            v-bind="api.getItemProps({ item })"
          >
            <span class="k-select__item-text" v-bind="api.getItemTextProps({ item })">{{ labelOf(item) }}</span>
            <span class="k-select__item-check" v-bind="api.getItemIndicatorProps({ item })">
              <KIcon name="check" :size="15" />
            </span>
          </li>
          <li v-if="!items.length" class="k-select__empty">Нет вариантов</li>
        </ul>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.k-select { display: flex; flex-direction: column; gap: 0.25rem; margin: 0; min-width: 0; }
.k-select__label { font-size: 0.8125rem; color: var(--k-text-muted); }
.k-select__req { color: var(--k-danger); margin-left: 2px; }
.k-select__box {
  display: flex;
  align-items: center;
  height: var(--k-control-h);
  padding-right: 0.5rem;
  background: var(--k-surface);
  border: 1px solid var(--k-border-strong);
  border-radius: var(--k-radius-sm);
  transition: border-color 0.15s, box-shadow 0.15s;
}
.k-select__box:focus-within { border-color: var(--k-primary); box-shadow: 0 0 0 3px var(--k-primary-soft); }
.k-select__box--error { border-color: var(--k-danger); }
.k-select__box--error:focus-within { box-shadow: 0 0 0 3px var(--k-danger-soft); }
.k-select__box--disabled { background: var(--k-surface-muted); }
.k-select__trigger {
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
  text-align: left;
  cursor: pointer;
}
.k-select__trigger:disabled { cursor: not-allowed; color: var(--k-text-muted); }
.k-select__value { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.k-select__value--placeholder { color: var(--k-text-faint); }
.k-select__clear {
  display: inline-flex;
  padding: 0.15rem;
  border: none;
  border-radius: var(--k-radius-sm);
  background: none;
  color: var(--k-text-faint);
  cursor: pointer;
}
.k-select__clear:hover { color: var(--k-text); background: var(--k-surface-muted); }
.k-select__chevron { display: inline-flex; color: var(--k-text-faint); pointer-events: none; transition: transform 0.15s; }
.k-select__chevron[data-state="open"] { transform: rotate(180deg); }
.k-select__hint { font-size: 0.75rem; color: var(--k-text-muted); }
.k-select__error { font-size: 0.75rem; color: var(--k-danger); }

/* zag читает вычисленный z-index контента и переносит его на positioner —
   задаём здесь, выше модалки (1000), чтобы список не прятался под ней. */
.k-select__content {
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
.k-select__content[hidden] { display: none; }
.k-select__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.45rem 0.6rem;
  border-radius: var(--k-radius-sm);
  font-size: 0.9rem;
  color: var(--k-text);
  cursor: pointer;
}
.k-select__item[data-highlighted] { background: var(--k-primary-soft); color: var(--k-primary); }
.k-select__item[data-state="checked"] { font-weight: 600; }
.k-select__item[data-disabled] { opacity: 0.5; cursor: not-allowed; }
.k-select__item-text { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.k-select__item-check { display: inline-flex; flex: none; }
.k-select__item-check[hidden] { display: none; }
.k-select__empty { padding: 0.5rem 0.6rem; font-size: 0.875rem; color: var(--k-text-muted); }
</style>
