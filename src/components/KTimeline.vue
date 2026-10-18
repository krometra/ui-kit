<script setup>
/**
 * KTimeline — хронология событий: история статусов, журнал действий, лента
 * активности.
 *
 *   items: [{ time, title, text?, tone?, icon? }]
 */
import KIcon from './KIcon.vue'

defineProps({
  items: { type: Array, default: () => [] },
})
</script>

<template>
  <ol class="k-timeline">
    <li v-for="(item, i) in items" :key="i" class="k-timeline__item">
      <span class="k-timeline__marker" :class="`k-timeline__marker--${item.tone || 'neutral'}`">
        <KIcon v-if="item.icon" :name="item.icon" :size="12" />
      </span>
      <div class="k-timeline__body">
        <div class="k-timeline__head">
          <span class="k-timeline__title">
            <slot name="title" :item="item">{{ item.title }}</slot>
          </span>
          <span class="k-timeline__time">{{ item.time }}</span>
        </div>
        <p v-if="item.text" class="k-timeline__text">{{ item.text }}</p>
        <slot name="extra" :item="item" />
      </div>
    </li>
  </ol>
</template>

<style scoped>
.k-timeline { margin: 0; padding: 0; list-style: none; }
.k-timeline__item { position: relative; display: flex; gap: 0.75rem; padding-bottom: 1rem; }
/* Вертикальная линия между маркерами; у последнего элемента не рисуем. */
.k-timeline__item:not(:last-child)::before {
  content: '';
  position: absolute;
  left: 0.53rem;
  top: 1.35rem;
  bottom: 0.1rem;
  width: 1px;
  background: var(--k-border);
}
.k-timeline__item:last-child { padding-bottom: 0; }
.k-timeline__marker {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.125rem;
  height: 1.125rem;
  margin-top: 0.2rem;
  border-radius: 50%;
  flex: none;
  border: 2px solid var(--k-surface);
}
.k-timeline__marker--neutral { background: var(--k-border-strong); color: var(--k-surface); }
.k-timeline__marker--primary { background: var(--k-primary); color: var(--k-on-primary); }
.k-timeline__marker--success { background: var(--k-success); color: var(--k-on-success); }
.k-timeline__marker--warning { background: var(--k-warning); color: var(--k-on-warning); }
.k-timeline__marker--danger { background: var(--k-danger); color: var(--k-on-danger); }
.k-timeline__body { flex: 1; min-width: 0; }
.k-timeline__head { display: flex; align-items: baseline; justify-content: space-between; gap: 0.75rem; }
.k-timeline__title { font-size: 0.9375rem; }
.k-timeline__time { font-size: 0.75rem; color: var(--k-text-faint); white-space: nowrap; font-variant-numeric: tabular-nums; }
.k-timeline__text { font-size: 0.8125rem; color: var(--k-text-muted); margin-top: 0.1rem; }
</style>
