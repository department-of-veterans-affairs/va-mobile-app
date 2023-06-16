# Continuous Integration and Deployment


## Production Deployment

 * See [Platform Support docs](https://depo-platform-documentation.scrollhelp.site/developer-docs/deployment-process) for schedule of production deployment 
 * Try to merge in your PR with adequate time to check that it works in staging. Because Staging and Production both use the master branch, once your PR is merged, you only have until the next production deploy to test your changes and revert them if necessary. Your code can occasionally get pulled into an off cycle deploy hotfix that can happen outside the regularly scheduled daily deploys. You can test changes on your branch without merging into master through review instances but this is not commonly used due to workarounds required to get a SIS user token. See [Review Instances](../Testing/ReviewInstances.md). 
 * Checking when production was last re-deployed can be done at through [Argo](https://argocd.vfs.va.gov/applications/vets-api-prod?resource=) via the last sync result section.

## Staging Deployment

  * Staging automatically redeploys after every new commit to Master (only during business hours). This typically takes up to 20 minutes. 
  * Checking when staging was last re-deployed can be done at through [Argo](https://argocd.vfs.va.gov/applications/vets-api-staging?resource=) via the last sync result section.

## Pull Request Continuous Integration  
  
  * Follow [PR best practices](https://depo-platform-documentation.scrollhelp.site/developer-docs/pull-request-best-practices)
  * When a PR is created, multiple checks are done before it is allowed to merge. 
    * Rubocop, all changes must comply with the linter, see [Rubocop](#Rubocop). 
    * All specs must pass. There are some specs (non-mobile) that do not pass consistently. This typically get disabled for this check but can occasionally slip through and fail your specs. If this check does fail, it may be a transient issue with the CI pipeline and just needs to be re-run. Occassionally, bad code gets merged into master that eventually gets corrected. You may need to re-merge with master to bring in these fixes to get this job to succeed (use re-merge master button on PR github page, don't have to do it manually). If after about 4 to 5 re-runs and re-merges of master into your branch, if it is still not passing, reach out to DSVA Platform Support (https://dsva.slack.com/archives/CBU0KDSB1).
    * Total lines of change (LOC) is under 500. If it is above 500 and cannot realistically be reduced, you can request an exception through DSVA Platform Support (See above link). JSON and YML files such as VCR cassettes used in specs do not count towards LOC.
    * Approved review by a Mobile team member. (Technically, a VA API Engineer from platform support approval will allow you to merge but as an internal policy, we require at least one mobile engineer to approve.)
    * If there are changes outside the mobile module, an additional review will be required by VA API Engineers group. This can also be requested by the DSVA Platform support (see above link).
  
## Rubocop

  * A linter used within vets-api that enforces style rules. 
  * Can be run locally on all of the mobile code by running `bundle exec rubocop modules/mobile -a`
  * Rules and exceptions for these styles can be modified in the .rubocop.yml in the root of vets-api
  * Rules can be disabled on a case by case basis by disabling the rule inline in your ruby file. EX: module length rule can be disabled by putting `# rubocop:disable Metrics/ModuleLength` before the module than `# rubocop:enable Metrics/ModuleLength` after the module. This should only be done if complying with the rule creates even worse looking code. 
