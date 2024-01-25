---
title: Components
---

# VA Mobile Design System - Components Package

The Components package is the core of the VA Mobile Design System containing the components themselves.

## For Consumers
The components package assumes you already have a functioning React Native app, whether using Expo or React Native CLI; see the [React Native documentation](https://reactnative.dev/docs/environment-setup) if you do not.

Once you have a running app:
1. Add `@department-of-veterans-affairs/mobile-component-library` as a dependency with your package manager (e.g. yarn)
2. Add `@department-of-veterans-affairs/mobile-assets` as a dependency
    - Note: beyond the assets package, `react`, `react-native`, and `react-native-gesture-handler` are also expected dependencies to run the components package
3. [Hook up the custom fonts](https://blog.logrocket.com/adding-custom-fonts-react-native/) in the assets package to your app
4. Import components from `@department-of-veterans-affairs/mobile-component-library` within .jsx/.tsx files and incorporate into the display logic similarly to how you would the built-in React Native components

Note: The linting package is highly recommended so you'll automatically receive linting warnings for deprecation as the components package evolves; it should be set to the same version as the components package.

Documentation about components available can be found via [the documentation site](https://department-of-veterans-affairs.github.io/va-mobile-app/design/Intro) as well as [our Storybook](https://department-of-veterans-affairs.github.io/va-mobile-library/). Questions and issues can be directed to [our DSVA Slack channel](https://dsva.slack.com/archives/C05HF9ULKJ4).

## For Contributors

### Prerequisites

1. Install [Node.js](https://nodejs.org/en)
2. Install [NVM](https://github.com/nvm-sh/nvm)
3. Install [yarn 4.0.2](https://yarnpkg.com/getting-started/install)

### Installation

1. Clone the repo

```
git clone git@github.com:department-of-veterans-affairs/va-mobile-library.git
```

2. From the root directory (`va-mobile-library`) run `nvm use`. If you do not have the active Node version installed (you will see an error) run `nvm install v18.18.0` (replacing v.18.18.0 with the version listed in our root-level .nvmrc file), then run `nvm use` to activate it.

3. Navigate to the components package

```
cd va-mobile-library/packages/components
```

4. Install dependencies

```
yarn
```
then
```
yarn tokens:build
```

5. Launch the app

- **Physical Device**
  1. Install the Expo Go app from the [App Store](https://itunes.apple.com/app/apple-store/id982107779) or [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent&referrer=www)
  2. Run `yarn start`
  3. Using your devices camera, scan the QR code that pops up in your console
- **Simulator**
  1. Run `yarn start`
  2. Press `i` to run on an iOS simulator or `a` to run on an Android Emulator (you may have to set up an emulator in Android Studio in order for this to work)
- **Web Browser**
  1. Run `yarn storybook:web`

### Yarn Commands

| Command              | Description |
| -------------------- | ----------- |
| `start`              | Starts Metro Bundler with options to run app on different platforms. **Note:** To run on web, use `yarn storybook:web` command below |
| `android `           | Run app on last used Android emulator/device |
| `ios`                | Run app on last used iOS simulator/device |
| `storybook:build`    | Generates static version of Storybook for deployment |
| `storybook:deploy`   | Deploys Storybook to [`homepage`](https://department-of-veterans-affairs.github.io/va-mobile-library) in `package.json` |
| `storybook:generate` | Generates `.storybook/native/storybook.requires.js` which tells React Native where to find stores since it doesn't support dynamic imports |
| `storybook:watch`    | Watches for newly created stories and regenerates `storybook.requires.js` |
| `storybook:web`      | Builds and launches development server for web |
| `test`               | Runs unit tests |
