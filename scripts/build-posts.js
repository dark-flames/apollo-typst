const fs = require('fs');
const { resolve, join, basename, extname } = require('path');
const { execSync } = require('child_process');
const { Compiler } = require('./compiler');
const toml = require('toml');

const root = resolve(__dirname, '../');

const fontPaths = [
  resolve(root, 'fonts'),
  resolve(root, 'assets/fonts'),
  resolve(root, 'asset/fonts'),
  resolve(root, 'static/fonts')
]

const themes = ['light', 'dark'];

function printWithDepth(depth, ...args) {
  if(depth > 0) {
    depth -= 1;
    console.log('    '.repeat(depth) + '|---', ...args);
  }
}

function isWorkspace(dir) {
  const res = fs.readdirSync(dir, { withFileTypes: true })
    .find((d) => 
        d.isFile() && (
          d.name === 'main.typ' || d.name === 'build-config.toml'
        )
    );
  return res;
}

function parseBuildConfig(path) {
  const content = fs.readFileSync(path);
  const config = toml.parse(content);

  let res = {};

  for (const [name, { entry }] of Object.entries(config.entries)) {
    res[name] = entry
  }

  return res;
}

function compileEntry(compiler, typstRoot, entry, artifactRoot, outputPath, depth) {
  compiler.evictCache();
  const entryPath = join(typstRoot, entry);
  const artifactPath = join(artifactRoot, outputPath);
  for (const theme of themes) {
    printWithDepth(depth + 1, 'Theme:', theme);
    fs.mkdirSync(join(artifactPath, theme), { recursive: true });
    
    const vec = compiler.vector(entryPath, theme);

    fs.writeFileSync(join(artifactPath, theme, 'main.multi.sir.in'), vec);
  }
}

function compileWorkspace(compiler, typstRoot, path, artifactRoot, depth) {
  fs.mkdirSync(join(artifactRoot, path), { recursive: true });
  printWithDepth(depth, 'Compile Workspace: ', path);
  const workspacePath = join(typstRoot, path);

  const configPath = fs.readdirSync(workspacePath, { withFileTypes: true })
    .find((d) => 
        d.isFile() && d.name === 'build-config.toml'
    );

  if (configPath) {
    const config = parseBuildConfig(join(workspacePath, 'build-config.toml'));
    for (const [name, entry] of Object.entries(config)) {
      const entryPath = join(path, entry);
      printWithDepth(depth + 1, `Compile: ${entryPath}:${name}`);
      compileEntry(compiler, typstRoot, join(path, entry), artifactRoot, join(path, name), depth + 1);
    }
  } else {
    const mainPath = join(path, 'main.typ')
    printWithDepth(depth + 1, 'Compile:', mainPath);
    compileEntry(compiler, typstRoot, mainPath, artifactRoot, path, depth + 1);
  }
}

function compileFile(compiler, typstRoot, path, name, artifactRoot, depth) {
  const base = basename(name, '.typ');
  const filePath = join(path, name);
  printWithDepth(depth, 'Compile:', filePath);
  compileEntry(compiler, typstRoot, filePath, artifactRoot, join(path, base), depth);
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

  console.log('[typst] using fonts:');
  for (const fontPath of fontPaths) {
    console.log(`- ${fontPath}`);
  }

  const compiler = new Compiler({ baseDir: root, fontPaths: fontPaths });

  compileDirectory(compiler, typstDir, '.', artifactRoot);
}

main();
