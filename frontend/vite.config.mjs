import { resolve } from 'path';
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { normalizePath } from 'vite';

export default defineConfig({
  plugins: [
    viteSingleFile(),
    viteStaticCopy({
      targets: [
        {
          src: normalizePath(
            resolve(
              __dirname,
              '../node_modules/@myriaddreamin/typst-ts-renderer/pkg/typst_ts_renderer_bg.wasm',
            ),
          ),
          dest: resolve(__dirname, '../static/wasm/'),
        },
      ],
    }),
  ],
  resolve: {
    preserveSymlinks: true, // this is the fix!
  },
  build: {
    minify: false,
    cssCodeSplit: false,
    emptyOutDir: true, // also necessary
    outDir: resolve(__dirname, '../static/apollo-typst'),
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'TypstApollo',
      // the proper extensions will be added
      fileName: 'apollo.typst',
    },
  },
  rollupOptions: {
    output: {
      assetFileNames: (assetInfo) => {
        if (assetInfo.name == 'style.css')
          return 'apollo.typst.css';
        return assetInfo.name;
      },
    }
  }
});
