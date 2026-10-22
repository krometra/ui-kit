/**
 * @krometra/ui-kit — UI-kit на Vue 3 со сменными темами оформления и светлой /
 * тёмной схемой. Интерактивные компоненты построены на машинах @zag-js.
 *
 * Точка входа: именованные экспорты компонентов + плагин для глобальной
 * регистрации. Стили токенов подключаются автоматически; базовый reset
 * (`@krometra/ui-kit/src/base.css`) приложение импортирует само, чтобы кит не
 * навязывал глобальные правила.
 *
 *   import { KButton, KTable } from '@krometra/ui-kit'
 *   import '@krometra/ui-kit/style.css'
 *
 * либо всё сразу:
 *   import KrometraUiKit from '@krometra/ui-kit'
 *   app.use(KrometraUiKit)
 */
import './tokens.css'

import KAlert from './components/KAlert.vue'
import KAvatar from './components/KAvatar.vue'
import KBadge from './components/KBadge.vue'
import KButton from './components/KButton.vue'
import KCard from './components/KCard.vue'
import KCheckbox from './components/KCheckbox.vue'
import KCombobox from './components/KCombobox.vue'
import KCountdown from './components/KCountdown.vue'
import KDescriptions from './components/KDescriptions.vue'
import KDrawer from './components/KDrawer.vue'
import KDropdown from './components/KDropdown.vue'
import KEmpty from './components/KEmpty.vue'
import KFileUpload from './components/KFileUpload.vue'
import KFilterBar from './components/KFilterBar.vue'
import KGantt from './components/KGantt.vue'
import KIcon from './components/KIcon.vue'
import KInput from './components/KInput.vue'
import KMenuItem from './components/KMenuItem.vue'
import KModal from './components/KModal.vue'
import KMoney from './components/KMoney.vue'
import KPage from './components/KPage.vue'
import KPagination from './components/KPagination.vue'
import KProgress from './components/KProgress.vue'
import KRadioGroup from './components/KRadioGroup.vue'
import KSegmented from './components/KSegmented.vue'
import KSelect from './components/KSelect.vue'
import KShell from './components/KShell.vue'
import KStat from './components/KStat.vue'
import KSteps from './components/KSteps.vue'
import KSwitch from './components/KSwitch.vue'
import KTable from './components/KTable.vue'
import KTabs from './components/KTabs.vue'
import KTextarea from './components/KTextarea.vue'
import KTimeline from './components/KTimeline.vue'
import KToast from './components/KToast.vue'
import KTooltip from './components/KTooltip.vue'

export {
  KAlert, KAvatar, KBadge, KButton, KCard, KCheckbox, KCombobox, KCountdown,
  KDescriptions, KDrawer, KDropdown, KEmpty, KFileUpload, KFilterBar, KGantt, KIcon,
  KInput, KMenuItem, KModal, KMoney, KPage, KPagination, KProgress,
  KRadioGroup, KSegmented, KSelect, KShell, KStat, KSteps, KSwitch, KTable,
  KTabs, KTextarea, KTimeline, KToast, KTooltip,
}

export { iconNames, iconRegistry, registerIcons } from './components/icon-registry.js'
export {
  applyTheme, buildTheme, themeToCss, resolveScheme, themes, schemes,
  presets, neutrals, semantics, radiusScales, densities, elevations, fontStacks,
} from './theme.js'
export { useToast, pushToast, dismissToast, toastStore } from './composables/useToast.js'
export * from './format.js'

const components = {
  KAlert, KAvatar, KBadge, KButton, KCard, KCheckbox, KCombobox, KCountdown,
  KDescriptions, KDrawer, KDropdown, KEmpty, KFileUpload, KFilterBar, KGantt, KIcon,
  KInput, KMenuItem, KModal, KMoney, KPage, KPagination, KProgress,
  KRadioGroup, KSegmented, KSelect, KShell, KStat, KSteps, KSwitch, KTable,
  KTabs, KTextarea, KTimeline, KToast, KTooltip,
}

export default {
  install(app) {
    for (const [name, component] of Object.entries(components)) {
      app.component(name, component)
    }
  },
}
