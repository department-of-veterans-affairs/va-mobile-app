---
title: QA
---
# VA Mobile App Quality Assurance Process

 A quality assurance process is an agreement between the project developers, product managers and quality assurance on the process for testing and verifying the delivery of product functionality. (See [this whitepaper](https://www.altexsoft.com/whitepapers/quality-assurance-quality-control-and-testing-the-basics-of-software-quality-management/) for some great QA-related basic terms and definitions, including "quality assurance process")

The VA Mobile App is a mobile application that will allow veterans to access their healthcare services and claims information via their mobile devices.

The objective of this QA process is to document how we will verify that the software developed for the VA Mobile App works as defined in the product requirements.

## Test strategy

We are taking an integrated approach to testing - building QA activities into the agile development process so that testing takes place early and often as a key part of sprint operations. Identifying issues during development will minimize technical and functional debt and make for better product quality and more accurate progress reporting and delivery status. In addition, we will leverage automated testing tools in the development delivery chain to provide real time [unit](https://department-of-veterans-affairs.github.io/va-mobile-app/docs/Engineering/FrontEnd/Testing/UnitTesting), [UI](https://department-of-veterans-affairs.github.io/va-mobile-app/docs/QA/Automation) and service reliability (_no documentation yet_) checks.

## Features to test

Testing will be performed throughout the development process based on the prioritization and delivery of features in the product backlog. As product management prioritizes features and the development team implements those features, Quality Assurance will write associated test cases and execute those test cases, verifying that the features delivered meet the requirements and function as intended. Features that have not been prioritized and implemented will not be tested. For a detailed description of test and acceptance criteria please refer to the product backlog. At a high level, testing will cover the following functionality:

- All delivered features related to login and authentication flows including biometric authentication
- All delivered features related to navigation and general app behavior
- All delivered features related to veteran access of information in the app (such as military history or disability rating)
- All delivered features related to veteran submission of information in the app (such as Rx refill, secure messaging, or file upload in claims)
- All delivered features related to notifications including push notifications
- All delivered features using accessibility controls (see accessibility test plan for more detail)

## Who is responsible

Software quality is a team effort. Developers will be responsible for [writing unit tests](https://department-of-veterans-affairs.github.io/va-mobile-app/docs/Engineering/Philosphy#all-the-tests). The product team will be responsible for user acceptance testing of the delivered features. Quality Assurance is responsible for writing automated UI tests and manually testing the product functionality and various user flows through the application.

## Testing methods

The following testing methods will be employed during development and testing of the VA Mobile App.

| **Method** | **Description** | **Primary Owner** |
| --- | --- | --- |
| User Stories &amp; Acceptance Criteria | Requirements are defined by the product team and written as user stories in the product backlog. Acceptance criteria (AC) are written as part of the user story and describe the conditions that must be met in order for the story to be accepted as complete. | Product |
| Test Cases &amp; Functional Testing | Test cases are defined by the QA team and are written not only to make sure all stories and their acceptance criteria are met but will also account for edge cases (scenarios that happen outside of normal operating conditions) like attempting to upload the wrong file type or entering text characters into a date field. Test cases are used to perform manual functional testing in which QA interacts with the application as would an end user to identify any issues. | QA |
| Unit Testing | Unit tests are written into the code by developers and target the smallest components of the code that can be logically isolated from the rest of the system. These tests are typically fast and can run any time the code is changed to help identify and isolate defects during development. The purpose of unit tests is to make sure the code functions are defect-free before merging into the larger code base. | Developers |
| Integration Testing | In contrast to unit tests, integration tests run across individual modules of code to validate that separately developed modules are working together properly. Integration tests are also used to validate that the VA Mobile App front end interfaces with other systems and services, such as the VA.gov APIs, as designed. | Developers |
| End-to-end Testing | End-to-end testing, or system testing, looks to validate that the system as a whole works as intended. These tests are similar in nature to integration tests but are focused on the superset of delivered software and its connections to other systems. End-to-end testing will be done prior to release and will consist of both manual and automated testing to ensure adequate coverage of the delivered functionality. | Developers, QA, Product |
| User Acceptance Testing | User Acceptance Testing, sometimes referred to as &quot;UAT&quot; or just Acceptance Testing, involves the product team and other stakeholders interacting with the application to simulate real-world usage and signing off that the delivered software functions as defined in the designs and requirements. We will leverage pre-production distribution tools such as TestFlight to get the app in the hands of stakeholders to facilitate Acceptance Testing. | Product, Stakeholder community |
| Accessibility Testing | Accessibility is a major requirement for the VA Mobile App and requires additional consideration beyond the standard testing process. QA will include accessibility checks in the manual functional testing activities. For a more detailed plan on accessibility testing approach see the [Mobile Accessibility Testing Plan](https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/products/va-mobile-app/testing/Accessibility%20Test%20Plan.md). | Developers, QA |
| Compatibility Testing | Software may behave differently depending on the specific device and operating system that it is running on. In order to validate that the software developed will work as intended across a variety of devices we will also perform manual functional testing of each feature on a variety of physical devices and OSs as defined in the [test device matrix](https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/products/va-mobile-app/product/significant%20decisions.md#what-did-you-decide-on-6).

## Testing accounts and data

In order to support testing activities we will need test user accounts with test data that is representative of the variations anticipated in production user data. The purpose of test accounts and test data is to simulate the possible variations that may occur in production data to stress test the application and ensure it has been designed and built to accommodate real world user variance. Test user data variance, and uptime/availability of staging systems, is critical to efficient, low-risk delivery of new features and regression-testing existing features. 

## Bug tracking

Issues identified during a development sprint will be written up as new bug tickets, and attached to an epic (if relevant). The Product Owner may prioritize logged issues into upcoming sprints for the development team to address. Issue tickets are scoped at a 1 by default, and split into further tickets if Engineering investigation uncovers a heavier lift to fix than the default scoping. 

All issue tickets should be written using the [issue ticket template](https://github.com/department-of-veterans-affairs/va-mobile-app/blob/develop/.github/ISSUE_TEMPLATE/bug-report.md). Issues should be classified according to severity based on an agreed-upon scale.

### Issue severity

| **Severity** | **Definition** |
| --- | --- |
| Critical (sev-1) | Issues with both HIGH impact and HIGH frequency |
| High (sev-2) | Issues with either HIGH impact and LOW frequency, or LOW impact and HIGH frequency |
| Low (sev-3) | Issues with both LOW impact and LOW frequency |

#### Impact definitions

| **Impact** | **Definition** | **Examples** |
| --- | --- | --- |
| High impact |  Prevents a user from completing a task | Crashes, system hangs, file/data corruption, errors with no discoverable workaround, component doesn't function (ex: link broken, button can't receive screen reader focus), etc |
| Low impact |  Does not prevent a user from completing a task | Typos, unclear messaging, repetitive information, errors with an easily discoverable workaround, etc |

#### Frequency definitions

| **Frequency** | **Definition** | **Examples** |
| --- | --- | --- |
| High frequency | Affects a component, screen, or action used by 15% or more of monthly users | Authentication, home page (including What's New and Encouraged Update), category landing screens, feature landing or child screens for most-used features (Claims, Upcoming Appointments, and Decision Letters), feature landing or child screens for next-most-used features (Prescriptions, Payments, Messaging, Letters, Disability Rating, and Military Info), and downloading a letter (decision or any other kind) |
| Low frequency | Affects a component, screen, or action used by 14% or fewer of monthly users | All other app actions (send message, upload file, etc); and all screens not listed in high frequency examples |

### User-submitted Bug Reports

The Mobile QA team monitors various bug reporting mechanisms to better serve our user base. Some of these mechanisms include: App Stores, Email, and miscellaneous message services. We manually collect these issues and file them into our backlog for review and triage as, "user feedback."

We have four paths for an issue that is submitted:

1. If the issue is repeated in customer reports or shows evidence in monitoring tools, but we are unable to replicate, we will hold the issue in our backlog as a documented open issue.
2. If we cannot replicate the issue or evidence points to strange transient network problems / isolated to a single user, we will label the issue as "[Closed - Can't Repro](https://github.com/department-of-veterans-affairs/va-mobile-app/labels/Closed%20-%20Can%27t%20Repro)" and close the issue.
3. If we know the issue was previously fixed, we will label the issue as "[Closed - Deployed/Fixed](https://github.com/department-of-veterans-affairs/va-mobile-app/labels/Closed%20-%20Deployed%2FFixed)" and close the issue.
4. If we are able to replicate the issue it will be evaluated for severity and assigned to the proper team for remediation.

## Test activity reporting

QA activities will primarily be tracked in ZenHub as commentary on sprint stories or logged issues.

| **Activity** | **Summary** |
| --- | --- |
| **Acceptance Criteria / Test Cases** | Added to ZenHub and associated to user stories |
| **Issue Tickets** | Maintained in ZenHub |

## Mobile QA Overview
In April of 2023, we recorded an 'overview of Mobile QA' presentation [(presentation slides as PDF)](https://github.com/department-of-veterans-affairs/va.gov-team/files/11348079/PDF.Mobile.app.release.process.QA.pdf) with some VA stakeholders. Video clips for each (rough) topic include:
- [High-level diagram of QA process in feature implementation](https://user-images.githubusercontent.com/94404065/234995289-0e373312-d47a-43f7-8db7-60bcdf4902ba.mp4)
- [The dwindling tail of bug fixes at the end of feature implementation, aka the feature armadillo](https://user-images.githubusercontent.com/94404065/234995471-a0774258-0cbe-47e4-9041-4d476a25c131.mp4)
- [What QA tests on any given ticket](https://user-images.githubusercontent.com/94404065/234995671-e25cb9c9-e267-4ff0-ad8f-445acee8f10b.mp4)
- [QA work outside of testing](https://user-images.githubusercontent.com/94404065/234995746-f18e5a4c-fc62-4939-838d-86c9061ba2e1.mp4)
- [QA FAQs, aka elephants in the room](https://user-images.githubusercontent.com/94404065/234995839-6aed1042-818d-4e00-b55d-d22923f0698c.mp4)





