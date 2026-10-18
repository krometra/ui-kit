<script setup>
/**
 * KSteps — индикатор шагов мастера на @zag-js/steps.
 *
 *   items:   [{ label, hint? }] или строки
 *   current: индекс текущего шага (с нуля), контролируемый
 *   clickable: разрешить переход по клику на пройденные шаги (событие `select`)
 */
import * as steps from '@zag-js/steps'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { computed, useId } from 'vue'
import KIcon from './KIcon.vue'

const props = defineProps({
  items: { type: Array, default: () => [] },
  current: { type: Number, default: 0 },
  clickable: { type: Boolean, default: false },
})

const emit = defineEmits(['select'])

const service = useMachine(steps.machine, {
  id: useId(),
  linear: false,
  get step() {
    return props.current
  },
  get count() {
    return props.items.length
  },
  onStepChange({ step }) {
    if (step !== props.current) emit('select', step)
  },
})

const api = computed(() => steps.connect(service, normalizeProps))

const labelOf = (item) => (typeof item === 'string' ? item : item.label)
const hintOf = (item) => (typeof item === 'string' ? '' : item.hint)
</script>

<template>
  <div class="k-steps" v-bind="api.getRootProps()">
    <ol class="k-steps__list" v-bind="api.getListProps()">
      <li v-for="(item, i) in items" :key="i" class="k-steps__item" v-bind="api.getItemProps({ index: i })">
        <component
          :is="clickable ? 'button' : 'div'"
          class="k-steps__trigger"
          :class="{ 'k-steps__trigger--clickable': clickable && i <= current }"
          v-bind="clickable ? api.getTriggerProps({ index: i }) : {}"
          :disabled="clickable && i > current ? true : null"
        >
          <span class="k-steps__marker" v-bind="api.getIndicatorProps({ index: i })">
            <KIcon v-if="i < current" name="check" :size="14" />
            <template v-else>{{ i + 1 }}</template>
          </span>
          <span class="k-steps__body">
            <span class="k-steps__label">{{ labelOf(item) }}</span>
            <span v-if="hintOf(item)" class="k-steps__hint">{{ hintOf(item) }}</span>
          </span>
        </component>
        <span v-if="i < items.length - 1" class="k-steps__sep" v-bind="api.getSeparatorProps({ index: i })" />
      </li>
    </ol>
  </div>
</template>

<style scoped>
.k-steps { overflow-x: auto; }
.k-steps__list {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
}
.k-steps__item { display: flex; align-items: center; gap: 0.5rem; white-space: nowrap; }
.k-steps__trigger {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.5rem;
  border: none;
  border-radius: var(--k-radius-sm);
  background: none;
  font: inherit;
  color: inherit;
  text-align: left;
}
.k-steps__trigger--clickable { cursor: pointer; }
.k-steps__trigger--clickable:hover { background: var(--k-surface-muted); }
.k-steps__trigger:focus-visible { outline: 2px solid var(--k-primary); outline-offset: 2px; }
.k-steps__trigger:disabled { cursor: default; }
.k-steps__sep { width: 1.5rem; height: 1px; background: var(--k-border-strong); flex: none; }
.k-steps__marker {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.625rem;
  height: 1.625rem;
  border-radius: 50%;
  background: var(--k-surface);
  border: 1px solid var(--k-border-strong);
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--k-text-muted);
  flex: none;
}
.k-steps__body { display: flex; flex-direction: column; }
.k-steps__label { font-size: 0.875rem; color: var(--k-text-muted); }
.k-steps__hint { font-size: 0.6875rem; color: var(--k-text-faint); }
.k-steps__marker[data-complete] { background: var(--k-success-soft); border-color: currentColor; color: var(--k-success); }
.k-steps__trigger[data-complete] .k-steps__label { color: var(--k-text); }
.k-steps__marker[data-current] { background: var(--k-primary); border-color: var(--k-primary); color: var(--k-on-primary); }
.k-steps__trigger[data-current] .k-steps__label { color: var(--k-text); font-weight: 600; }
.k-steps__item[data-complete] .k-steps__label { color: var(--k-text); }
.k-steps__item[data-current] .k-steps__label { color: var(--k-text); font-weight: 600; }
</style>
