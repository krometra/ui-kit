/**
 * Всплывающие уведомления на @zag-js/toast.
 *
 * Очередь живёт в модуле, а не в компоненте: любому стору или обработчику
 * достаточно импортировать useToast(), не пробрасывая ссылку на <KToast>.
 * Сам контейнер монтируется один раз в корне приложения.
 *
 *   const toast = useToast()
 *   toast.success('Сохранено', 'Изменения применены')
 *   toast.error('Ошибка', 'Не удалось связаться с сервером')
 *   pushToast({ title: 'Идёт загрузка', tone: 'loading', timeout: 0 })  // висит до dismiss
 */
import { createStore } from '@zag-js/toast'

export const toastStore = createStore({
  placement: 'top-end',
  duration: 4000,
  removeDelay: 400,
  gap: 12,
})

const types = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  danger: 'error',
  error: 'error',
  loading: 'loading',
}

export function pushToast({ title = '', text = '', tone = 'info', timeout } = {}) {
  const data = { title, description: text, type: types[tone] ?? 'info' }
  if (timeout === 0) data.duration = Infinity
  else if (timeout != null) data.duration = timeout
  return toastStore.create(data)
}

export function dismissToast(id) {
  toastStore.dismiss(id)
}

export function useToast() {
  return {
    toast: pushToast,
    success: (title, text) => pushToast({ title, text, tone: 'success' }),
    info: (title, text) => pushToast({ title, text, tone: 'info' }),
    warning: (title, text) => pushToast({ title, text, tone: 'warning' }),
    error: (title, text) => pushToast({ title, text, tone: 'danger' }),
    loading: (title, text) => pushToast({ title, text, tone: 'loading', timeout: 0 }),
    dismiss: dismissToast,
  }
}
