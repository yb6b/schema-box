import { onMounted, onUnmounted } from 'vue'

/** 组件卸载时会修改回原来的 */
export function useSetTitle(newtitle?: string) {
  let oldTitle = ''
  onMounted(() => {
    oldTitle = document.title
    document.title = newtitle ? `${newtitle} · 形码盒子` : '形码盒子'
  })
  onUnmounted(() => {
    document.title = oldTitle
  })
}
