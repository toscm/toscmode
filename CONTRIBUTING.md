# Development install

1. Install [NodeJS](https://nodejs.org/en) >=20 and [Python](https://www.python.org/) >=3.8
2. Clone the repo
3. Within the repo, execute the following commands

```bash
npm install # Install dependencies
npm run build # Build extension
pip install -e "." # Install python package in dev mode
jupyter labextension develop . --overwrite # Create JupyterLab Links
jupyter lab # Start JupyterLab (in another terminal)
```

For useful commands are:

```bash
npm run watch # Watch and rebuild on changes
jupyter lab build --minimize=False # Build source maps for easier debugging
```

# Development uninstall

```bash
pip uninstall jupyterlab_toscmode # Uninstall pip package
jupyter labextension list # Print paths of labextensions
# MANUAL STEP: search printed paths for jupyterlab_toscmode symlink
# MANUAL STEP: remove jupyterlab_toscmode symlink
```

# PyPI Release

```bash
pip install build twine hatch
hatch version 0.3.0 # Bump version. This will create a tag.
npm clean:all # Clean up dev files before building the package.
git clean -dfX # Clean up local git dir.
python -m build # Create python package in dist dir (tar.gz and .whl).
twine upload dist/* # Upload package to PyPI.
```

# NPM Release

```bash
npm login
npm publish --access public
```

