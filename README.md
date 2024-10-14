# jupyterlab_toscmode

[![Github Actions Status](https://github.com/toscm/toscmode/actions/workflows/build.yml/badge.svg)](https://github.com/toscm/toscmode/actions/workflows/build.yml)
<!-- [![Binder](https://mybinder.org/badge_logo.svg)](https://mybinder.org/v2/gh/toscm/toscmode/main?urlpath=lab) -->

jupyterlab_toscmode is a JupyterLab extension providing an additional command *Enable toscmode* that allows to switch between the normal mode and a very lightweight showcase mode developed for the lectures of Tobias Schmidt.

In Toscmode, the following elements are hidden:

- The menu panel (at the top of the screen)
- The notebook panel (at the top of the notebook)
- The cell toolbar (inside the currently selected cell)
- Cells below the currently selected cell

The following elements are added:

- A button to switch back to the normal mode (at the top left of the screen)
- Buttons to navigate between cells (at the bottom right of the screen)

## Requirements

- JupyterLab >= 4.0.0

## Install

To install the extension, execute:

```bash
pip install jupyterlab_toscmode
```

## Uninstall

To remove the extension, execute:

```bash
pip uninstall jupyterlab_toscmode
```

## Contributing

### Development install

Note: You will need NodeJS to build the extension package.

The `jlpm` command is JupyterLab's pinned version of
[yarn](https://yarnpkg.com/) that is installed with JupyterLab. You may use
`yarn` or `npm` in lieu of `jlpm` below.

```bash
# Clone the repo to your local environment
# Change directory to the jupyterlab_toscmode directory
# Install package in development mode
pip install -e "."
# Link your development version of the extension with JupyterLab
jupyter labextension develop . --overwrite
# Rebuild extension Typescript source after making changes
jlpm build
```

You can watch the source directory and run JupyterLab at the same time in different terminals to watch for changes in the extension's source and automatically rebuild the extension.

```bash
# Watch the source directory in one terminal, automatically rebuilding when needed
jlpm watch
# Run JupyterLab in another terminal
jupyter lab
```

With the watch command running, every saved change will immediately be built locally and available in your running JupyterLab. Refresh JupyterLab to load the change in your browser (you may need to wait several seconds for the extension to be rebuilt).

By default, the `jlpm build` command generates the source maps for this extension to make it easier to debug using the browser dev tools. To also generate source maps for the JupyterLab core extensions, you can run the following command:

```bash
jupyter lab build --minimize=False
```

### Development uninstall

```bash
pip uninstall jupyterlab_toscmode
```

In development mode, you will also need to remove the symlink created by `jupyter labextension develop`
command. To find its location, you can run `jupyter labextension list` to figure out where the `labextensions`
folder is located. Then you can remove the symlink named `jupyterlab_toscmode` within that folder.

### Testing the extension

#### Frontend tests

This extension is using [Jest](https://jestjs.io/) for JavaScript code testing.

To execute them, execute:

```sh
jlpm
jlpm test
```

#### Integration tests

This extension uses [Playwright](https://playwright.dev/docs/intro) for the integration tests (aka user level tests).
More precisely, the JupyterLab helper [Galata](https://github.com/jupyterlab/jupyterlab/tree/master/galata) is used to handle testing the extension in JupyterLab.

More information are provided within the [ui-tests](./ui-tests/README.md) README.

### Packaging the extension

See [RELEASE](RELEASE.md)
