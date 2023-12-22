<script setup lang="ts">
import { shallowRef, watchEffect } from 'vue'
import { mdiPlusBoxOutline, mdiScale, mdiTextBoxEditOutline, mdiTrashCanOutline } from '@quasar/extras/mdi-v7'
import LoadFile from 'components/loadFile/LoadFile.vue'
import RawFile from 'src/libs/platforms/rawFile'
import { type Schema, countDictItems, createEmptySchema } from 'libs/schema'
import { removeFileNameExt } from 'src/libs/utils/string'
import { platAuto } from 'src/libs/platforms/autoplat'

const emits = defineEmits<{
  value: [value: Schema | null]
}>()

const openDialog = shallowRef(false)

const dataRef = shallowRef<Schema | null>(null)

watchEffect(() => {
  emits('value', dataRef.value)
})

function onDrop(e: DragEvent) {
  const f = e.dataTransfer?.files[0]
  if (!f)
    throw new Error('无法识别文件')
  const rawfile = new RawFile(f)
  rawfile.getText().then((txt) => {
    const result = createEmptySchema()
    result.cfg.name = removeFileNameExt(rawfile.name)
    result.cfg.txt = txt
    dataRef.value = result
  })
}

async function onGetNewSchema(sch: Schema) {
  const raw = sch.cfg.raw!
  const isDict = await platAuto.validate(raw)
  if (!isDict)
    throw new TypeError(`无法解析码表${sch.cfg.name}`)
  dataRef.value = await platAuto.load(raw)
  dataRef.value.cfg = sch.cfg
  openDialog.value = false
}
</script>

<template>
  <!-- 编码码表的弹窗 -->
  <QDialog v-model="openDialog">
    <LoadFile
      dict-mode
      :preset="dataRef!"
      @value="onGetNewSchema"
    />
  </QDialog>
  <!-- 赛码文章卡片 -->
  <QCard
    style="height: 15rem;"
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
        <div class="row justify-evenly">
          <div>
            <div class="text-overline">
              {{ dataRef.cfg.name }}
            </div>
            <!-- 显示码表前几行 -->
            <div class="font-monospace text-grey text-truncate" style="max-width: 14rem;">
              <div v-for="i of dataRef.dicts[0].items.slice(0, 6)" :key="i[0]">
                {{ `${i[1]}\t${i[0]}` }}
              </div>
            </div>
          </div>
          <QSeparator vertical class="q-mx-sm" />
          <!-- 展示方案的基本信息 -->
          <div class="column justify-end" style="height: 9.7rem;">
            <div class="text-blue-grey-9">
              共 {{ countDictItems(dataRef) }} 行
            </div>
            <div class="text-blue-grey-9">
              上屏码长 {{ dataRef.cfg.cmLen }}
            </div>
            <div class="text-blue-grey-9">
              选重键 <kbd>{{ dataRef.cfg.selectKeys }}</kbd>
            </div>
          </div>
        </div>
      </QCardSection>

      <QCardActions class="col-2 justify-around bg-blue-grey-1 collumn">
        <QBtn :icon="mdiScale" flat class="col ">
          <QTooltip>单字测评、组词测评、码表分析</QTooltip>
          测 评
        </QBtn>
        <QBtn
          :icon="mdiTextBoxEditOutline" flat class="col"
          @click="e => openDialog = true"
        >
          <QTooltip>配置码表的基本参数</QTooltip>
          配 置
        </QBtn>
        <QBtn
          :icon="mdiTrashCanOutline" color="negative" flat class="col "
          @click="e => dataRef = null"
        >
          <QTooltip>删除码表</QTooltip>
          删 除
        </QBtn>
      </QCardActions>
    </template>
  </QCard>
</template>
