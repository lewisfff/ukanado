import babel from 'rollup-plugin-babel';

export default {
  entry: 'src/core.js',
  format: 'cjs',
  plugins: [ babel() ],
  dest: 'core.js'
};