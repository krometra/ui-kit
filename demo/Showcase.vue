<script setup>
/**
 * Витрина foxy-ui-kit: все компоненты на одной странице плюс живой конструктор
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
const page = ref(1)
const standalonePage = ref(3)
const sortKey = ref('amount')
const sortDir = ref('desc')
const modal = ref(false)
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
          <span class="showcase__logo"><FxIcon name="zap" :size="20" /></span>
          <div>
            <h1>foxy-ui-kit</h1>
            <p>UI-kit на Vue 3 со сменными темами, светлой и тёмной схемой</p>
          </div>
        </div>
        <div class="showcase__hero-actions">
          <FxButton variant="secondary" :icon="theme.scheme === 'dark' ? 'sun' : 'moon'" title="Переключить схему" @click="toggleScheme" />
          <FxButton variant="secondary" icon="external">GitHub</FxButton>
          <FxButton variant="primary" icon="download">yarn add foxy-ui-kit</FxButton>
        </div>
      </div>
    </header>

    <main class="showcase__body">
      <!-- Конструктор темы -->
      <section class="showcase__section">
        <h2 class="showcase__title">Тема оформления</h2>
        <FxCard
          title="Конструктор"
          subtitle="Один и тот же кит в разной стилистике — меняются только CSS-переменные"
        >
          <template #actions>
            <FxButton variant="secondary" size="sm" icon="copy" @click="copyCss">Скопировать CSS</FxButton>
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
            <FxSelect v-model="theme.scheme" label="Схема" :options="schemeOptions" />
            <FxSelect v-model="theme.neutral" label="Нейтрали" placeholder="из пресета" :options="optionsOf(neutrals)" clearable />
            <FxSelect v-model="theme.radius" label="Скругления" :options="optionsOf(radiusScales)" />
            <FxSelect v-model="theme.density" label="Плотность" :options="optionsOf(densities)" />
            <FxSelect v-model="theme.elevation" label="Тени" :options="optionsOf(elevations)" />
            <FxSelect v-model="theme.font" label="Шрифт" :options="optionsOf(fontStacks)" />
            <FxInput v-model="theme.accent" label="Свой акцент" placeholder="#7c3aed" hint="перекрывает пресет" />
          </div>

          <pre class="showcase__css">{{ cssPreview }}</pre>
        </FxCard>
      </section>

      <!-- Кнопки -->
      <section class="showcase__section">
        <h2 class="showcase__title">Кнопки</h2>
        <FxCard>
          <div class="showcase__row">
            <FxButton variant="primary">Сохранить</FxButton>
            <FxButton variant="secondary">Отмена</FxButton>
            <FxButton variant="ghost">Пропустить</FxButton>
            <FxButton variant="success" icon="check">Подтвердить</FxButton>
            <FxButton variant="danger" icon="delete">Удалить</FxButton>
            <FxButton variant="link">Подробнее</FxButton>
          </div>
          <div class="showcase__row showcase__row--mt">
            <FxButton variant="primary" size="lg" icon="add">Создать проект</FxButton>
            <FxButton variant="primary" icon="send">Отправить</FxButton>
            <FxButton variant="secondary" size="sm" icon="download">Выгрузить</FxButton>
            <FxButton variant="primary" loading>Сохранение…</FxButton>
            <FxButton variant="secondary" icon="more" />
            <FxButton variant="primary" disabled>Недоступно</FxButton>
          </div>
        </FxCard>
      </section>

      <!-- Формы -->
      <section class="showcase__section">
        <h2 class="showcase__title">Поля ввода</h2>
        <div class="showcase__grid showcase__grid--2">
          <FxCard title="Основные контролы">
            <div class="showcase__stack">
              <FxInput v-model="query" label="Поиск" placeholder="Название или ID" prefix-icon="search" />
              <FxInput v-model="email" label="Электронная почта" type="email" required hint="Используется для уведомлений" />
              <FxInput v-model="amount" label="Бюджет" suffix="₽" error="Превышает лимит тарифа" />
              <FxSelect
                v-model="city"
                label="Город"
                placeholder="Любой"
                :options="['Москва', 'Санкт-Петербург', 'Новосибирск', 'Казань']"
              />
              <FxCombobox v-model="owner" label="Ответственный" :options="people" :get-value="(p) => p.id" :get-label="(p) => p.name" placeholder="Поиск по имени" />
              <FxTextarea v-model="comment" label="Комментарий" placeholder="Необязательно" :rows="3" />
            </div>
          </FxCard>
          <FxCard title="Выбор и переключатели">
            <div class="showcase__stack">
              <FxRadioGroup
                v-model="plan"
                label="Тарифный план"
                :options="[
                  { value: 'solo', label: 'Личный', hint: 'один пользователь' },
                  { value: 'team', label: 'Командный', hint: 'до 20 участников' },
                  { value: 'org', label: 'Организация', hint: 'без ограничений' },
                ]"
              />
              <FxCheckbox v-model="agree" label="Принимаю условия использования" hint="Можно отозвать в настройках" />
              <FxSwitch v-model="notify" label="Уведомления по почте" hint="Сводка раз в сутки" />
              <FxSegmented
                v-model="view"
                :options="[
                  { value: 'table', icon: 'checklist', label: 'Таблица' },
                  { value: 'cards', icon: 'dashboard', label: 'Карточки' },
                ]"
              />
              <FxFileUpload v-model="files" />
            </div>
          </FxCard>
        </div>
      </section>

      <!-- Метрики и статусы -->
      <section class="showcase__section">
        <h2 class="showcase__title">Метрики и статусы</h2>
        <div class="showcase__grid showcase__grid--4">
          <FxStat label="Выручка за месяц" value="284,6 млн ₽" icon="finance" tone="primary" :trend="12.4" hint="к августу" />
          <FxStat label="Активных пользователей" value="8 412" icon="users" tone="success" :trend="8.1" hint="за 30 дней" />
          <FxStat label="Открытых задач" value="37" icon="checklist" tone="warning" hint="из них 4 просрочены" />
          <FxStat label="Время отклика" value="184 мс" icon="activity" tone="danger" :trend="-25" invert hint="p95" />
        </div>
        <FxCard class="showcase__mt">
          <div class="showcase__row">
            <FxBadge tone="primary" dot>В работе</FxBadge>
            <FxBadge tone="warning" dot>На проверке</FxBadge>
            <FxBadge tone="info">Запланировано</FxBadge>
            <FxBadge tone="success" icon="check-badge">Готово</FxBadge>
            <FxBadge tone="danger" icon="reject">Отклонено</FxBadge>
            <FxBadge tone="neutral">Черновик</FxBadge>
            <FxBadge tone="success" size="sm">Оплачено</FxBadge>
          </div>
          <div class="showcase__row showcase__row--mt">
            <FxMoney :value="4850000" size="lg" />
            <FxMoney :value="128400" tone="success" />
            <FxMoney :value="42200" :fraction="true" tone="muted" />
            <FxMoney :value="284600000" compact />
            <FxCountdown :to="deadline" size="lg" />
            <FxCountdown :to="soon" />
          </div>
          <div class="showcase__stack showcase__row--mt">
            <FxProgress label="Заполненность профиля" :value="72" show-value />
            <FxProgress label="Синхронизация данных" :value="100" tone="success" show-value />
            <FxProgress label="Использовано места" :value="18" tone="warning" show-value />
          </div>
        </FxCard>
      </section>

      <!-- Оповещения -->
      <section class="showcase__section">
        <h2 class="showcase__title">Оповещения</h2>
        <div class="showcase__stack">
          <FxAlert tone="info" title="Двухфакторная аутентификация">
            Включите второй фактор, чтобы защитить аккаунт от входа по украденному паролю.
          </FxAlert>
          <FxAlert tone="success" title="Изменения сохранены">
            Новые настройки применятся ко всем участникам команды в течение минуты.
          </FxAlert>
          <FxAlert tone="warning" title="Тариф истекает через 3 дня" />
          <FxAlert tone="danger" title="Не удалось подключиться к хранилищу" closable>
            Проверьте параметры доступа и повторите попытку.
          </FxAlert>
        </div>
      </section>

      <!-- Поиск, фильтры и таблица -->
      <section class="showcase__section">
        <h2 class="showcase__title">Поиск, фильтры и таблица</h2>
        <FxFilterBar :active="activeFilters" @remove="removeFilter" @reset="resetFilters">
          <template #search>
            <FxInput v-model="query" placeholder="Поиск по названию, ID или ответственному" prefix-icon="search" />
          </template>
          <FxSelect
            v-model="status"
            label="Статус"
            placeholder="Все"
            :options="[
              { value: 'active', label: 'Активные' },
              { value: 'archived', label: 'Архив' },
            ]"
          />
          <FxSelect v-model="city" label="Город" placeholder="Все" :options="['Москва', 'Санкт-Петербург', 'Казань']" />
          <template #actions>
            <FxButton variant="secondary" icon="sliders">Ещё фильтры</FxButton>
            <FxButton variant="primary" icon="add">Создать</FxButton>
          </template>
        </FxFilterBar>

        <FxCard padding="none" class="showcase__mt">
          <template #header>
            <FxTabs
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
          <FxTable
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
              <span class="showcase__owner"><FxAvatar :name="row.owner" size="sm" />{{ row.owner }}</span>
            </template>
            <template #cell-amount="{ row }"><FxMoney :value="row.amount" /></template>
            <template #cell-status="{ row }"><FxBadge :tone="row.tone" dot>{{ row.status }}</FxBadge></template>
            <template #cell-actions>
              <FxDropdown>
                <template #trigger="{ props }"><FxButton v-bind="props" variant="ghost" size="sm" icon="more" /></template>
                <FxMenuItem icon="eye">Открыть</FxMenuItem>
                <FxMenuItem icon="edit">Редактировать</FxMenuItem>
                <FxMenuItem icon="copy">Дублировать</FxMenuItem>
                <FxMenuItem icon="delete" danger>Удалить</FxMenuItem>
              </FxDropdown>
            </template>
          </FxTable>
        </FxCard>
      </section>

      <!-- Процессы -->
      <section class="showcase__section">
        <h2 class="showcase__title">Процессы</h2>
        <div class="showcase__grid showcase__grid--2">
          <FxCard title="Мастер настройки">
            <FxSteps
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
              <FxButton variant="secondary" icon="back" @click="step = Math.max(0, step - 1)">Назад</FxButton>
              <FxButton variant="primary" icon-end="forward" @click="step = Math.min(4, step + 1)">Далее</FxButton>
            </div>
          </FxCard>

          <FxCard title="История изменений" subtitle="Задача PR-1042">
            <template #actions><FxCountdown :to="soon" /></template>
            <FxTimeline :items="events" />
          </FxCard>

          <FxCard title="Карточка сущности">
            <template #actions><FxBadge tone="success" icon="check-badge">Активна</FxBadge></template>
            <FxDescriptions
              :items="[
                { key: 'name', label: 'Название', value: 'Обновление платёжного шлюза', wide: true },
                { key: 'id', label: 'Идентификатор', value: 'PR-1042' },
                { key: 'owner', label: 'Ответственный', value: 'Анна Ковалёва' },
                { key: 'created', label: 'Создано', value: '12.08.2026' },
                { key: 'size', label: 'Вложения', value: formatBytes(482301) },
                { key: 'desc', label: 'Описание', value: 'Перевод оплаты на новый провайдер, миграция токенов.', wide: true },
              ]"
            />
          </FxCard>

          <FxCard title="Пагинация" subtitle="Работает и отдельно от таблицы" padding="none">
            <FxPagination
              v-model:page="standalonePage"
              :page-size="20"
              :total="640"
            />
          </FxCard>

          <FxCard title="Пустое состояние" padding="none">
            <FxEmpty
              icon="search"
              title="Ничего не найдено"
              description="Попробуйте изменить запрос или убрать часть фильтров."
            >
              <FxButton variant="secondary" icon="refresh" @click="resetFilters">Сбросить фильтры</FxButton>
            </FxEmpty>
          </FxCard>
        </div>
      </section>

      <!-- Каркас -->
      <section class="showcase__section">
        <h2 class="showcase__title">Каркас приложения</h2>
        <div class="showcase__shell-frame">
          <FxShell :nav="nav">
            <template #logo>
              <span class="showcase__logo showcase__logo--sm"><FxIcon name="zap" :size="15" /></span>
              Продукт
            </template>
            <template #header-left>
              <FxBadge tone="primary" icon="organization">ООО «Пример»</FxBadge>
            </template>
            <template #header-actions>
              <FxButton variant="ghost" icon="bell" />
              <FxDropdown>
                <template #trigger="{ props }">
                  <FxButton v-bind="props" variant="ghost" size="sm"><FxAvatar name="Анна Ковалёва" size="sm" /></FxButton>
                </template>
                <FxMenuItem icon="user">Профиль</FxMenuItem>
                <FxMenuItem icon="settings">Настройки</FxMenuItem>
                <FxMenuItem icon="logout" danger>Выйти</FxMenuItem>
              </FxDropdown>
            </template>
            <FxPage title="Обзор" subtitle="Сводка по вашим проектам">
              <template #actions><FxButton variant="primary" icon="add">Создать</FxButton></template>
              <div class="showcase__grid showcase__grid--3">
                <FxStat label="Проектов" value="12" icon="folder" tone="primary" />
                <FxStat label="Завершено" value="42" icon="check-badge" tone="success" />
                <FxStat label="Баланс" value="128 400 ₽" icon="wallet" />
              </div>
            </FxPage>
          </FxShell>
        </div>
      </section>

      <!-- Вкладки -->
      <section class="showcase__section">
        <h2 class="showcase__title">Вкладки с пояснением</h2>
        <FxTabs
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
        <FxCard title="Модальное окно, подсказки и уведомления">
          <div class="showcase__row">
            <FxButton variant="primary" @click="modal = true">Открыть модалку</FxButton>
            <FxButton variant="secondary" @click="toast.success('Сохранено', 'Изменения применены')">Успех</FxButton>
            <FxButton variant="secondary" @click="toast.warning('Требуется внимание', 'Тариф истекает через 3 дня')">Внимание</FxButton>
            <FxButton variant="secondary" @click="toast.error('Ошибка', 'Не удалось связаться с сервером')">Ошибка</FxButton>
            <FxButton variant="secondary" @click="toast.loading('Загрузка', 'Закройте крестиком')">Загрузка</FxButton>
          </div>
          <div class="showcase__row showcase__row--mt">
            <FxTooltip text="Подсказка появляется по наведению и по фокусу с клавиатуры">
              <FxBadge tone="info" icon="info">Наведите на меня</FxBadge>
            </FxTooltip>
            <FxAvatar name="Анна Ковалёва" />
            <FxAvatar name="ООО Пример" square />
            <FxAvatar icon="organization" size="lg" name="Компания" />
          </div>
        </FxCard>
      </section>

      <!-- Иконки -->
      <section class="showcase__section">
        <h2 class="showcase__title">Иконки <span class="showcase__count">{{ iconNames.length }}</span></h2>
        <FxCard>
          <div class="showcase__icons">
            <div v-for="name in iconNames" :key="name" class="showcase__icon">
              <FxIcon :name="name" :size="19" />
              <span>{{ name }}</span>
            </div>
          </div>
        </FxCard>
      </section>
    </main>

    <FxModal v-model="modal" title="Подтверждение действия" subtitle="Задача PR-1042" size="md">
      <div class="showcase__stack">
        <FxAlert tone="info">Действие затронет всех участников проекта.</FxAlert>
        <FxDescriptions
          :columns="1"
          :items="[
            { key: 'who', label: 'Инициатор', value: 'Анна Ковалёва' },
            { key: 'what', label: 'Действие', value: 'Перевод в статус «Готово»' },
            { key: 'when', label: 'Дата', value: '06.09.2026' },
          ]"
        />
        <FxCheckbox :model-value="true" label="Уведомить участников по почте" />
      </div>
      <template #footer>
        <FxButton variant="ghost" @click="modal = false">Отмена</FxButton>
        <FxButton variant="primary" icon="check" @click="modal = false; toast.success('Действие выполнено')">
          Подтвердить
        </FxButton>
      </template>
    </FxModal>

    <FxToast />
  </div>
</template>

<style scoped>
.showcase { min-height: 100vh; }
.showcase__hero {
  background: linear-gradient(180deg, var(--fx-surface) 0%, var(--fx-bg) 100%);
  border-bottom: 1px solid var(--fx-border);
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
.showcase__brand p { margin-top: 0.2rem; color: var(--fx-text-muted); font-size: 0.9375rem; }
.showcase__logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: var(--fx-radius);
  background: var(--fx-primary);
  color: var(--fx-on-primary);
  box-shadow: var(--fx-shadow-md);
}
.showcase__logo--sm { width: 1.75rem; height: 1.75rem; border-radius: var(--fx-radius-sm); box-shadow: none; }
.showcase__hero-actions { display: flex; gap: 0.5rem; }

.showcase__body { max-width: 1160px; margin: 0 auto; padding: 2rem 1.5rem 4rem; }
.showcase__section + .showcase__section { margin-top: 2.5rem; }
.showcase__title {
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--fx-text-faint);
  margin-bottom: 0.75rem;
}
.showcase__count { color: var(--fx-text-muted); }
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
  background: var(--fx-surface);
  border: 1px solid var(--fx-border-strong);
  border-radius: 999px;
  font: inherit;
  font-size: 0.8125rem;
  color: var(--fx-text-muted);
  cursor: pointer;
}
.showcase__preset:hover { color: var(--fx-text); }
.showcase__preset--active { border-color: var(--fx-primary); color: var(--fx-primary); font-weight: 600; }
.showcase__preset-dot { width: 0.7rem; height: 0.7rem; border-radius: 50%; }
.showcase__theme-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr)); gap: 0.75rem; }
.showcase__css {
  margin: 1rem 0 0;
  padding: 0.875rem;
  background: var(--fx-surface-muted);
  border: 1px solid var(--fx-border);
  border-radius: var(--fx-radius-sm);
  font-family: var(--fx-font-mono);
  font-size: 0.75rem;
  line-height: 1.55;
  color: var(--fx-text-muted);
  overflow-x: auto;
}

.showcase__shell-frame {
  border: 1px solid var(--fx-border);
  border-radius: var(--fx-radius);
  overflow: hidden;
  box-shadow: var(--fx-shadow-sm);
  height: 26rem;
}
.showcase__shell-frame :deep(.fx-shell) { min-height: 100%; height: 100%; }
.showcase__shell-frame :deep(.fx-shell__sidebar) { height: 100%; position: static; }
.showcase__shell-frame :deep(.fx-shell__header) { position: static; }
.showcase__icons { display: grid; grid-template-columns: repeat(auto-fill, minmax(8rem, 1fr)); gap: 0.5rem; }
.showcase__icon {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.55rem;
  border-radius: var(--fx-radius-sm);
  font-size: 0.75rem;
  color: var(--fx-text-muted);
}
.showcase__icon:hover { background: var(--fx-surface-muted); color: var(--fx-text); }
</style>
