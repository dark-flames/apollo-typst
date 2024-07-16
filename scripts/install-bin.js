const platform = process.platform;

const { execSync } = require('child_process');

const exec = (cmd, opts) => {
  try {
    return {
      result: execSync(cmd, { stdio: 'inherit', ...opts }),
    };
  } catch (e) {
    return { error: e };
  }
};

/// Install the latest version of `zola` following the instructions on the [Zola website](https://www.getzola.org/documentation/getting-started/installation/).
const installZola = () => {
  if (platform === 'win32') {
    console.log('Installing Zola for Windows');
    exec('winget install getzola.zola');
  } else {
    throw new Error('Unsupported platform yet');
  }
};

installZola();
console.log('Please restart your editor and terminal to ensure all changes are applied');
