# oQuanta Survey Form SDK

React component library for rendering dynamic survey forms using oQuanta's design system.

## Installation

```bash
npm install @oquanta/survey-form-sdk
# or
yarn add @oquanta/survey-form-sdk
```

## Building and Publishing the SDK

1. Install required dependencies:

```bash
yarn add -D rollup @rollup/plugin-node-resolve @rollup/plugin-commonjs @rollup/plugin-typescript rollup-plugin-terser rollup-plugin-peer-deps-external rollup-plugin-postcss autoprefixer
```

Build the SDK:
```bash
# in project root
yarn build:sdk
```

Test locally using npm/yarn link:

```bash
# In the SDK directory
cd dist/sdk/survey-form
yarn link

# In your public project
yarn link @oquanta/survey-form-sdk
```