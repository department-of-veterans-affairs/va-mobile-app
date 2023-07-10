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
* Created JSON schema for endpoint (`modules/mobile/spec/support/schemas`) _(if applicable)_
### Documentation
* Created $ref schema for new endpoint (`modules/mobile/docs/schemas`)
* Updated openapi.yaml for new endpoint (`modules/mobile/docs/openapi.yaml`)
  * Included standard error responses in docs _(more responses may be applicable for some endpoints)_:
  ```
  '401':
      $ref: '#/components/responses/401'
  '403':
      $ref: '#/components/responses/403'
  '404':
      $ref: '#/components/responses/404'
  '408':
      $ref: '#/components/responses/408'
  '500':
      $ref: '#/components/responses/500'
  '502':
      $ref: '#/components/responses/502'
  '503':
      $ref: '#/components/responses/503'
  '504':
      $ref: '#/components/responses/504'
  ```
* Regenerated HTML file by running `generate_static_docs.sh` command (`modules/mobile/docs/generate_static_docs.sh`)
### Monitoring
* Added new endpoint to `SERVICE_GRAPH` (`modules/mobile/app/controllers/mobile/v0/maintenance_windows_controller.rb`) _(only applicable for new upstream services used)_
  * Updated request specs (`modules/mobile/spec/models/service_graph_spec.rb`)
* Added new endpoint component to `api_mobile_components` in [devops repo](https://github.com/department-of-veterans-affairs/devops) (`ansible/deployment/config/revproxy-vagov/vars/nginx_components.yml`) _(only applicable if new endpoint not already covered by any existing components)_
  * Ordered the components accordingly to avoid incorrect matches _(Components are used to match the routes of incoming requests. When a new request is received by the vets-api, datadog will attempt to associate it with the first component in the list that matches- e.g. if a new request comes in for `/mobile/v0/appointments` and `appointment` is listed above `appointments` in the components list, it will associate the request with the `appointment` component.)_
  * Added mapping of component section to `nginx_api_server.conf.j2` (`ansible/deployment/config/revproxy-vagov/templates/nginx_api_server.conf.j2`) _(if new component section added in `nginx_components.yml`)_
  * Added mapping of component section to `nginx_new_api_server.conf.j2` (`ansible/deployment/config/revproxy-vagov/templates/nginx_new_api_server.conf.j2`) _(if new component section added in `nginx_components.yml`)_
