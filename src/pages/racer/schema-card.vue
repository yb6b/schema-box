<script setup lang="ts">
import { defineAsyncComponent, shallowRef, toValue, watch } from 'vue'
import { mdiPlusBoxOutline, mdiScale, mdiTextBoxEditOutline, mdiTrashCanOutline } from '@quasar/extras/mdi-v7'
import { useQuasar } from 'quasar'
import LoadFile from '@/components/file-loader/file-loader.vue'
import { removeFileNameExt } from '@/libs/utils/string'
import { detectAndFillMabiao, platToName } from '@/libs/platforms'
import type { Mabiao } from '@/libs/schema'
import { RawFile } from '@/libs/platforms/raw-file'

const emits = defineEmits<{
  value: [value: Mabiao | null]
}>()

const $q = useQuasar()
const MabiaoEvaluator = defineAsyncComponent(() => import('./mabiao/visualize-card.vue'))

const openDialog = shallowRef(false)
const openEvaluateDialog = shallowRef(false)

const dataRef = shallowRef<Mabiao | null>(null)

watch(dataRef, () => {
  emits('value', dataRef.value)
})

function onDrop(e: DragEvent) {
  const f = e.dataTransfer?.files[0]
  if (!f)
    throw new Error('无法识别文件')
  const raw = new RawFile(f)
  detectAndFillMabiao(raw).then((mb) => {
    mb.name = removeFileNameExt(raw.name)
    dataRef.value = mb
  }).catch((r) => { $q.notify({ type: 'negative', message: r.message }) })
}

async function onGetNewSchema(mb: Mabiao) {
  // loadFile 组件内部已经推断过了
  dataRef.value = mb
  openDialog.value = false
}
</script>

<template>
  <!-- 编码码表的弹窗 -->
  <QDialog v-model="openDialog">
    <LoadFile
      dict-mode
      :preset="toValue(dataRef)!"
      @value="onGetNewSchema"
    />
  </QDialog>
  <!-- 测评码表的弹窗 -->
  <QDialog v-model="openEvaluateDialog" maximized>
    <MabiaoEvaluator v-if="openEvaluateDialog" :mabiao="toValue(dataRef!)" />
  </QDialog>
  <!-- 赛码文章卡片 -->
  <QCard
    style="height: 240px;"
    @drop.prevent="onDrop"
    @dragover.prevent
    @dragenter.prevent
    @dragleave.prevent
  >
    <!-- 空状态 -->
    <div
      v-if="!dataRef"
      class="column flex-center cursor-pointer bg-grey-1"
      style="height: 100%;padding-bottom: 1rem;"
      @click="e => openDialog = true"
    >
      <div class="row flex-center">
        <QIcon :name="mdiPlusBoxOutline" size="xl" color="grey" />
      </div>
      <div class="text-grey-7 q-mt-sm text-center">
        拖动文件至此，或者点击详细操作
      </div>
    </div>
    <!-- 有数据之后显示卡片 -->
    <template v-else>
      <QCardSection>
        <div class="row justify-evenly ">
          <div>
            <div class="text-overline">
              {{ dataRef.name }}
            </div>
            <!-- 显示码表前几行 -->
            <div class="font-monospace text-grey text-truncate" style="max-width: 14rem;max-height: 7.8rem;">
              <div v-for="i of dataRef.items!.slice(0, 6)" v-once :key="i.join('')">
                {{ `${i[1]}\t${i[0]}` }}
              </div>
            </div>
          </div>
          <QSeparator vertical class="q-mx-sm" />
          <!-- 展示方案的基本信息 -->
          <div class="column justify-end" style="height: 9.5rem;">
            <div class="text-blue-grey-9">
              码表格式:{{ platToName[dataRef.plat!] }}
            </div>
            <div class="text-blue-grey-9">
              共 {{ dataRef.items!.length }} 行
            </div>
            <div class="text-blue-grey-9">
              上屏码长 {{ dataRef.cmLen }}
            </div>
            <div class="text-blue-grey-9">
              选重键 <kbd>{{ dataRef.selectKeys }}</kbd>
            </div>
          </div>
        </div>
      </QCardSection>

      <QCardActions class="col-2 justify-around bg-blue-grey-1 collumn">
        <QBtn :icon="mdiScale" flat class="col" @click="openEvaluateDialog = true">
          <QTooltip>单字测评、组词测评、码表分析</QTooltip>
          测 评
        </QBtn>
        <QBtn
          :icon="mdiTextBoxEditOutline" flat class="col"
          @click="openDialog = true"
        >
          <QTooltip>配置码表的基本参数</QTooltip>
          配 置
        </QBtn>
        <QBtn
          :icon="mdiTrashCanOutline" color="negative" flat class="col "
          @click="dataRef = null"
        >
          <QTooltip>删除码表</QTooltip>
          删 除
        </QBtn>
      </QCardActions>
    </template>
  </QCard>
</template>
