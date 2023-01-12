# Endpoint Creation Checklist
## Checklist for creating new endpoints:
### App Functionality
* Added endpoint to routes.rb (`modules/mobile/config/routes.rb`)
* Created new controller method for endpoint (`modules/mobile/app/controllers`)
* Created new serializer (`modules/mobile/app/serializers/mobile`) _(if applicable)_
* Created new model (`modules/mobile/app/models`) _(if applicable)_
* Created new pagination contract (`modules/mobile/app/models/mobile/v0/contracts`) _(if applicable)_
### Specs
* Wrote request specs for new endpoint in rspec (`modules/mobile/spec/request`)
* Created JSON schema for endpoint (`modules/mobile/spec/support/schemas`)
### Documentation
* Created $ref schema for new endpoint (`modules/mobile/docs/schemas`)
* Updated openapi.yaml for new endpoint (`modules/mobile/docs/openapi.yaml`)
* Regenerated HTML file by running `generate_static_docs.sh` command (`modules/mobile/docs/generate_static_docs.sh`)
### Monitoring
* Added new endpoint to `SERVICE_GRAPH` (`modules/mobile/app/controllers/mobile/v0/maintenance_windows_controller.rb`) _(only applicable for new upstream services used)_
  * Updated request specs (`modules/mobile/spec/models/service_graph_spec.rb`)
* Added new endpoint component to `api_mobile_components` in [devops repo](https://github.com/department-of-veterans-affairs/devops) (`ansible/deployment/config/revproxy-vagov/vars/nginx_components.yml`)
  * Ensured order of components matches the order routes as listed in [`routes.rb`](https://github.com/department-of-veterans-affairs/vets-api/blob/master/modules/mobile/config/routes.rb)
  * Added mapping of component section to `nginx_api_server.conf.j2` (`ansible/deployment/config/revproxy-vagov/templates/nginx_api_server.conf.j2`) _(if new component section added in `nginx_components.yml`)_
  * Added mapping of component section to `nginx_new_api_server.conf.j2` (`ansible/deployment/config/revproxy-vagov/templates/nginx_new_api_server.conf.j2`) _(if new component section added in `nginx_components.yml`)_
