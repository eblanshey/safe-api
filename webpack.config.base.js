'use strict';
var path = require('path');

//var reactExternal = {
//  root: 'React',
//  commonjs2: 'react',
//  commonjs: 'react',
//  amd: 'react'
//}

module.exports = {
  externals: {
    'react': 'react',
    'react-dom': 'react-dom'
  },
  module: {
    loaders: [
      { test: /\.js$/, loaders: ['babel-loader'], exclude: /node_modules/ }
    ]
  },
  output: {
    library: 'safe-api',
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['', '.js'],
    fallback: [path.join(__dirname, 'node_modules')]
  },
  resolveLoader: {
    fallback: [path.join(__dirname, 'node_modules')]
  }
};