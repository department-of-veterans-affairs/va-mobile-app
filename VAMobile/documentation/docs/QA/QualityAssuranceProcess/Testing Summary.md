---
title: Testing summary
---
# Why a testing summary?

QA must [clearly communicate their test plan, results, and quality assessment](https://department-of-veterans-affairs.github.io/va-mobile-app/docs/docs/QA/HowWeWork/index.md#we-stop-testing-when) to fulfill their role of providing stakeholders with enough information to decide whether to release software.

For small, incremental, low-risk, simple changes, the documentation of the test plan itself (running a set of cases, which passed/failed, and any bug reports written) is often sufficient to meet decision-making needs. There's no grand narrative to communicate, for fixing a typo in a button label.

For larger, 'big bang', higher-risk, complex changes, (which should be [avoided whenever possible](https://department-of-veterans-affairs.github.io/va-mobile-app/docs/Engineering/FrontEnd/DevelopmentBestPractices#scoping-tickets)), just a test plan is typically insufficient to communicate your testing work and its results. A testing summary can also be important when working with multiple teams (who likely have differing expectations about what, how, and why QA tests what we test) to support the secondary goal of "avoiding surprising the implementation team about what's being released."

# What's in a testing summary

All testing summaries include:
- Basic identifying information: QA Engineer's name, name of feature under test (and link(s) to key feature documentation, such as a feature epic), and the date when the testing summary was written
- Link to full test plan(s) and result(s), manual and automated
- List of bug(s) found and fixed, pre-release (and links to bug reports for those bugs)
- List of bug(s) found and NOT fixed, pre-release (and links to bug reports for those bugs)
- Testing narrative which includes:
   - Whether all planned & desired testing was completed, and if not, an explanation why
   - What risks QA assessed (in the code itself; in the composition or operations of the implementing team; in the upstream/downstream systems the code integrates with, and visibility/lack thereof into their operations; etc)
   - How QA attempted to mitigate those risks
   - Where, if anywhere, QA anticipates problems after release
- Any other information QA deems relevant to communicate their quality assessment

The VA H&B app flagship team, and the experience teams who work with the mobile app platform team for QA, have a lot of variety in documentation: where they document feature information, what they document, different repos in which they work through tickets, etc. QA should work with the PM responsible to establish where to write/save a testing summary.

Because there is no standard place to publish these summaries, there's also no single template (ex: github ticket template) to create them. Here's an [example summary](https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/products/va-mobile-app/features/design-personalization/qa/findings.md) in the flagship product repo that can be used as a helpful starting point.

## When is a testing summary written

A testing summary (implicit in the name) is written [when testing is completed, but before the release of the software under test.](https://department-of-veterans-affairs.github.io/va-mobile-app/docs/QA/QualityAssuranceProcess/working-with-others#testing-qa)
