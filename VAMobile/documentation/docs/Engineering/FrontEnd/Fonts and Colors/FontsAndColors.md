# Fonts and Colors

## Fonts
To support the common usage of colors for each font style, defaults colors have been set for each type of font under `src/styles/themes/standardTheme.ts`(See `buildTypography` function). Colors for each font style are based on these:
- [Light Mode Text Colors](https://www.sketch.com/s/dc5da595-7a22-4cdd-a850-bd91a80dd377/a/4a0vvdq)
- [Dark Mode Text Colors](https://www.sketch.com/s/dc5da595-7a22-4cdd-a850-bd91a80dd377/a/eKe44Mx)

## Colors
Colors in code can be found under `src/styles/themes/VAColors.ts`. Any new colors should be added `src/styles/themes/VAColors.ts` and then used in `src/styles/themes/standardTheme.ts` or `src/styles/themescolorSchemes.ts`

Some text, components(ex. snackbar), or icons use different colors than the default color set for each font. You can find the general guidelines for what colors to use for most text, components, and icons [here](https://www.sketch.com/s/dc5da595-7a22-4cdd-a850-bd91a80dd377/a/nRo32rk)
