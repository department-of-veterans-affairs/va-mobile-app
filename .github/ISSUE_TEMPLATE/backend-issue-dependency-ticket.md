---
name: Backend Issue/Dependency Ticket
about: Template for backend requests that don't have or are a dependency for a feature.
title: 'Backend: ...'
labels: back-end, eng
assignees: ''

---
<!-- Please fill out all of the relevant sections of this template. Please do not delete any areas of this template. The tickets can be updated as the sections are finished and any section that doesn't need to have info should be labeled as NA -->
## User Story
<!-- If this is ticket is a dependency please paste the user story from the original issue below. Otherwise create a user story here; As a (who wants to accomplish something), I want to (what they want to accomplish), So that (why they want to accomplish that thing) e.g. As a mobile app product owner, I want a login metrics dashboard, so that I can track the rate of successful logins. -->

#### Description
<!-- Please include a description of the change and context. -->

#### Dependent Issue
<!-- If this is ticket is a dependency enter the link to the original issue below. -->
department-of-veterans-affairs/va-mobile-app#0000 or N/A

#### Test users
<!-- List test users used to record spec cassettes or for staging integration tests. -->
vets.gov.user+000@gmail.com

## Acceptance Criteria
<!-- Add a checkbox for each item required to fulfill the issue. 
e.g. A new MHV Rx service class makes a call to the prescriptions list endpoint.
The final four checkboxes are applicable to all issues. -->
- [ ] ...
- [ ] It logs its progression through the 'happy path' or helpful error details.
- [ ] I tested the feature on staging and could demo it if asked.
- [ ] Public Ruby API methods have [Yardoc](https://rubydoc.info/gems/yard/file/docs/GettingStarted.md) comments.
- [ ] The [OpenAPI](https://swagger.io/specification/) documentation is up-to-date.
