import './typst.css'; 

const Typst = require('@myriaddreamin/typst.ts/dist/esm/main.bundle.js');
import * as SVG from './svg'
import '@myriaddreamin/typst-ts-renderer/pkg/typst_ts_renderer_bg.wasm';


export default {
    ...Typst,
    ...SVG
};