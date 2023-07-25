---
title: Information Architecture
sidebar_position: 5
---

## Defining information architecture
Information architecture (IA) is the practice of organizing, structuring, and labeling content in an effective and sustainable way. This guide is intended to help designers and content maintainers make content within the VA mobile app usable and findable to Veterans.
 

## Information Architecture principles
The following guiding principles are used to help Veterans find information and complete tasks within the VA Health and Benefits app:
* **Considers the larger VA system:** The app’s IA and navigational language consider VA touchpoints, properties and programs outside of the mobile app (digital and physical), with each thing working together as an omnichannel system.
* **Consistent sense of place:** The app uses multiple wayfinding approaches to communicate where users are *now* in the app and *where they can go from there.* Examples of this are displaying global navigation on every screen in the hierarchy, screen names that are unique and descriptive, using common screen transitions to communicate a screen's position in the hierarchy, and including descriptive back labels on each screen.
* **Delivers value at every level:** Each screen in the app should contain valuable and/or actionable content—no screens that are just lists of links. 
* **Extensible:** The app’s IA and navigation model leave room to expand its feature set by considering and anticipating future organizational needs.
* **Informed by Veterans:** IA decisions are based on user research conducted with Veterans, examining their mental models around the organization of common tasks and undertanding of labels, as well as getting feedback on proposed solutions. 
* **Keeps it simple:** Content is prioiritized and includes only what’s absolutely necessary—the fewer elements (number of levels in the hierarchy, number of screens, number of links on a screen) the better.

References:
[VA.gov Information Architecture (IA) team](https://github.com/department-of-veterans-affairs/va.gov-team/tree/69833737d9fe22b8990bb987e7c50de13205c5d5/platform/information-architecture)
[Best Practices for IA on VA.gov](https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/platform/information-architecture/ia-best-practices.md)
[VA.gov Design principles](https://design.va.gov/about/principles)  



## When to think about IA
* Launching a new feature in the VA Health and Benefits app
* Adding a new category or subsection to the VA Health and Benefits app
* Rewriting content and needing to split or merge an existing screen
* Looking to improve the findability of an existing feature and/or screen
* Removing a feature and/or screen
* Changing the UX of global navigational elements (i.e. tab bar/bottom navigation, top bar, including treatments for back buttons, contextual actions and screen titles)


## IA documentation
Understanding what’s guiding the app’s current information architecture and make future decisions that are in line with the existing organization, navigation, labeling, and indexing systems.

### Sitemap/flow diagram 
A sitemap is a planning tool that visually shows how information will be grouped and labeled, where content will be located, and how a user will move through the app. This adaptation of a standard sitemap includes the system display logic for screens that have variants, key actions (buttons, links), common processes and points where it makes use of native mobile integrations. **This is the source of truth for the app’s IA.** 

<iframe width="800" height="450" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FTEEgHdlibzCilCj4LviHVF%2FVA-Mobile-app---Detailed-Sitemap-2.0%3Ftype%3Dwhiteboard%26node-id%3D0%253A1%26t%3DNOXEk15mCNO0XQ5Q-1" allowfullscreen></iframe>

[VA Mobile App - Detailed sitemap 2.0 (FigJam)](https://www.figma.com/file/TEEgHdlibzCilCj4LviHVF/VA-Mobile-app---Detailed-Sitemap-2.0?type=whiteboard&node-id=0%3A1&t=NOXEk15mCNO0XQ5Q-1)



### Taxonomy description
The VA Health and Benefits app’s IA contains four top level categories: Home, Benefits, Health and [Payments]. Each category contains at least two features and/or subcategories. Features within each category should be grouped into subsections if the number of features in a category exceeds six.

#### Top level categories and contents
* **Home:** The app’s default screen—displays a combined, personalized view of the information (and tasks) most relevant to the individual Veteran from across the VA, plus persistent access to general VA info (ex: contact and location finder) and lesser used features like Profile and Settings.
  * **Profile (Subcategory):** Infrequently updated items like personal information (such as contact information, military information, DOB) that isn’t specific to a single category and app settings.
* **Health:** All health-related features and statuses.
  * Features: Appointments, Pharmacy, Medical records, Messaging, COVID-19 updates.
* **Benefits:** All benefit-related features and statuses that are not health-related.
  * Features: Disability rating, Claims, Education, VA Letters
* **[Payments]:** A unified section for managing financial information from across the VA.
  * Features: Benefit payments, medical copays, bills, travel reimbursements, direct deposit information.



### Adding new items to the app’s Information Architecture
1. **A feature’s placement within the app’s navigation and taxonomy should take user mental models, business goals, and the feature type into account.** [Determining Navigation and Information Architecture Placement for New VA Mobile App Features](https://docs.google.com/document/d/1XQcYxnCifloaBFNKL2C9JNS7KIj6wEhb4VokPGxBZU8/edit#) is a guide intended to help teams decide where a new feature belongs in this app’s sitemap and navigation model. 
1. **Always try to find a placement in an existing category first** before proposing a new top-level category for a feature. Confirm new category names and contents with card sort research before adding to the app.
1. **Within a category, keep the hierarchy as flat as possible** in terms of screens (limit the levels it’s possible to drill down through in order to get to child screens), but without inlcuding too many options on a single screen. 
1. **If there are many features within a category, group the features and label the groups** at category level before introducing additional levels into the screen hierarchy—this helps avoid cognitive overload.
1. **All features in the VA mobile app should have a primary placement within the app’s taxonomy**, even if there are multiple entry points for it at different locations within the app (example of secondary entry points: personalized home screen content, cross-references within other sections).
1. **When content outgrows the current category structure, conduct card sort research** to determine new category names and contents (Avoid using “hamburger” and “more” menus as primary navigation).

## Background
The VA Health and Benefits app’s Information Architecture and navigation model are based on the findings and output from a multi-stage, collaborative and cross-functional design and research process: [Information Architecture and Navigation - High Level Project Summary](https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/products/va-mobile-app/ux-design/information-architecture-navigation/High%20Level%20Project%20Summary.md)
* [**Phase I:** Two rounds of card sorting](https://github.com/department-of-veterans-affairs/va.gov-team/tree/master/products/va-mobile-app/ux-research/information-architecture) (open and closed) with Veterans
* [**Phase II:** Navigation model design exploration](https://github.com/department-of-veterans-affairs/va.gov-team/tree/master/products/va-mobile-app/ux-design/information-architecture-navigation#phase-ii---navigation-model-exploration--implementation), audit and comparative analysis
* [**Phase III:** Evaluative testing](https://github.com/department-of-veterans-affairs/va.gov-team/tree/master/products/va-mobile-app/ux-research/usability-testing/new%20navigation%20usability) with Veterans, including a usability study of the proposed navigation model and sitemap reflected through a low-fidelity prototype


