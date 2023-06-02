<template>
  <div style="width: 100%;max-height: 90vh;text-align: center;">
    <div style="display: flex;justify-content: center;">
      <a-card :loading="isLoad" :title="$t('ipLocInfo')" hoverable style="width: 90vw;margin: 4vh auto;height: 90vh;">
        <template #extra>
          <a-button type="primary" shape="circle" @click="initData">
            <template #icon><undo-outlined /></template>
          </a-button>
        </template>
        <a-list bordered>
          <a-list-item v-for="(value, key) in loc" :key="key">
            <a-list-item-meta :title="locDict[key]" />
            <a-list-item-meta :description="value" />
          </a-list-item>
        </a-list>
        <div id="mapContainer" style="height: 100%;width:100%;margin: 0 auto;"></div>
      </a-card>
    </div>
  </div>
</template>

<script>
import api from './api'
import { UndoOutlined } from '@ant-design/icons-vue';

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
      isLoad: true,
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
        this.loc['cf-connecting-ip'] = data['cf-connecting-ip']
        this.loc['cf-ipcity'] = data['cf-ipcity']
        this.loc['cf-ipcountry'] = data['cf-ipcountry']
        this.loc['cf-iplatitude'] = data['cf-iplatitude']
        this.loc['cf-iplongitude'] = data['cf-iplongitude']
        this.loc['cf-region-code'] = data['cf-region-code']
        this.isLoad = false
        this.initMap()
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
      AMapLoader.load({
        key: "0bd67b1b8c7942f3c11d8a663a9d50dc",
        version: "2.0",
      }).then((AMap) => {
        let convertedPoints;
        AMap.convertFrom([this.loc['cf-iplongitude'], this.loc['cf-iplatitude']], 'gps', function (status, result) {
          if (result.info === 'ok') {
            convertedPoints = [result.locations[0].lng, result.locations[0].lat];
            const map = new AMap.Map('mapContainer');
            map.setZoom(10);
            map.setCenter(convertedPoints);
            const marker = new AMap.Marker({
              position: convertedPoints,
              title: 'IP 位置',
              map: map
            });
          }
        });
      }).catch((e) => {
        console.error(e);
      });
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
</style>
