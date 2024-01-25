# Contributing Code

If your contribution entails adding an entirely new component or significant enhancement of an existing component, [please see the general guidance to contributing](https://department-of-veterans-affairs.github.io/va-mobile-app/design/About/Contributing%20to%20the%20design%20system/contributing-to-the-design-system). Given larger enhancements will entail designer input throughout the process, discussions will precede any need for code contributions which will be able to clarify expectations.

If you are looking to contribute a bugfix or minor change you don't believe needs that process:
1. [Search our outstanding issues](https://github.com/department-of-veterans-affairs/va-mobile-library/issues) to determine if it's already on our radar or a new ticket needs to be created
2. Notify us in [our DSVA slack channel](https://dsva.slack.com/archives/C05HF9ULKJ4) to:
    - Determine if we have a timeline to prioritize if a ticket already exists
    - Open a conversation around your intent to contribute a small change
3. If the Slack conversation gives the go ahead to move forward, either assign yourself to the existing ticket or create the new ticket and assign it to yourself
4. If appropriate, update the Slack thread with the newly created ticket
5. Move ticket to in progress
6. See individual package documentation for how to get it running locally to code/test your changes

Factors to keep in mind during coding for a smooth PR:
- Look over [our PR template](https://github.com/department-of-veterans-affairs/va-mobile-library/blob/main/.github/pull_request_template.md?plain=1) for awareness of write-up expectations
- Observe existing code structure and aim to minimize complexity and maintain consistency unless you feel it could be meaningfully improved--if so, consider using Slack to discuss more robust code restructure changes prior to making them
- If appropriate:
    - Update/add unit tests
    - Update/add code documentation
    - Update/add storybook stories
    - Create alpha testing package build(s) to test within your app it behaves as expected with your changes
        - Note: alpha builds should never be used in production, if it is time critical it should be a beta build and be a very temporary fix until a proper version can be published