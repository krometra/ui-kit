<script setup>
/**
 * KStat — плитка ключевой метрики для дашборда.
 *
 * `trend` — изменение в процентах: положительное красится в зелёный со стрелкой
 * вверх, отрицательное в красный. Для метрик, где снижение это хорошо (расходы,
 * время отклика, число ошибок), передайте `invert`.
 */
import { computed } from 'vue'
import KIcon from './KIcon.vue'

const props = defineProps({
  label: { type: String, default: '' },
  value: { type: [String, Number], default: '' },
  hint: { type: String, default: '' },
  icon: { type: String, default: '' },
  tone: { type: String, default: 'neutral' }, // neutral | primary | success | warning | danger
  trend: { type: Number, default: null },
  invert: { type: Boolean, default: false },
})

const good = computed(() => (props.invert ? props.trend < 0 : props.trend > 0))
</script>

<template>
  <div class="k-stat">
    <div class="k-stat__head">
      <span class="k-stat__label">{{ label }}</span>
      <span v-if="icon" class="k-stat__icon" :class="`k-stat__icon--${tone}`">
        <KIcon :name="icon" :size="16" />
      </span>
    </div>
    <div class="k-stat__value"><slot>{{ value }}</slot></div>
    <div v-if="hint || trend != null" class="k-stat__foot">
      <span v-if="trend != null" class="k-stat__trend" :class="good ? 'k-stat__trend--good' : 'k-stat__trend--bad'">
        <KIcon :name="trend > 0 ? 'up' : 'down'" :size="13" />
        {{ Math.abs(trend).toLocaleString('ru-RU') }}%
      </span>
      <span v-if="hint" class="k-stat__hint">{{ hint }}</span>
    </div>
  </div>
</template>

<style scoped>
.k-stat {
  background: var(--k-surface);
  border: 1px solid var(--k-border);
  border-radius: var(--k-radius);
  box-shadow: var(--k-shadow-sm);
  padding: 1rem 1.125rem;
}
.k-stat__head { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; }
.k-stat__label { font-size: 0.8125rem; color: var(--k-text-muted); }
.k-stat__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: var(--k-radius-sm);
  background: var(--k-surface-muted);
  color: var(--k-text-muted);
}
.k-stat__icon--primary { background: var(--k-primary-soft); color: var(--k-primary); }
.k-stat__icon--success { background: var(--k-success-soft); color: var(--k-success); }
.k-stat__icon--warning { background: var(--k-warning-soft); color: var(--k-warning); }
.k-stat__icon--danger { background: var(--k-danger-soft); color: var(--k-danger); }
.k-stat__value { margin-top: 0.35rem; font-size: 1.5rem; font-weight: 650; letter-spacing: -0.02em; }
.k-stat__foot { margin-top: 0.35rem; display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; }
.k-stat__trend { display: inline-flex; align-items: center; gap: 0.15rem; font-weight: 600; }
.k-stat__trend--good { color: var(--k-success); }
.k-stat__trend--bad { color: var(--k-danger); }
.k-stat__hint { color: var(--k-text-muted); }
</style>
