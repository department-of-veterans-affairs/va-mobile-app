# Release Pipeline Draft Discussion
What does the release pipeline look like? What are the steps? Who has to sign off on what? What builds have to happen? 

## Draft Process
1. make release branch
2. build QA v1
3. Add whats new text files
4. add QA fixes
5. QA v2? 
6. tests?
7. sign offs?
8. approvals?
9. merge to master -> kicks of builds to app stores -> updates master with build bumps
10. version tag?
11. create PR to merge master back to develop to catch QA changes and bumps


## Questions
Do the QA builds really need to happen on the release branch? Currently builds go out twice a week to the dev/qa team and should encompass any changes. is there a need to make separate (read extra) staging builds for this?

For the release branch, do we want to commit changes directly to the release branch, or do bug fixes happen on develop and then we cherry pick those fixes to release? Then the only commits directly to release are whats new text commits.

Right now we have x.x.x versioning. What decides major, minor and patch and how do we tell the CI/CD box which is which.

How do we pass other info to the CI/CD box if we need to? (this is very low on the list of things to figure out, its just on my brain.)

What tests and/or documentation needs to be created/saved for each release? Test outputs, 508 docs, etc?

