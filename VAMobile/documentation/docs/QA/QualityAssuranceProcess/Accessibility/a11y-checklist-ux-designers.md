---
title: Checklist for UX designers
---

# Accessibility checklist for UX designers

*Last update: October 21, 2024*

The following accessibility guidelines include guidance from both [Web Content Accessibility Guidelines (WCAG) 2.2](https://www.w3.org/TR/WCAG22/) and [Mobile Content Accessibility Guidelines (MCAG)](https://getevinced.github.io/mcag/). Since the majority of the list is made up of WCAG guidance, we have included an indicator of "(MCAG)" whenever the guidance comes from MCAG.

## **Adaptable UI**
An adaptable user interface (UI) works for everyone. Someone’s screen size or text settings should never stop them from seeing and using anything.

### **Visual layouts should be flexible and adapt to a user’s preferred setup.**
- Design content that is visible and usable from 320 to 1280 pixels.
- Design layouts that adapt between portrait and landscape mode.
- Ensure that the app is fully mobile responsive including when a user has their text size increased or are zooming in.
- Check your design in specialized browsing modes (i.e. Dark Mode, High Contrast Mode, or Inverted Colors). If your content is still legible and icons, borders, links, form fields, etc. are still present, no adjustments are needed. 
- Do not use horizontal scrolling and ensure that none of the app elements are broken that would allow for horizontal scrolling. 
<br />

## **Color contrast**
A minimum contrast between two colors is necessary so that a user can perceive both colors separately.

### **Text / copy**
- Ensure regular-sized text has a minimum contrast ratio of 4.5:1.
- Ensure large-sized text has a minimum contrast ratio of 3:1.
- Check that text placed over images or gradient backgrounds still has sufficient contrast in all viewports.

### **UI elements**
- Ensure visual states, like hover or focus, on UI components have a minimum contrast ratio of 3:1.
- Ensure that form field borders and custom form elements have a minimum contrast ratio of 3:1.
- Ensure charts, diagrams, and other graphics have a minimum contrast ratio of 3:1 between important parts.
- Ensure that icons have a minimum contrast ratio of 3:1.
<br />

## **Target size**
When targets are small, it is difficult for users with hand tremors and those who have difficulty with fine motor movement to activate them accurately. Providing sufficient size, or sufficient spacing between targets, will reduce the likelihood of accidentally activating the wrong control.

- Ensure that the size of the target for pointer inputs is at least 44 by 44 CSS pixels (or 7x7 millimeters), except when:
  * The target does not overlap any other target and has a target offset of at least 44 CSS pixels to every adjacent target
  * The interaction can be achieved through a different control on the same screen
  * The target is in a sentence, or is in a bulleted or numbered list, or its’ size is otherwise constrained by the line-height of non-target text
  * The target is a default user agent control and was not modified by the mobile app team (MCAG).
<br />

## **Content structure**
Structuring content helps people group information and work out what's important and what they need to read first. This structure must be shown visually and using code.
- Provide easily identifiable feedback (i.e. confirmation of a form submission, alerting the user when something goes wrong, notify the user of changes on the page, etc.). Instructions should be easy to identify.
- Design headings that reflect a logical visual and semantic content hierarchy.
- In a screen with multiple content sections (i.e. Prescription details), each section should have a heading.
- Ensure headings at the same "level" look similar across the app.
- Annotate intended headings for developers, if they are unclear.
- Ensure that the order of the elements on the screen make sense and reflect the content hierarchy of the screen (MCAG).
- Ensure that elements that assemble a single context (i.e. a heading and a single line of copy that should be read together) are announced by a screenreader as one unit and that each of the parts are not announced separately (MCAG).

## **Spacing**
Blocks of text (three lines or more in the body text font size without additional zoom) should have sufficient spacing between lines, words, and characters. Using typography and spacking tokens (see "Spacing tokens" below), each typography component will be pre-built into the library with the minimum spacing requirements. 
- Spaces between lines in text blocks are at least 0.9 times the font size and no more than 1.7 times the font size.
- Spaces between paragraphs (with subsequent paragraphs) should be at least two times (double) that of the font size.
- The font’s default inter-word spacing should not be changed.
- The font’s default inter-letter spacing should not be changed.

### **Spacing tokens**
Typography tokens and various other components will be pre-built into the Flagship and Component libraries with the minimum required spacing tokens needed to follow accessibility best practices. While you can increase the amount of spacing used, you should never reduce it without consulting the accessibility specialist on the mobile app team. For full spacing token documentation, [see the design system](https://department-of-veterans-affairs.github.io/va-mobile-app/design/Foundation/Design%20tokens/Spacing).

## **Forms**
Clear instructions for entering or fixing information will help a user complete a form quickly and correctly the first time. Using autocomplete and giving someone a chance to review information helps reduce the amount of typing.

### **Form information should be discernible.**
- Put any instructions relating to the whole form before the start of the form
- Avoid using color alone to identify a required field.
- Avoid using placeholder text to label a form field.
- Check that form labels or help text are placed close to the form field.

### **Labels and error messages should be discernible.**
- Ensure form labels are visible at all times.
- Place error messages beneath the related form field.
- Make error messages visible and noticeable using color, familiar icons, and text. **Do not use color alone.**
- If an element has both a visible label and an accessible name, the visible label's text should be included in the accessible name (MCAG).
	- The accessible name's copy should start with the text of the visible label (MCAG).

### **Information should be checkable before submission.**
- Let people review the information they’ve entered in a form and fix any mistakes before they complete a legal or financial transaction, change saved data, or submit a test answer.

### **Avoid redundant entries**
- Ensure that information previously entered by or provided to the user that is required to be entered again in the same process is either auto-populated or available for the user to select.
  * Except when: re-entering the information is essential, the information is required to ensure the security of the content, or previously entered information is no longer valid.
<br />

## **Real-time updates (MCAG)**
- There should be a visual indication for real-time updates on the screen.
- There should be auditory indications for real-time updates while using the app.
- Real-time updates should have tactile indications (haptics) unless a user has turned haptic feedback off.
- Time-sensitive real-time updates should be reflected in a push notification when a user is not actively using the app unless a user has opted out of or turned off push notifications.

## **Toast / snackbar (MCAG)**
- The content of a snackbar should be announced by assistive technology without the focus shifting to it.
- The font size of a snackbar message should be at the same as the base font size.
- Each snackbar message should stay visible for at least 5 seconds plus one extra second for every 120 words (rounding up) unless the user can take an action (i.e. "undo").
	- If there is an action that a user can take, the snackbar **should not** auto-dismiss.
	- If the only option within the snackbar is to "dismiss", the snackbar **should** auto-dismiss.

## **Images**
Images, including icons, that are meaningful must have a text alternative (alt text) so that users who can’t see them, can still get the same visual information they contain.
- Identify decorative images so engineers can code them correctly.
- If not included in the body of the page, a text description of any complex images should be found near the image.
- If icons are used, they should have accompanying text and/or a label. Icons should not be used on their own, as it can cause issues for blind/low vision users and users with cognitive disabilities.
<br />

## **External device support (MCAG)**
If a smartphone device supports the connection of an external assistive technology device, users should be able to operate controls and other interactive elements of the app while using the device of their choosing.

When designing, consider how your design will be used by a variety of assistive tech devices. These devices include, but are not limited to:
- Braille displays
- Switch control devices
- Eye-tracking systems and/or technology
- Augmentative and alternative communication (AAC) devices
- Hearing aid compatibility
- Adaptive keyboards and input devices (including a mouse)

## **Keyboard**
Any function or experience a user has when using a mouse must be available to keyboard users. Keyboard accessibility remains as important as ever and most major mobile operating systems do include keyboard interfaces, allowing mobile devices to be operated by external physical keyboards (e.g. keyboards connected via Bluetooth, USB On-The-Go) or alternative on-screen keyboards (e.g. scanning on-screen keyboards).

### **All tasks should be able to be performed using only a keyboard.**
- Use keyboard interactions that are predictable, logical and intuitive, using native patterns where possible.
- Keep an expected focus order of UI components so people can understand and use them. Note this order for developers.
- Avoid triggering important changes that users should be aware of when any component receives keyboard focus.
- Ensure that changing the settings of any UI component has predictable effects unless you tell users first.

### **Ensure that the focusable element does not get obscured / covered.**
- Ensure that any components that receive keyboard focus are not hidden by author-created content.

### **Keyboard shortcuts should not interfere with other input methods**
- Use only keyboard shortcuts that include a modifier key like Alt or Control.
- Use single-character keyboard shortcuts only if they can be turned off, changed, or work when a component has focus.
<br />

## **Links**
Links must clearly tell users where the link will take them and they must be easy to see.
- Ensure links can be identified by more than solely text color.
- Tell users if links are going to open an element outside of the app. Avoid linking to elements outside of the app when possible.
- Give visited links a distinct visual state
<br />

## **Navigation**
Users want to navigate around the app easily. A user’s confidence in an app will build when they know where they are and that layouts are applied consistently.

### **Layouts should support easy navigation.**
- Organize content into common regions and note the regions for developers.
- Keep navigation items in a consistent layout and order throughout the app.
- Give users more than one way to find content on the app.
<br />

## **Dragging movement**
Some people cannot perform dragging movements in a precise manner. Others use a specialized or adapted input device, such as a trackball, head pointer, eye-gaze system, or speech-controlled mouse emulator, which may make dragging cumbersome and error-prone.
- Ensure that all functionality that uses a dragging movement for operation can be achieved by a single pointer without dragging, unless dragging is essential or the functionality is determined by the user agent and not modified by the author.
- Multipoint gestures should have a keyboard alternative.
<br />

## **Motion interaction**
Content and functions that rely on gestures, motion, or a focus state to work, should have alternative ways to access them.

### **Content should always be visible.**
- Avoid content that appears on focus/active only.

### **Gestures should be predictable and easy.**
- Ensure that all tasks can be completed using simple gestures, like a single or double tap.
- Ensure components only activate when a user activates them.

### **Tasks that rely on device motion or user motion should be customizable and accessible.**
- Ensure operations that use motion can be turned off.
- Ensure the same task can be done using standard UI components.
<br />

## **Sensory**
Information that relies on sensory perceptions (like color or sound) to relay meaning, needs to consider users who won’t receive those sensory clues and offer another way to get the same meaning.

### **Communicate information using multiple accessible methods.**
- Add another method if using color to communicate important information.
- Elements distinction should not solely rely on color cues (MCAG).
- Elements' state distinction should not solely rely on color cues (MCAG).
- Conveying information, indicating an action, or prompting a response should not soley rely on color cues (MCAG).
<br />

## **Tables**
Tables help users interpret information with a structural relationship between headings and data. Tables use visual styles and semantic code to make them easier to read.

### **Table styles make readability easier.**
- Use styling to differentiate table headers from data cells.
- Use borders and/or zebra shading to help visual tracking between rows.
- Don't include too much white space between columns.
<br />

## **Timed events**
Time limits must consider people who may need more time to read or complete tasks.

### **Time limits should be reasonable and adjustable.**
- Use time limits only when they are necessary.
- Provide users with an option to turn off or adjust a time limit before it begins or
- Warn users before time expires and give them at least 20 seconds to easily extend the time limit.
<br />

## **Text styles**
Text on web pages must be easy to read, see and scan. Accessible text makes the reading experience better for everyone.

### **Text should be easy to scan and read.**
- Avoid overusing italic and all caps.
- Use underline for links, not for other text.
- Left-align text. Avoid using right-align, center or justified text..
- Design content areas so that lines are shorter than 80 characters.
- Avoid a font size below 16px when possible. Minimum body font size is 16px.
<br />

## **Multimedia**
Multimedia content can offer users an alternative to text. Users can watch or listen if you give them options to turn on captions, read a transcript, listen to a description of visual content, or watch a sign language translation of this content.

### **Alternatives should be easy to find.**
- Put transcripts close to embedded media.
- Put a link to audio-described video close to video location.
<br />

## **Consistent help**
When the placement of the help mechanism is kept consistent across a set of screens, users looking for help will find it easier to identify.
- If a help option (contact form, chat box, etc.) is available to a user, ensure that the placement / location and naming of this option is consistent across screens.
<br />

## **Audio and moving content**
Content that moves or starts playing automatically grabs people's attention. Giving people an option to control this, creates a more comfortable experience.

### **Flashing content can cause seizures.**
- Avoid content that flashes more than 3 times in a second or where the flash is below the general flash and red flash thresholds.

### **Audio content must be controllable.**
- Avoid having audio content play automatically unless it plays for 3 seconds or less.
- Let people control the volume of any audio that plays automatically for more than 3 seconds.

### **Moving content must be controllable.**
- Stop moving content, including carousels, from playing automatically, unless it plays for 5 seconds or less.
- Let people pause, stop or hide any media content that plays automatically and is longer than 5 seconds.

## **Web Views (MCAG)**
- Content presented within Web Views should meet the WCAG 2.2, AA requirements, except when:
	- Elements' target size should meet 2.5.5 Target Size (Enhanced) (AAA) instead of 2.5.8 Target Size (Minimum) (AA)

---


_Note: Most of the current content was borrowed from the [Accessibility Not-Checklist](https://not-checklist.intopia.digital/) (altered for mobile apps). Content / tasks will be updated as these lists move forward._