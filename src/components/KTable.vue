<script setup>
/**
 * KTable — таблица данных с сортировкой, пустым состоянием и пагинацией.
 *
 * Колонки описываются спецификацией, ячейки по умолчанию берут row[col.key];
 * любую можно переопределить слотом `#cell-<key>`. Пагинация контролируемая
 * (серверная): передайте total + pageSize и v-model:page.
 *
 *   columns: [{ key, label, width?, align?, nowrap?, sortable?, actions? }]
 *
 *   <KTable :columns="cols" :rows="rows" v-model:page="page"
 *            :page-size="20" :total="total" clickable @row-click="open">
 *     <template #cell-status="{ row }"><KBadge>{{ row.status }}</KBadge></template>
 *   </KTable>
 */
import { computed } from 'vue'
import KIcon from './KIcon.vue'
import KPagination from './KPagination.vue'

const props = defineProps({
  columns: { type: Array, required: true },
  rows: { type: Array, default: () => [] },
  rowKey: { type: [String, Function], default: 'id' },
  loading: { type: Boolean, default: false },
  emptyText: { type: String, default: 'Ничего не найдено' },
  clickable: { type: Boolean, default: false },
  dense: { type: Boolean, default: false },
  sortKey: { type: String, default: '' },
  sortDir: { type: String, default: 'asc' }, // asc | desc
  page: { type: Number, default: 1 },
  pageSize: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
})

const emit = defineEmits(['update:page', 'update:sortKey', 'update:sortDir', 'row-click'])

function keyOf(row, i) {
  return typeof props.rowKey === 'function' ? props.rowKey(row) : (row[props.rowKey] ?? i)
}

function toggleSort(col) {
  if (!col.sortable) return
  if (props.sortKey === col.key) {
    emit('update:sortDir', props.sortDir === 'asc' ? 'desc' : 'asc')
  } else {
    emit('update:sortKey', col.key)
    emit('update:sortDir', 'asc')
  }
}

const showPagination = computed(() => props.pageSize > 0 && props.total > props.pageSize)
</script>

<template>
  <div class="k-table" :class="{ 'k-table--dense': dense }">
    <div class="k-table__scroll">
      <table class="k-table__table">
        <thead>
          <tr>
            <th
              v-for="col in columns"
              :key="col.key"
              :style="{ width: col.width, textAlign: col.align || 'left' }"
              :class="{ 'k-table__th--sortable': col.sortable }"
              @click="toggleSort(col)"
            >
              <span class="k-table__th-inner">
                {{ col.label }}
                <KIcon
                  v-if="col.sortable"
                  :name="sortKey === col.key && sortDir === 'desc' ? 'chevron-down' : 'chevron-up'"
                  :size="13"
                  :class="['k-table__sort', { 'k-table__sort--active': sortKey === col.key }]"
                />
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td :colspan="columns.length" class="k-table__msg">
              <KIcon name="spinner" :size="18" spin /> Загрузка…
            </td>
          </tr>
          <tr v-else-if="!rows.length">
            <td :colspan="columns.length" class="k-table__msg">
              <slot name="empty">{{ emptyText }}</slot>
            </td>
          </tr>
          <tr
            v-for="(row, i) in rows"
            v-else
            :key="keyOf(row, i)"
            :class="{ 'k-table__row--clickable': clickable }"
            @click="clickable && emit('row-click', row)"
          >
            <td
              v-for="col in columns"
              :key="col.key"
              :style="{ textAlign: col.align || 'left', whiteSpace: col.nowrap ? 'nowrap' : null }"
            >
              <div v-if="col.actions" class="k-table__actions" @click.stop>
                <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]" :index="i" />
              </div>
              <slot v-else :name="`cell-${col.key}`" :row="row" :value="row[col.key]" :index="i">
                {{ row[col.key] }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <KPagination
      v-if="showPagination"
      :page="page"
      :page-size="pageSize"
      :total="total"
      @update:page="emit('update:page', $event)"
    />
  </div>
</template>

<style scoped>
.k-table__scroll { overflow-x: auto; }
.k-table__table { width: 100%; border-collapse: collapse; font-size: 0.9375rem; }
.k-table__table th,
.k-table__table td {
  padding: 0.7rem 0.875rem;
  text-align: left;
  border-bottom: 1px solid var(--k-border);
  vertical-align: middle;
}
.k-table--dense .k-table__table th,
.k-table--dense .k-table__table td { padding: 0.45rem 0.75rem; font-size: 0.875rem; }
.k-table__table th {
  position: sticky;
  top: 0;
  background: var(--k-surface-muted);
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--k-text-muted);
  white-space: nowrap;
}
.k-table__th-inner { display: inline-flex; align-items: center; gap: 0.25rem; }
.k-table__th--sortable { cursor: pointer; user-select: none; }
.k-table__th--sortable:hover { color: var(--k-text); }
.k-table__sort { opacity: 0.35; }
.k-table__sort--active { opacity: 1; color: var(--k-primary); }
.k-table__table tbody tr:last-child td { border-bottom: none; }
.k-table__actions { display: inline-flex; align-items: center; gap: var(--k-gap); }
.k-table__row--clickable { cursor: pointer; }
.k-table__row--clickable:hover { background: var(--k-primary-soft); }
.k-table__msg {
  text-align: center;
  color: var(--k-text-muted);
  padding: 2rem;
}
</style>
