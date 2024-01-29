# Testing

## Testing component package integrations

Before a new component, or new version of an old component, is released it should be tested inside an example environment that it will be consuming. For this purpose we can use the [VA Flagship app](https://github.com/department-of-veterans-affairs/va-mobile-app). We can do this both with automation and manual testing.

### Automatically

We will have automated checks run on the components where we can. For our main client, the VA Flagship app we currently have [a Github actions workflow](https://github.com/department-of-veterans-affairs/va-mobile-library/blob/main/.github/workflows/check-component-integrations.yml) that will run each time a pull request is merged into the `main` branch. This automated workflow will simulate the VA Flagship app using the latest component package and run any associated tests to ensure no unintentional breakage happens. The workflow can also be run manually from the [Check Component Integrations action](https://github.com/department-of-veterans-affairs/va-mobile-library/actions/workflows/check-component-integrations.yml).

As more clients are added to the system, more tests will be added to the workflow. The tests themselves are managed by the client team and any app included (at this time) needs to be in a publicly accessible repository.

Automated tests will be able to check each instance of the component, so it is also important to manually test component integrations where appropriate.

### Manually

The preferred method for manual testing is [to create an alpha build via the NPM publish workflow](https://github.com/department-of-veterans-affairs/va-mobile-library/actions/workflows/publish.yml) of the package from your branch and then update your project locally to leverage that alpha build to test. Note: alpha builds should never be used in production.

There are a couple additional methods to manually check if a component works inside an app environment, but neither works as well as the preferred method and may not behave the same as a published package (e.g. changes may work using these methods that would _not_ work in a published NPM package): 
<details>
<summary>Alternate Method 1</summary>
The first option is to manually install the local component into the app you're testing in by running: <code>yarn add file:../../va-mobile-library/packages/components</code> (assumes va-mobile-app and va-mobile-library are siblings, if they are not, change the path). This method points directly to the component file you're testing. The downside here is that your watch command may not work, so you'll need to rebuild the app to see changes (or update the watch configuration).

</details>

<details>
<summary>Alternate Method 2</summary>
The second is to use <a href="https://classic.yarnpkg.com/lang/en/docs/cli/link/">local dependency linking through yarn commands</a>. This creates a symlink to the local component from the app. There are some <a href="https://github.com/facebook/metro/issues/1">Metro config changes that need to happen for this to work</a> and support is a little iffy at the moment, but it's certainly an option, although not highly recommended at this point.

</details>

With all methods above, you can validate things have installed correctly looking up the `@department-of-veterans-affairs/mobile-component-library` folder within your package folder (e.g. `node_modules`) and validating the correct package version is present. You can then run all app-level tests on it (manual app use, unit, compiling, e2e). The level of testing needed will be defined by the size of the update that is being made.
