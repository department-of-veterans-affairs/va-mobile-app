# Continuous Integration and Deployment

## Rubocop

  * A linter used within vets-api that enforces style rules. 
  * Rules and exceptions for these styles can be modified in the .rubocop.yml in the root of vets-api
  * Rules can be disabled on a case by case basis by disabling the rule inline in your ruby file. EX: module length rule can be disabled by putting `# rubocop:disable Metrics/ModuleLength` before the module than `# rubocop:enable Metrics/ModuleLength` after the module. This should only be done if complying with the rule creates even worse looking code. 

## Pull Request Continuous Integration  

  * When a PR is created to merge into master, multiple checks are done before it is allowed to merge. 
    * Rubocop, all changes must comply with the linter, see above section. 
    * All specs must pass. There are some specs (non-mobile) that do not pass consistently. This typically get disabled for this check but can occasionally slip through and fail your specs. This can be resolved by just re-running the job through github. 
    * Total lines of change is under 500. If it is above 500 and cannot realistically be reduced, you can request an exception through DSVA Platform support (https://dsva.slack.com/archives/CBU0KDSB1). 
    * Approved review by a Mobile team member. If there are changes outside the mobile module, an additional review will be required by VA API Engineers group. This can also be requested by the DSVA Platform support (see above link.
  * NOTE: Try not to merge in your PR without adequate time to check that it does not cause any issues in staging. Vets-API daily deploy is at 3PM EST but is manual process so if there's issues, it can be deployed before or after this time. Because Staging and Production both use the master branch. Once your PR is merged, you only have until the next production deploy to test your changes and revert them if necessary.  
