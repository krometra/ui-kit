<script setup>
/**
 * KTextarea — многострочное поле. Подпись, подсказка и ошибка ведут себя так
 * же, как у KInput, чтобы формы выглядели однородно.
 */
import { computed, useAttrs } from 'vue'

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
  modelValue: { type: String, default: '' },
  label: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  rows: { type: [Number, String], default: 4 },
  hint: { type: String, default: '' },
  error: { type: String, default: '' },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
})

defineEmits(['update:modelValue'])
</script>

<template>
  <label class="k-textarea" v-bind="rootAttrs">
    <span v-if="label" class="k-textarea__label">
      {{ label }}<span v-if="required" class="k-textarea__req">*</span>
    </span>
    <textarea
      class="k-textarea__field"
      :class="{ 'k-textarea__field--error': error }"
      :value="modelValue"
      :rows="rows"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      v-bind="controlAttrs"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <span v-if="error" class="k-textarea__error">{{ error }}</span>
    <span v-else-if="hint" class="k-textarea__hint">{{ hint }}</span>
  </label>
</template>

<style scoped>
.k-textarea { display: flex; flex-direction: column; gap: 0.25rem; margin: 0; min-width: 0; }
.k-textarea__label { font-size: 0.8125rem; color: var(--k-text-muted); }
.k-textarea__req { color: var(--k-danger); margin-left: 2px; }
.k-textarea__field {
  width: 100%;
  padding: 0.5rem 0.625rem;
  background: var(--k-surface);
  border: 1px solid var(--k-border-strong);
  border-radius: var(--k-radius-sm);
  font: inherit;
  font-size: 0.9375rem;
  color: inherit;
  outline: none;
  resize: vertical;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.k-textarea__field:focus { border-color: var(--k-primary); box-shadow: 0 0 0 3px var(--k-primary-soft); }
.k-textarea__field--error { border-color: var(--k-danger); }
.k-textarea__field:disabled { background: var(--k-surface-muted); cursor: not-allowed; }
.k-textarea__hint { font-size: 0.75rem; color: var(--k-text-muted); }
.k-textarea__error { font-size: 0.75rem; color: var(--k-danger); }
</style>
