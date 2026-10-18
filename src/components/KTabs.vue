<script setup>
/**
 * KTabs — горизонтальные вкладки на @zag-js/tabs: навигация стрелками,
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
import KIcon from './KIcon.vue'

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
  <div class="k-tabs" :class="`k-tabs--${variant}`" v-bind="api.getRootProps()">
    <div class="k-tabs__list" v-bind="api.getListProps()">
      <button
        v-for="item in items"
        :key="item.value"
        class="k-tabs__tab"
        :class="{ 'k-tabs__tab--hinted': item.hint }"
        v-bind="api.getTriggerProps({ value: String(item.value), disabled: item.disabled })"
      >
        <span class="k-tabs__label">
          <KIcon v-if="item.icon" :name="item.icon" :size="15" />
          {{ item.label }}
          <span v-if="item.count != null" class="k-tabs__count">{{ item.count }}</span>
        </span>
        <span v-if="item.hint" class="k-tabs__hint">{{ item.hint }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.k-tabs { overflow-x: auto; }
.k-tabs__list { display: flex; align-items: stretch; gap: 0.25rem; }
.k-tabs--line .k-tabs__list { border-bottom: 1px solid var(--k-border); }
.k-tabs__tab {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 0.75rem;
  background: none;
  border: none;
  font: inherit;
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--k-text-muted);
  cursor: pointer;
  white-space: nowrap;
  transition: color 0.15s, background 0.15s, border-color 0.15s;
}
.k-tabs__tab:focus { outline: none; }
.k-tabs__tab:focus-visible { outline: 2px solid var(--k-primary); outline-offset: -2px; border-radius: var(--k-radius-sm); }
.k-tabs__tab[data-disabled] { opacity: 0.5; cursor: not-allowed; }
.k-tabs--line .k-tabs__tab { border-bottom: 2px solid transparent; margin-bottom: -1px; }
.k-tabs--line .k-tabs__tab:hover:not([data-disabled]) { color: var(--k-text); }
.k-tabs--line .k-tabs__tab[data-selected] { color: var(--k-primary); border-bottom-color: var(--k-primary); }
.k-tabs--pill .k-tabs__tab { border-radius: 999px; padding: 0.4rem 0.85rem; }
.k-tabs--pill .k-tabs__tab:hover:not([data-disabled]) { background: var(--k-surface-muted); }
.k-tabs--pill .k-tabs__tab[data-selected] { background: var(--k-primary-soft); color: var(--k-primary); }
.k-tabs__label { display: inline-flex; align-items: center; gap: 0.4rem; }
.k-tabs__tab--hinted { flex-direction: column; align-items: flex-start; justify-content: center; gap: 0.1rem; }
.k-tabs__hint { font-size: 0.75rem; font-weight: 400; color: var(--k-text-muted); }
.k-tabs--pill .k-tabs__tab--hinted { border-radius: var(--k-radius-lg); }
.k-tabs__count {
  padding: 0.05rem 0.35rem;
  border-radius: 999px;
  background: var(--k-surface-muted);
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--k-text-muted);
}
.k-tabs__tab[data-selected] .k-tabs__count { background: var(--k-primary-soft); color: var(--k-primary); }
</style>
