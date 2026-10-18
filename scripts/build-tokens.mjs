/**
 * Генерирует src/tokens.css из theme.js: светлая схема как :root, тёмная —
 * под [data-k-scheme="dark"]. Запускать после правок палитры: `yarn tokens`.
 */
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { themeToCss } from '../src/theme.js'

const header = `/*
 * Дизайн-токены @krometra/ui-kit. Файл сгенерирован scripts/build-tokens.mjs из
 * theme.js — править палитру там, затем \`yarn tokens\`.
 *
 * Светлая схема — по умолчанию; тёмная включается атрибутом
 * <html data-k-scheme="dark"> или через applyTheme({ scheme: 'dark' | 'system' }).
 * Все примитивы берут размеры и цвета отсюда, поэтому строка «инпут + селект +
 * кнопка» выравнивается без правок в вёрстке приложения.
 */
`

const css = [
  header,
  themeToCss({ scheme: 'light' }, ':root'),
  '',
  themeToCss({ scheme: 'dark' }, ':root[data-k-scheme="dark"]'),
  '',
].join('\n')

writeFileSync(fileURLToPath(new URL('../src/tokens.css', import.meta.url)), css)
console.log('src/tokens.css обновлён')
