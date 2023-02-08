const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')
const resolve = dir => path.join(__dirname, dir)
module.exports = {
  mode: 'none',
  entry: './src/index.js',
  output: {
    path: path.join(__dirname,"/dist"),
    filename: 'pgh-lib.js',  
    libraryTarget: 'umd',  //�õ���ģ�鶨��淶
    library: 'pgh-lib',   //�������
    libraryExport: 'default'
  },
  resolve: {
      alias: {
        '@': resolve('src')
      }
    },
  externals : {
    vue: {
      root: "Vue",   //ͨ�� script ��ǩ���룬��ʱȫ�ֱ����п��Է��ʵ��� Vue
      commonjs: "vue",  //���Խ�vue��Ϊһ�� CommonJS ģ�����
      commonjs2: "vue",  //����������ƣ����������� module.exports.default
      amd: "vue"   //������ commonjs����ʹ�� AMD ģ��ϵͳ
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use:  ['vue-loader']
      },
      {
        test: /\.css$/,
        use:  ['css-loader','postcss-loader']
      },
      {
          test: /\.s[ac]ss$/i,
          use:  ['css-loader','postcss-loader','sass-loader']
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ]
}
