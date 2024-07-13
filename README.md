# apollo-typst
Typst blog template based on [Zola](https://getzola.org), [typst.ts](https://github.com/Myriad-Dreamin/typst.ts), and [apollo](https://github.com/not-matthias/apollo).

## Features
* Full functionality of [Zola](https://getzola.org) and [apollo](https://github.com/not-matthias/apollo).
* Supports both markdown and [typst](https://typst.app/).

## Usage
### Preparation
* Install `make`, `cargo`, and `npm`.
* Install the latest version of `typst-ts-cli` via cargo:
    ```shell
    cargo install --locked --git https://github.com/Myriad-Dreamin/typst.ts typst-ts-cli
    ```
    Or download the latest release from [GitHub Releases](https://github.com/Myriad-Dreamin/typst.ts/releases).
* Install the latest version of `zola` following the instructions on the [Zola website](https://www.getzola.org/documentation/getting-started/installation/).
* Configure your own blog in `config.toml`. Full configuration options can be found in the [apollo documentation](https://github.com/not-matthias/apollo/blob/main/content/posts/configuration.md).

### Write posts with Typst

* Create a new typst workspace under the `typst` directory and write your post with Typst.

* Create a `.md` file in the `content` directory and write the metadata of the post in the front matter. Then, add the `extra.typst` field to the front matter, specifying the name of the typst workspace. The content of the markdown file will be ignored; instead, the content from the typst file will be utilized. For an example, refer to `content/posts/test.md`.
* If the typst output has its own title, you can set `extra.hide_title = true` to prevent zola from generating a redundant title.


### Build

```shell
make       # build
make clean # clean
make dev   # dev server
```

### Deployment[WIP]
To deploy your site to GitHub Pages, you can use the provided GitHub Action:

`.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - name: checkout
      uses: actions/checkout@v4
      with:
        submodules: recursive
    - uses: ../.github/actions/deploy-action@main
      with:
      access-token: ${{ secrets.ACCESS_TOKEN }}
      deploy-branch: static
    # deploy-repo: another/repo
```
