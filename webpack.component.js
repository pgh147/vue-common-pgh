const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const resolve = dir => path.join(__dirname, dir)
module.exports = {
  mode: 'none',
  entry: {
	  'pgh-lib':'./src/index.js',
	  'hxRadioGroup':'./src/components/HxRadioGroup/inde.js',
	  'hxSteps':'./src/components/HxSteps/inde.js'
  },
  output: {
  path: path.join(__dirname,"/lib"),
  publicPath:process.env.NODE_ENV=='development'?'/dist/':'../',
  filename: '[name].js',
  libraryTarget: 'umd',
  library: '[name]',
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
       // use:  ['vue-loader']
		use: [{
		   loader: "vue-loader",
		   options: {
			loaders: {
				scss: [
                  'vue-style-loader',
                  MiniCssExtractPlugin.loader,
                  'css-loader?sourceMap',
                  'sass-loader?sourceMap'
                ],
                css: [                   
                 'vue-style-loader',
                  MiniCssExtractPlugin.loader,
                  'css-loader?sourceMap'
                ]

		   }
		  }
		}],
		
		
		
		
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
    new VueLoaderPlugin(),
//	new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
  //    filename: "[name].css",
    //  chunkFilename: "[id].css",
    //})
  ]
}
