<script setup>
/**
 * Витрина @krometra/ui-kit: все компоненты на одной странице плюс живой конструктор
 * темы. Служит документацией и площадкой для визуальной проверки: меняя тему
 * сверху, сразу видно, как кит выглядит в другом фирменном стиле.
 */
import { computed, ref, watch } from 'vue'
import {
  applyTheme, themes, themeToCss, iconNames,
  densities, elevations, fontStacks, neutrals, radiusScales,
  useToast, formatBytes,
} from '../src/index.js'

const toast = useToast()

// --- конструктор темы ---
const theme = ref({
  preset: 'default',
  scheme: 'light',
  neutral: '',
  radius: 'default',
  density: 'default',
  elevation: 'default',
  font: 'system',
  accent: '',
})

const themeSpec = computed(() => {
  const t = { ...theme.value }
  if (!t.neutral) delete t.neutral
  if (!t.accent) delete t.accent
  return t
})

let restoreTheme = () => {}
watch(
  themeSpec,
  (spec) => {
    restoreTheme()
    restoreTheme = applyTheme(spec)
  },
  { immediate: true, deep: true },
)

const cssPreview = computed(() => themeToCss(themeSpec.value))

function copyCss() {
  navigator.clipboard?.writeText(cssPreview.value)
  toast.success('CSS темы скопирован', 'Вставьте в глобальные стили проекта')
}

// --- демо-состояние компонентов ---
const query = ref('')
const email = ref('anna@example.com')
const amount = ref('12 900')
const city = ref('')
const status = ref('active')
const comment = ref('')
const agree = ref(true)
const notify = ref(true)
const plan = ref('team')
const files = ref([new File(['demo'], 'Отчёт за квартал.pdf', { type: 'application/pdf' })])
const owner = ref(null)
const people = [
  { id: 1, name: 'Анна Ковалёва' },
  { id: 2, name: 'Дмитрий Орлов' },
  { id: 3, name: 'Мария Титова' },
  { id: 4, name: 'Сергей Белов' },
]
const schemeOptions = [
  { value: 'light', label: 'Светлая' },
  { value: 'dark', label: 'Тёмная' },
  { value: 'system', label: 'Как в системе' },
]

function toggleScheme() {
  theme.value.scheme = theme.value.scheme === 'dark' ? 'light' : 'dark'
}
const tab = ref('all')
const hintedTab = ref('profile')
const view = ref('table')
const chipNorm = ref(true)
const chipVariant = ref(false)
const chipFound = ref(['отёк'])
const chipOpen = ref(false)
const chipTeeth = ref('')
const page = ref(1)
const standalonePage = ref(3)
const sortKey = ref('amount')
const sortDir = ref('desc')
const modal = ref(false)
const drawer = ref(false)
const ganttSelected = ref(null)
const step = ref(1)

const deadline = new Date(Date.now() + 3 * 3600 * 1000 + 12 * 60 * 1000)
const soon = new Date(Date.now() + 47 * 1000)

const columns = [
  { key: 'id', label: 'ID', width: '6rem', nowrap: true },
  { key: 'name', label: 'Название' },
  { key: 'owner', label: 'Ответственный', width: '13rem' },
  { key: 'amount', label: 'Сумма', width: '9rem', align: 'right', sortable: true },
  { key: 'status', label: 'Статус', width: '9rem' },
  { key: 'actions', label: '', width: '4rem', actions: true },
]

const rows = [
  { id: 'PR-1042', name: 'Обновление платёжного шлюза', owner: 'Анна Ковалёва', amount: 485000, status: 'В работе', tone: 'primary' },
  { id: 'PR-1039', name: 'Миграция аналитики в ClickHouse', owner: 'Дмитрий Орлов', amount: 124000, status: 'На проверке', tone: 'warning' },
  { id: 'PR-1035', name: 'Редизайн личного кабинета', owner: 'Мария Титова', amount: 78000, status: 'Готово', tone: 'success' },
  { id: 'PR-1031', name: 'Аудит доступов', owner: 'Сергей Белов', amount: 14500, status: 'Отменено', tone: 'neutral' },
]

const events = [
  { time: '14:32', title: 'Задача переведена в «Готово»', text: 'Мария Титова', tone: 'success', icon: 'check' },
  { time: '14:29', title: 'Добавлен комментарий', text: '«Проверил на стенде, замечаний нет»', tone: 'primary', icon: 'message' },
  { time: '13:48', title: 'Загружен файл', text: 'Отчёт за квартал.pdf', tone: 'neutral', icon: 'attach' },
  { time: '11:05', title: 'Задача создана', text: 'Дмитрий Орлов', tone: 'warning', icon: 'add' },
]

const ganttDay = (n) => {
  const d = new Date(Date.now() + n * 86400000)
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10)
}
const ganttGroups = [
  { key: 'anna', label: 'Анна Ковалёва' },
  { key: 'sergey', label: 'Сергей Белов' },
  { key: 'maria', label: 'Мария Титова' },
]
const ganttItems = [
  { key: 'PR-1042', code: 'PR-1042', label: 'Платёжный шлюз', group: 'anna', start: ganttDay(-6), end: ganttDay(-2), tone: 'success', muted: true, hint: 'Готово' },
  { key: 'PR-1048', code: 'PR-1048', label: 'Миграция токенов', group: 'anna', start: ganttDay(-1), end: ganttDay(4), hint: 'В работе' },
  { key: 'PR-1051', code: 'PR-1051', label: 'Отчёт для бухгалтерии', group: 'anna', start: ganttDay(6), end: ganttDay(9), tone: 'neutral', hint: 'Запланировано' },
  { key: 'PR-1039', code: 'PR-1039', label: 'Интеграция с CRM', group: 'sergey', segments: [{ start: ganttDay(-4), end: ganttDay(-2) }, { start: ganttDay(1), end: ganttDay(3) }], tone: 'warning', hint: 'Ждёт ответа партнёра' },
  { key: 'PR-1044', code: 'PR-1044', label: 'Аудит доступов', group: 'sergey', start: ganttDay(4), end: ganttDay(12), tone: 'info' },
  { key: 'PR-1035', code: 'PR-1035', label: 'Редизайн личного кабинета', group: 'maria', start: ganttDay(-10), end: ganttDay(2), tone: 'danger', hint: 'Срок сорван на 2 дня' },
  { key: 'PR-1050', code: 'PR-1050', label: 'Онбординг', group: 'maria', start: ganttDay(3), end: ganttDay(7) },
]

const nav = [
  { items: [
    { label: 'Обзор', to: '/', icon: 'dashboard' },
    { label: 'Проекты', to: '/projects', icon: 'folder', badge: 12 },
    { label: 'Задачи', to: '/tasks', icon: 'checklist' },
  ] },
  { section: 'Настройки', items: [
    { label: 'Команда', to: '/team', icon: 'users' },
    { label: 'Оплата', to: '/billing', icon: 'wallet' },
  ] },
]

const activeFilters = computed(() => {
  const out = []
  if (status.value) out.push({ key: 'status', label: `Статус: ${status.value === 'active' ? 'активные' : 'архив'}` })
  if (city.value) out.push({ key: 'city', label: `Город: ${city.value}` })
  return out
})

function removeFilter(chip) {
  if (chip.key === 'status') status.value = ''
  if (chip.key === 'city') city.value = ''
}

function resetFilters() {
  status.value = ''
  city.value = ''
}

const optionsOf = (obj) => Object.keys(obj).map((k) => ({ value: k, label: k }))
</script>

<template>
  <div class="showcase">
    <header class="showcase__hero">
      <div class="showcase__hero-inner">
        <div class="showcase__brand">
          <span class="showcase__logo"><KIcon name="zap" :size="20" /></span>
          <div>
            <h1>@krometra/ui-kit</h1>
            <p>UI-kit на Vue 3 со сменными темами, светлой и тёмной схемой</p>
          </div>
        </div>
        <div class="showcase__hero-actions">
          <KButton variant="secondary" :icon="theme.scheme === 'dark' ? 'sun' : 'moon'" title="Переключить схему" @click="toggleScheme" />
          <KButton variant="secondary" icon="external">GitHub</KButton>
          <KButton variant="primary" icon="download">yarn add @krometra/ui-kit</KButton>
        </div>
      </div>
    </header>

    <main class="showcase__body">
      <!-- Конструктор темы -->
      <section class="showcase__section">
        <h2 class="showcase__title">Тема оформления</h2>
        <KCard
          title="Конструктор"
          subtitle="Один и тот же кит в разной стилистике — меняются только CSS-переменные"
        >
          <template #actions>
            <KButton variant="secondary" size="sm" icon="copy" @click="copyCss">Скопировать CSS</KButton>
          </template>

          <div class="showcase__presets">
            <button
              v-for="t in themes"
              :key="t.value"
              class="showcase__preset"
              :class="{ 'showcase__preset--active': theme.preset === t.value && !theme.accent }"
              @click="theme.preset = t.value; theme.accent = ''"
            >
              <span class="showcase__preset-dot" :style="{ background: t.accent }" />
              {{ t.label }}
            </button>
          </div>

          <div class="showcase__theme-grid">
            <KSelect v-model="theme.scheme" label="Схема" :options="schemeOptions" />
            <KSelect v-model="theme.neutral" label="Нейтрали" placeholder="из пресета" :options="optionsOf(neutrals)" clearable />
            <KSelect v-model="theme.radius" label="Скругления" :options="optionsOf(radiusScales)" />
            <KSelect v-model="theme.density" label="Плотность" :options="optionsOf(densities)" />
            <KSelect v-model="theme.elevation" label="Тени" :options="optionsOf(elevations)" />
            <KSelect v-model="theme.font" label="Шрифт" :options="optionsOf(fontStacks)" />
            <KInput v-model="theme.accent" label="Свой акцент" placeholder="#7c3aed" hint="перекрывает пресет" />
          </div>

          <pre class="showcase__css">{{ cssPreview }}</pre>
        </KCard>
      </section>

      <!-- Кнопки -->
      <section class="showcase__section">
        <h2 class="showcase__title">Кнопки</h2>
        <KCard>
          <div class="showcase__row">
            <KButton variant="primary">Сохранить</KButton>
            <KButton variant="secondary">Отмена</KButton>
            <KButton variant="ghost">Пропустить</KButton>
            <KButton variant="success" icon="check">Подтвердить</KButton>
            <KButton variant="danger" icon="delete">Удалить</KButton>
            <KButton variant="link">Подробнее</KButton>
          </div>
          <div class="showcase__row showcase__row--mt">
            <KButton variant="primary" size="lg" icon="add">Создать проект</KButton>
            <KButton variant="primary" icon="send">Отправить</KButton>
            <KButton variant="secondary" size="sm" icon="download">Выгрузить</KButton>
            <KButton variant="primary" loading>Сохранение…</KButton>
            <KButton variant="secondary" icon="more" />
            <KButton variant="primary" disabled>Недоступно</KButton>
          </div>
        </KCard>
      </section>

      <!-- Формы -->
      <section class="showcase__section">
        <h2 class="showcase__title">Поля ввода</h2>
        <div class="showcase__grid showcase__grid--2">
          <KCard title="Основные контролы">
            <div class="showcase__stack">
              <KInput v-model="query" label="Поиск" placeholder="Название или ID" prefix-icon="search" />
              <KInput v-model="email" label="Электронная почта" type="email" required hint="Используется для уведомлений" />
              <KInput v-model="amount" label="Бюджет" suffix="₽" error="Превышает лимит тарифа" />
              <KSelect
                v-model="city"
                label="Город"
                placeholder="Любой"
                :options="['Москва', 'Санкт-Петербург', 'Новосибирск', 'Казань']"
              />
              <KCombobox v-model="owner" label="Ответственный" :options="people" :get-value="(p) => p.id" :get-label="(p) => p.name" placeholder="Поиск по имени" />
              <KTextarea v-model="comment" label="Комментарий" placeholder="Необязательно" :rows="3" />
            </div>
          </KCard>
          <KCard title="Выбор и переключатели">
            <div class="showcase__stack">
              <KRadioGroup
                v-model="plan"
                label="Тарифный план"
                :options="[
                  { value: 'solo', label: 'Личный', hint: 'один пользователь' },
                  { value: 'team', label: 'Командный', hint: 'до 20 участников' },
                  { value: 'org', label: 'Организация', hint: 'без ограничений' },
                ]"
              />
              <KCheckbox v-model="agree" label="Принимаю условия использования" hint="Можно отозвать в настройках" />
              <KSwitch v-model="notify" label="Уведомления по почте" hint="Сводка раз в сутки" />
              <KSegmented
                v-model="view"
                :options="[
                  { value: 'table', icon: 'checklist', label: 'Таблица' },
                  { value: 'cards', icon: 'dashboard', label: 'Карточки' },
                ]"
              />
              <KFileUpload v-model="files" />
            </div>
            <div class="showcase__row showcase__row--mt">
              <KChip v-model:pressed="chipNorm" tone="success">норма</KChip>
              <KChip v-model:pressed="chipVariant" tone="info" dashed>вариант нормы</KChip>
              <KChip
                v-for="f in ['отёк', 'гиперемия']"
                :key="f"
                tone="danger"
                :pressed="chipFound.includes(f)"
                @update:pressed="(on) => (chipFound = on ? [...chipFound, f] : chipFound.filter((x) => x !== f))"
              >
                {{ f }}
              </KChip>
              <KChip soft :expanded="chipOpen" :marked="chipFound.length > 0" @click="chipOpen = !chipOpen">Шкала</KChip>
              <KChip size="sm" icon="filter">Фильтр</KChip>
              <KInput v-model="chipTeeth" size="sm" inline label="зубы:" placeholder="1.6, 2.6" style="width: 13rem" />
              <KInput model-value="4" size="sm" inline label="размер до" suffix="мм" style="width: 11rem" />
            </div>
          </KCard>
        </div>
      </section>

      <!-- Метрики и статусы -->
      <section class="showcase__section">
        <h2 class="showcase__title">Метрики и статусы</h2>
        <div class="showcase__grid showcase__grid--4">
          <KStat label="Выручка за месяц" value="284,6 млн ₽" icon="finance" tone="primary" :trend="12.4" hint="к августу" />
          <KStat label="Активных пользователей" value="8 412" icon="users" tone="success" :trend="8.1" hint="за 30 дней" />
          <KStat label="Открытых задач" value="37" icon="checklist" tone="warning" hint="из них 4 просрочены" />
          <KStat label="Время отклика" value="184 мс" icon="activity" tone="danger" :trend="-25" invert hint="p95" />
        </div>
        <KCard class="showcase__mt">
          <div class="showcase__row">
            <KBadge tone="primary" dot>В работе</KBadge>
            <KBadge tone="warning" dot>На проверке</KBadge>
            <KBadge tone="info">Запланировано</KBadge>
            <KBadge tone="success" icon="check-badge">Готово</KBadge>
            <KBadge tone="danger" icon="reject">Отклонено</KBadge>
            <KBadge tone="neutral">Черновик</KBadge>
            <KBadge tone="success" size="sm">Оплачено</KBadge>
          </div>
          <div class="showcase__row showcase__row--mt">
            <KMoney :value="4850000" size="lg" />
            <KMoney :value="128400" tone="success" />
            <KMoney :value="42200" :fraction="true" tone="muted" />
            <KMoney :value="284600000" compact />
            <KCountdown :to="deadline" size="lg" />
            <KCountdown :to="soon" />
          </div>
          <div class="showcase__stack showcase__row--mt">
            <KProgress label="Заполненность профиля" :value="72" show-value />
            <KProgress label="Синхронизация данных" :value="100" tone="success" show-value />
            <KProgress label="Использовано места" :value="18" tone="warning" show-value />
          </div>
        </KCard>
      </section>

      <!-- Оповещения -->
      <section class="showcase__section">
        <h2 class="showcase__title">Оповещения</h2>
        <div class="showcase__stack">
          <KAlert tone="info" title="Двухфакторная аутентификация">
            Включите второй фактор, чтобы защитить аккаунт от входа по украденному паролю.
          </KAlert>
          <KAlert tone="success" title="Изменения сохранены">
            Новые настройки применятся ко всем участникам команды в течение минуты.
          </KAlert>
          <KAlert tone="warning" title="Тариф истекает через 3 дня" />
          <KAlert tone="danger" title="Не удалось подключиться к хранилищу" closable>
            Проверьте параметры доступа и повторите попытку.
          </KAlert>
        </div>
      </section>

      <!-- Поиск, фильтры и таблица -->
      <section class="showcase__section">
        <h2 class="showcase__title">Поиск, фильтры и таблица</h2>
        <KFilterBar :active="activeFilters" @remove="removeFilter" @reset="resetFilters">
          <template #search>
            <KInput v-model="query" placeholder="Поиск по названию, ID или ответственному" prefix-icon="search" />
          </template>
          <KSelect
            v-model="status"
            label="Статус"
            placeholder="Все"
            :options="[
              { value: 'active', label: 'Активные' },
              { value: 'archived', label: 'Архив' },
            ]"
          />
          <KSelect v-model="city" label="Город" placeholder="Все" :options="['Москва', 'Санкт-Петербург', 'Казань']" />
          <template #actions>
            <KButton variant="secondary" icon="sliders">Ещё фильтры</KButton>
            <KButton variant="primary" icon="add">Создать</KButton>
          </template>
        </KFilterBar>

        <KCard padding="none" class="showcase__mt">
          <template #header>
            <KTabs
              v-model="tab"
              :items="[
                { value: 'all', label: 'Все', count: 128 },
                { value: 'mine', label: 'Мои', count: 6 },
                { value: 'done', label: 'Завершённые', count: 42 },
                { value: 'draft', label: 'Черновики', count: 1 },
              ]"
              variant="pill"
            />
          </template>
          <KTable
            :columns="columns"
            :rows="rows"
            v-model:page="page"
            v-model:sort-key="sortKey"
            v-model:sort-dir="sortDir"
            :page-size="4"
            :total="128"
            clickable
          >
            <template #cell-name="{ row }"><span class="showcase__cell-name">{{ row.name }}</span></template>
            <template #cell-owner="{ row }">
              <span class="showcase__owner"><KAvatar :name="row.owner" size="sm" />{{ row.owner }}</span>
            </template>
            <template #cell-amount="{ row }"><KMoney :value="row.amount" /></template>
            <template #cell-status="{ row }"><KBadge :tone="row.tone" dot>{{ row.status }}</KBadge></template>
            <template #cell-actions>
              <KDropdown>
                <template #trigger="{ props }"><KButton v-bind="props" variant="ghost" size="sm" icon="more" /></template>
                <KMenuItem icon="eye">Открыть</KMenuItem>
                <KMenuItem icon="edit">Редактировать</KMenuItem>
                <KMenuItem icon="copy">Дублировать</KMenuItem>
                <KMenuItem icon="delete" danger>Удалить</KMenuItem>
              </KDropdown>
            </template>
          </KTable>
        </KCard>
      </section>

      <!-- Процессы -->
      <section class="showcase__section">
        <h2 class="showcase__title">Процессы</h2>
        <div class="showcase__grid showcase__grid--2">
          <KCard title="Мастер настройки">
            <KSteps
              :items="[
                { label: 'Аккаунт', hint: 'почта и пароль' },
                { label: 'Организация', hint: 'название, домен' },
                { label: 'Команда' },
                { label: 'Интеграции' },
                { label: 'Готово' },
              ]"
              :current="step"
              clickable
              @select="step = $event"
            />
            <div class="showcase__row showcase__row--mt">
              <KButton variant="secondary" icon="back" @click="step = Math.max(0, step - 1)">Назад</KButton>
              <KButton variant="primary" icon-end="forward" @click="step = Math.min(4, step + 1)">Далее</KButton>
            </div>
          </KCard>

          <KCard title="История изменений" subtitle="Задача PR-1042">
            <template #actions><KCountdown :to="soon" /></template>
            <KTimeline :items="events" />
          </KCard>

          <KCard title="Карточка сущности">
            <template #actions><KBadge tone="success" icon="check-badge">Активна</KBadge></template>
            <KDescriptions
              :items="[
                { key: 'name', label: 'Название', value: 'Обновление платёжного шлюза', wide: true },
                { key: 'id', label: 'Идентификатор', value: 'PR-1042' },
                { key: 'owner', label: 'Ответственный', value: 'Анна Ковалёва' },
                { key: 'created', label: 'Создано', value: '12.08.2026' },
                { key: 'size', label: 'Вложения', value: formatBytes(482301) },
                { key: 'desc', label: 'Описание', value: 'Перевод оплаты на новый провайдер, миграция токенов.', wide: true },
              ]"
            />
          </KCard>

          <KCard title="Пагинация" subtitle="Работает и отдельно от таблицы" padding="none">
            <KPagination
              v-model:page="standalonePage"
              :page-size="20"
              :total="640"
            />
          </KCard>

          <KCard title="Пустое состояние" padding="none">
            <KEmpty
              icon="search"
              title="Ничего не найдено"
              description="Попробуйте изменить запрос или убрать часть фильтров."
            >
              <KButton variant="secondary" icon="refresh" @click="resetFilters">Сбросить фильтры</KButton>
            </KEmpty>
          </KCard>
        </div>
      </section>

      <!-- Ганта -->
      <section class="showcase__section">
        <h2 class="showcase__title">Диаграмма Ганта</h2>
        <KGantt
          :items="ganttItems"
          :groups="ganttGroups"
          :from="ganttDay(-7)"
          :to="ganttDay(14)"
          :selected="ganttSelected"
          @item-click="ganttSelected = $event.key; drawer = true"
        >
          <template #corner>Задача</template>
          <template #group="{ group }"><KAvatar :name="group.label" size="sm" />{{ group.label }}</template>
        </KGantt>
      </section>

      <!-- Каркас -->
      <section class="showcase__section">
        <h2 class="showcase__title">Каркас приложения</h2>
        <div class="showcase__shell-frame">
          <KShell :nav="nav">
            <template #logo>
              <span class="showcase__logo showcase__logo--sm"><KIcon name="zap" :size="15" /></span>
              Продукт
            </template>
            <template #header-left>
              <KBadge tone="primary" icon="organization">ООО «Пример»</KBadge>
            </template>
            <template #header-actions>
              <KButton variant="ghost" icon="bell" />
              <KDropdown>
                <template #trigger="{ props }">
                  <KButton v-bind="props" variant="ghost" size="sm"><KAvatar name="Анна Ковалёва" size="sm" /></KButton>
                </template>
                <KMenuItem icon="user">Профиль</KMenuItem>
                <KMenuItem icon="settings">Настройки</KMenuItem>
                <KMenuItem icon="logout" danger>Выйти</KMenuItem>
              </KDropdown>
            </template>
            <KPage title="Обзор" subtitle="Сводка по вашим проектам">
              <template #actions><KButton variant="primary" icon="add">Создать</KButton></template>
              <div class="showcase__grid showcase__grid--3">
                <KStat label="Проектов" value="12" icon="folder" tone="primary" />
                <KStat label="Завершено" value="42" icon="check-badge" tone="success" />
                <KStat label="Баланс" value="128 400 ₽" icon="wallet" />
              </div>
            </KPage>
          </KShell>
        </div>
      </section>

      <!-- Вкладки -->
      <section class="showcase__section">
        <h2 class="showcase__title">Вкладки с пояснением</h2>
        <KTabs
          v-model="hintedTab"
          :items="[
            { value: 'profile', label: 'Профиль', hint: 'Заполняет сотрудник', icon: 'user' },
            { value: 'access', label: 'Доступы', hint: 'Выдаёт администратор', count: 3 },
            { value: 'history', label: 'История', hint: 'Ведётся автоматически' },
          ]"
        />
      </section>

      <!-- Прочее -->
      <section class="showcase__section">
        <h2 class="showcase__title">Вспомогательное</h2>
        <KCard title="Модальное окно, подсказки и уведомления">
          <div class="showcase__row">
            <KButton variant="primary" @click="modal = true">Открыть модалку</KButton>
            <KButton variant="secondary" icon="forward" @click="drawer = true">Боковая панель</KButton>
            <KButton variant="secondary" @click="toast.success('Сохранено', 'Изменения применены')">Успех</KButton>
            <KButton variant="secondary" @click="toast.warning('Требуется внимание', 'Тариф истекает через 3 дня')">Внимание</KButton>
            <KButton variant="secondary" @click="toast.error('Ошибка', 'Не удалось связаться с сервером')">Ошибка</KButton>
            <KButton variant="secondary" @click="toast.loading('Загрузка', 'Закройте крестиком')">Загрузка</KButton>
          </div>
          <div class="showcase__row showcase__row--mt">
            <KTooltip text="Подсказка появляется по наведению и по фокусу с клавиатуры">
              <KBadge tone="info" icon="info">Наведите на меня</KBadge>
            </KTooltip>
            <KAvatar name="Анна Ковалёва" />
            <KAvatar name="ООО Пример" square />
            <KAvatar icon="organization" size="lg" name="Компания" />
          </div>
        </KCard>
      </section>

      <!-- Иконки -->
      <section class="showcase__section">
        <h2 class="showcase__title">Иконки <span class="showcase__count">{{ iconNames.length }}</span></h2>
        <KCard>
          <div class="showcase__icons">
            <div v-for="name in iconNames" :key="name" class="showcase__icon">
              <KIcon :name="name" :size="19" />
              <span>{{ name }}</span>
            </div>
          </div>
        </KCard>
      </section>
    </main>

    <KModal v-model="modal" title="Подтверждение действия" subtitle="Задача PR-1042" size="md">
      <div class="showcase__stack">
        <KAlert tone="info">Действие затронет всех участников проекта.</KAlert>
        <KDescriptions
          :columns="1"
          :items="[
            { key: 'who', label: 'Инициатор', value: 'Анна Ковалёва' },
            { key: 'what', label: 'Действие', value: 'Перевод в статус «Готово»' },
            { key: 'when', label: 'Дата', value: '06.09.2026' },
          ]"
        />
        <KCheckbox :model-value="true" label="Уведомить участников по почте" />
      </div>
      <template #footer>
        <KButton variant="ghost" @click="modal = false">Отмена</KButton>
        <KButton variant="primary" icon="check" @click="modal = false; toast.success('Действие выполнено')">
          Подтвердить
        </KButton>
      </template>
    </KModal>

    <KDrawer
      v-model="drawer"
      :modal="false"
      :title="ganttItems.find(i => i.key === ganttSelected)?.code || 'PR-1042'"
      :subtitle="ganttItems.find(i => i.key === ganttSelected)?.label || 'Платёжный шлюз'"
      @close="ganttSelected = null"
    >
      <template #actions><KButton variant="ghost" size="sm" icon="external" title="Открыть" /></template>
      <div class="showcase__stack">
        <KAlert tone="info">Без затемнения: можно кликать по диаграмме, панель сменит задачу.</KAlert>
        <KDescriptions
          :columns="1"
          :items="[
            { key: 'who', label: 'Исполнитель', value: 'Анна Ковалёва' },
            { key: 'status', label: 'Статус', value: 'В работе' },
            { key: 'dates', label: 'Сроки', value: '20.10 - 24.10' },
          ]"
        />
      </div>
      <template #footer>
        <KButton variant="ghost" @click="drawer = false">Закрыть</KButton>
      </template>
    </KDrawer>

    <KToast />
  </div>
</template>

<style scoped>
.showcase { min-height: 100vh; }
.showcase__hero {
  background: linear-gradient(180deg, var(--k-surface) 0%, var(--k-bg) 100%);
  border-bottom: 1px solid var(--k-border);
}
.showcase__hero-inner {
  max-width: 1160px;
  margin: 0 auto;
  padding: 2.25rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  flex-wrap: wrap;
}
.showcase__brand { display: flex; align-items: center; gap: 0.875rem; }
.showcase__brand h1 { font-size: 1.5rem; }
.showcase__brand p { margin-top: 0.2rem; color: var(--k-text-muted); font-size: 0.9375rem; }
.showcase__logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: var(--k-radius);
  background: var(--k-primary);
  color: var(--k-on-primary);
  box-shadow: var(--k-shadow-md);
}
.showcase__logo--sm { width: 1.75rem; height: 1.75rem; border-radius: var(--k-radius-sm); box-shadow: none; }
.showcase__hero-actions { display: flex; gap: 0.5rem; }

.showcase__body { max-width: 1160px; margin: 0 auto; padding: 2rem 1.5rem 4rem; }
.showcase__section + .showcase__section { margin-top: 2.5rem; }
.showcase__title {
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--k-text-faint);
  margin-bottom: 0.75rem;
}
.showcase__count { color: var(--k-text-muted); }
.showcase__row { display: flex; align-items: center; gap: 0.625rem; flex-wrap: wrap; }
.showcase__row--mt, .showcase__mt { margin-top: 1rem; }
.showcase__stack { display: flex; flex-direction: column; gap: 0.875rem; }
.showcase__grid { display: grid; gap: 1rem; }
.showcase__grid--2 { grid-template-columns: repeat(auto-fit, minmax(22rem, 1fr)); }
.showcase__grid--3 { grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr)); }
.showcase__grid--4 { grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr)); }
.showcase__cell-name { font-weight: 500; }
.showcase__owner { display: inline-flex; align-items: center; gap: 0.45rem; }

.showcase__presets { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1rem; }
.showcase__preset {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.7rem;
  background: var(--k-surface);
  border: 1px solid var(--k-border-strong);
  border-radius: 999px;
  font: inherit;
  font-size: 0.8125rem;
  color: var(--k-text-muted);
  cursor: pointer;
}
.showcase__preset:hover { color: var(--k-text); }
.showcase__preset--active { border-color: var(--k-primary); color: var(--k-primary); font-weight: 600; }
.showcase__preset-dot { width: 0.7rem; height: 0.7rem; border-radius: 50%; }
.showcase__theme-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr)); gap: 0.75rem; }
.showcase__css {
  margin: 1rem 0 0;
  padding: 0.875rem;
  background: var(--k-surface-muted);
  border: 1px solid var(--k-border);
  border-radius: var(--k-radius-sm);
  font-family: var(--k-font-mono);
  font-size: 0.75rem;
  line-height: 1.55;
  color: var(--k-text-muted);
  overflow-x: auto;
}

.showcase__shell-frame {
  border: 1px solid var(--k-border);
  border-radius: var(--k-radius);
  overflow: hidden;
  box-shadow: var(--k-shadow-sm);
  height: 26rem;
}
.showcase__shell-frame :deep(.k-shell) { min-height: 100%; height: 100%; }
.showcase__shell-frame :deep(.k-shell__sidebar) { height: 100%; position: static; }
.showcase__shell-frame :deep(.k-shell__header) { position: static; }
.showcase__icons { display: grid; grid-template-columns: repeat(auto-fill, minmax(8rem, 1fr)); gap: 0.5rem; }
.showcase__icon {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.55rem;
  border-radius: var(--k-radius-sm);
  font-size: 0.75rem;
  color: var(--k-text-muted);
}
.showcase__icon:hover { background: var(--k-surface-muted); color: var(--k-text); }
</style>
