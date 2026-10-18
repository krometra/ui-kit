<script setup>
/**
 * KShell — каркас приложения: светлый боковой навигатор + верхняя шапка.
 *
 * Сайдбар намеренно светлый: в интерфейсах с плотными таблицами тёмная колонка
 * перетягивает внимание с данных. Цвета берутся из темы, поэтому под конкретный
 * проект каркас перекрашивается без правок разметки.
 *
 *   nav: [{ section?, items: [{ label, to, icon?, badge? }] }]
 *
 * Слоты: #logo, #header-actions, #user, по умолчанию — контент страницы.
 */
import { ref } from 'vue'
import KIcon from './KIcon.vue'

defineProps({
  nav: { type: Array, default: () => [] },
  title: { type: String, default: '' },
})

const open = ref(false)
</script>

<template>
  <div class="k-shell" :class="{ 'k-shell--nav-open': open }">
    <aside class="k-shell__sidebar">
      <div class="k-shell__logo">
        <slot name="logo">{{ title }}</slot>
      </div>
      <nav class="k-shell__nav">
        <template v-for="(group, gi) in nav" :key="gi">
          <p v-if="group.section" class="k-shell__section">{{ group.section }}</p>
          <router-link
            v-for="item in group.items"
            :key="item.to"
            :to="item.to"
            class="k-shell__link"
            @click="open = false"
          >
            <KIcon v-if="item.icon" :name="item.icon" :size="17" class="k-shell__link-icon" />
            <span class="k-shell__link-label">{{ item.label }}</span>
            <span v-if="item.badge" class="k-shell__badge">{{ item.badge }}</span>
          </router-link>
        </template>
      </nav>
      <div v-if="$slots.sidebarFooter" class="k-shell__sidebar-footer">
        <slot name="sidebarFooter" />
      </div>
    </aside>

    <div class="k-shell__main">
      <header class="k-shell__header">
        <button class="k-shell__burger" aria-label="Меню" @click="open = !open">
          <KIcon :name="open ? 'close' : 'menu'" :size="20" />
        </button>
        <div class="k-shell__header-left"><slot name="header-left" /></div>
        <div class="k-shell__header-actions">
          <slot name="header-actions" />
          <slot name="user" />
        </div>
      </header>
      <main class="k-shell__content"><slot /></main>
    </div>

    <div class="k-shell__overlay" @click="open = false" />
  </div>
</template>

<style scoped>
.k-shell { display: flex; min-height: 100vh; background: var(--k-bg); }
.k-shell__sidebar {
  width: 15rem;
  flex: none;
  display: flex;
  flex-direction: column;
  background: var(--k-surface);
  border-right: 1px solid var(--k-border);
  position: sticky;
  top: 0;
  height: 100vh;
}
.k-shell__logo {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  height: 3.75rem;
  padding: 0 1.125rem;
  border-bottom: 1px solid var(--k-border);
  font-size: 1.0625rem;
  font-weight: 650;
  letter-spacing: -0.01em;
}
.k-shell__nav { flex: 1; overflow-y: auto; padding: 0.75rem 0.625rem; }
.k-shell__section {
  padding: 0.9rem 0.55rem 0.35rem;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--k-text-faint);
}
.k-shell__link {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 0.55rem;
  border-radius: var(--k-radius-sm);
  color: var(--k-text-muted);
  font-size: 0.9375rem;
  text-decoration: none;
  transition: background 0.12s, color 0.12s;
}
.k-shell__link:hover { background: var(--k-surface-muted); color: var(--k-text); text-decoration: none; }
.k-shell__link.router-link-active {
  background: var(--k-primary-soft);
  color: var(--k-primary);
  font-weight: 550;
}
.k-shell__link-icon { color: currentColor; }
.k-shell__link-label { flex: 1; min-width: 0; }
.k-shell__badge {
  padding: 0.05rem 0.35rem;
  border-radius: 999px;
  background: var(--k-danger);
  color: var(--k-on-danger);
  font-size: 0.6875rem;
  font-weight: 600;
}
.k-shell__sidebar-footer { padding: 0.75rem; border-top: 1px solid var(--k-border); }

.k-shell__main { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.k-shell__header {
  position: sticky;
  top: 0;
  z-index: 40;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  height: 3.75rem;
  padding: 0 1.25rem;
  background: color-mix(in srgb, var(--k-surface) 85%, transparent);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--k-border);
}
.k-shell__header-left { flex: 1; min-width: 0; display: flex; align-items: center; gap: 0.75rem; }
.k-shell__header-actions { display: flex; align-items: center; gap: 0.5rem; }
.k-shell__burger {
  display: none;
  background: none;
  border: none;
  color: var(--k-text-muted);
  cursor: pointer;
  padding: 0.25rem;
}
.k-shell__content { flex: 1; min-width: 0; }
.k-shell__overlay { display: none; }

@media (max-width: 900px) {
  .k-shell__sidebar {
    position: fixed;
    z-index: 70;
    transform: translateX(-100%);
    transition: transform 0.2s ease;
    box-shadow: var(--k-shadow-lg);
  }
  .k-shell--nav-open .k-shell__sidebar { transform: none; }
  .k-shell--nav-open .k-shell__overlay {
    display: block;
    position: fixed;
    inset: 0;
    z-index: 60;
    background: var(--k-overlay);
  }
  .k-shell__burger { display: inline-flex; }
}
</style>
