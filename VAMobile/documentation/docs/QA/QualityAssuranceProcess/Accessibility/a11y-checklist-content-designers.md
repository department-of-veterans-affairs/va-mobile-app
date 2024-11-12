---
title: Checklist for content designers
---

# Accessibility checklist for content designers

*Last update: October 28, 2024*

The following accessibility guidelines include guidance from both [Web Content Accessibility Guidelines (WCAG) 2.2](https://www.w3.org/TR/WCAG22/) and [Mobile Content Accessibility Guidelines (MCAG)](https://getevinced.github.io/mcag/). Since the majority of the list is made up of WCAG guidance, we have included an indicator of "(MCAG)" whenever the guidance comes from MCAG.

## **Code quality**
Good quality code is resilient which makes it compatible with a wider range of browsers and assistive technologies.

### **Language changes in the content should be identified.**
- Identify language changes within the content and identify for developers to markup.
<br />

## **Content structure**
Structuring content helps people group information and work out what's important and what they need to read first. This structure must be shown visually and using code.
- All content on the app should use plain language and avoid figures of speech, idioms, and complicated metaphors.
- All buttons, links, and labels should be unique and descriptive of what a user will find on the following screen.

### **Headings should be descriptive.**
- Write headings that are short and clear.
- Put meaningful words or essential information at the start of the heading.
- Make sure headings accurately describe the following content.

### **Headings should communicate content hierarchy.**
- Introduce each content section with a heading.
- Use heading levels to reflect a logical content hierarchy.
- Begin the main body content with a heading that describes the page. Only one primary (web equivalant to an H1) should be used per screen and should make it clear to a user what information will be found on that screen.
- Communicate the heading structure to developers, if it’s unclear.

### **Group related items as lists.**
- Use numbered lists when the order of items matters.
- Use bulleted lists where there is no clear order.
<br />

## **Forms**
Clear instructions for entering or fixing information will help a user complete a form quickly and correctly the first time. Using autocomplete and giving someone a chance to review information helps reduce the amount of typing.
- Put information that relates to the whole form before the start of the form.
- Check that all required fields are visually identified.
- Check that each label makes the field’s purpose clear.
- Offer clear help text to help people enter information correctly.
- Within a process that requires the user to enter the exact information more than one time after the user provides the data once, at least one of the following should be true:
   - The fields are auto-populated, or
   - The user can choose to auto-populate the fields
   - Except when:
      - The information is required to ensure the security of the content, or
      - The previously entered information is no longer valid.

### **Messages should tell you what and how to fix an error.**
- Identify where mistakes are and describe the issue in language people will understand.
- When there is an option for it, error messages include suggestions for revision, except when:
   - The information may jeopardize the security or privacy of the user. (MCAG)
- Write error messages to be as specific as you can, rather than using generic messages.
- Avoid putting links inside error message text.
- If a user input results in an error, the item in error should be clearly marked. (MCAG)
- If a user input results in an error, the error is described by text. (MCAG)
- Error messages should be located next to the item in error.

### **Sensitive Transcations Error Prevention (MCAG)**
- When users submit any action involving financial transactions, legal commitments, or authorization to access or change data owned by users, at least one of the following should be true:
   - There is a mechanism that validates the user inputs and provides an option to correct errors, or 
   - The user can check and confirm the data before executing the transaction, or
   - The submission is reversible.
<br />

## **Images**
Images, including icons, that are meaningful must have a text alternative (alt text) so that users who can’t see them, can still get the same visual information they contain.

### **Informative images need alt text, but decorative images don’t.**
- Describe the meaningful information in informative images using alt text.
- Identify decorative images so developers can code them correctly.
- Avoid using images containing informative text unless it’s a logo or the information is available somewhere else.

### **Complex images should have alternatives.**
- Provide alt text that briefly describes the image, and
- Include a detailed text description of the complex image.
<br />

## **Links**
Links must clearly tell users where the link will take them and they must be easy to see.
- Confirm that the link text describes the link’s destination.
- Avoid using URLs as link text.
- Use the same link text to describe links that go to the same destination.
- Avoid using title attributes on links.
- Include file format and size information in links to non-web pages.
- Put essential information about the link destination at the front of the link text.
<br />

## **Multimedia**
Multimedia content can offer users an alternative to text. Everyone can watch or listen if you give them options to turn on captions, read a transcript, listen to a description of visual content, or watch a sign language translation of the content.

### **Pre-recorded audio-only content should have alternatives.**
- Provide a transcript of audio information for pre-recorded audio-only content.

### **Pre-recorded video content should have alternatives.**
- Provide captions for audio in video content.
- Provide a descriptive transcript or audio description for visual information.
- Provide audio description of visual information for video content.
- Provide a descriptive transcript of audio and visual information for video content.

### **Live video content should have alternatives.**
- Provide captions for live video content.
- Ask presenters to describe all important visual information in their dialogue.
- Ask presenters to use audio-described videos in their presentations.

### **Live audio-only content should have alternatives.**
- Offer live captions or text streams for live audio-only content.
<br />

## **Navigation**
Users want to navigate around the app easily. A user’s confidence in an app will build when they know where they are and that layouts are applied consistently.
- Provide a descriptive title for each page or view.
   - The screen title should describe its' context. (MCAG)
- Each screen title should be unique. (MCAG)
- Provide a unique name for common page regions that are used more than once on a page.
- The order of elements on the screen should make sense and reflect the content hierarchy of the screen. (MCAG)

### **Logical Content Grouping (MCAG)**
Elements forming a single context unit should be grouped together so they are announced by assistive technologies as a single element.
- When browsing through the screen with a screen reader or a similar assistive technology, ensure that elements that assemble a single context (i.e. a button, its' text, and its' icon **or** an image and its' caption) are announced as one unit and that each of its parts is not announced separately.
<br />

## **Sensory**
Information that relies on sensory perceptions (like color or sound) to relay meaning, needs to consider users who won’t receive those sensory clues and offer another way to get the same meaning.

### **Communicate information using multiple accessible methods.**
- Add another method if using color to communicate important information.
- Add visual cues if you’re using auditory-only cues for notifications.
- Write instructions that don’t rely on someone perceiving color, shape, size, location, or sound to be understood.
<br />

## **Tables**
Tables help users interpret information with a structural relationship between headings and data. Tables use visual styles and semantic code to make them easier to read.

### **Tables should be easy to read.**
- Break up complex tables into smaller simple tables, where possible.
- Include content in all header cells.

### **Tables should be easy to find and navigate.**
- Identify a table using a caption.
- Give complex tables a text summary.
<br />

## **Text styles**
Text on web pages must be easy to read, see and scan. Accessible text makes the reading experience better for everyone.

### **Text should be easy to scan and read.**
- Avoid overusing text formatting, like underline, bold, italic and all caps.
- Left-align text. Avoid using right-align, center, or justified text.
<br />

## **Unique Labels (MCAG)**
- Interactive elements' labels and accessible names should be unique, except when elements have the exact functionality.
<br />

## **Scaled Text Legibility (MCAG)**
- Text blocks should not be written in all capital letters
- Text blocks should not be written entirely in italics
- Text blocks should not be written in lighter or thinner font weights. A minimum font weight of 400 is recommended.
- Text blocks should not be set to have a justified alignment. All inter-word spacing should be even and consistent.
- Text line lengths should not exceed 70 characters per row, including spaces, using the default font size / zoom settings.
<br />

## **Predictability (MCAG)**
- Users should remain in the same context (i.e. screen, modal, alerts) when they enter or update values in controls and form elements, except when:
   - Users are informed about the context change up front.
- No significant content or structure changes should occur when users enter or update values in controls and form elements, except when: 
   - The changes are due to filtering or sorting actions, and
   - Users can predict the changes, and
   - The location of the focus and assistive technologies in the UI is kept
- Users should remain in the same context (i.e. screen, modal, alerts) when they shift the focus to any control or form element
- No significant content or structure changes should occur when users shift the focus to any control or form element

## **Consistent Help (MCAG)**
- Help mechanisms and help center links should be visually located consistently across all screens.
- Help mechanisms and help center links should be programmatically located consistently across all screens.
- Help mechanisms and help center links should have the exact same identifying names across all screens.

---


_Note: Most of the current content was borrowed from the [Accessibility Not-Checklist](https://not-checklist.intopia.digital/) (altered for mobile apps). Content / tasks will be updated as these lists move forward._