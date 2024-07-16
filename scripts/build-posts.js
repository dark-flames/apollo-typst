const fs = require('fs');
const { resolve } = require('path');
const { execSync } = require('child_process');
const { Compiler } = require('./compiler');

const root = resolve(__dirname, '../');

const themes = ['light', 'dark'];

function main() {
  const postsDir = resolve(root, 'typ/posts');
  /// Creates artifact directory
  const artifactRoot = resolve(root, 'static/typst');
  fs.mkdirSync(artifactRoot, { recursive: true });
  /// Links Apollo package
  try {
    execSync(`typst-ts-cli package link --manifest ${root}/packages/typst-apollo/typst.toml`);
  } catch {}

  /// Gets all subdirectories in the current working directory
  const subpaths = fs
    .readdirSync(postsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  const compiler = new Compiler({ baseDir: root });

  for (const p of subpaths) {
    compiler.evictCache();

    fs.mkdirSync(resolve(artifactRoot, p), { recursive: true });
    console.log('- CompilePost:', p);
    for (const theme of themes) {
      console.log('  - Theme:', theme);
      fs.mkdirSync(resolve(artifactRoot, p, theme), { recursive: true });

      const vec = compiler.vector(resolve(postsDir, p, 'main.typ'), theme);
      fs.writeFileSync(resolve(artifactRoot, p, theme, 'main.multi.sir.in'), vec);
    }
  }
}

main();
