---
title: "2025-08-22: VAHB Freetext Input PII Leakage"
---

## Summary

On August 22, 2025, a PII leakage incident was identified in the VA Health and Benefits (VAHB) mobile app. Two freetext feedback mechanisms—an RX Intercept survey (live since March 6, 2025) and a stationary profile survey (live since July 15, 2025)—were storing free-form user responses directly in Google Analytics. Although the app warned users not to include personally identifiable information and scanned for common PII formats (SSN, phone numbers, email addresses), some users still submitted responses containing PII. The issue was discovered when a team member manually reviewed survey responses and noticed PII inclusions. At the time of discovery, approximately 13,000 total responses had been logged, with a smaller subset containing PII.

## Resolution

Upon discovery, the team took the following steps:

1. **Reported the incident** to Platform Support via the DSVA Slack `#vfs-platform-support` channel.
2. **Notified leadership** in the `vsp-leadership-incident-tracking` channel.
3. **Opened a privacy support ticket** — OIT VA Privacy office created `PSET0787093`, which was later escalated to a formal incident.
4. **Removed affected fields** — A code change was quickly created and merged ([va-mobile-app #11516](https://github.com/department-of-veterans-affairs/va-mobile-app/issues/11516)) to temporarily remove the freetext survey fields from the app, with the fix targeting the September 9, 2025 app store release.
5. **Initiated a Google data deletion request** to remove the logged PII from Google Analytics.
6. **Began investigation** into a permanent backend (AWS) solution to securely store freetext responses outside of Google Analytics.

## Suggestions for Avoiding Similar Issues in the Future

- **Do not use analytics platforms (e.g., Google Analytics) as a storage solution for any user-submitted freetext input.** Analytics tools are not designed with PII controls and access restrictions appropriate for handling veteran data.
- **Design for PII-safety from the start.** Before launching any feature that collects freetext input, ensure a secure, auditable backend storage solution is in place. The team had previously investigated Medallia but determined it was outside contract obligations; a vetted AWS database solution should be in place prior to collecting such data.
- **Treat freetext input as inherently risky.** Automated scanning for PII patterns (SSN, phone, email) is a helpful mitigation but is not sufficient on its own. Users may include PII in unexpected formats, languages, or abbreviations that pattern-matching cannot catch.
- **Establish a review and approval process for new data collection mechanisms** that explicitly requires sign-off from privacy stakeholders before launch. The incident revealed a disconnect between the approving partners' PII requirements and the implementation.
- **Implement periodic manual audits** of any collected freetext data as an additional safety check, rather than relying solely on automated scanning.
- **Coordinate with Medallia or other approved VA survey solutions** as a long-term path to collect user feedback in a compliant and secure manner.
