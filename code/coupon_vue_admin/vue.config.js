module.exports = {
    // publicPath: './',
    productionSourceMap: false,
    devServer: {
        // port: 8081,
        // proxy: 'http://2y48108v47.zicp.vip/',
        // changeOrigin: true,
    },
    chainWebpack: config => {
        // 移除 prefetch 插件
        config.plugins.delete('prefetch')
    }
}