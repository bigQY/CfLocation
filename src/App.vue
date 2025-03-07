<template>
  <div style="width: 100%; max-height: 90vh; text-align: center">
    <div style="display: flex; justify-content: center">
      <a-card
        :loading="isLoad"
        :title="$t('ipLocInfo')"
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
        <div
          id="mapContainer"
          style="
            height: 100%;
            width: 100%;
            margin: 0 auto;
            border-bottom-right-radius: 10px;
            border-bottom-left-radius: 10px;
          "
        ></div>
      </a-card>
    </div>
  </div>
</template>

<script>
import api from './api'
import { UndoOutlined } from '@ant-design/icons-vue'
import 'leaflet/dist/leaflet.css'
import 'leaflet/dist/leaflet.js'
import 'leaflet/dist/images/marker-icon-2x.png'
import 'leaflet/dist/images/marker-icon.png'
import 'leaflet/dist/images/marker-shadow.png'

export default {
  name: 'App',
  components: {
    UndoOutlined
  },
  data() {
    return {
      local: 'zhCN',
      loc: {
        'cf-connecting-ip': this.$t('loadingLoc'),
        'cf-ipcity': this.$t('loadingLoc'),
        'cf-ipcountry': this.$t('loadingLoc'),
        'cf-iplatitude': this.$t('loadingLoc'),
        'cf-iplongitude': this.$t('loadingLoc'),
        'cf-region-code': this.$t('loadingLoc')
      },
      locDict: {
        'cf-connecting-ip': this.$t('ipAddress'),
        'cf-ipcity': this.$t('city'),
        'cf-ipcountry': this.$t('country'),
        'cf-iplatitude': this.$t('latitude'),
        'cf-iplongitude': this.$t('longitude'),
        'cf-region-code': this.$t('regionCode')
      },
      isLoad: true
    }
  },
  methods: {
    async getLocation() {
      return api.getLoc()
    },
    initData() {
      this.isLoad = true
      this.getLocation().then((res) => {
        const data = res.data
        // 如果loc含有对应的key，则更新loc对应的value
        for (const key in data) {
          if (Object.prototype.hasOwnProperty.call(this.loc, key)) {
            this.loc[key] = data[key]
          }
        }
        this.isLoad = false
        this.$nextTick(() => {
          this.initMap()
        })
      })
    },
    setMapHeight() {
      const cardHeight = document.querySelector('.ant-card').offsetHeight
      const headHeight = document.querySelector('.ant-card-head').offsetHeight
      const bodyHeight = document.querySelector('.ant-card-body').offsetHeight
      const mapHeight = cardHeight - headHeight - bodyHeight
      document.querySelector('#mapContainer').style.height = mapHeight + 'px'
    },
    async initMap() {
      // user in China
      if (this.loc['cf-ipcountry'] === 'CN') {
        await this.$AMapLoader
          .load({
            key: '0bd67b1b8c7942f3c11d8a663a9d50dc',
            version: '2.0'
          })
          .then((AMap) => {
            const map = new AMap.Map('mapContainer')
            map.setZoom(10)
            map.setCity(this.loc['cf-ipcity'])
            const marker = new AMap.Marker({
              position: [this.loc['cf-iplongitude'], this.loc['cf-iplatitude']],
              title: 'IP 位置',
              map: map
            })
          })
          .catch((e) => {
            console.error(e)
          })
        return
      } else {
        // user outside China
        // leflet map with openstreetmap

        // 修复地图白线问题
        var originalInitTile = L.GridLayer.prototype._initTile
        L.GridLayer.include({
          _initTile: function (tile) {
            originalInitTile.call(this, tile)

            var tileSize = this.getTileSize()

            tile.style.width = tileSize.x - 0.8 + 'px'
            tile.style.height = tileSize.y - 0.8 + 'px'
          }
        })

        const map = L.map('mapContainer').setView(
          [this.loc['cf-iplatitude'], this.loc['cf-iplongitude']],
          10
        )

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution:
            'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
        }).addTo(map)

        L.marker([this.loc['cf-iplatitude'], this.loc['cf-iplongitude']])
          .addTo(map)
          .bindPopup('IP 位置')
          .openPopup()

        // 调用invalidateSize方法
        this.$nextTick(() => {
          map.invalidateSize()
        })

        return
      }
    }
  },
  computed: {},
  watch: {
    isLoad() {
      if (!this.isLoad) {
        this.$nextTick(() => {
          this.setMapHeight()
        })
      }
    }
  },
  mounted() {
    this.initData()
  }
}
</script>
<style scoped>
.ant-card-body {
  border-radius: 10px;
}
</style>
