# CfLocation

利用cloudflare提供的功能,根据IP地址获取地理位置信息。

## Demo

[https://iploc.zzdx.us.kg/](https://iploc.zzdx.us.kg/)

## 部署方法

1. 克隆本项目
2. 在cloudflare创建一个pages项目
3. 通过git方式部署pages
4. 框架预设选择vue即可
5. 确认部署
6. 开启cloudflare控制面板转换规则中的添加访问者位置标头选项

## 项目亮点

1. **基于Vue 3和Vite构建**：使用现代化的前端框架Vue 3和构建工具Vite，提供快速的开发体验和高效的构建性能。
2. **国际化支持**：通过`vue-i18n`实现中英文双语支持，自动检测浏览器语言并切换。
3. **Ant Design Vue集成**：使用Ant Design Vue组件库，提供优雅的UI组件和良好的用户体验。
4. **实时IP地理位置获取**：利用Cloudflare提供的功能，根据访问者的IP地址实时获取地理位置信息。
5. **高德地图集成**：通过高德地图API展示IP地址对应的地理位置，提供直观的地图展示效果。
6. **响应式设计**：使用CSS变量和媒体查询，支持深色模式和不同设备的响应式布局。
7. **代码风格统一**：集成ESLint和Prettier，确保代码风格一致性和可维护性。