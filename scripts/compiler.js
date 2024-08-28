const { NodeCompiler, DynLayoutCompiler } = require('@myriaddreamin/typst-ts-node-compiler');
const { resolve } = require('path');
const breakpoints = require('../frontend/breakpoints.json');

breakpoints.reverse();

class Compiler {
  constructor({ baseDir }) {
    this.baseDir = baseDir;
    const fonts = resolve(this.baseDir, 'fonts');
    const assetsFonts = resolve(this.baseDir, 'assets/fonts');
    const assetFonts = resolve(this.baseDir, 'asset/fonts');
    console.log(
      '[typst] using fonts in',
      resolve(this.baseDir, '{fonts,assets/fonts,asset/fonts}'),
    );
    const compileArgs = {
      workspace: this.baseDir,
      fontArgs: [{ fontPaths: [fonts, assetsFonts, assetFonts] }],
      // todo: move this to session after we fixed the bug
      inputs: { 'x-target': 'web-light' },
    };
    // layout_widths: LayoutWidths::from_iter(
    //     (0..40).map(|i| {
    //         typst::layout::Abs::pt(750.0) - typst::layout::Abs::pt(i as f64 * 10.0)
    //     }),
    // ),
    this.base = NodeCompiler.create(compileArgs);
    const dyn = target => {
      const c = DynLayoutCompiler.fromBoxed(NodeCompiler.create(compileArgs).intoBoxed());
      c.setTarget(target);
      c.setLayoutWidths(breakpoints);
      return c;
    };
    this.dyn = {
      light: dyn('web-light'),
      dark: dyn('web-dark'),
    };
  }

  title(path) {
    return this.base.compile({
      mainFilePath: path,
    }).result.title;
  }

  evictCache() {
    this.base.evictCache(10);
  }

  vector(mainFilePath, theme = 'light') {
    try {
      return this.dyn[theme].vector({ mainFilePath });
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}

module.exports = { Compiler };
