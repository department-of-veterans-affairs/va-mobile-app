---
title: Linting
---

# VA Mobile Design System - Linting Package

The Linting package contains an ESLint config for use by consumers of the [VA Design System Mobile Component Library](https://www.npmjs.com/package/@department-of-veterans-affairs/mobile-component-library) to automatically issue deprecation notices when outdated components are being used.

## For consumers
These steps assume you already have `eslint` installed for your project as a devDependency and configured correctly.
1. Add `@department-of-veterans-affairs/eslint-config-mobile` as a devDependency to your project
    - Note: Your version should match your components package version to behave correctly
2. In your eslint config file, add to the `extends` attribute: `@department-of-veterans-affairs/mobile`

Once configured, running linting on your project should emit warnings for using outdated components.

If linting is part of your continuous integration checks and warnings cause failures, the following can be added to your CI linting script to suppress the warnings during CI:
```
--rule 'deprecate/import: off'
```

## For contributors
Not much to say for contributors as this is just a set of linting rules.

This package leverages the `eslint-plugin-deprecate` package to issue deprecation notices as part of linting. As there is no real code and nothing to be run, contributing is as simple as editing the linting rules [in the GitHub web interface](https://github.com/department-of-veterans-affairs/va-mobile-library/blob/main/packages/linting/index.js) and creating a PR. 

Versioning of this package should be aligned with the components package.