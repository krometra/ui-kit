<script setup>
/**
 * KCard — базовая поверхность: белая карточка со светлой рамкой.
 *
 * Заголовок задаётся пропом `title` (+ `subtitle`) либо слотом #header;
 * действия шапки — #actions, низ — #footer. `padding="none"` нужен, когда
 * внутрь кладут таблицу во всю ширину.
 */
defineProps({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  padding: { type: String, default: 'md' }, // md | sm | none
  hoverable: { type: Boolean, default: false },
})
</script>

<template>
  <section class="k-card" :class="[`k-card--p-${padding}`, { 'k-card--hoverable': hoverable }]">
    <header v-if="title || subtitle || $slots.header || $slots.actions" class="k-card__header">
      <div class="k-card__heading">
        <slot name="header">
          <h2 v-if="title" class="k-card__title">{{ title }}</h2>
          <p v-if="subtitle" class="k-card__subtitle">{{ subtitle }}</p>
        </slot>
      </div>
      <div v-if="$slots.actions" class="k-card__actions"><slot name="actions" /></div>
    </header>
    <div class="k-card__body"><slot /></div>
    <footer v-if="$slots.footer" class="k-card__footer"><slot name="footer" /></footer>
  </section>
</template>

<style scoped>
.k-card {
  background: var(--k-surface);
  border: 1px solid var(--k-border);
  border-radius: var(--k-radius);
  box-shadow: var(--k-shadow-sm);
  overflow: hidden;
}
.k-card--hoverable { transition: box-shadow 0.15s, border-color 0.15s; }
.k-card--hoverable:hover { box-shadow: var(--k-shadow-md); border-color: var(--k-border-strong); }
.k-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--k-border);
}
.k-card__heading { min-width: 0; }
.k-card__title { font-size: 1rem; font-weight: 600; }
.k-card__subtitle { margin-top: 0.15rem; font-size: 0.8125rem; color: var(--k-text-muted); }
.k-card__actions { display: flex; align-items: center; gap: 0.5rem; flex: none; }
.k-card--p-md .k-card__body { padding: 1.25rem; }
.k-card--p-sm .k-card__body { padding: 0.75rem; }
.k-card--p-none .k-card__body { padding: 0; }
.k-card__footer {
  padding: 0.875rem 1.25rem;
  border-top: 1px solid var(--k-border);
  background: var(--k-surface-muted);
}
</style>
