<script setup>
/**
 * KGantt — диаграмма Ганта по дням: слева список задач, справа полосы сроков.
 * Задачи группируются (по исполнителю, команде, этапу); у группы сводная
 * полоса от самого раннего начала до самого позднего конца, группы
 * сворачиваются. Даты — строки 'YYYY-MM-DD'.
 *
 *   items:  [{ key, label, start, end?, group?, code?, tone?, hint?, href?, muted?,
 *              segments?: [{ start, end }] }]
 *   groups: [{ key, label, hint? }]  — порядок групп; без него задачи идут одним списком
 *   tone    — 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'
 *   muted   — завершённая или неактуальная задача, полоса приглушена
 *   segments — несколько отрезков в одной строке (работа с перерывами)
 *
 *   <KGantt :items="tasks" :groups="people" from="2026-10-19" to="2026-11-06"
 *           @item-click="open">
 *     <template #group="{ group }"><KAvatar :name="group.label" size="sm" />{{ group.label }}</template>
 *   </KGantt>
 *
 * Слоты: #group="{ group, items, collapsed }", #label="{ item }", #bar="{ item }".
 */
import { computed, ref } from 'vue'
import KIcon from './KIcon.vue'
import KTooltip from './KTooltip.vue'

const props = defineProps({
  items: { type: Array, default: () => [] },
  groups: { type: Array, default: () => [] },
  from: { type: String, required: true },
  to: { type: String, required: true },
  today: { type: String, default: () => new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10) },
  weekends: { type: Boolean, default: false },
  dayWidth: { type: Number, default: 56 },
  labelWidth: { type: String, default: '18rem' },
  emptyText: { type: String, default: 'Нет задач в этом периоде' },
})

const emit = defineEmits(['item-click'])

const WEEKDAYS = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб']
const MONTHS = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']

const utc = (iso) => new Date(`${iso}T00:00:00Z`)
const addDays = (iso, n) => new Date(utc(iso).getTime() + n * 86400000).toISOString().slice(0, 10)

const days = computed(() => {
  const list = []
  for (let iso = props.from; iso <= props.to; iso = addDays(iso, 1)) {
    const wd = utc(iso).getUTCDay()
    const weekend = wd === 0 || wd === 6
    if (weekend && !props.weekends) continue
    list.push({ iso, wd, weekend, date: utc(iso).getUTCDate(), month: utc(iso).getUTCMonth() })
  }
  return list.map((d, i) => ({ ...d, monthStart: i === 0 || d.month !== list[i - 1].month }))
})

const todayIndex = computed(() => days.value.findIndex(d => d.iso === props.today))

function span(start, end) {
  const s = start || end
  const e = end || start
  if (!s || e < props.from || s > props.to) return null
  const list = days.value
  const first = list.findIndex(d => d.iso >= s)
  let last = -1
  for (let i = list.length - 1; i >= 0; i--) if (list[i].iso <= e) { last = i; break }
  if (first < 0 || last < first) return null
  return { first, last, cutStart: s < props.from, cutEnd: e > props.to }
}

function barsOf(item) {
  const parts = item.segments?.length ? item.segments : [{ start: item.start, end: item.end }]
  return parts.map(p => span(p.start, p.end)).filter(Boolean)
}

const collapsed = ref(new Set())
function toggle(key) {
  const next = new Set(collapsed.value)
  next.has(key) ? next.delete(key) : next.add(key)
  collapsed.value = next
}

const rows = computed(() => {
  const out = []
  if (!props.groups.length) {
    for (const item of props.items) out.push({ type: 'item', key: item.key, item, bars: barsOf(item) })
    return out
  }
  for (const group of props.groups) {
    const items = props.items.filter(i => i.group === group.key)
    const bars = items.flatMap(barsOf)
    const summary = bars.length
      ? { first: Math.min(...bars.map(b => b.first)), last: Math.max(...bars.map(b => b.last)) }
      : null
    const isCollapsed = collapsed.value.has(group.key)
    out.push({ type: 'group', key: `g:${group.key}`, group, items, summary, collapsed: isCollapsed })
    if (!isCollapsed) for (const item of items) out.push({ type: 'item', key: `${group.key}:${item.key}`, item, bars: barsOf(item) })
  }
  return out
})

const gridStyle = computed(() => ({
  '--k-gantt-day-w': `${props.dayWidth}px`,
  '--k-gantt-label-w': props.labelWidth,
  gridTemplateColumns: `var(--k-gantt-label-w) repeat(${days.value.length}, var(--k-gantt-day-w))`,
}))

const barStyle = (bar) => ({
  left: `calc(var(--k-gantt-day-w) * ${bar.first} + 3px)`,
  width: `calc(var(--k-gantt-day-w) * ${bar.last - bar.first + 1} - 6px)`,
})

const dayLines = computed(() => {
  const marks = []
  days.value.forEach((d, i) => {
    if (d.weekend) marks.push({ key: `w${i}`, kind: 'weekend', i })
    if (i > 0 && d.wd === 1 && !props.weekends) marks.push({ key: `m${i}`, kind: 'week', i })
  })
  return marks
})

function open(item) {
  emit('item-click', item)
}
</script>

<template>
  <div class="k-gantt">
    <div class="k-gantt__scroll">
      <div class="k-gantt__grid" :style="gridStyle">
        <div class="k-gantt__corner"><slot name="corner" /></div>
        <div
          v-for="(d, i) in days"
          :key="d.iso"
          class="k-gantt__day"
          :class="{ 'k-gantt__day--today': i === todayIndex, 'k-gantt__day--weekend': d.weekend, 'k-gantt__day--week': i > 0 && d.wd === 1 && !weekends }"
        >
          <span class="k-gantt__month">{{ d.monthStart ? MONTHS[d.month] : '' }}</span>
          <span class="k-gantt__date">{{ d.date }}</span>
          <span class="k-gantt__wd">{{ WEEKDAYS[d.wd] }}</span>
        </div>

        <div v-if="!rows.length" class="k-gantt__empty">{{ emptyText }}</div>

        <template v-for="(row, r) in rows" :key="row.key">
          <template v-if="row.type === 'group'">
            <button type="button" class="k-gantt__label k-gantt__label--group" :style="{ gridRow: r + 2 }" @click="toggle(row.group.key)">
              <KIcon :name="row.collapsed ? 'chevron-right' : 'chevron-down'" :size="14" class="k-gantt__chevron" />
              <span class="k-gantt__group-name">
                <slot name="group" :group="row.group" :items="row.items" :collapsed="row.collapsed">{{ row.group.label }}</slot>
              </span>
              <span class="k-gantt__count">{{ row.items.length }}</span>
            </button>
            <div class="k-gantt__track k-gantt__track--group" :style="{ gridRow: r + 2 }">
              <div v-if="row.summary" class="k-gantt__summary" :style="barStyle(row.summary)" />
            </div>
          </template>

          <template v-else>
            <div class="k-gantt__label" :class="{ 'k-gantt__label--muted': row.item.muted }" :style="{ gridRow: r + 2 }">
              <slot name="label" :item="row.item">
                <span v-if="row.item.code" class="k-gantt__code">{{ row.item.code }}</span>
                <span class="k-gantt__title">{{ row.item.label }}</span>
              </slot>
            </div>
            <div class="k-gantt__track" :style="{ gridRow: r + 2 }">
              <div
                v-for="(bar, b) in row.bars"
                :key="b"
                class="k-gantt__bar-slot"
                :style="barStyle(bar)"
              >
                <KTooltip :disabled="!row.item.hint" placement="top">
                  <component
                    :is="row.item.href ? 'a' : 'button'"
                    :href="row.item.href || undefined"
                    :target="row.item.href ? '_blank' : undefined"
                    :rel="row.item.href ? 'noopener' : undefined"
                    :type="row.item.href ? undefined : 'button'"
                    class="k-gantt__bar"
                    :class="[
                      `k-gantt__bar--${row.item.tone || 'primary'}`,
                      { 'k-gantt__bar--muted': row.item.muted, 'k-gantt__bar--cut-start': bar.cutStart, 'k-gantt__bar--cut-end': bar.cutEnd },
                    ]"
                    @click="open(row.item)"
                  >
                    <slot v-if="b === 0" name="bar" :item="row.item">{{ row.item.code || row.item.label }}</slot>
                  </component>
                  <template #content><span class="k-gantt__hint">{{ row.item.hint }}</span></template>
                </KTooltip>
              </div>
            </div>
          </template>
        </template>

        <div
          v-for="m in dayLines"
          :key="m.key"
          class="k-gantt__mark"
          :class="`k-gantt__mark--${m.kind}`"
          :style="{ gridColumn: m.i + 2, gridRow: `2 / ${rows.length + 2}` }"
        />
        <div
          v-if="todayIndex >= 0 && rows.length"
          class="k-gantt__today"
          :style="{ gridColumn: todayIndex + 2, gridRow: `2 / ${rows.length + 2}` }"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.k-gantt {
  border: 1px solid var(--k-border);
  border-radius: var(--k-radius);
  background: var(--k-surface);
  overflow: hidden;
}
.k-gantt__scroll { overflow: auto; max-height: inherit; }
.k-gantt__grid { display: grid; grid-auto-rows: minmax(2.25rem, auto); position: relative; width: max-content; min-width: 100%; }

.k-gantt__corner,
.k-gantt__day {
  position: sticky;
  top: 0;
  z-index: 3;
  background: var(--k-surface-muted);
  border-bottom: 1px solid var(--k-border);
}
.k-gantt__corner {
  grid-row: 1;
  grid-column: 1;
  left: 0;
  z-index: 4;
  display: flex;
  align-items: flex-end;
  padding: 0.5rem 0.75rem;
  border-right: 1px solid var(--k-border);
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--k-text-muted);
}
.k-gantt__day {
  grid-row: 1;
  display: grid;
  grid-template-rows: 0.9rem auto auto;
  justify-items: center;
  padding: 0.35rem 0 0.4rem;
  font-variant-numeric: tabular-nums;
}
.k-gantt__day--week { box-shadow: inset 1px 0 0 var(--k-border); }
.k-gantt__month { font-size: 0.625rem; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; color: var(--k-primary); }
.k-gantt__date {
  min-width: 1.75rem;
  padding: 0.05rem 0.35rem;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 600;
  text-align: center;
  color: var(--k-text);
}
.k-gantt__wd { font-size: 0.6875rem; color: var(--k-text-faint); }
.k-gantt__day--weekend .k-gantt__date { color: var(--k-text-faint); }
.k-gantt__day--today .k-gantt__date { background: var(--k-primary); color: var(--k-on-primary); }
.k-gantt__day--today .k-gantt__wd { color: var(--k-primary); font-weight: 600; }

.k-gantt__label {
  grid-column: 1;
  position: sticky;
  left: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
  padding: 0.35rem 0.75rem 0.35rem 2rem;
  background: var(--k-surface);
  border-right: 1px solid var(--k-border);
  border-bottom: 1px solid var(--k-border);
  font-size: 0.8125rem;
  color: var(--k-text);
}
.k-gantt__label--muted { color: var(--k-text-faint); }
.k-gantt__label--group {
  padding-left: 0.5rem;
  border: none;
  border-right: 1px solid var(--k-border);
  border-bottom: 1px solid var(--k-border);
  background: var(--k-surface-muted);
  font: inherit;
  font-weight: 600;
  font-size: 0.875rem;
  text-align: left;
  cursor: pointer;
}
.k-gantt__label--group:focus-visible { outline: 2px solid var(--k-primary); outline-offset: -2px; }
.k-gantt__chevron { color: var(--k-text-muted); flex: none; }
.k-gantt__group-name { display: inline-flex; align-items: center; gap: 0.5rem; min-width: 0; flex: 1; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.k-gantt__count {
  flex: none;
  min-width: 1.4rem;
  padding: 0 0.4rem;
  border-radius: 999px;
  background: var(--k-surface);
  color: var(--k-text-muted);
  font-size: 0.6875rem;
  font-weight: 600;
  text-align: center;
  line-height: 1.4rem;
}
.k-gantt__code { flex: none; font-variant-numeric: tabular-nums; font-weight: 600; color: var(--k-text-muted); }
.k-gantt__title { min-width: 0; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }

.k-gantt__track {
  grid-column: 2 / -1;
  position: relative;
  border-bottom: 1px solid var(--k-border);
}
.k-gantt__track--group { background: var(--k-surface-muted); }
.k-gantt__summary {
  position: absolute;
  z-index: 1;
  top: 50%;
  height: 0.5rem;
  margin-top: -0.25rem;
  border-radius: 2px;
  background: var(--k-text-muted);
  opacity: 0.55;
}
.k-gantt__summary::before,
.k-gantt__summary::after {
  content: '';
  position: absolute;
  bottom: -0.3rem;
  border: 0.3rem solid transparent;
  border-top-color: var(--k-text-muted);
}
.k-gantt__summary::before { left: 0; border-left-color: var(--k-text-muted); }
.k-gantt__summary::after { right: 0; border-right-color: var(--k-text-muted); }

.k-gantt__bar-slot { position: absolute; top: 0.3rem; bottom: 0.3rem; z-index: 1; display: flex; }
.k-gantt__bar-slot :deep(.k-tooltip) { display: flex; flex: 1; min-width: 0; }
.k-gantt__bar {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  padding: 0 0.5rem;
  border: none;
  border-left: 3px solid var(--k-gantt-accent);
  border-radius: var(--k-radius-sm);
  background: var(--k-gantt-fill);
  color: var(--k-gantt-ink);
  font: inherit;
  font-size: 0.75rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-decoration: none;
  cursor: pointer;
  transition: box-shadow 0.15s, transform 0.15s;
}
.k-gantt__bar:hover { box-shadow: var(--k-shadow-sm); transform: translateY(-1px); }
.k-gantt__bar:focus-visible { outline: 2px solid var(--k-primary); outline-offset: 1px; }
.k-gantt__bar--cut-start { border-top-left-radius: 0; border-bottom-left-radius: 0; border-left-style: dashed; }
.k-gantt__bar--cut-end { border-top-right-radius: 0; border-bottom-right-radius: 0; }
.k-gantt__bar--muted { opacity: 0.5; text-decoration: line-through; }
.k-gantt__bar--primary { --k-gantt-accent: var(--k-primary); --k-gantt-fill: var(--k-primary-soft); --k-gantt-ink: var(--k-primary); }
.k-gantt__bar--success { --k-gantt-accent: var(--k-success); --k-gantt-fill: var(--k-success-soft); --k-gantt-ink: var(--k-success-strong); }
.k-gantt__bar--warning { --k-gantt-accent: var(--k-warning); --k-gantt-fill: var(--k-warning-soft); --k-gantt-ink: var(--k-warning-strong); }
.k-gantt__bar--danger { --k-gantt-accent: var(--k-danger); --k-gantt-fill: var(--k-danger-soft); --k-gantt-ink: var(--k-danger-strong); }
.k-gantt__bar--info { --k-gantt-accent: var(--k-info); --k-gantt-fill: var(--k-info-soft); --k-gantt-ink: var(--k-info-strong); }
.k-gantt__bar--neutral { --k-gantt-accent: var(--k-border-strong); --k-gantt-fill: var(--k-surface-muted); --k-gantt-ink: var(--k-text-muted); }
.k-gantt__hint { white-space: pre-line; }

.k-gantt__mark { pointer-events: none; z-index: 0; }
.k-gantt__mark--weekend { background: var(--k-surface-muted); }
.k-gantt__mark--week { box-shadow: inset 1px 0 0 var(--k-border); }
.k-gantt__today {
  pointer-events: none;
  z-index: 0;
  background: var(--k-primary-soft);
  opacity: 0.6;
  box-shadow: inset 2px 0 0 var(--k-primary);
}

.k-gantt__empty {
  grid-column: 1 / -1;
  padding: 2rem;
  text-align: center;
  color: var(--k-text-muted);
}
</style>
