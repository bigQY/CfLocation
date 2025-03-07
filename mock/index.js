export default [
  {
    url: '/loc',
    method: 'get',
    response: () => {
      return {
        'cf-connecting-ip': '1.2.3.4',
        'cf-connecting-o2o': '1',
        'cf-ipcity': 'Tokyo',
        'cf-ipcontinent': 'AS',
        'cf-ipcountry': 'JP',
        'cf-iplatitude': '35.68930',
        'cf-iplongitude': '139.68990',
        'cf-postal-code': '102-0082',
        'cf-ray': '91807f604da2d753',
        'cf-region': 'Tokyo',
        'cf-region-code': '13',
        'cf-timezone': 'Asia/Tokyo',
        'cf-visitor': '{"scheme":"https"}'
      }
    }
  }
]
