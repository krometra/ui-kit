<script setup>
/**
 * KTooltip — подсказка над обёрнутым элементом на @zag-js/tooltip: открывается
 * по наведению и фокусу с задержкой, закрывается по Esc и уходу указателя.
 * Пузырёк рендерится в <body>, поэтому не обрезается контейнерами с overflow.
 *
 *   <KTooltip text="Расшифровка статуса"><KBadge>В работе</KBadge></KTooltip>
 */
import * as tooltip from '@zag-js/tooltip'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { computed, useId } from 'vue'

const props = defineProps({
  text: { type: String, default: '' },
  placement: { type: String, default: 'top' }, // top | bottom | left | right
  openDelay: { type: Number, default: 300 },
  closeDelay: { type: Number, default: 100 },
  disabled: { type: Boolean, default: false },
})

const service = useMachine(tooltip.machine, {
  id: useId(),
  get positioning() {
    return { placement: props.placement }
  },
  get openDelay() {
    return props.openDelay
  },
  get closeDelay() {
    return props.closeDelay
  },
  get disabled() {
    return props.disabled
  },
})

const api = computed(() => tooltip.connect(service, normalizeProps))
</script>

<template>
  <span class="k-tooltip" tabindex="0" v-bind="api.getTriggerProps()">
    <slot />
  </span>
  <Teleport to="body">
    <div v-if="api.open" v-bind="api.getPositionerProps()">
      <div class="k-tooltip__bubble" v-bind="api.getContentProps()">
        <slot name="content">{{ text }}</slot>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.k-tooltip { display: inline-flex; outline: none; }
.k-tooltip:focus-visible { outline: 2px solid var(--k-primary); outline-offset: 2px; border-radius: var(--k-radius-sm); }
.k-tooltip__bubble {
  z-index: 1200;
  max-width: 18rem;
  padding: 0.4rem 0.55rem;
  background: var(--k-tooltip-bg);
  color: var(--k-tooltip-text);
  border-radius: var(--k-radius-sm);
  font-size: 0.75rem;
  line-height: 1.4;
  box-shadow: var(--k-shadow-md);
}
</style>
