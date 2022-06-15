// 通过chainWebpack自定义打包
// 使用 module.exports 向外暴露
module.exports = {
  // 使用 chainWebpack 生成节点，通过config来接收webpack配置对象
  chainWebpack: config => {
    // config.when()判断当前处于什么样的编译模式 
    config.when(process.env.NODE_ENV === "production", config => {
      // 满足开发阶段，调用entry()进入到默认打包入口，调用clear()将默认打包入口清空，再通过add新增自定义的打包入口
      config
        .entry("app")
        .clear()
        .add("./src/main-prod.js")

      config //生成项目体积大小报告--webpack-bundle-analyzer在链式中引用
        .plugin('webpack-bundle-analyzer')
        .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)

      config.set('externals', {
        // 键值对形式 "挂载在全局的变量名称" ："引入的模块名称"
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        nprogress: 'NProgress'
      })
    })
    config.when(process.env.NODE_ENV === "development", config => {
      config
        .entry("app")
        .clear()
        .add("./src/main-dev.js")
    })
  }
}

// 生成项目体积大小报告--webpack-bundle-analyzer在对象中引用
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// module.exports = {
//   configureWebpack: {
//     plugins: [
//       new BundleAnalyzerPlugin()
//     ]
//   }
// }

// module.exports = {
//   proxy正向代理方法
//   devServer: {
//     proxy: {
//       '/': {
//         target: 'http://localhost:3000',
//         changeOrigin: true
//       }
//     }
//   }
// }
