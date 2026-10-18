<script setup>
/**
 * KEmpty — пустое состояние списка: иконка, заголовок, пояснение и действие.
 */
import KIcon from './KIcon.vue'

defineProps({
  icon: { type: String, default: 'search' },
  title: { type: String, default: 'Ничего не найдено' },
  description: { type: String, default: '' },
})
</script>

<template>
  <div class="k-empty">
    <span class="k-empty__icon"><KIcon :name="icon" :size="24" /></span>
    <p class="k-empty__title">{{ title }}</p>
    <p v-if="description" class="k-empty__desc">{{ description }}</p>
    <div v-if="$slots.default" class="k-empty__actions"><slot /></div>
  </div>
</template>

<style scoped>
.k-empty { padding: 2.5rem 1.5rem; text-align: center; }
.k-empty__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: var(--k-surface-muted);
  color: var(--k-text-faint);
  margin-bottom: 0.75rem;
}
.k-empty__title { font-weight: 600; }
.k-empty__desc { margin-top: 0.25rem; font-size: 0.875rem; color: var(--k-text-muted); }
.k-empty__actions { margin-top: 1rem; display: flex; justify-content: center; gap: 0.5rem; }
</style>
