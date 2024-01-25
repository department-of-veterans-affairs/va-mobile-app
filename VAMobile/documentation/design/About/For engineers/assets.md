---
title: Assets
---

# VA Mobile Design System - Assets Package

The Assets package contains static assets such as fonts and SVG icons for use by VA mobile applications. 

## For consumers

The Assets package is a peer dependency to the Components package so it is expected to be added separately via your package manager (e.g. yarn) alongside using components. It does not contain any code, so it is up to the consumer to configure the package to be leveraged by their app, [notably the fonts so they are available within your app](https://blog.logrocket.com/adding-custom-fonts-react-native/) for the components.

The [components package](https://github.com/department-of-veterans-affairs/va-mobile-library/tree/main/packages/components) contains [an Icon convenience component](https://github.com/department-of-veterans-affairs/va-mobile-library/blob/main/packages/components/src/components/Icon/Icon.tsx) that makes leveraging both the assets package icons and custom SVGs specific to your app easy; it is highly recommended to use for icon needs.

## For contributors
Not much to say for contributors as this is just a collection of assets.

Before contributing, consider if the contribution is necessary. This package is intended for shared assets. If your asset is only relevant to a specific app, then it should be handled within the app. Keep in mind the Icon convenience component can handle custom SVGs to help display an app-level icon without it being part of the assets package.

As there is no code and nothing to be run, contributing is as simple as adding the asset [to the package via the GitHub web interface](https://github.com/department-of-veterans-affairs/va-mobile-library/tree/main/packages/assets) using the add file/folder buttons and creating a PR. 