---
sidebar_position: 1
---

# Overview

Welcome to the engineering section of the VA Mobile Design System documentation!

First things first: from an engineering perspective, what is the design system?

Fundamentally, the design system is a collection of NPM packages that can be added to a project like any other. These packages are created to support making native mobile apps that adhere to VA design principles, provide an accessible user experience, and streamline app development by providing UI building blocks to maximize time for delivering features. 

Currently and on the roadmap for foreseeable future, the mobile design system components rely on React Native--the most popular mobile framework for complex, multiplatform native mobile apps.

The VA Mobile Design System is in early stages and far from maturity; as such, feedback on experience using the packages and this documentation is very welcomed to continually improve the experience! The ideal avenue for feedback is our [DSVA Slack channel](https://dsva.slack.com/archives/C05HF9ULKJ4) (#va-mobile-app-shared-systems).

Lastly, the [va-mobile-library repo](https://github.com/department-of-veterans-affairs/va-mobile-library) houses the VA Mobile Design System codebase and [our Storybook](https://department-of-veterans-affairs.github.io/va-mobile-library/) demonstrates them functionally.

## Packages

So, what is currently being offered? 

Our packages:
- assets
  - Package containing static assets (e.g. fonts, SVG icons) for VA mobile apps
  - Peer dependency (required) to components for appropriate function
  - [Documentation](https://department-of-veterans-affairs.github.io/va-mobile-app/design/For%20engineers/assets)
  - [NPM](https://www.npmjs.com/package/@department-of-veterans-affairs/mobile-assets)
  - [Code](https://github.com/department-of-veterans-affairs/va-mobile-library/tree/main/packages/assets)
- components
  - Package containing the components of the design system
  - [Documentation](https://department-of-veterans-affairs.github.io/va-mobile-app/design/For%20engineers/components)
  - [NPM](https://www.npmjs.com/package/@department-of-veterans-affairs/mobile-component-library)
  - [Code](https://github.com/department-of-veterans-affairs/va-mobile-library/tree/main/packages/components)
- linting
  - Package containing an eslint plugin to issue deprecation notices as part of linting
  - [Documentation](https://department-of-veterans-affairs.github.io/va-mobile-app/design/For%20engineers/linting)
  - [NPM](https://www.npmjs.com/package/@department-of-veterans-affairs/eslint-config-mobile)
  - [Code](https://github.com/department-of-veterans-affairs/va-mobile-library/tree/main/packages/linting)
- tokens
  - Package containing atomic, tokenized building blocks used for components so any app can build screens or custom components adhering to the same underlying styling fundamentals
  - [Documentation](https://department-of-veterans-affairs.github.io/va-mobile-app/design/For%20engineers/tokens)
  - [NPM](https://www.npmjs.com/package/@department-of-veterans-affairs/mobile-tokens)
  - [Code](https://github.com/department-of-veterans-affairs/va-mobile-library/tree/main/packages/tokens)

Each package's documentation page contains more specialized guidance both for consumers of the package as well as for contributing.

All packages use [ISC licenses](https://en.wikipedia.org/wiki/ISC_license):
> Copyright 2023 Department of Veterans Affairs
> 
> Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.
> 
> THE SOFTWARE IS PROVIDED “AS IS” AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.