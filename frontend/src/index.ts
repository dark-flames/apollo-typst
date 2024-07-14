import './typst.css'; 

import * as Typst from '@myriaddreamin/typst.ts/dist/esm/main.mjs';

import '@myriaddreamin/typst-ts-renderer/pkg/typst_ts_renderer_bg.wasm';

import './render'


export default {
    ...Typst,
};