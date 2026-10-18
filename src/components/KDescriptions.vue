<script setup>
/**
 * KDescriptions — список «поле → значение» для карточек сущностей.
 * Значение можно переопределить слотом `#value-<key>`.
 *
 *   items: [{ key, label, value? }]
 */
defineProps({
  items: { type: Array, default: () => [] },
  columns: { type: Number, default: 2 },
})
</script>

<template>
  <dl class="k-desc" :style="{ '--k-desc-cols': columns }">
    <div v-for="item in items" :key="item.key" class="k-desc__row" :class="{ 'k-desc__row--wide': item.wide }">
      <dt class="k-desc__label">{{ item.label }}</dt>
      <dd class="k-desc__value">
        <slot :name="`value-${item.key}`" :item="item">{{ item.value ?? '—' }}</slot>
      </dd>
    </div>
  </dl>
</template>

<style scoped>
.k-desc {
  display: grid;
  grid-template-columns: repeat(var(--k-desc-cols, 2), minmax(0, 1fr));
  gap: 0.875rem 1.5rem;
  margin: 0;
}
.k-desc__row { min-width: 0; }
.k-desc__row--wide { grid-column: 1 / -1; }
.k-desc__label { font-size: 0.75rem; color: var(--k-text-muted); text-transform: uppercase; letter-spacing: 0.04em; }
.k-desc__value { margin: 0.2rem 0 0; font-size: 0.9375rem; overflow-wrap: anywhere; }

@media (max-width: 720px) {
  .k-desc { grid-template-columns: 1fr; }
}
</style>
