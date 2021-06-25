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
9. approvals?
10. merge to master -> kicks of builds to app stores -> updates master with build bumps
11. version tag?
12. create PR to merge master back to develop to catch QA changes and bumps

## Questions
Do the QA builds really need to happen on the release branch? Currently builds go out twice a week to the dev/qa team and should encompass any changes. is there a need to make separate (read extra) staging builds for this?
> IMO qa should smoke test the release branch build that's set up to point to prod. It's not necessarily a great review since we don't have good accounts, but we need to figure that out. Still thinking about the question though... whether release should also do a qa build pointing to staging. That's weird but maybe necessary because of our inability to test in prod? 

For the release branch, do we want to commit changes directly to the release branch, or do bug fixes happen on develop and then we cherry pick those fixes to release? Then the only commits directly to release are whats new text commits.
> I like the idea of committing bug fixes to release and merging them back into develop; seems less risky but I'm open.

Right now we have x.x.x versioning. What decides major, minor and patch and how do we tell the CI/CD box which is which.
> Product-scale changes, minor revisions and smaller features, and bug fixes only. As for how you tell the differences between small and major features, I really haven't a clue. I've always gone by "feel" but that doesn't make good process. This is where a good marketing person could help, because sometimes major revisions are just "we need to run a new marketing campaign. I don't even know that this matters... pretty much everyone has app auto updates, and I can't tell you the last time I paid attention to version numbers when downloading an app.

How do we pass other info to the CI/CD box if we need to? (this is very low on the list of things to figure out, its just on my brain.)

What tests and/or documentation needs to be created/saved for each release? Test outputs, 508 docs, etc?
> I like the idea of showing results of any automated testing, but I don't know that I have a good reason why. Not sure if anyone would look at them. Do you think we need a long term record of test successes?

## Brainstorming...

* We can describe the flow, but let's definitely point to external documentation about [how workflow works](https://nvie.com/posts/a-successful-git-branching-model). Let better explainers do the explaining.
* We can & should add what's new and description to source control if possible. It'd be nice to have screenshots automagically uploaded, too. I think it'd simplify the amount of people that need access to the store accounts and that's a good thing long term.
* For approvals, imo we need VA Gov Product, Ad Hoc Product, and QA sign offs. Could we automate that with a github issue that includes revision name and all the sign offs?
