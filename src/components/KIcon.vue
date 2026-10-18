<script setup>
/**
 * KIcon — единственная точка входа для иконок кита.
 *
 * Оборачивает Lucide (https://lucide.dev, ISC). Компоненты и приложения
 * ссылаются на иконку по *семантическому* имени ("delete", "settings"), а не
 * по форме, поэтому набор можно заменить в одном месте — см. icon-registry.js.
 *
 *   <KIcon name="settings" :size="16" />
 *
 * Иконку, которой нет в реестре, можно передать напрямую компонентом —
 * так приложение расширяет набор, не форкая кит:
 *
 *   <KIcon :component="MyBrandIcon" />
 */
import { computed } from 'vue'
import { iconRegistry } from './icon-registry.js'

const props = defineProps({
  name: { type: String, default: '' },
  component: { type: [Object, Function], default: null },
  size: { type: [Number, String], default: 18 },
  strokeWidth: { type: [Number, String], default: 2 },
  spin: { type: Boolean, default: false },
})

const resolved = computed(() => {
  if (props.component) return props.component
  const c = iconRegistry[props.name]
  if (!c && props.name && import.meta.env?.DEV) {
    console.warn(`[KIcon] неизвестная иконка "${props.name}" — добавьте её в icon-registry.js или передайте :component`)
  }
  return c || null
})
</script>

<template>
  <component
    :is="resolved"
    v-if="resolved"
    class="k-icon"
    :class="{ 'k-icon--spin': spin }"
    :size="Number(size)"
    :stroke-width="Number(strokeWidth)"
    aria-hidden="true"
  />
</template>

<style scoped>
.k-icon { display: inline-block; vertical-align: -0.15em; flex-shrink: 0; }
.k-icon--spin { animation: k-icon-spin 1s linear infinite; }
@keyframes k-icon-spin { to { transform: rotate(360deg); } }
</style>
