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
### Lighthouse CCG authorization services
Some Lighthouse APIs use an authorization flow called, client credentials grant (CCG). See [Lighthouse documentation](https://dev-developer.va.gov/explore/authorization/docs/client-credentials?api=va_letter_generator) for more information. Mobile has already implemented this authorization flow with at least the immunizations endpoints so generating the JWT token logic can be borrowed from that. 


Adding a new service will require the following steps:
(For questions on the first two steps, contact Derek Brown.)
  1. Request sandbox access [here](https://developer.va.gov/onboarding/request-sandbox-access) or ask Lighthouse to expand the permissions of an existing client id we have with them to include the new API. Client ids can be shared by anyone with the same VASI number. All of Vets-api uses the same VASI number so if possible, try to use an existing one. If a new client id is required, follow these steps:
  * install pem-jwk tool: https://www.npmjs.com/package/pem-jwk
  * In terminal, execute `openssl genrsa -out private.pem 2048`
  * `openssl rsa -in private.pem -out public.pem -outform PEM -pubout`
  * `cat public.pem | pem-jwk > public.jwk`
  * Use the generated public.jwk file as your Oauth submission to Lighthouse and save the `private.pem` file for a later step.
  * client_id will be provided upon submission of the lighthouse onboarding form
  2. Add a new settings to `config/settings.yml` in the vets-api.
  * See section [Adding Local Settings](./Devops.md)
  * to find the config values, go [here](https://dev-developer.va.gov/explore/authorization/docs/client-credentials)
  * select the the desired service from the "Select an API" dropdown menu and click "Update page"
  * the `aud_claim_url` can be found in the "aud" section of the page
  * the `access_token_url` can be found in the "Retrieving an access token" section. It will be the url in the example POST.
  * the `api_scopes` can be found in the "scopes" section. Only include the ones you need.
  * to get the other values, use the left nav bar to navigate to the documentation for the correct API. For example, if you want information for the Appeals Status API, you would go [here](https://dev-developer.va.gov/explore/appeals/docs/appeals?version=current).
  * Near the top of the page, there should be a link to that APIs openapi.json. Click this link to reveal the json in a new tab. The `api_url` should be in that page as `url`.
  3. Add new AWS RSA key if new client id was generated as well as any other sensitive information that can't be publicly shared.
  * See section [AWS](./Devops.md)
  * The formatting of the private RSA key is very particular. the key string should have a new line for every 64 characters. Reference formatting of another RSA key in AWS to see an example. 
  4. Add new variables Manifests repo and Devops repo as instructed in See section [Devops](./Devops.md)
  5. Once sandbox is working, you must request production access separately though the same onboarding link above.
