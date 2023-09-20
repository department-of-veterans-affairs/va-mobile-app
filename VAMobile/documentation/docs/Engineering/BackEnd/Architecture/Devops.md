# Devops
When storing sensitive information that cannot be publicly exposed. It must be added to all the following locations:

_Note: All Devops and Manifests PRs will need a Platform support ticket created for devops team to review_ 

## AWS
All variables should first be put in AWS. If it is not done first, when Manifests repo looks for the new variables, it will fail deployment if it is not found. 
* This can be done at [AWS](https://dsvagovcloud.signin.amazonaws-us-gov.com/console) with the following steps:
* Login and find service `Systems Manager`
* Goto `Parameter Store` in left column
* In search bar, type in `mobile` and use other mobile keys and urls as reference to how to format new ones. The path need to match exactly what is added to Manifests.
  
## Manifests Repo
Once AWS has the variable, Add it to the [vsp-infra-application-manifests repo](https://github.com/department-of-veterans-affairs/vsp-infra-application-manifests) in the following locations:
1. `apps/vets-api/staging/templates/secrets.yaml`: This file maps the AWS path to a variable name.
  ```
  -  key: /dsva-vagov/vets-api/prod/mobile_lighthouse_letters/api_url
     name: mobile_lighthouse_letters_api_url
  ```

2. `apps/vets-api/staging/values.yaml`: This file needs two additions, 
* Mapping that name from `secrets.yaml` to an env variables.
```
- name: mobile_lighthouse_letters_api_url
  path: /dsva-vagov/vets-api/prod/mobile_lighthouse_letters/api_url
  env_var: MOBILE_LIGHTHOUSE_LETTERS_API_URL
```
* Fetching env variable. 
```
mobile_lighthouse_letters:
    api_url: <%= ENV['MOBILE_LIGHTHOUSE_LETTERS_API_URL'] %>
```
3. Repeat these steps for the production files in `apps/vets-api/prod`. Dev env is not used by mobile and does not need to be added there.
## Devops Repo
If you'd like to use these values in review instances, after updating Manifests repo, add the variables to [devops repo](https://github.com/department-of-veterans-affairs/devops) in `ansible/roles/review-instance-configure/vars/settings.local.yml` 

## Adding Local Settings
Add a new section to `config/settings.yml` in the vets-api. See mobile entry `lighthouse_health_immunization` as reference.
This file populates these variables in local spec environment. Variables will get overwritten by the Devops/Manifest values in staging and production.
The names of the variables should be identical to whats in Devops/Manifests repos but the values can be dummy values. They can then be referenced by `Settings` variable in specs.

## Forward Proxy

* If updating forward proxies to a URL is necessary, this can be done at `ansible/deployment/config/fwdproxy-vagov-staging.yml` and 
  `ansible/deployment/config/fwdproxy-vagov-prod.yml`
