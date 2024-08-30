# apollo-typst

Typst static site template based on [Zola](https://getzola.org), [typst.ts](https://github.com/Myriad-Dreamin/typst.ts), and [apollo](https://github.com/not-matthias/apollo).

## Features

- Full functionality of [Zola](https://getzola.org) and [apollo](https://github.com/not-matthias/apollo).
- Supports both markdown and [typst](https://typst.app/).

## Usage

### Preparation

- Install `yarn` and execute `yarn install`.
- Install `zola` following its [document](https://www.getzola.org/documentation/getting-started/installation/).
- Install `typst-ts-cli` following its [document](https://github.com/Myriad-Dreamin/typst.ts/tree/main?tab=readme-ov-file#concept-precompiler).
- Configure your site in `config.toml`. Full configuration options can be found in the [apollo documentation](https://github.com/not-matthias/apollo/blob/main/content/posts/configuration.md).

### Write posts with Typst

- `appollo-typst` support both single files and workspaces:

  - If a subdirectory of typ contains `main.typ`, it will be treated as a workspace, with `main.typ` serving as the entry point. 

  - Otherwise, each .typ file within the subdirectory will be compiled independently.

- Create a `.md` file in the `content` directory and write the metadata of the post in the front matter. Then, add the `extra.typst` field to the front matter, specifying the name (relative path to `typ/`) of the typst file or the typst workspace. The content of the markdown file will be ignored; instead, the content from the typst file will be utilized. For an example, refer to `content/posts/test.md`.

- If the typst output has its own title, you can set `extra.hide_title = true` to prevent zola from generating a redundant title.

### Build

```shell
# If you updated the frontend
yarn build:fe
# If you updated the typst
yarn build:typ
# Final zola build
yarn build
```

### Develop

```shell
yarn serve
```

### Deployment

To deploy your site to GitHub Pages, you can use the provided GitHub Action in branch `action-v1`:

Example .github/workflows/deployl.yaml

```yaml
name: Deploy

on: workflow_dispatch

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: checkout
        uses: actions/checkout@v4
      - name: deploy
        uses: dark-flames/apollo-typst@action-v1
        with:
          access-token: ${{ secrets.ACCESS_TOKEN }}
          deploy-branch: static
        # deploy-repo: ${{ another/repo }}
```
If you want to use custom page, remember to put `CNAME` file in the `static/`.