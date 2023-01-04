---
title: Screen types
sidebar_position: 2
---
The VA mobile app has 5 main screen types that fall into two categories:

* **Hierarchical screens:** The categories, features, and child screens that make up much of the app. Make one choice per screen (descending deeper into the app’s hierarchy) until you reach a destination. These screens always display the tab bar.
* **Modal screens:** The VA Health & Benefits mobile app uses modality for quick actions and contained tasks where the user must maintain focus to complete it. Because they appear on a layer above the hierarchical screens, modal screens generally cover the tab bar.

### Category landing screen​
[image of category landing]
* **Definition:** The “home” screen of a category. Categories are the top level of hierarchical navigation (each category appears in tab bar/bottom navigation bar), grouping features of a similar type. It contains links to features and relevant summary content. Features are listed alphabetically, and grouped into subsections if the number of features in a category exceeds 6. Displays the tab bar. Does not display back button.
* **Screen transition:** Screen transition between categories is top-level peer (fade through).
* **Scroll behavior:** Content scrolls if it exceeds the panel height
  * Screen title scroll behavior
    * Upon load: "VA" header text visible in top bar, screen title appears in body
    * When scrolled: "VA" header disappears from top bar, screen title disappears from body and moves to top bar
* **Examples:** Home, Health, Benefits, Payments
* Figma file: category template
* Github ticket for template

### Feature landing screen​
[image of feature landing]
* **Definition:** The “home” screen of a feature. Features are parent sections with multiple children that generally live within a category. A complex feature (like pharmacy or secure messaging) can also have subsections. Displays the tab bar and a descriptive back button.
* **Screen transition:** Horizontal (pushing on & off from right).
* **Scroll behavior:** Content scrolls if it exceeds the panel height
  * Screen title scroll behavior
    * Upon load: "VA" header text visible in top bar, screen title appears in body
    * When scrolled: "VA" header disappears from top bar, screen title disappears from body and moves to top bar
* **Examples:** Appointments, Pharmacy, Profile
* Figma file: feature landing
* Figma: header scroll behavior
* Github ticket for template

### Child screen​
[image of child screen]
* **Definition:** Child screens live within a feature, generally an item in a list. It’s often the end point of a hierarchy. Displays the tab bar and a descriptive back button.
* **Screen transition:** Horizontal (pushing on & off from right).
* **Scroll behavior:** Content scrolls if it exceeds the panel height
  * Screen title scroll behavior
    * Upon load: "VA" header text visible in top bar, screen title appears in body
    * When scrolled: "VA" header disappears from top bar, screen title disappears from body and moves to top bar
* **Examples:** Appointment details, Prescription details
* Figma file: feature landing
* Figma file: child
* Figma: header scroll behavior
* Github ticket for template

### Fullscreen task/subtask​
[image of fullscreen task/subtask]
* **Definition:** A contained, linear flow that is presented modally at any level of the app’s hierarchy, opening on a layer over the current screen and taking up the whole screen. A fullscreen task/subtask can be one or multiple steps, and it requires an explicit close or cancel button to exit. Use a task/subtask to enable something complex in order to lock in focus. Because it covers the entire screen, it is the only modally appearing screen over which other dialogs or panels can appear. Does not display the tab bar.
* **Behaviors & Logic:**
  * **Screen Transition:** Screen transition is vertical (pushing on & off from the bottom) to open the subtask, then horizontal between sequential steps (if applicable).
  * **Scroll behavior:** Content (including primary & secondary action buttons) scrolls if it exceeds the panel height.
  * **Button behavior & display logic**
    * Top bar action button behavior & display logic
      * Left button: Cancel only, must be accompanied by primary embedded action button in content. Closes editable view without saving changes and/or closes entire multi-strep flow without saving changes (Display "Are you sure?" confirmation modal).
      * Right button: Done or Close. Does not appear with a primary action button. Closes non-editable view.
    * Embedded action button behavior & display logic
      * Primary action button: May appear alone or with a secondary action button. If task is a single step, tap to save/submit and close view. If task is multi-step, tap to advance to next step (mid-task) or save/submit and close view (end of task) Always accompanied by Cancel.
      * Secondary action button: Appears in a multi-step task, accompanied by a primary action button. Tap to go back one step.
* **Example:** Create an appointment, Refill a prescription
* Figma file: fullscreen subtask
* Github ticket for template

### Large panel​
[image of large panel]
* **Definition:** A contained (single step) task that is presented modally at any level of the app’s hierarchy and appears as a card that covers most of the underlying content. It displays a close button to exit, but can also swipe down or tap on background to close. Use a large panel to display more in depth detail (multiple paragraphs) or a small (quick) task, when you need to lock in focus and limit the possibility of abandoning. Cannot appear over another panel. Does not display the tab bar.
* **Behaviors & Logic:**
  * **Screen transition:** Screen transition is vertical (pushing on & off from the bottom) to open & close, then horizontal between sequential steps (if applicable).
  * **Scroll behavior:** 
     * Top bar title and actions are fixed & do not scroll.
     * Content (including primary & secondary action buttons) scrolls if it exceeds the panel height.
  * **Button behavior & display logic**
    * Top bar action buttons:
      * Left button: Cancel only, must be accompanied by primary embedded action button in content. Closes editable view without saving changes (Display "Are you sure?" confirmation modal).
      * Right button: Done or Close. Does not appear with a primary action button. Closes non-editable view.
    * Embedded action buttons:
      * Primary action button: May appear alone or with a secondary action button. If task is a single step, tap to save/submit and close view. Always accompanied by Cancel.
    * Secondary close/dismiss actions (Save/close action depends on top bar action button label) :
      * Swipe down from header to close the panel
      * Android hardware back also results in closing the panel
* **Example:** Compose a secure message
* Figma file: large panel template
* Github ticket for  template 

### Web view
[image of web view]
* **Definition:** A screen that displays content from an outside website without requiring the user to leave the app. Requires an explicit close or cancel button to exit. Does not display tab bar due to required web toolbar.
* **Transition:** Horizontal (pushing on & off from right).
* **Example:** Contact VA
* [Figma link]

### Adding new screen types to the app​
* Always try to use an existing screen type first before proposing a new (or modifying an existing) screen type.
* New screen types should apply to multiple features/locations in the app rather than stand as one-offs, and need to be approved by the Component Committee.
