<script setup>
/**
 * KInput — однострочное поле ввода с подписью, подсказкой и ошибкой.
 *
 * Метрики совпадают с KSelect и KButton, поэтому строка фильтров
 * выравнивается без правок в приложении. Нативные атрибуты (autocomplete,
 * inputmode, min, @blur, …) прокидываются на <input>.
 *
 *   <KInput v-model="query" label="Поиск" prefix-icon="search" :error="err" />
 */
import { computed, useAttrs } from 'vue'
import KIcon from './KIcon.vue'

defineOptions({ inheritAttrs: false })

/*
 * Атрибуты разделяются: class и style остаются на корне (иначе layout-классы
 * из родителя не могут задать ширину поля в строке фильтров), остальное —
 * autocomplete, inputmode, min, обработчики — уходит на сам контрол.
 */
const attrs = useAttrs()
const rootAttrs = computed(() => ({ class: attrs.class, style: attrs.style }))
const controlAttrs = computed(() => {
  const { class: _c, style: _s, ...rest } = attrs
  return rest
})

defineProps({
  modelValue: { type: [String, Number], default: '' },
  label: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  type: { type: String, default: 'text' },
  hint: { type: String, default: '' },
  error: { type: String, default: '' },
  prefixIcon: { type: String, default: '' },
  suffix: { type: String, default: '' },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
})

defineEmits(['update:modelValue'])
</script>

<template>
  <label class="k-input" v-bind="rootAttrs">
    <span v-if="label" class="k-input__label">
      {{ label }}<span v-if="required" class="k-input__req">*</span>
    </span>
    <span
      class="k-input__box"
      :class="{ 'k-input__box--error': error, 'k-input__box--disabled': disabled }"
    >
      <KIcon v-if="prefixIcon" :name="prefixIcon" :size="16" class="k-input__icon" />
      <input
        class="k-input__field"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :readonly="readonly"
        :aria-invalid="error ? 'true' : null"
        v-bind="controlAttrs"
        @input="$emit('update:modelValue', $event.target.value)"
      />
      <span v-if="suffix" class="k-input__suffix">{{ suffix }}</span>
    </span>
    <span v-if="error" class="k-input__error">{{ error }}</span>
    <span v-else-if="hint" class="k-input__hint">{{ hint }}</span>
  </label>
</template>

<style scoped>
.k-input { display: flex; flex-direction: column; gap: 0.25rem; margin: 0; min-width: 0; }
.k-input__label { font-size: 0.8125rem; color: var(--k-text-muted); }
.k-input__req { color: var(--k-danger); margin-left: 2px; }
.k-input__box {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  height: var(--k-control-h);
  padding: 0 0.625rem;
  background: var(--k-surface);
  border: 1px solid var(--k-border-strong);
  border-radius: var(--k-radius-sm);
  transition: border-color 0.15s, box-shadow 0.15s;
}
.k-input__box:focus-within { border-color: var(--k-primary); box-shadow: 0 0 0 3px var(--k-primary-soft); }
.k-input__box--error { border-color: var(--k-danger); }
.k-input__box--error:focus-within { box-shadow: 0 0 0 3px var(--k-danger-soft); }
.k-input__box--disabled { background: var(--k-surface-muted); }
.k-input__icon { color: var(--k-text-faint); }
.k-input__field {
  flex: 1;
  min-width: 0;
  border: none;
  background: none;
  outline: none;
  font: inherit;
  font-size: 0.9375rem;
  color: inherit;
}
.k-input__field:disabled { cursor: not-allowed; color: var(--k-text-muted); }
.k-input__suffix { font-size: 0.875rem; color: var(--k-text-muted); white-space: nowrap; }
.k-input__hint { font-size: 0.75rem; color: var(--k-text-muted); }
.k-input__error { font-size: 0.75rem; color: var(--k-danger); }
</style>
