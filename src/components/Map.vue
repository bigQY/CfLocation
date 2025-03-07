<template>
  <div ref="mapContainer" style="height: 100%; width: 100%" :style="props.style"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'
import 'leaflet/dist/leaflet.css'
import 'leaflet/dist/leaflet.js'

const props = defineProps({
  loc: {
    type: Object,
    required: true
  },
  mapType: {
    type: String,
    required: true
  },
  style: {
    type: Object,
    required: false
  }
})

const mapContainer = ref(null)
let map = null
let leafletWhiteLinesFixed = false

const fixLeafletWhiteLines = () => {
  if (!leafletWhiteLinesFixed) {
    var originalInitTile = L.GridLayer.prototype._initTile
    L.GridLayer.include({
      _initTile: function (tile) {
        originalInitTile.call(this, tile)
        var tileSize = this.getTileSize()
        tile.style.width = tileSize.x - 0.8 + 'px'
        tile.style.height = tileSize.y - 0.8 + 'px'
      }
    })
    leafletWhiteLinesFixed = true
  }
}

const initMap = async () => {
  if (props.mapType === 'amap') {
    await initAmap()
  } else if (props.mapType === 'leaflet') {
    await initLeaflet()
  } else {
    // user in China
    if (props.loc['cf-ipcountry'] === 'CN') {
      await initAmap()
    } else {
      // user outside China
      await initLeaflet()
    }
  }
}

const initAmap = async () => {
  await AMapLoader.load({
    key: '0bd67b1b8c7942f3c11d8a663a9d50dc',
    version: '2.0'
  })
    .then((AMap) => {
      map = new AMap.Map(mapContainer.value)
      map.setZoom(8)
      map.setCenter([props.loc['cf-iplongitude'], props.loc['cf-iplatitude']])
      const marker = new AMap.Marker({
        position: [props.loc['cf-iplongitude'], props.loc['cf-iplatitude']],
        title: 'IP 位置',
        map: map
      })
    })
    .catch((e) => {
      console.error(e)
    })
}

const initLeaflet = async () => {
  fixLeafletWhiteLines()

  map = L.map(mapContainer.value).setView(
    [props.loc['cf-iplatitude'], props.loc['cf-iplongitude']],
    10
  )

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
  }).addTo(map)

  L.marker([props.loc['cf-iplatitude'], props.loc['cf-iplongitude']])
    .addTo(map)
    .bindPopup('IP 位置')
    .openPopup()

  // 调用invalidateSize方法
  nextTick(() => {
    map.invalidateSize()
  })
}

onMounted(() => {
  initMap()
})

onBeforeUnmount(() => {
  if (map) {
    map.remove()
  }
})

// 监听loc变化，重新初始化地图
watch(
  () => props.loc,
  () => {
    if (map) {
      map.remove()
    }
    nextTick(() => {
      initMap()
    })
  },
  { deep: true }
)

// 监听style变化，重新设置地图高度
watch(
  () => props.style,
  () => {
    if (map && map.invalidateSize) {
      nextTick(() => {
        map.invalidateSize()
      })
    }
  },
  { deep: true }
)
</script>
