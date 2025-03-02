const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // // Añadimos una regla específica para manejar imágenes con parámetros de consulta
      // const imageRule = webpackConfig.module.rules.find(rule => rule.test && rule.test.test('.svg'));
      
      // // Modificamos las reglas existentes para excluir los archivos con parámetros de consulta
      // if (imageRule) {
      //   imageRule.exclude = /\.(gif|png|jpe?g|svg|tiff|webp)$/i;
      // }

      // Añadir soporte para WebP
      webpackConfig.module.rules.push({
        test: /\.(gif|png|jpe?g|svg|avif|webp)$/i,
        type: "asset",
      });

      // Añadir plugin de optimización de imágenes
      webpackConfig.optimization.minimizer.push(
        new ImageMinimizerPlugin({
          minimizer: {
            implementation: ImageMinimizerPlugin.sharpMinify,
            options: {
              encodeOptions: {
                jpeg: {
                  // https://sharp.pixelplumbing.com/api-output#jpeg
                  quality: 100,
                },
                webp: {
                  // https://sharp.pixelplumbing.com/api-output#webp
                  lossless: true,
                },
                avif: {
                  // https://sharp.pixelplumbing.com/api-output#avif
                  lossless: true,
                },
  
                // png by default sets the quality to 100%, which is same as lossless
                // https://sharp.pixelplumbing.com/api-output#png
                png: {},
  
                // gif does not support lossless compression at all
                // https://sharp.pixelplumbing.com/api-output#gif
                gif: {},
              },
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