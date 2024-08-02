---
title: Creating components in Figma
sidebar_position: 6
---

## How to set up components

* **Component configuration**
	* All components should have “simplify all instances” checked.
	* For components on the doc site:
	    * **Description**: Add a short description of how the component should be used from the documentation site.
	    * **Link**: Add a link to the component’s page on the documentation site.
	* For components that only live in Figma and do not appear on the doc site:
	    * **Description**: Add a short description of how the component should be used.
	    * *Note: Most Figma-only components are sub-parts or building blocks of another component in Figma. They exist in Figma to allow designers to build and use components, but are not required from an engineering perspective. For one component in Figma, there can sometimes be multiple Figma-only components.*
* **Colors**
	* All colors should be pulled from the [Design Tokens file](https://www.figma.com/design/rdLIEaC9rVwX70QbIGkMvG/%F0%9F%93%90-Design-Tokens-Library---Design-System---VA-Mobile?m=auto&t=KYbckwsxuA27CJcc-7) (not light/dark theme files). It is also recommended that you use any semantic tokens that are available.
* **Typography**
	* All text styles should be pulled from the [Foundations Library](https://www.figma.com/file/bGO6g5cCvWycrNjoK66PXc/%F0%9F%93%90-DesignTokens1.0---Library---VAMobile) (not light/dark theme files).
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