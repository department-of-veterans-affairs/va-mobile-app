---
title: Screen types
sidebar_position: 3
---

The VA mobile app has 5 main screen types that fall into two categories:

**Hierarchical screens:**
- The categories, features, and child screens that make up much of the app.
- Make one choice per screen (descending deeper into the app’s hierarchy) until you reach a destination.
- These screens always display the tab bar.

**Modal screens:**
- The VA Health & Benefits mobile app uses modality for quick actions and contained tasks where the user must maintain focus to complete it.
- Because they appear on a layer above the hierarchical screens, modal screens cover the tab bar.

## Hierarchical screens

### Home screen​
<iframe width="500" height="800" alt="image of VA mobile app Home screen" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fdesign%2Fcdp7Be4UdYesq9fXeqaOgt%2FNavigation-2.0-Screen-Templates---%F0%9F%9A%A2-Shipped---VA-Mobile%3Fm%3Dauto%26node-id%3D7733-11182%26t%3DGsZrpZDn1qDXDTr0-1" allowfullscreen></iframe>

* **Definition:** The Home screen is the initial/default screen of the app. It sits at the top level of the hierarchical navigation and summarizes a Veteran's interactions with the VA mobile app. It also provides access to the Veteran's profile information.
  
  The Home screen contains several zones of variable and fixed content:
  - **Activity:** Personalized modules that summarize "in-flight" activities and provide a secondary entry point to app features (variable appearance).
  - **About you:** Personalized high-level data, including the Veteran Status card (fixed appearance).
  - **VA resources:** General interest/evergreen links to VA tools as well as a banner space for announcements (fixed appearance).

  The Home screen displays the tab bar and a link to the Veteran Crisis line. It does not display a back button.
- **Screen transition:** Screen transition between home and categories is top-level peer (fade through).
- **Scroll behavior:** Content scrolls if it exceeds the panel height.
- **Resources:**
  - [Figma file: Home screen template](https://www.figma.com/design/cdp7Be4UdYesq9fXeqaOgt/Navigation-2.0-Screen-Templates---%F0%9F%9A%A2-Shipped---VA-Mobile?node-id=7733-11182&t=GsZrpZDn1qDXDTr0-4)

### Category landing screen​
<iframe width="500" height="500" alt="image of VA mobile app Category landing screen" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2Fcdp7Be4UdYesq9fXeqaOgt%2FVAMobile-Navigation2.0-ScreenTemplates-Shipped%25F0%259F%259A%25A2%3Fnode-id%3D661%253A2738%26t%3Db57jsZqgwHpuU2ja-1" allowfullscreen></iframe>

- **Definition:** Category screens sit at the top level of the hierarchical navigation (and are peers to the Home screen), grouping features of a similar type. Each category screen contains permanent entry points to features and variable description text when applicable. Features are grouped into subsections if the number of features in a category exceeds 6. Displays the tab bar and a link to the Veteran Crisis line. It does not display a back button.
- **Screen transition:** Screen transition between categories is top-level peer (fade through).
- **Scroll behavior:** Content scrolls if it exceeds the panel height.
  - Screen title scroll behavior:
    - Upon load: "VA" header text visible in top bar, screen title appears in body.
    - When scrolled: "VA" header disappears from top bar, screen title disappears from body and moves to top bar.
- **Examples:** Health, Benefits, Payments
- **Resources:**
  - [Figma file: Category landing screen template](https://www.figma.com/file/cdp7Be4UdYesq9fXeqaOgt/IA%2FNAV-Screen-Templates?node-id=288%3A2995)
  - [Github ticket: Category landing screen template](https://github.com/department-of-veterans-affairs/va-mobile-app/issues/3996)

### Feature landing screen​
<iframe width="750" height="500" alt="image of VA mobile app feature landing/child screen" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2Fcdp7Be4UdYesq9fXeqaOgt%2FVAMobile-Navigation2.0-ScreenTemplates-Shipped%25F0%259F%259A%25A2%3Fnode-id%3D661%253A2737%26t%3Db57jsZqgwHpuU2ja-1" allowfullscreen></iframe>

- **Definition:** The “home” screen of a feature. Features are parent sections with multiple children that generally live within a category. A complex feature (like pharmacy or secure messaging) can also have subsections. Displays the tab bar and a descriptive back button.
- **Screen transition:** Horizontal (pushing on & off from right).
- **Scroll behavior:** Content scrolls if it exceeds the panel height.
  - Screen title scroll behavior:
    - Upon load: "VA" header text visible in top bar, screen title appears in body.
    - When scrolled: "VA" header disappears from top bar, screen title disappears from body and moves to top bar.
- **Examples:** Appointments, Pharmacy, Profile
- **Resources:**
  - [Figma file: Feature landing/child screen template](https://www.figma.com/file/cdp7Be4UdYesq9fXeqaOgt/IA%2FNAV-Screen-Templates?node-id=2%3A334)
  - [Figma: header scroll behavior](https://www.figma.com/file/cdp7Be4UdYesq9fXeqaOgt/IA%2FNAV-Screen-Templates?node-id=1%3A364)
  - [Github ticket: Feature landing/child screen template](https://app.zenhub.com/workspaces/va-mobile-frontendqa-60f1a34998bc75000f2a489f/issues/gh/department-of-veterans-affairs/va-mobile-app/3977)

### Child screen​
<iframe width="750" height="500" alt="image of VA mobile app feature landing/child screen" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2Fcdp7Be4UdYesq9fXeqaOgt%2FVAMobile-Navigation2.0-ScreenTemplates-Shipped%25F0%259F%259A%25A2%3Fnode-id%3D661%253A2737%26t%3Db57jsZqgwHpuU2ja-1" allowfullscreen></iframe>

- **Definition:** Child screens live within a feature, generally an item in a list. It’s often the endpoint of a hierarchy. Displays the tab bar and a descriptive back button.
- **Screen transition:** Horizontal (pushing on & off from right).
- **Scroll behavior:** Content scrolls if it exceeds the panel height.
  - Screen title scroll behavior:
    - Upon load: "VA" header text visible in top bar, screen title appears in body.
    - When scrolled: "VA" header disappears from top bar, screen title disappears from body and moves to top bar.
- **Examples:** Appointment details, Prescription details
- **Resources:**
  - [Figma file: Feature landing/child screen template](https://www.figma.com/file/cdp7Be4UdYesq9fXeqaOgt/IA%2FNAV-Screen-