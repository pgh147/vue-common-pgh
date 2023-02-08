const path = require('path')
const resolve = dir => path.join(__dirname, dir)
const StylelintPlugin = require('stylelint-webpack-plugin')
const {
  NODE_ENV,
  DEVSERVERPORT
} = process.env

module.exports = {
  devServer: {
    port: Number(DEVSERVERPORT),
    open: true,
    hotOnly: false,
    proxy: {
      // /v1/requiredStoneList/
      // '/idoAPI/v1/requiredStoneList/': {
      // target: 'http://hscm-test.idolove.com/',
      //   target: 'http://172.30.14.184:8083',
      //   secure: false,
      //   ws: true,
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/idoAPI/v1': ''
      //   }
      // },

      // /v1/gemsDiscountCoefficientStep/exportListItem

      // http://172.30.8.225:8081/

      // http://172.30.8.225:8083/

      // /reverseMouldGoldPrice/selectReverseMouldGoldPricePage/v1/gemsDiscount/

      // /v1/certificate/detail/importListItem

      '/idoAPI/v1/storeDirectMail/': {
        // target: 'http://hscm-test.idolove.com/',
        target: 'http://d972-210-21-235-83.ngrok.io/',
        secure: false,
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/idoAPI': ''
        }
      },

      // '/idoAPI/v1/gemsDiscountCoefficientStep/': {
      //   target: 'http://172.30.8.225:8081/',
      //   secure: false,
      //   ws: true,
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/idoAPI': ''
      //   }
      // },

      // '/idoAPI/v1/tatioDiscount/': {
      //   // target: 'http://hscm-test.idolove.com/',
      //   target: 'http://172.30.8.225:9004/',
      //   secure: false,
      //   ws: true,
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/idoAPI/v1': ''
      //   }
      // },

      // http://172.30.8.225:9004/

      // '/idoAPI/v1/discountDict': {
      //   // target: 'http://hscm-test.idolove.com/',
      //   target: 'http://172.30.8.225:9004/',
      //   secure: false,
      //   ws: true,
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/idoAPI': ''
      //   }
      // },

      // '/idoAPI/v1/goldWeightRelevance': {
      //   // target: 'http://hscm-test.idolove.com/',
      //   target: 'http://oy44688621.zicp.vip',
      //   secure: false,
      //   ws: true,
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/idoAPI/v1': ''
      //   }
      // },
      // '/idoAPI/v1/directSecurityDistributionDetail': {
      //   // target: 'http://hscm-test.idolove.com/',
      //   target: 'http://192.168.7.11:8081/',
      //   secure: false,
      //   ws: true,
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/idoAPI': ''
      //   }
      // },
      // '/idoAPI/v1/totalTemplateLibrary': {
      //   // target: 'http://hscm-test.idolove.com/',
      //   target: 'https://64a6-113-106-166-26.ngrok.io/',
      //   secure: false,
      //   ws: true,
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/idoAPI/v1': ''
      //   }
      // },
      // '/idoAPI/v1/businessModule': {
      //   // target: 'http://hscm-test.idolove.com/',
      //   target: 'http://oy44688621.zicp.vip/workflow',
      //   secure: false,
      //   ws: true,
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/idoAPI/v1/businessModule': ''
      //   }
      // },
      // '/idoAPI/v1/bareStone': {
      //   // target: 'http://hscm-test.idolove.com/',
      //   target: 'http://172.30.8.225:8083/',
      //   secure: false,
      //   ws: true,
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/idoAPI/v1': ''
      //   }
      // },
      // '/idoAPI/v1/bom/uploadImage': {
      //   // target: 'http://hscm-test.idolove.com/',
      //   target: 'http://192.168.7.11:8081/',
      //   secure: false,
      //   ws: true,
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/idoAPI': ''
      //   }
      // },
      '/idoAPI': {
        // target: 'http://hscm-test.idolove.com/',
        target: 'http://hscm-stg.idolove.com/',
        secure: false,
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/idoAPI': ''
        }
      },
      '/idSSOAPI': {
        target: 'http://hscm-stg.idolove.com/',
        // target: 'http://hscm-test.idolove.com/',
        secure: false,
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/idSSOAPI': ''
        }
      }
    },
    disableHostCheck: true
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
    optimization: NODE_ENV === 'production' ? {
      // 分割代码块
      splitChunks: {
        cacheGroups: {
          // 公用模块抽离
          common: {
            chunks: 'initial',
            minSize: 0, // 大于0个字节
            minChunks: 2 // 抽离公共代码时，这个代码块最小被引用的次数
          },
          // 第三方库抽离
          vendor: {
            priority: 1, // 权重
            test: /node_modules/,
            chunks: 'initial',
            minSize: 0, // 大于0个字节
            minChunks: 2 // 在分割之前，这个代码块最小应该被引用的次数
          }
        }
      }
    } : {},
    plugins: [
      new StylelintPlugin({
        files: ['**/src/*.{html,vue,css,sass,scss}'],
        fix: false,
        cache: true,
        failOnError: false
      })
    ]
  },
  chainWebpack(config) {
    // 移除prefetch插件，避免加载多余的资源
    config.plugins.delete('prefetch')
    // 移除 preload 插件，避免加载多余的资源
    config.plugins.delete('preload')
    // 配置svg规则排除icons目录中svg文件处理
    config.module
      .rule('svg')
      .exclude.add(resolve('src/assets/icons'))
      .end()

    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
  }
}
