<script setup>
/**
 * KPage — стандартная обвязка экрана: хлебные крошки, заголовок, действия
 * справа и контент. Используйте как корень каждого маршрута, чтобы отступы и
 * расположение кнопок не разъезжались между страницами.
 */
import KIcon from './KIcon.vue'

defineProps({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  // [{ label, to? }] — последний элемент отрисуется как текущий, без ссылки
  breadcrumbs: { type: Array, default: () => [] },
  back: { type: [String, Object], default: null },
  width: { type: String, default: 'wide' }, // wide | narrow | full
})
</script>

<template>
  <div class="k-page" :class="`k-page--${width}`">
    <nav v-if="breadcrumbs.length" class="k-page__crumbs" aria-label="Хлебные крошки">
      <template v-for="(crumb, i) in breadcrumbs" :key="i">
        <component
          :is="crumb.to && i < breadcrumbs.length - 1 ? 'router-link' : 'span'"
          :to="crumb.to"
          class="k-page__crumb"
          :class="{ 'k-page__crumb--current': i === breadcrumbs.length - 1 }"
        >{{ crumb.label }}</component>
        <KIcon v-if="i < breadcrumbs.length - 1" name="chevron-right" :size="13" class="k-page__crumb-sep" />
      </template>
    </nav>

    <header class="k-page__header">
      <div class="k-page__heading">
        <router-link v-if="back" :to="back" class="k-page__back" aria-label="Назад">
          <KIcon name="back" :size="18" />
        </router-link>
        <div class="k-page__titles">
          <div class="k-page__title-row">
            <slot name="title"><h1>{{ title }}</h1></slot>
            <slot name="title-extra" />
          </div>
          <p v-if="subtitle" class="k-page__subtitle">{{ subtitle }}</p>
        </div>
      </div>
      <div v-if="$slots.actions" class="k-page__actions"><slot name="actions" /></div>
    </header>

    <slot />
  </div>
</template>

<style scoped>
.k-page { padding: 1.75rem 2rem 3rem; margin: 0 auto; width: 100%; }
.k-page--wide { max-width: 1360px; }
.k-page--narrow { max-width: 880px; }
.k-page__crumbs { display: flex; align-items: center; gap: 0.3rem; margin-bottom: 0.6rem; font-size: 0.8125rem; }
.k-page__crumb { color: var(--k-text-muted); text-decoration: none; }
.k-page__crumb:hover { color: var(--k-primary); }
.k-page__crumb--current { color: var(--k-text); }
.k-page__crumb-sep { color: var(--k-text-faint); }
.k-page__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.k-page__heading { display: flex; align-items: flex-start; gap: 0.625rem; min-width: 0; }
.k-page__back {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  margin-top: 0.15rem;
  border: 1px solid var(--k-border);
  border-radius: var(--k-radius-sm);
  background: var(--k-surface);
  color: var(--k-text-muted);
  flex: none;
}
.k-page__back:hover { background: var(--k-surface-muted); color: var(--k-text); }
.k-page__titles { min-width: 0; }
.k-page__title-row { display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap; }
.k-page__subtitle { margin-top: 0.25rem; font-size: 0.875rem; color: var(--k-text-muted); }
.k-page__actions { display: flex; align-items: center; gap: 0.5rem; flex: none; flex-wrap: wrap; justify-content: flex-end; }

@media (max-width: 720px) {
  .k-page { padding: 1.25rem 1rem 2.5rem; }
  .k-page__header { flex-direction: column; align-items: stretch; }
}
</style>
