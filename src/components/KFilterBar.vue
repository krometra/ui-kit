<script setup>
/**
 * KFilterBar — панель поиска и фильтров над списком.
 *
 * Слоты: #search (обычно KInput), по умолчанию — сами фильтры, #actions —
 * кнопки справа. Ниже показываются активные фильтры чипами со сбросом: без
 * этого пользователь теряет из виду, почему список пуст.
 *
 *   active: [{ key, label }]
 */
import KIcon from './KIcon.vue'

defineProps({
  active: { type: Array, default: () => [] },
})

defineEmits(['remove', 'reset'])
</script>

<template>
  <div class="k-filterbar">
    <div class="k-filterbar__row">
      <div v-if="$slots.search" class="k-filterbar__search"><slot name="search" /></div>
      <div class="k-filterbar__fields"><slot /></div>
      <div v-if="$slots.actions" class="k-filterbar__actions"><slot name="actions" /></div>
    </div>
    <div v-if="active.length" class="k-filterbar__chips">
      <span v-for="chip in active" :key="chip.key" class="k-filterbar__chip">
        {{ chip.label }}
        <button class="k-filterbar__chip-x" aria-label="Убрать фильтр" @click="$emit('remove', chip)">
          <KIcon name="close" :size="12" />
        </button>
      </span>
      <button class="k-filterbar__reset" @click="$emit('reset')">Сбросить всё</button>
    </div>
  </div>
</template>

<style scoped>
.k-filterbar {
  background: var(--k-surface);
  border: 1px solid var(--k-border);
  border-radius: var(--k-radius);
  box-shadow: var(--k-shadow-sm);
  padding: 0.875rem 1rem;
}
.k-filterbar__row { display: flex; align-items: flex-end; gap: 0.75rem; flex-wrap: wrap; }
.k-filterbar__search { flex: 1 1 20rem; min-width: 14rem; }
.k-filterbar__fields { display: flex; align-items: flex-end; gap: 0.75rem; flex-wrap: wrap; }
.k-filterbar__actions { display: flex; align-items: center; gap: 0.5rem; margin-left: auto; }
.k-filterbar__chips {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-wrap: wrap;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px dashed var(--k-border);
}
.k-filterbar__chip {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.15rem 0.3rem 0.15rem 0.55rem;
  background: var(--k-primary-soft);
  color: var(--k-primary);
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 500;
}
.k-filterbar__chip-x {
  display: inline-flex;
  background: none;
  border: none;
  color: inherit;
  opacity: 0.65;
  cursor: pointer;
  padding: 0.1rem;
}
.k-filterbar__chip-x:hover { opacity: 1; }
.k-filterbar__reset {
  background: none;
  border: none;
  font: inherit;
  font-size: 0.75rem;
  color: var(--k-text-muted);
  cursor: pointer;
  text-decoration: underline;
}
.k-filterbar__reset:hover { color: var(--k-text); }
</style>
