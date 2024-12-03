---
title: Documentation Guide
sidebar_position: 1
---

# Flagship Component Documentation Guide

## Who does the work?

Updating the documentation for a new component should be a collaboration between the design system team and the Flagship team when the component either currently lives within the design system or will be moved there in the future. It is recommended that you reach out to the Design System team to determine if a new component will remain in the Flagship team’s library or if it will be moved to the design system.

If a new component is exclusive to the VAHB app and will **not** become part of the design system, the Flagship team member should move forward with detailed documentation of the component. When possible, please align with the current documentation outline that is being used by the design system team for consistency (see the [button component](https://department-of-veterans-affairs.github.io/va-mobile-app/design/Components/Buttons%20and%20links/Button) as an example). 

:::note
Guidance on writing documentation and templates for the documentation are included in the “Documentation resources” section below.
:::

If the new component **will** eventually live within the design system, please coordinate with the Design System team so that they can update the [design system documentation](https://department-of-veterans-affairs.github.io/va-mobile-app/design/Intro) with the new component. The Flagship team member should document how the component is used with the VAHB mobile app, while the Design System team will focus on documenting how the component can be used universally.

* **Design system team** documents:
    * The various ways a component can be used.
* **Flagship team** documents:
    * How the mobile app uses the component specifically (where, when, etc.).

## Where does the documentation live?
We have an area on the documentation site for the [Flagship design library](https://department-of-veterans-affairs.github.io/va-mobile-app/docs/Intro#). Within that section, there is another section for [Components](https://department-of-veterans-affairs.github.io/va-mobile-app/docs/Flagship%20design%20library/Components/Overview). Currently, most of the documentation is engineering-focused and is not used to document the components (or their usage) themselves. Please use this area of the documentation site to house this documentation moving forward.

Reference the list in the “What should we document?” section below as a guide to what should be updated (including the name of the page itself) vs. what should be added as a new page on the documentation site. 

## What should we document?
The design system team is responsible for documenting any components where the master lives (or will eventually live) within their library. The Flagship team is responsible for documenting any components where the master lives within their library. 

However, in many cases, the master component lives within the design system’s library (or will in the future) and the Flagship team will use instances of the master component in a specific way. In those cases, the Flagship team should document how they are using the component within the VA: Health and Benefits mobile app.

## Documentation resources
We have several resources available to assist with writing documentation.

* [Writing component documentation](https://department-of-veterans-affairs.github.io/va-mobile-app/design/About/Contributing%20to%20the%20design%20system/writing-component-documentation/) (documentation / guidance)
* [Documentation template](https://github.com/department-of-veterans-affairs/va-mobile-app/issues/new?assignees=&labels=component-documentation%2C+ux&template=common_component.md&title=Common+Component+Ticket%3A%5BInsert+name+of+component+here%5D) (in Github)
    * _Can copy the markdown out of the template_
* [Documentation template](https://docs.google.com/document/d/1DJoTdwXxUrjmCv8S9XwNvn4uVbd66jyE0XUwqzgZtc4/edit#heading=h.bhvl2fy62vsv) (in Google Docs)
    * _Can use this and then convert to markdown_