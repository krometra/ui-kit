<script setup>
/**
 * KFileUpload — зона загрузки файлов на @zag-js/file-upload: drag-and-drop,
 * выбор по клику, проверка типа и размера, список выбранного с удалением.
 *
 * В v-model живут объекты File; отправка — забота приложения, кит не
 * навязывает транспорт. Отклонённые файлы приходят событием `reject`.
 *
 *   <KFileUpload v-model="files" accept=".pdf,application/pdf" :max-file-size="50 * 1024 * 1024" />
 */
import * as fileUpload from '@zag-js/file-upload'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { computed, useId } from 'vue'
import KIcon from './KIcon.vue'

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  label: { type: String, default: 'Перетащите файлы или нажмите для выбора' },
  hint: { type: String, default: '' },
  accept: { type: String, default: '' },
  multiple: { type: Boolean, default: true },
  maxFileSize: { type: Number, default: Infinity },
  disabled: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'reject'])

const service = useMachine(fileUpload.machine, {
  id: useId(),
  locale: 'ru-RU',
  get accept() {
    return props.accept ? props.accept.split(',').map((s) => s.trim()).filter(Boolean) : undefined
  },
  get maxFiles() {
    return props.multiple ? Infinity : 1
  },
  get maxFileSize() {
    return props.maxFileSize
  },
  get disabled() {
    return props.disabled
  },
  get acceptedFiles() {
    return props.modelValue
  },
  onFileChange({ acceptedFiles, rejectedFiles }) {
    emit('update:modelValue', acceptedFiles)
    if (rejectedFiles.length) emit('reject', rejectedFiles)
  },
})

const api = computed(() => fileUpload.connect(service, normalizeProps))
</script>

<template>
  <div class="k-upload" v-bind="api.getRootProps()">
    <div class="k-upload__zone" v-bind="api.getDropzoneProps()">
      <KIcon name="upload" :size="20" class="k-upload__icon" />
      <span class="k-upload__label">{{ label }}</span>
      <span v-if="hint" class="k-upload__hint">{{ hint }}</span>
    </div>
    <input v-bind="api.getHiddenInputProps()" />

    <ul v-if="api.acceptedFiles.length" class="k-upload__list" v-bind="api.getItemGroupProps()">
      <li
        v-for="file in api.acceptedFiles"
        :key="`${file.name}-${file.size}-${file.lastModified}`"
        class="k-upload__file"
        v-bind="api.getItemProps({ file })"
      >
        <KIcon name="document" :size="16" class="k-upload__file-icon" />
        <span class="k-upload__file-name" v-bind="api.getItemNameProps({ file })">{{ file.name }}</span>
        <span class="k-upload__file-size" v-bind="api.getItemSizeTextProps({ file })">{{ api.getFileSize(file) }}</span>
        <button class="k-upload__remove" aria-label="Удалить" v-bind="api.getItemDeleteTriggerProps({ file })">
          <KIcon name="close" :size="14" />
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.k-upload__zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  width: 100%;
  padding: 1.25rem;
  background: var(--k-surface-muted);
  border: 1px dashed var(--k-border-strong);
  border-radius: var(--k-radius);
  color: var(--k-text-muted);
  cursor: pointer;
  outline: none;
  transition: border-color 0.15s, background 0.15s;
}
.k-upload__zone:hover:not([data-disabled]),
.k-upload__zone[data-dragging],
.k-upload__zone:focus-visible { border-color: var(--k-primary); background: var(--k-primary-soft); }
.k-upload__zone[data-disabled] { opacity: 0.6; cursor: not-allowed; }
.k-upload__icon { color: var(--k-text-faint); }
.k-upload__label { font-size: 0.875rem; color: var(--k-text); }
.k-upload__hint { font-size: 0.75rem; }
.k-upload__list { margin: 0.625rem 0 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 0.375rem; }
.k-upload__file {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.6rem;
  background: var(--k-surface);
  border: 1px solid var(--k-border);
  border-radius: var(--k-radius-sm);
  font-size: 0.875rem;
}
.k-upload__file-icon { color: var(--k-text-faint); }
.k-upload__file-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.k-upload__file-size { font-size: 0.75rem; color: var(--k-text-muted); }
.k-upload__remove { background: none; border: none; color: var(--k-text-faint); cursor: pointer; padding: 0.1rem; }
.k-upload__remove:hover { color: var(--k-danger); }
</style>
