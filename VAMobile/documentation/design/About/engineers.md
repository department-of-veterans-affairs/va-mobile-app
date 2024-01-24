---
title: For engineers
sidebar_position: 5
---

## Testing component integrations

Before a new component, or new version of an old component, is released it should be tested inside an example environment that it will be consuming. For this purpose we can use the [VA Flagship app](https://github.com/department-of-veterans-affairs/va-mobile-app). We can do this both with automation and manual testing.

### Automatically

We will have automated checks run on the components where we can. For our main client, the VA Flagship app we currently have [a Github actions workflow](https://github.com/department-of-veterans-affairs/va-mobile-library/blob/main/.github/workflows/check-component-integrations.yml) that will run each time a pull request is merged into the `main` branch. This automated workflow will simulate the VA Flagship app using the latest component package and run any associated tests to ensure no unintentional breakage happens. The workflow can also be run manually from the [Check Component Integrations action](https://github.com/department-of-veterans-affairs/va-mobile-library/actions/workflows/check-component-integrations.yml).

As more clients are added to the system, more tests will be added to the workflow. The tests themselves are managed by the client team and any app included (at this time) needs to be in a publicly accessible repository.

Automated tests will be able to check each instance of the component, so it is also important to manually test component integrations where appropriate.

### Manually

There are a couple ways to manually check if a component works inside an app environment. The first is to use [local dependency linking through yarn commands](https://classic.yarnpkg.com/lang/en/docs/cli/link/). This creates a symlink to the local component from the app. There are some [Metro config changes that need to happen for this to work](https://github.com/facebook/metro/issues/1) and support is a little iffy at the moment, but it's certainly an option, although not highly recommended at this point.

Our second (and preferred) option is to manually install the local component into the app you're testing in by running: `yarn add file:../../va-mobile-library/packages/components` (assumes va-mobile-app and va-mobile-library are siblings, if they are not, change the path). This method points directly to the component file you're testing. The downside here is that your watch command may not work, so you'll need to rebuild the app to see changes (or update the watch configuration).

Once this component is listed in the package.json file you can run all app-level tests on it (tapping around, unit, compiling, e2e). The level of testing needed will be defined by the size of the update that is being made.
