---
title: Tokens
---

# VA Mobile Design System - Tokens Package

The Tokens package contains the design tokens for the VA Mobile Design Library. It uses [Style Dictionary](https://amzn.github.io/style-dictionary/#/) as a build system to define our styles in JSON and export them to different formats.

## For consumers
Direct consumption of the tokens package is optional, but recommended. The tokens package contains the same building blocks used to build the design system components which will more easily allow screen content and app-level custom components to follow design system conventions, helping maintain consistency in experience for users. It is also recommended to match the tokens package version to the version of tokens used by the components package you are leveraging, to ensure consistency.

To use the tokens, simply:
1. Add `@department-of-veterans-affairs/mobile-tokens` to your project via your package manager (e.g. yarn)
2. Add `import { Colors } from '@department-of-veterans-affairs/mobile-tokens` to files you wish to use them in. 
  - Note: `Colors` are the only tokens available for now.
3. Reference colors in your code: e.g. `buttonColor = Colors.grayMedium`

## For contributors
Depending on what is being contributed, the recommendation for how to proceed differs.

If you are contributing a simple addition or update of an existing token, the recommendation is to do so [in the GitHub web interface](https://github.com/department-of-veterans-affairs/va-mobile-library/tree/main/packages/tokens/src/tokens) by updating the relevant src tokens file and [running an alpha publish against the branch for the package](https://github.com/department-of-veterans-affairs/va-mobile-library/actions/workflows/publish.yml) to affirm the `dist/` folder correctly forms up your updated/added token as expected in the [resulting NPM package](https://www.npmjs.com/package/@department-of-veterans-affairs/mobile-tokens?activeTab=versions).

If you are contributing many tokens or need to adjust build processes, you should get set up locally. See the [directions in the components package documentation](https://department-of-veterans-affairs.github.io/va-mobile-app/design/About/For%20engineers/components) for doing so with minor modifications to that process of changing directory to the tokens package (`va-mobile-library/packages/tokens`) instead of components and not having the final running steps as the `tokens:build` command is essentially running the tokens as it generates the output folders based on the build/config setup and tokens in the `src/` folder.

Note: the folder structure and file naming within the `src/` folder is relevant so follow the existing structure and direct questions to [the DSVA Slack channel](https://dsva.slack.com/archives/C05HF9ULKJ4).

### Yarn Commands

| Command              | Description |
| -------------------- | ----------- |
| `tokens:build`    | Takes any JSON files in the `src/tokens` folder and transforms them according to the defined transformations in the `config.js` |
