import { mdiClipboardOutline, mdiContentCopy, mdiFileDocument } from '@quasar/extras/mdi-v7'

type SelectSource = 'upload' | 'clipboard' | 'textarea' | 'preset'

interface SelectOption {
  label: string
  value: SelectSource
  icon: string
  dsc: string
}
export const selectOptions: SelectOption[] = [
  { label: '打开文件', value: 'upload', icon: mdiFileDocument, dsc: '打开本地文件' },
  { label: '系统剪贴板', value: 'clipboard', icon: mdiClipboardOutline, dsc: '一键读取剪切板，性能好' },
  { label: '粘贴', value: 'textarea', icon: mdiContentCopy, dsc: '手动粘贴，可能卡顿' },
  //  { label: '预置方案', value: 'presets', icon: mdiViewDashboardOutline, dsc: '预装的20种方案' },
]
