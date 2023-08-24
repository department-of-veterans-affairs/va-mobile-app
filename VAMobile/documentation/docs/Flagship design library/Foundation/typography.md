---
title: Typography
sidebar_position: 5
---

Typography in the VA mobile app generally follows [typography used by VA.gov](https://design.va.gov/design/typography) with some adjustments. With native and OS specific components we utilize OS defined typography. 

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

* [Typography in Figma](https://www.figma.com/file/QVLPB3eOunmKrgQOuOt0SU/%F0%9F%93%90-DesignLibrary2.0---VAMobile?type=design&node-id=3859%3A7737&t=8Vn51lk7QdLMQXS3-1)

## Front-end
To support the common usage of colors for each font style, defaults colors have been set for each type of font under `src/styles/themes/standardTheme.ts`(See `buildTypography` function). Colors for each font style are based on the [Design Tokens - Design Library](https://www.figma.com/file/bGO6g5cCvWycrNjoK66PXc/%F0%9F%93%90-DesignTokens1.0---Library---VAMobile?node-id=115%3A157&t=RpifEcByzqSp4on7-1) file.