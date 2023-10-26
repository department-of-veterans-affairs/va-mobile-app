---
title: Typography
sidebar_position: 5
---

Typography generally follows [VA.gov’s guidance](https://design.va.gov/foundation/typography) with some adjustments.

* The mobile app doesn’t use CSS pixel measurements to define font sizes. Instead, we use points (PT) on iOS and density-independent pixels (DP) on Android. This allows our fonts to scale appropriately for all screen densities across devices. Below are resources that describe this in more detail:
    * [Guidance from W3C](https://w3c.github.io/wcag2ict/#guidance-when-applying-css-pixel-to-non-web-documents-and-software)
    * [Fonts in mobile apps for developers](https://www.skoumal.com/en/fonts-in-mobile-apps-for-developers/)
    * [Mobile design 101: pixels, points and resolutions](https://medium.com/@fluidui/mobile-design-101-pixels-points-and-resolutions-f60413035243)
* With native and OS specific components, we utilize OS defined typography.

<!-- <table>
<caption>Mobile app typography styles</caption>
<tr>
    <th>Use</th>
    <th>Font</th>
    <th>Font Size</th>
    <th>Line Height</th>
    <th>Style</th>
</tr>
<tr>
    <td>Heading</td>
    <td>Bitter Bold</td>
    <td>24px</td>
    <td>30px</td>
    <td>N/A</td>
</tr>
<tr>
    <td>Mobile Body</td>
    <td>Source Sans Pro Regular</td>
    <td>20px</td>
    <td>30px</td>
    <td>N/A</td>
</tr>
<tr>
    <td>Mobile Body Bold</td>
    <td>Source Sans Pro Bold</td>
    <td>20px</td>
    <td>20px</td>
    <td>N/A</td>
</tr>
<tr>
    <td>Mobile Body Link</td>
    <td>Source Sans Pro Regular</td>
    <td>20px</td>
    <td>30px</td>
    <td>Underline</td>
</tr>
<tr>
    <td>Mobile Body Required</td>
    <td>Source Sans Pro Regular</td>
    <td>20px</td>
    <td>30px</td>
    <td>Asterisk before text</td>
</tr>
<tr>
    <td>Helper Text</td>
    <td>Source Sans Pro Regular</td>
    <td>16px</td>
    <td>22px</td>
    <td>N/A</td>
</tr>
</table> -->

<iframe width="550" height="500" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FQVLPB3eOunmKrgQOuOt0SU%2F%25F0%259F%2593%2590-DesignLibrary2.0---VAMobile%3Ftype%3Ddesign%26node-id%3D3859%253A7737%26t%3DLWuS4oyNuplsuZBa-1" allowfullscreen></iframe>

## Front-end
To support the common usage of colors for each font style, defaults colors have been set for each type of font under `src/styles/themes/standardTheme.ts`(See `buildTypography` function). Colors for each font style are based on the [Design Tokens - Design Library](https://www.figma.com/file/bGO6g5cCvWycrNjoK66PXc/%F0%9F%93%90-DesignTokens1.0---Library---VAMobile?node-id=115%3A157&t=RpifEcByzqSp4on7-1) file.