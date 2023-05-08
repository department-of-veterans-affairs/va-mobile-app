---
title: Creating components in Figma
sidebar_position: 6
---

### How to set up components

* **Component configuration**
	* All components should have “simplify all instances” checked.
	* For components on the doc site:
	    * **Description**: Add a short description of how the component should be used from the [documentation site](https://department-of-veterans-affairs.github.io/va-mobile-app/docs/UX/ComponentsSection/).
	    * **Link**: Add a link to the component’s page on the [documentation site](https://department-of-veterans-affairs.github.io/va-mobile-app/docs/UX/ComponentsSection/).
	* For components that only live in Figma and do not appear on the doc site:
	    * **Description**: Add a short description of how the component should be used.
	    * *Note: Most Figma-only components are sub-parts or building blocks of another component in Figma. They exist in Figma to allow designers to build and use components, but are not required from an engineering perspective. For one component in Figma, there can sometimes be multiple Figma-only components.*
* **Colors**
	* All colors should be pulled from the [Design Tokens file](https://www.figma.com/file/bGO6g5cCvWycrNjoK66PXc/%F0%9F%93%90-DesignTokens1.0---Library---VAMobile) (not light/dark theme files).
* **Typography**
	* All text styles should be pulled from the [Design Tokens file](https://www.figma.com/file/bGO6g5cCvWycrNjoK66PXc/%F0%9F%93%90-DesignTokens1.0---Library---VAMobile) (not light/dark theme files).
* **Autolayout**
	* Components must be set up to automatically vertically resize as text changes.
	    * Typically, a component’s height will need to be set to “hug” to accomplish this.
	* Components must be set up for responsive widths. Here are some potential ways to achieve this:
	    * Variant widths may need to be set to “fill” at 360px.
	    * Constraints may need to be set to "left and right" or “scale.”
	    * Autolayout properties may need to be customized depending on the component’s design.
* **Properties**
	* Properties should be listed in an order that mimics the component’s visual layout from top to bottom and left to right.
	* For main components, show nested properties as appropriate.
	* Variants should be named and set up consistently.
	    * **Mode**: Always appears first. Options include Light and Dark.
	    * **Type**: Appears below Mode. Used for things like Primary / Secondary or H1 / H2.
	    * **Layout**: Appears below Type. Used for things like Horizontal / Vertical or varying quantities.
	    * **State**: Appears below Layout. Used for things like Focus / Active or Open / Closed or Active / Inactive.
	* Booleans should be named and set up consistently.
	    * Used to show/hide icons, buttons, content, etc.
	    * Always name them descriptively – i.e. icon (left) / icon (right), button (secondary), header (show/hide).
	* Instance swaps should be named and set up consistently.
	    * Preferred values should be set as appropriate.
	    * Always name them descriptively – i.e. icon (left) / icon (right).
	* Text properties should be named and set up consistently.
	    * Add content fields for every editable content area.
	    * Header and title fields should be named descriptively – i.e. header / title or header 1, header 2, etc.
	    * Body copy fields should always be named “content”.
	    * Fields such as labels, tags, and buttons should be named descriptively – i.e. button text.

### How to set up icons

#### Adding icons to the library
1. Log in to [Font Awesome (version 5.15.4)](https://fontawesome.com/v5/search) and look for the specific icon. 
2. Click SVG and then right click and copy the SVG code snippet.
3. In the Figma [Design Library](https://www.figma.com/file/QVLPB3eOunmKrgQOuOt0SU/%F0%9F%93%90-DesignLibrary2.0---VAMobile?node-id=719%3A1428&t=mZejOtPIYdGFPfth-1), paste the SVG code snipped onto the  “Design Elements” page.
4. In the right panel, select “constrain proportions” and set the longest side of the SVG to 24px. This will scale it appropriately.
5. Then, add any color variants for the icon.

#### Preparing icons for handoff
##### Duotone icons
1. Open [Icons 2.0](https://www.figma.com/file/cLGkWCYparhoT1kDSw0xX4/%F0%9F%93%90-Icons-2.0---VAMobile?node-id=0%3A1&t=cuVnHqvFVGMX3KrI-1) file in Figma
2. Log in to [Font Awesome (version 5.15.4)](https://fontawesome.com/v5/search) and look for the duotone icon. 
	* If it exists, copy the SVG code snippet and paste it into the Figma file.
		* Remove the frame and resize the icon so that the longest side is 24px.
	* If it does not exist, look for the version without the circle. Copy the SVG code snippet and paste it into the Figma file.
		* Remove the frame and resize the icon to fit inside of the 24px circle. Depending on the icon, it will most likely be around 12 to 16 px. 
		* Draw a 24x24px circle, center the icon inside of the circle, and subtract it. 
		* Place another copy of the icon on top of the circle, center it, and group the layers.
3. Label the group layer with the name of the icon – always use the same name that FE uses.
4. Change the center fill of the icon to #FFFFFF and the circle to #000000 fill.
5. Click on the group layer and select export SVG. 
6. In your downloads, right click and select "Open with" > "Text edit."
7. Copy the code from the text edit and send to FE. Ask FE to review and make sure it is working as expected.

##### Single layer icons
1. Open [Icons 2.0](https://www.figma.com/file/cLGkWCYparhoT1kDSw0xX4/%F0%9F%93%90-Icons-2.0---VAMobile?node-id=0%3A1&t=cuVnHqvFVGMX3KrI-1) file in Figma
2. Log in to [Font Awesome (version 5.15.4)](https://fontawesome.com/v5/search) and look for the icon. Copy the SVG code snippet and paste it into the Figma file.
3. Remove the frame and resize the icon to fit inside of the 24px circle.
4. Label the vector layer with the name of the icon – always use the same name that FE uses.
5. Change fill to #000000.
6. Click on the vector layer and select export SVG. 
7. In your downloads, right click and select "Open with" > "Text edit."
8. Copy the code from the text edit and send to FE. Ask FE to review and make sure it is working as expected.