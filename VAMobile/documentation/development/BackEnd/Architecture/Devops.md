---
title: Environment variables, secrets, and the parameter store
---

When storing sensitive information that cannot be publicly exposed, it must be stored in AWS and referenced in a specific manner.

## Creating and Referencing Settings in the Parameter Store

Please consult the detailed and evolving process for using the Parameter Store in the Platform Documentation: [Settings and Parameter Store](https://depo-platform-documentation.scrollhelp.site/developer-docs/settings-and-parameter-store)

### Mobile-specific Naming Conventions

If a setting is different between modalities (web and mobile), consider appending `_mobile` to a setting key. For example, the tokens and API keys are different between mobile and web for MHV/RX, so we've defined the following:
```
mhv:
  rx:
    app_token: <%= ENV['mhv__rx__app_token'] %>
    x_api_key: <%= ENV['mhv__rx__x_api_key'] %>
mhv_mobile:
  rx:
    app_token: <%= ENV['mhv_mobile__rx__app_token'] %>
    x_api_key: <%= ENV['mhv_mobile__rx__x_api_key'] %>
```

Otherwise, use the same conventions, i.e. `/dsva-vagov/vets-api/staging/env_vars/my_setting/value`, as defined in the documentation or the setting will not be properly loaded.

## Devops Repo

If you'd like to use these values in review instances, after updating the vets-api repo, add the variables to the [devops repo](https://github.com/department-of-veterans-affairs/devops) in `ansible/roles/review-instance-configure/vars/settings.local.yml`
