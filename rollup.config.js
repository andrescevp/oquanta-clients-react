import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import autoprefixer from 'autoprefixer';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';
import tailwindcss from 'tailwindcss';

export default {
  input: 'src/sdk/survey-form/index.ts',
  output: [
    {
      file: 'dist/sdk/survey-form/index.js',
      format: 'cjs',
      sourcemap: true
    },
    {
      file: 'dist/sdk/survey-form/index.esm.js',
      format: 'esm',
      sourcemap: true
    }
  ],
  plugins: [
    peerDepsExternal(),
    resolve(),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.sdk.form.json',
      declaration: true,
      declarationDir: 'dist/sdk/survey-form',
      rootDir: './src'
    }),
    postcss({
      plugins: [
        tailwindcss('./tailwind.config.js'),
        autoprefixer()
      ],
      extract: 'survey-form-sdk.css',
      minimize: true
    }),
    terser()
  ],
  external: [
    'react', 
    'react-dom', 
    'react-hook-form', 
    'react-i18next'
  ]
};