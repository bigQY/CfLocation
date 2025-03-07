<template>
  <div style="width: 100%; height: 90vh; text-align: center">
    <div style="display: flex; justify-content: center">
      <a-card
        :loading="isLoad"
        :title="t('ipLocInfo')"
        hoverable
        style="width: 90vw; margin: 4vh auto; height: 90vh; border-radius: 10px"
      >
        <template #extra>
          <a-button type="primary" shape="circle" @click="initData">
            <template #icon><undo-outlined /></template>
          </a-button>
        </template>
        <a-list bordered style="border-top-left-radius: 10px; border-top-right-radius: 10px">
          <a-list-item v-for="(value, key) in loc" :key="key">
            <a-list-item-meta :title="locDict[key]" />
            <a-list-item-meta :description="value" />
          </a-list-item>
        </a-list>
        <Map :loc="loc" mapType="auto" v-model:style="mapStyle" />
      </a-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import api from './api'
import { UndoOutlined } from '@ant-design/icons-vue'

import Map from './components/Map.vue'

const { t } = useI18n()

const isLoad = ref(true)
const loc = reactive({
  'cf-connecting-ip': t('loadingLoc'),
  'cf-ipcity': t('loadingLoc'),
  'cf-ipcountry': t('loadingLoc'),
  'cf-iplatitude': t('loadingLoc'),
  'cf-iplongitude': t('loadingLoc'),
  'cf-region-code': t('loadingLoc')
})
const locDict = {
  'cf-connecting-ip': t('ipAddress'),
  'cf-ipcity': t('city'),
  'cf-ipcountry': t('country'),
  'cf-iplatitude': t('latitude'),
  'cf-iplongitude': t('longitude'),
  'cf-region-code': t('regionCode')
}
const mapStyle = reactive({
  height: '100%',
  width: '100%'
})

const getLocation = async () => {
  return api.getLoc()
}

const initData = () => {
  isLoad.value = true
  getLocation().then((res) => {
    const data = res.data
    // 如果loc含有对应的key，则更新loc对应的value
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(loc, key)) {
        loc[key] = data[key]
      }
    }
    isLoad.value = false
  })
}

const setMapHeight = () => {
  const cardHeight = document.querySelector('.ant-card').offsetHeight
  const headHeight = document.querySelector('.ant-card-head').offsetHeight
  const bodyHeight = document.querySelector('.ant-card-body').offsetHeight
  const mapHeight = cardHeight - headHeight - bodyHeight
  if (mapHeight > 0) {
    mapStyle.height = mapHeight + 'px'
  }
}

watch(isLoad, (newVal) => {
  if (!newVal) {
    nextTick(() => {
      setMapHeight()
    })
  }
})

onMounted(() => {
  initData()
})
</script>

<style scoped>
.ant-card-body {
  border-radius: 10px;
}
</style>
