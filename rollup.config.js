import nodeResolve from "@rollup/plugin-node-resolve";
import svg from 'rollup-plugin-svg';
import css from "rollup-plugin-import-css";

const baseConfig = {
  input: 'src/geotrace.js',
  output: {
    file: 'dist/geotrace.js',
    format: 'esm'
  },
  plugins: [
    css({
      output: 'geotrace.css',
    }),
    nodeResolve(),
    svg(),
  ],
}

const esmConfig = {
  ...baseConfig,
  output: {
    file: 'dist/geotrace.esm.js',
    format: 'es',
  },
};

/**
 * There are both named exports and a default export in `geotrace.js`, but that
 * doesn't work for UMD bundles, as the RollupError reports: "Consumers of your
 * bundle will have to use chunk.default to access their default export, which
 * may not be what you want. Use `output.exports: "named"` to disable this
 * warning." Ideally we should reorganize the exports in geotrace.js.
 * @see https://rollupjs.org/configuration-options/#output-exports
 * @see https://rollupjs.org/configuration-options/#output-name
 */
const umdNamedExportOptions = {
  exports: 'named',
  name: 'geotrace',
};

const umdConfig = {
  ...baseConfig,
  output: {
    file: 'dist/geotrace.umd.js',
    format: 'umd',
    ...umdNamedExportOptions,
  },
};

export default [
  esmConfig,
  umdConfig,
];
