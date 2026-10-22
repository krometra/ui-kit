# @krometra/ui-kit

UI-kit на Vue 3 со сменными темами оформления, светлой и тёмной схемой.
Интерактивные компоненты построены на машинах состояний [zag.js](https://zagjs.com):
позиционирование, фокус-трап, клавиатурная навигация и ARIA приходят из машин,
а не пишутся заново в каждом компоненте.

**Витрина и конструктор темы: <https://krometra.github.io/ui-kit/>**

35 компонентов, 88 иконок, девять готовых тем, две цветовые схемы и конструктор
своей темы. Разметка и поведение компонентов одни и те же, а стилистика
подбирается под проект: цвет, нейтрали, скругления, плотность, тени и шрифт
задаются CSS-переменными.

## Установка

```bash
npm install @krometra/ui-kit
# или из репозитория (скрипт `prepare` собирает `dist/`)
npm install github:krometra/ui-kit#v0.4.0
```

Публикация в npm происходит по тегу `v*`, если задан секрет `NPM_TOKEN`.

## Использование

Глобально:

```js
import { createApp } from 'vue'
import KrometraUiKit from '@krometra/ui-kit'
import '@krometra/ui-kit/style.css'
import App from './App.vue'

createApp(App).use(KrometraUiKit).mount('#app')
```

Точечно (tree-shaking):

```vue
<script setup>
import { KButton, KTable, KMoney } from '@krometra/ui-kit'
</script>
```

Базовый reset страницы подключается отдельно, чтобы кит не навязывал глобальные
правила приложению:

```js
import '@krometra/ui-kit/src/base.css'
```

Уведомления требуют один `<KToast />` в корне приложения; дальше сообщения
шлются из любого места через `useToast()`.

## Темы

Тема — это набор значений для переменных `--k-*`. Меняется в рантайме, без
пересборки стилей.

```js
import { applyTheme } from '@krometra/ui-kit'

applyTheme('violet')                                    // готовый пресет
applyTheme({ preset: 'ocean', radius: 'sharp' })        // пресет с правками
applyTheme({ accent: '#e11d48', density: 'compact' })   // свой акцент
applyTheme({ preset: 'ocean', textMuted: '#5b6472' })   // свой цвет вторичного текста
applyTheme({ preset: 'scanflow', scheme: 'dark' })      // тёмная схема
const stop = applyTheme({ scheme: 'system' })           // следовать за ОС
```

| Ось | Значения |
|---|---|
| `preset` | `default`, `scanflow`, `slate`, `ocean`, `forest`, `violet`, `amber`, `rose`, `mono` |
| `scheme` | `light`, `dark`, `system` |
| `neutral` | `cool`, `warm`, `plain` |
| `radius` | `sharp`, `subtle`, `default`, `soft`, `pill` |
| `density` | `compact`, `default`, `comfortable` |
| `elevation` | `flat`, `default`, `lifted` |
| `font` | `system`, `grotesk`, `serif`, `mono` или своя строка |
| `bg`, `surface`, `text`, `textMuted`, `textFaint` | свой цвет фона, поверхности и текста поверх нейтральной палитры (hex) |

Не заданные оси наследуются из `tokens.css`, поэтому частичная тема — обычный
способ настройки. `applyTheme` выставляет `data-k-scheme` и `color-scheme` на
`<html>` и возвращает функцию отката; при `scheme: 'system'` она же снимает
подписку на смену системной темы.

Тёмная схема работает и без JavaScript: достаточно атрибута
`<html data-k-scheme="dark">` — значения для неё лежат в `tokens.css`.

Для статической темы удобнее сгенерировать CSS один раз:

```js
import { themeToCss } from '@krometra/ui-kit'
themeToCss({ preset: 'forest', radius: 'soft' })  // ':root { --k-primary: … }'
```

Отдельные переменные всегда можно переопределить руками:

```css
:root {
  --k-primary: #0f62fe;
  --k-radius: 10px;
}
```

Помимо базовых цветов у каждого статуса есть полный набор: `--k-success`,
`-hover`, `-soft` (фон плашек), `-strong` (текст на мягком фоне) и
`--k-on-success` (текст на заливке). Компоненты не содержат захардкоженных
цветов, поэтому любая схема перекрашивает их целиком.

`tokens.css` генерируется из `theme.js` командой `yarn tokens`.

## Компоненты

| Группа | Компоненты |
|---|---|
| Каркас | `KShell`, `KPage`, `KCard`, `KTabs`, `KSegmented` |
| Формы | `KInput`, `KTextarea`, `KSelect`, `KCombobox`, `KCheckbox`, `KRadioGroup`, `KSwitch`, `KFileUpload` |
| Действия | `KButton`, `KDropdown`, `KMenuItem` |
| Данные | `KTable`, `KPagination`, `KDescriptions`, `KTimeline`, `KGantt`, `KEmpty` |
| Статусы | `KBadge`, `KAlert`, `KStat`, `KProgress`, `KSteps`, `KToast` |
| Значения | `KMoney`, `KCountdown`, `KAvatar`, `KFilterBar` |
| Прочее | `KIcon`, `KModal`, `KTooltip` |

На zag.js: `KSelect`, `KCombobox`, `KDropdown`, `KModal`, `KToast`,
`KPagination`, `KTooltip`, `KTabs`, `KCheckbox`, `KSwitch`, `KRadioGroup`,
`KSegmented`, `KFileUpload`, `KProgress`, `KSteps`. Плавающие слои
(списки, меню, подсказки, модалки) рендерятся в `<body>`, поэтому не
обрезаются контейнерами с `overflow` и корректно ложатся друг на друга:
модалка 1000, списки и меню 1100, подсказки 1200, уведомления 1300.

### Заметные особенности API

```vue
<!-- select и combobox принимают любые объекты -->
<KSelect v-model="volumeId" :options="volumes" :get-value="v => v.id" :get-label="v => v.name" clearable />
<KCombobox v-model="counterpartyId" :options="counterparties" label="Контрагент" @search="load" />

<!-- дропдаун: своя кнопка кита или собственный триггер со слотом -->
<KDropdown label="Экспорт" v-slot="{ close }">
  <KMenuItem icon="download">PDF</KMenuItem>
</KDropdown>
<KDropdown>
  <template #trigger="{ props }"><KButton v-bind="props" variant="ghost" icon="more" /></template>
  <KMenuItem icon="edit">Редактировать</KMenuItem>
</KDropdown>

<!-- модалка не закрывается кликом по фону, пока не попросить -->
<KModal v-model="open" title="Новый документ" close-on-outside>…</KModal>
```

Иконки задаются семантическим именем (`<KIcon name="settings" />`). Своя
иконка передаётся компонентом (`<KIcon :component="MyIcon" />`) или
регистрируется по имени, чтобы работать и в `icon`-пропах кнопок:

```js
import { registerIcons } from '@krometra/ui-kit'
import { RotateCw } from 'lucide-vue-next'
registerIcons({ rescan: RotateCw })
```

## Форматтеры

```js
import { formatMoney, formatBytes, formatDuration, pluralize } from '@krometra/ui-kit'

formatMoney(4850000)                                 // «4 850 000 ₽»
formatBytes(482301)                                  // «471,0 КБ»
formatDuration(9930)                                 // «02:45:30»
pluralize(3, ['файл', 'файла', 'файлов'])            // «3 файла»
```

Также: `formatNumber`, `formatPercent`, `formatDate`, `formatDateTime`,
`formatRelative`, `truncate`, `initials`, `plural`.

## Разработка

```bash
yarn install
yarn dev          # витрина с конструктором темы на localhost:5173
yarn build        # сборка библиотеки в dist/
yarn build:demo   # сборка витрины для GitHub Pages
yarn tokens       # перегенерировать src/tokens.css из theme.js
```

Витрина живёт в `demo/Showcase.vue` и служит и документацией, и площадкой для
визуальной проверки при изменении токенов.

## Что изменилось в 0.4.0

- `KGantt` - диаграмма Ганта по дням: список задач слева, полосы сроков справа,
  группы со сводной полосой и сворачиванием, отметка сегодняшнего дня,
  выходные скрываются или затеняются, несколько отрезков в одной строке,
  подсказка и ссылка у полосы.

## Что изменилось в 0.3.0

- Кит переехал в организацию Крометры: пакет `@krometra/ui-kit`, репозиторий
  `github.com/krometra/ui-kit`. Прежний пакет `foxy-ui-kit` больше не выходит.
- Префикс сменился на `K`: компоненты `KButton`, `KTable`…, классы `.k-*`,
  CSS-переменные `--k-*`, плагин `KrometraUiKit`. Поведение и API компонентов
  не менялись: переход — замена `Fx` на `K`, `fx-` на `k-` и имени пакета.

## Что изменилось в 0.2.2

- `applyTheme`/`buildTheme`: опции `text`, `textMuted` и `textFaint` задают цвета текста
  поверх нейтральной палитры, как `bg` и `surface`. Нужны, когда фон приложения темнее
  палитры кита и вторичный текст на нём теряет контраст.

## Что изменилось в 0.2.1

- `KTabs`: у пункта появился `hint` — пояснение второй строкой под названием.

## Что изменилось в 0.2.0

- Тёмная схема (`scheme: 'light' | 'dark' | 'system'`) и пресет `scanflow`.
- Семантические токены `-hover`/`-strong`/`--k-on-*`, `--k-overlay`,
  `--k-tooltip-*`, `--k-selection`; хардкод цветов из компонентов убран.
- Интерактивные компоненты переведены на zag.js; добавлен `KCombobox`.
- `KSelect`: пропы `getValue`/`getLabel`/`clearable`, значение в v-model
  остаётся исходного типа; пустой `<option>` для плейсхолдера больше не нужен.
- `KDropdown`: слот `#trigger` получает `{ props, open }` и обязан привязать
  `props`; пропы `label`/`icon`/`variant`/`size` рисуют кнопку кита; слот по
  умолчанию получает `{ close }`.
- `KModal`: клик по фону не закрывает окно без `close-on-outside`.
- `KFileUpload`: в v-model объекты `File`, событие `reject`.
- `useToast`: очередь на `@zag-js/toast`; экспорт `toasts` заменён на
  `toastStore`; добавлен `loading`.
- `KAvatar` красится семантическими токенами вместо фиксированной палитры.
- `registerIcons()` и новые иконки: `rotate`, `scissors`, `restore`, `file-up`,
  `move`, `list`, `grid`, `sun`, `moon`.

## Лицензия

MIT
