module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/' : './',
  lintOnSave: process.env.NODE_ENV === 'production' ? false : true,
  productionSourceMap: false,
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import '@/styles/global.scss';`
      }
    }
  },
  devServer: {
    open: true,
    proxy: {
      [process.env.VUE_APP_BASEURL]: {
        target: 'http://120.25.120.118:58080',
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASEURL]: ''
        }
      }
    }
  }
};
