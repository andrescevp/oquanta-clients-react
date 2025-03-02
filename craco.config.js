const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Añadir soporte para WebP
      webpackConfig.module.rules.push({
        test: /\.(jpe?g|png)$/i,
        use: [
          {
            loader: 'webp-loader',
            options: {
              quality: 80
            }
          }
        ]
      });

      // Añadir plugin de optimización de imágenes
      webpackConfig.optimization.minimizer.push(
        new ImageMinimizerPlugin({
          minimizer: {
            implementation: ImageMinimizerPlugin.imageminMinify,
            options: {
              plugins: [
                ['mozjpeg', { quality: 80 }],
                ['pngquant', { quality: [0.6, 0.8] }],
                ['imagemin-webp', { quality: 80 }]
              ]
            }
          },
          generator: [
            {
              preset: 'webp',
              implementation: ImageMinimizerPlugin.imageminGenerate,
              options: {
                plugins: ['imagemin-webp']
              }
            }
          ]
        })
      );

      return webpackConfig;
    }
  }
};