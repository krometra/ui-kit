<script setup>
/**
 * FxTabs — горизонтальные вкладки на @zag-js/tabs: навигация стрелками,
 * roving tabindex и ARIA от машины.
 *
 * Только заголовки: содержимое рисует приложение по v-model. Так вкладки можно
 * привязать к маршруту, не дублируя контент внутри компонента.
 *
 *   items: [{ value, label, hint?, icon?, count?, disabled? }]
 *
 * hint — пояснение второй строкой под названием вкладки.
 */
import * as tabs from '@zag-js/tabs'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { computed, useId } from 'vue'
import FxIcon from './FxIcon.vue'

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  items: { type: Array, default: () => [] },
  variant: { type: String, default: 'line' }, // line | pill
})

const emit = defineEmits(['update:modelValue'])

const service = useMachine(tabs.machine, {
  id: useId(),
  get value() {
    return props.modelValue === '' || props.modelValue == null ? null : String(props.modelValue)
  },
  onValueChange({ value }) {
    const item = props.items.find((i) => String(i.value) === value)
    emit('update:modelValue', item ? item.value : value)
  },
})

const api = computed(() => tabs.connect(service, normalizeProps))
</script>

<template>
  <div class="fx-tabs" :class="`fx-tabs--${variant}`" v-bind="api.getRootProps()">
    <div class="fx-tabs__list" v-bind="api.getListProps()">
      <button
        v-for="item in items"
        :key="item.value"
        class="fx-tabs__tab"
        :class="{ 'fx-tabs__tab--hinted': item.hint }"
        v-bind="api.getTriggerProps({ value: String(item.value), disabled: item.disabled })"
      >
        <span class="fx-tabs__label">
          <FxIcon v-if="item.icon" :name="item.icon" :size="15" />
          {{ item.label }}
          <span v-if="item.count != null" class="fx-tabs__count">{{ item.count }}</span>
        </span>
        <span v-if="item.hint" class="fx-tabs__hint">{{ item.hint }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.fx-tabs { overflow-x: auto; }
.fx-tabs__list { display: flex; align-items: stretch; gap: 0.25rem; }
.fx-tabs--line .fx-tabs__list { border-bottom: 1px solid var(--fx-border); }
.fx-tabs__tab {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 0.75rem;
  background: none;
  border: none;
  font: inherit;
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--fx-text-muted);
  cursor: pointer;
  white-space: nowrap;
  transition: color 0.15s, background 0.15s, border-color 0.15s;
}
.fx-tabs__tab:focus { outline: none; }
.fx-tabs__tab:focus-visible { outline: 2px solid var(--fx-primary); outline-offset: -2px; border-radius: var(--fx-radius-sm); }
.fx-tabs__tab[data-disabled] { opacity: 0.5; cursor: not-allowed; }
.fx-tabs--line .fx-tabs__tab { border-bottom: 2px solid transparent; margin-bottom: -1px; }
.fx-tabs--line .fx-tabs__tab:hover:not([data-disabled]) { color: var(--fx-text); }
.fx-tabs--line .fx-tabs__tab[data-selected] { color: var(--fx-primary); border-bottom-color: var(--fx-primary); }
.fx-tabs--pill .fx-tabs__tab { border-radius: 999px; padding: 0.4rem 0.85rem; }
.fx-tabs--pill .fx-tabs__tab:hover:not([data-disabled]) { background: var(--fx-surface-muted); }
.fx-tabs--pill .fx-tabs__tab[data-selected] { background: var(--fx-primary-soft); color: var(--fx-primary); }
.fx-tabs__label { display: inline-flex; align-items: center; gap: 0.4rem; }
.fx-tabs__tab--hinted { flex-direction: column; align-items: flex-start; justify-content: center; gap: 0.1rem; }
.fx-tabs__hint { font-size: 0.75rem; font-weight: 400; color: var(--fx-text-muted); }
.fx-tabs--pill .fx-tabs__tab--hinted { border-radius: var(--fx-radius-lg); }
.fx-tabs__count {
  padding: 0.05rem 0.35rem;
  border-radius: 999px;
  background: var(--fx-surface-muted);
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--fx-text-muted);
}
.fx-tabs__tab[data-selected] .fx-tabs__count { background: var(--fx-primary-soft); color: var(--fx-primary); }
</style>
