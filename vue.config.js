const { defineConfig } = require('@vue/cli-service')
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = defineConfig({
  transpileDependencies: true,
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "@/assets/styles/index.scss";`
        //����ȫ�ֱ���
      }
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        "@": resolve("src")
      },
      fallback: {
        path: false
      }
    },
  }
})
