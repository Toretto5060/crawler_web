module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? './' : './',
  // 将构建好的文件输出到哪里
  outputDir: process.env.NODE_ENV === 'production' ? 'dist_pro' : 'dist_dev',
  lintOnSave:false, //关闭eslint警告
  devServer: {
    // host: 'localhost',
    port: 6060,
    open: false,
    before: app => { }
  }
}
