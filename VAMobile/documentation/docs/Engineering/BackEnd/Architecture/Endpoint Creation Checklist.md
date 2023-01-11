# Endpoint Creation Checklist

### Checklist for creating new endpoint:

* Created new rspec (`modules/mobile/spec/request`)
* Created new controller (`modules/mobile/app/controllers`) _(if applicable)_
* Created new serializer (`modules/mobile/app/serializers/mobile`)
* Created new model (`modules/mobile/app/models`) _(if applicable)_
* Created new adapter (`modules/mobile/app/models/mobile/v0/adapters`) _(if applicable)_
* Created new pagination contract (`modules/mobile/app/models/mobile/v0/contracts`) _(if applicable)_
* Created $ref schema for new endpoint (`modules/mobile/docs/schemas`)
* Updated openapi.yaml for new endpoint (`modules/mobile/docs/openapi.yaml`)
* Added endpoint to routes.rb (`modules/mobile/config/routes.rb`)
* Created JSON schema for endpoint (`modules/mobile/spec/support/schemas`)
* Re-rendered HTML file (`modules/mobile/docs/index.html`)
* Added new endpoint to `api_mobile_components` in [devops repo](https://github.com/department-of-veterans-affairs/devops) (`ansible/deployment/config/revproxy-vagov/vars/nginx_components.yml`)
