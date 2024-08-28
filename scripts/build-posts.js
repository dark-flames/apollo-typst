const fs = require('fs');
const { resolve, join, basename, extname } = require('path');
const { execSync } = require('child_process');
const { Compiler } = require('./compiler');

const root = resolve(__dirname, '../');

const themes = ['light', 'dark'];

function printWithDepth(depth, ...args) {
  if(depth > 0) {
    depth -= 1;
    console.log('    '.repeat(depth) + '|---', ...args);
  }
}

function compileWorkspace(compiler, typstRoot, path, artifactRoot, depth) {
  compiler.evictCache();

  fs.mkdirSync(join(artifactRoot, path), { recursive: true });
  printWithDepth(depth, 'Compile Workspace: ', path);
  for (const theme of themes) {
    printWithDepth(depth + 1, 'Theme:', theme);
    fs.mkdirSync(resolve(artifactRoot, path, theme), { recursive: true });

    const vec = compiler.vector(resolve(typstRoot, path, 'main.typ'), theme);
    fs.writeFileSync(resolve(artifactRoot, path, theme, 'main.multi.sir.in'), vec);
  }
}

function compileFile(compiler, typstRoot, path, name, artifactRoot, depth) {
  compiler.evictCache();
  const base = basename(name, '.typ');
  const artifactPath = join(artifactRoot, path, base);

  fs.mkdirSync(join(artifactRoot, path, base), { recursive: true });
  printWithDepth(depth, 'Compile File:', join(path, name));
  for (const theme of themes) {
    printWithDepth(depth + 1, 'Theme:', theme);
    fs.mkdirSync(join(artifactPath, theme), { recursive: true });

    const vec = compiler.vector(join(typstRoot, path, name), theme);
    fs.writeFileSync(join(artifactPath, theme, 'main.multi.sir.in'), vec);
  }
}

function isWorkspace(dir) {
  const res =  fs.readdirSync(dir, { withFileTypes: true }).find((d) => d.isFile() && d.name === 'main.typ');
  return res;
}

function compileDirectory(compiler, typstRoot, dir, artifactRoot, depth = 0) {
  printWithDepth(depth, 'Compile Dir: ', dir);

  for (const p of fs.readdirSync(join(typstRoot, dir), { withFileTypes: true })) {
    const subPath = join(dir, p.name);
    if(p.isFile()) {
      if(extname(p.name) === '.typ') {
        compileFile(compiler, typstRoot, dir, p.name, artifactRoot, depth + 1);
      } else {
        printWithDepth(depth + 1, 'Skip:', subPath);
      }
    } else if(isWorkspace(join(typstRoot, subPath))) {
      compileWorkspace(compiler, typstRoot, subPath, artifactRoot, depth + 1);
    } else {
      compileDirectory(compiler, typstRoot, subPath, artifactRoot, depth + 1);
    }
  }
}

function main() {
  const typstDir = resolve(root, 'typ');
  /// Creates artifact directory
  const artifactRoot = resolve(root, 'static/typst');
  fs.mkdirSync(artifactRoot, { recursive: true });
  /// Links Apollo package
  try {
    execSync(`typst-ts-cli package link --manifest ${root}/packages/typst-apollo/typst.toml`);
  } catch {}

  const compiler = new Compiler({ baseDir: root });
  compileDirectory(compiler, typstDir, '.', artifactRoot);
}

main();
