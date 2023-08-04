---
title: Color palette
sidebar_position: 2
---

The VA mobile app has two color themes: Light and Dark. [The VA mobile app themes](https://www.figma.com/file/bGO6g5cCvWycrNjoK66PXc/VA-Mobile-Design-Tokens?node-id=151%3A76) use colors from the [VA style guide](https://design.va.gov/foundation/color-palette), and only deviate if necessary for accessibility purposes.

<iframe width="550" height="500" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FQVLPB3eOunmKrgQOuOt0SU%2F%25F0%259F%2593%2590-DesignLibrary2.0---VAMobile%3Ftype%3Ddesign%26node-id%3D3859%253A7446%26t%3DLWuS4oyNuplsuZBa-1" allowfullscreen></iframe>

**Themes**
- [Light theme in Figma](https://www.figma.com/file/yXL0MkEKyAPGXPZqRH0VFZ/VA-Mobile-light-theme?node-id=183%3A441)
- [Dark theme in Figma](https://www.figma.com/file/gOhb2kZvoQiXiGigqWZhnx/VA-Mobile-dark-theme?node-id=183%3A441)

## Front-end
Colors in code can be found under `src/styles/themes/VAColors.ts`. Any new colors should be added `src/styles/themes/VAColors.ts` and then used in `src/styles/themes/standardTheme.ts` or `src/styles/themescolorSchemes.ts`

Some text, components(ex. snackbar), or icons use different colors than the default color set for each font. You can find the general guidelines for what colors to use for most text, components, and icons in the [VA Mobile app Design Library](https://www.figma.com/file/QVLPB3eOunmKrgQOuOt0SU/VAMobile-DesignLibrary1.0-%F0%9F%93%90?node-id=501%3A40&t=P62TR9FmT9E6a4O2-1).