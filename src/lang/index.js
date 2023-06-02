import { createI18n } from 'vue-i18n'

import enUS from "./en_US";
import zhCN from "./zh_CN";

const browserLanguage = (navigator.language || navigator.browserLanguage).toLowerCase();

const messages = {
  "en-us": enUS,
  "zh-cn": zhCN,
}

const i18n = createI18n({
  locale: browserLanguage,
  fallbackLocale: 'en-us',
  messages,
})

export default i18n