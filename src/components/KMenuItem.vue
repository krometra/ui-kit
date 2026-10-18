<script setup>
/**
 * KMenuItem — пункт меню внутри KDropdown. Рендерится как <router-link>,
 * если передан `to`, иначе как кнопка. Атрибут data-k-menu-item нужен
 * дропдауну, чтобы закрыться после выбора.
 */
import KIcon from './KIcon.vue'

defineProps({
  icon: { type: String, default: '' },
  to: { type: [String, Object], default: null },
  danger: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
})
</script>

<template>
  <component
    :is="to ? 'router-link' : 'button'"
    :to="to"
    :type="to ? null : 'button'"
    class="k-menu-item"
    :class="{ 'k-menu-item--danger': danger }"
    :disabled="to ? null : disabled"
    role="menuitem"
    data-k-menu-item
  >
    <KIcon v-if="icon" :name="icon" :size="15" />
    <span class="k-menu-item__label"><slot /></span>
  </component>
</template>

<style scoped>
.k-menu-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.45rem 0.55rem;
  background: none;
  border: none;
  border-radius: var(--k-radius-sm);
  font: inherit;
  font-size: 0.875rem;
  color: var(--k-text);
  text-align: left;
  text-decoration: none;
  cursor: pointer;
}
.k-menu-item:hover { background: var(--k-surface-muted); text-decoration: none; }
.k-menu-item:focus-visible { outline: 2px solid var(--k-primary); outline-offset: -2px; }
.k-menu-item:disabled { opacity: 0.5; cursor: not-allowed; }
.k-menu-item--danger { color: var(--k-danger-strong); }
.k-menu-item--danger:hover { background: var(--k-danger-soft); }
.k-menu-item__label { flex: 1; min-width: 0; }
</style>
