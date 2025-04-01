---
title: How we work
---
# How we work

?The role of QA within a software delivery team is to provide enough details about the software we're delivering, so that stakeholders can make informed decisions (about whether to release, how to prioritize a given bug, etc). 

We typically provide that information by signing off that we've tested the software in question to our satisfaction. Saying "QA approves merging to develop" or "QA approves release" means we believe we've tested the software well.

## When is our testing "good enough"?

Good software testing happens with the keen awareness that it is impossible to "find all the bugs" (limitations in time, resources, tooling, and knowledge; not to mention inevitable changes in data, processes, software, and systems our software integrates with). Therefore, a highly-functional QA team knows when to stop vs continue working on a given task. On our team:

### We stop preparing for testing activities when:
* we are sufficiently aware of how our software and interacting systems can break and what kinds of problems are the most important to find, and
* we have what we need (tools, data prep, etc) to be able to look for those problems.

### We stop testing when:
* we've examined the product commensurate to the risk it contains,
* we've met our testing standards, and
* we've expressed our testing plan and results, along with quality assessments, clearly.

## Common misconception: QA makes the final decision
QA is one of the last roles, if not the last role, involved in a given ticket; on some teams they are given gatekeeping authority over what software is released.

Within the VA mobile app space, PMs (in conjunction with stakeholders) make the final decision for what goes out the door. That is often explicit (such as new releases or new features) and, on a high-trust team, sometimes implicit (ex: QA stating a ticket meets the PM-set ACs does not need further review before merging into develop)
