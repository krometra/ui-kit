/**
 * Темы оформления.
 *
 * Кит намеренно не привязан к одному фирменному стилю: под каждый проект
 * меняется палитра, скругления и плотность, а разметка и поведение компонентов
 * остаются теми же. Тема — это набор значений для CSS-переменных `--k-*`,
 * который применяется к любому элементу-контейнеру (обычно к :root).
 *
 *   import { applyTheme, themes } from '@krometra/ui-kit'
 *   applyTheme('slate')                                  // готовый пресет
 *   applyTheme({ preset: 'ocean', radius: 'sharp', density: 'compact' })
 *   applyTheme({ accent: '#7c3aed' })                    // свой акцент
 *   applyTheme({ preset: 'scanflow', scheme: 'dark' })   // тёмная схема
 *   applyTheme({ scheme: 'system' })                     // за системой
 *
 * Всё, что не задано, наследуется из tokens.css, поэтому частичная тема —
 * законная и самая частая форма настройки.
 */

export const schemes = ['light', 'dark', 'system']

/**
 * Пресеты акцента и нейтралей.
 *
 * Нейтрали задаются отдельно от акцента: одинаковый синий на холодном и на
 * тёплом сером выглядит как два разных бренда, и подбирать их порознь удобнее,
 * чем держать десяток почти одинаковых палитр. Пресет может уточнить нейтрали
 * точечно через `neutralOverrides` — так живут проектные темы.
 */
export const presets = {
  default: {
    label: 'Default',
    accent: '#2563eb',
    accentHover: '#1d4ed8',
    accentSoft: '#eff6ff',
    neutral: 'cool',
  },
  scanflow: {
    label: 'ScanFlow',
    accent: '#2563eb',
    accentHover: '#1d4ed8',
    accentSoft: '#eff6ff',
    neutral: 'cool',
    neutralOverrides: {
      light: { bg: '#f8fafc', surfaceMuted: '#f1f5f9', border: '#e2e8f0', text: '#1e293b' },
      dark: { bg: '#0f172a', surface: '#1e293b', surfaceMuted: '#273549', border: '#334155', borderStrong: '#475569' },
    },
  },
  slate: {
    label: 'Slate',
    accent: '#475569',
    accentHover: '#334155',
    accentSoft: '#f1f5f9',
    neutral: 'cool',
  },
  ocean: {
    label: 'Ocean',
    accent: '#0891b2',
    accentHover: '#0e7490',
    accentSoft: '#ecfeff',
    neutral: 'cool',
  },
  forest: {
    label: 'Forest',
    accent: '#059669',
    accentHover: '#047857',
    accentSoft: '#ecfdf5',
    neutral: 'warm',
  },
  violet: {
    label: 'Violet',
    accent: '#7c3aed',
    accentHover: '#6d28d9',
    accentSoft: '#f5f3ff',
    neutral: 'cool',
  },
  amber: {
    label: 'Amber',
    accent: '#d97706',
    accentHover: '#b45309',
    accentSoft: '#fffbeb',
    neutral: 'warm',
  },
  rose: {
    label: 'Rose',
    accent: '#e11d48',
    accentHover: '#be123c',
    accentSoft: '#fff1f2',
    neutral: 'warm',
  },
  mono: {
    label: 'Mono',
    accent: '#18181b',
    accentHover: '#000000',
    accentSoft: '#f4f4f5',
    neutral: 'plain',
  },
}

/** Нейтральные шкалы: фон, поверхности, границы, текст — для обеих схем. */
export const neutrals = {
  cool: {
    light: {
      bg: '#f6f8fb',
      surface: '#ffffff',
      surfaceMuted: '#f8fafc',
      border: '#e4e9f0',
      borderStrong: '#cbd5e1',
      text: '#172033',
      textMuted: '#64748b',
      textFaint: '#94a3b8',
    },
    dark: {
      bg: '#0b1220',
      surface: '#111a2b',
      surfaceMuted: '#18233a',
      border: '#24314a',
      borderStrong: '#354764',
      text: '#e5eaf3',
      textMuted: '#9aa7bb',
      textFaint: '#66748c',
    },
  },
  warm: {
    light: {
      bg: '#faf9f7',
      surface: '#ffffff',
      surfaceMuted: '#f7f5f2',
      border: '#ebe7e1',
      borderStrong: '#d6cfc5',
      text: '#26211c',
      textMuted: '#6f665c',
      textFaint: '#a39a8f',
    },
    dark: {
      bg: '#15120f',
      surface: '#1c1814',
      surfaceMuted: '#24201b',
      border: '#302a24',
      borderStrong: '#443c34',
      text: '#efe9e2',
      textMuted: '#a89e92',
      textFaint: '#776d62',
    },
  },
  plain: {
    light: {
      bg: '#fafafa',
      surface: '#ffffff',
      surfaceMuted: '#f4f4f5',
      border: '#e7e7e9',
      borderStrong: '#d0d0d4',
      text: '#18181b',
      textMuted: '#6b7280',
      textFaint: '#a1a1aa',
    },
    dark: {
      bg: '#0f0f11',
      surface: '#17171a',
      surfaceMuted: '#1f1f23',
      border: '#2a2a30',
      borderStrong: '#3c3c44',
      text: '#ededf0',
      textMuted: '#a1a1aa',
      textFaint: '#6b6b75',
    },
  },
}

/**
 * Семантические цвета статусов. `strong` — текст на мягком фоне (бейджи,
 * плашки), `soft` в тёмной схеме выводится смешиванием с поверхностью.
 */
export const semantics = {
  light: {
    success: { base: '#059669', hover: '#047857', soft: '#ecfdf5', strong: '#065f46' },
    warning: { base: '#f59e0b', hover: '#d97706', soft: '#fffbeb', strong: '#b45309' },
    danger: { base: '#dc2626', hover: '#b91c1c', soft: '#fef2f2', strong: '#991b1b' },
    info: { base: '#4f46e5', hover: '#4338ca', soft: '#eef2ff', strong: '#3730a3' },
  },
  dark: {
    success: { base: '#34d399', hover: '#6ee7b7', strong: '#6ee7b7' },
    warning: { base: '#fbbf24', hover: '#fcd34d', strong: '#fcd34d' },
    danger: { base: '#f87171', hover: '#fca5a5', strong: '#fca5a5' },
    info: { base: '#818cf8', hover: '#a5b4fc', strong: '#a5b4fc' },
  },
}

/** Скругления: от строгих прямых углов до подчёркнуто мягких. */
export const radiusScales = {
  sharp: { sm: '2px', md: '3px', lg: '5px' },
  subtle: { sm: '4px', md: '5px', lg: '8px' },
  default: { sm: '6px', md: '8px', lg: '14px' },
  soft: { sm: '9px', md: '12px', lg: '20px' },
  pill: { sm: '12px', md: '16px', lg: '28px' },
}

/** Плотность: высота контролов и базовый шаг. */
export const densities = {
  compact: { controlH: '2.125rem', controlHSm: '1.75rem', gap: '0.375rem' },
  default: { controlH: '2.5rem', controlHSm: '2rem', gap: '0.5rem' },
  comfortable: { controlH: '2.875rem', controlHSm: '2.25rem', gap: '0.625rem' },
}

/** Тени: от плоского интерфейса до выраженной глубины. */
export const elevations = {
  flat: {
    light: { sm: 'none', md: '0 1px 2px rgba(15, 23, 42, 0.06)', lg: '0 6px 20px rgba(15, 23, 42, 0.10)' },
    dark: { sm: 'none', md: '0 1px 2px rgba(0, 0, 0, 0.3)', lg: '0 6px 20px rgba(0, 0, 0, 0.45)' },
  },
  default: {
    light: { sm: '0 1px 2px rgba(15, 23, 42, 0.05)', md: '0 4px 16px rgba(15, 23, 42, 0.08)', lg: '0 18px 44px rgba(15, 23, 42, 0.14)' },
    dark: { sm: '0 1px 2px rgba(0, 0, 0, 0.35)', md: '0 4px 16px rgba(0, 0, 0, 0.45)', lg: '0 18px 44px rgba(0, 0, 0, 0.6)' },
  },
  lifted: {
    light: { sm: '0 1px 3px rgba(15, 23, 42, 0.08)', md: '0 8px 24px rgba(15, 23, 42, 0.12)', lg: '0 24px 60px rgba(15, 23, 42, 0.20)' },
    dark: { sm: '0 1px 3px rgba(0, 0, 0, 0.45)', md: '0 8px 24px rgba(0, 0, 0, 0.55)', lg: '0 24px 60px rgba(0, 0, 0, 0.7)' },
  },
}

/** Шрифтовые пары. */
export const fontStacks = {
  system: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  grotesk: "'Inter', 'Segoe UI', system-ui, sans-serif",
  serif: "'Georgia', 'Times New Roman', serif",
  mono: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, monospace",
}

/** Сводит `system` к конкретной схеме по настройке ОС; вне браузера — light. */
export function resolveScheme(scheme = 'light') {
  if (scheme !== 'system') return scheme === 'dark' ? 'dark' : 'light'
  if (typeof window === 'undefined' || !window.matchMedia) return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/**
 * Собирает карту CSS-переменных для темы.
 *
 * Возвращает простой объект, а не строку стилей: его одинаково удобно
 * применить через element.style.setProperty и отрендерить в <style> при SSR.
 */
export function buildTheme(theme = {}) {
  const spec = typeof theme === 'string' ? { preset: theme } : theme
  const scheme = resolveScheme(spec.scheme)
  const dark = scheme === 'dark'
  const preset = presets[spec.preset] ?? presets.default
  const neutralFamily = neutrals[spec.neutral ?? preset.neutral] ?? neutrals.cool
  const neutral = {
    ...neutralFamily[scheme],
    ...(spec.neutral ? {} : preset.neutralOverrides?.[scheme]),
    ...(spec.bg ? { bg: spec.bg } : {}),
    ...(spec.surface ? { surface: spec.surface } : {}),
    ...(spec.text ? { text: spec.text } : {}),
    ...(spec.textMuted ? { textMuted: spec.textMuted } : {}),
    ...(spec.textFaint ? { textFaint: spec.textFaint } : {}),
  }
  const radius = radiusScales[spec.radius] ?? radiusScales.default
  const density = densities[spec.density] ?? densities.default
  const elevation = (elevations[spec.elevation] ?? elevations.default)[scheme]
  const font = fontStacks[spec.font] ?? spec.font ?? fontStacks.system

  const baseAccent = spec.accent ?? preset.accent
  const accent = dark ? tint(baseAccent, 0.12) : baseAccent
  const accentHover = spec.accentHover
    ?? (dark ? tint(accent, 0.14) : spec.accent ? shade(accent, -0.12) : preset.accentHover)
  const accentSoft = spec.accentSoft
    ?? (dark ? mix(accent, neutral.surface, 0.22) : spec.accent ? tint(accent, 0.92) : preset.accentSoft)

  const vars = {
    '--k-primary': accent,
    '--k-primary-hover': accentHover,
    '--k-primary-soft': accentSoft,
    '--k-on-primary': onColor(accent),

    '--k-bg': neutral.bg,
    '--k-surface': neutral.surface,
    '--k-surface-muted': neutral.surfaceMuted,
    '--k-border': neutral.border,
    '--k-border-strong': neutral.borderStrong,
    '--k-text': neutral.text,
    '--k-text-muted': neutral.textMuted,
    '--k-text-faint': neutral.textFaint,

    '--k-overlay': dark ? 'rgba(0, 0, 0, 0.6)' : 'rgba(15, 23, 42, 0.35)',
    '--k-tooltip-bg': dark ? neutral.text : '#172033',
    '--k-tooltip-text': dark ? neutral.bg : '#ffffff',
    '--k-selection': mix(accent, neutral.surface, dark ? 0.4 : 0.2),

    '--k-radius-sm': radius.sm,
    '--k-radius': radius.md,
    '--k-radius-lg': radius.lg,

    '--k-control-h': density.controlH,
    '--k-control-h-sm': density.controlHSm,
    '--k-gap': density.gap,

    '--k-shadow-sm': elevation.sm,
    '--k-shadow-md': elevation.md,
    '--k-shadow-lg': elevation.lg,

    '--k-font': font,
  }

  for (const [name, tone] of Object.entries(semantics[scheme])) {
    vars[`--k-${name}`] = tone.base
    vars[`--k-${name}-hover`] = tone.hover
    vars[`--k-${name}-soft`] = tone.soft ?? mix(tone.base, neutral.surface, 0.18)
    vars[`--k-${name}-strong`] = tone.strong
    vars[`--k-on-${name}`] = onColor(tone.base)
  }

  return vars
}

/**
 * Применяет тему к элементу (по умолчанию к :root).
 *
 * Помимо переменных выставляет `data-k-scheme` и `color-scheme`, чтобы
 * нативные контролы и скроллбары следовали схеме. При `scheme: 'system'`
 * подписывается на смену системной темы. Возвращает функцию отката — удобно
 * для витрин и предпросмотра, где тема временная.
 */
export function applyTheme(theme = {}, target = null) {
  const el = target ?? (typeof document !== 'undefined' ? document.documentElement : null)
  if (!el) return () => {}

  const spec = typeof theme === 'string' ? { preset: theme } : theme
  const previous = {}
  const previousScheme = el.getAttribute('data-k-scheme')
  const previousColorScheme = el.style.colorScheme

  const paint = () => {
    const vars = buildTheme(spec)
    for (const [key, value] of Object.entries(vars)) {
      if (!(key in previous)) previous[key] = el.style.getPropertyValue(key)
      el.style.setProperty(key, value)
    }
    const scheme = resolveScheme(spec.scheme)
    el.setAttribute('data-k-scheme', scheme)
    el.style.colorScheme = scheme
  }

  paint()

  let media = null
  if (spec.scheme === 'system' && typeof window !== 'undefined' && window.matchMedia) {
    media = window.matchMedia('(prefers-color-scheme: dark)')
    media.addEventListener('change', paint)
  }

  return () => {
    media?.removeEventListener('change', paint)
    for (const [key, value] of Object.entries(previous)) {
      if (value) el.style.setProperty(key, value)
      else el.style.removeProperty(key)
    }
    if (previousScheme) el.setAttribute('data-k-scheme', previousScheme)
    else el.removeAttribute('data-k-scheme')
    el.style.colorScheme = previousColorScheme
  }
}

/** Тема как строка для атрибута style или тега <style>. */
export function themeToCss(theme = {}, selector = ':root') {
  const spec = typeof theme === 'string' ? { preset: theme } : theme
  const lines = Object.entries(buildTheme(spec)).map(([k, v]) => `  ${k}: ${v};`)
  lines.push(`  color-scheme: ${resolveScheme(spec.scheme)};`)
  return `${selector} {\n${lines.join('\n')}\n}`
}

/** Список готовых тем для переключателей в интерфейсе. */
export const themes = Object.entries(presets).map(([value, p]) => ({
  value,
  label: p.label,
  accent: p.accent,
}))

// --- вспомогательное: смешивание цветов ---

function parseHex(hex) {
  const s = hex.replace('#', '')
  const full = s.length === 3 ? s.split('').map((c) => c + c).join('') : s
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16))
}

function toHex(rgb) {
  return `#${rgb.map((c) => Math.round(Math.min(255, Math.max(0, c))).toString(16).padStart(2, '0')).join('')}`
}

/** Затемняет (amount < 0) или осветляет (amount > 0) цвет. */
function shade(hex, amount) {
  const rgb = parseHex(hex)
  const target = amount < 0 ? 0 : 255
  return toHex(rgb.map((c) => c + (target - c) * Math.abs(amount)))
}

/** Смешивает цвет с белым: 0 — исходный, 1 — белый. */
function tint(hex, amount) {
  return shade(hex, amount)
}

/** Смешивает два цвета: weight — доля первого. */
function mix(a, b, weight) {
  const ra = parseHex(a)
  const rb = parseHex(b)
  return toHex(ra.map((c, i) => c * weight + rb[i] * (1 - weight)))
}

/** Цвет текста поверх заливки: белый на тёмном, почти чёрный на светлом. */
function onColor(hex) {
  const [r, g, b] = parseHex(hex).map((c) => {
    const v = c / 255
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  })
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b
  return luminance > 0.45 ? '#0f172a' : '#ffffff'
}
