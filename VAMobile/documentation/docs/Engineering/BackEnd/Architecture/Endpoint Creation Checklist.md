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
  1. Request sandbox access [here](https://developer.va.gov/onboarding/request-sandbox-access) or ask Lighthouse to expand the permissions of an existing client id we have with them to include the new API. If requesting a new client id, follow these steps:
  * install pem-jwk tool: https://www.npmjs.com/package/pem-jwk
  * In terminal, execute `openssl genrsa -out private.pem 2048`
  * `openssl rsa -in private.pem -out public.pem -outform PEM -pubout`
  * `cat public.pem | pem-jwk > public.jwk`
  * Use the generated public.jwk file as your Oauth submission to Lighthouse and save the `private.pem` file for a later step. 
  2. Add client id (or new permissions to existing) to `config/settings.yml`. See entry `lighthouse_health_immunization` as reference. client_id should be provided by the lighthouse onboarding form. Other urls were provided by a lighthouse contact, Derek Brown. Unclear if best practice is to create single client id with all scopes Mobile will need or if we want a client id for each service, I'm leaning towards the former.
  3. Add key path, private RSA key and other relevant urls, to [AWS](https://dsvagovcloud.signin.amazonaws-us-gov.com/console) with the following steps:
  * Login and find service `Systems Manager`
  * Goto `Parameter Store` in left column
  * In search bar, type in `mobile` and use other mobile keys and urls as reference to how to format new ones. The names of these parameters need to match what is referenced in manifests repo changes listed below. 
  <br/><br/>*Note: the formatting of the private RSA key is very particular. There should be no spaces or new lines. New lines should be replaced with /n. At time of writing, there is no checks in place for valid formatting so misformatting AWS values will cause production deployment to fail. May want to have Rachel Cassity double check any new values. Format should look something like this:* 
```
-----BEGIN RSA PRIVATE KEY-----\nLOTOFCHARACTERSHERE\n-----END RSA PRIVATE KEY-----
```
  4. Add key path and other relevant urls to [vsp-infra-application-manifests repo](https://github.com/department-of-veterans-affairs/vsp-infra-application-manifests) in the following locations: 
  * apps/vets-api/staging/values.yaml
  * apps/vets-api/staging/templates/secrets.yaml
  * apps/vets-api/prod/values.yaml
  * apps/vets-api/prod/templates/secrets.yaml
  <br/><br/>*Note: You may notice that immunizations also is added to dev as well as vets-api-helm101, which is used for testing k8s. It was determined that these aren't used by mobile and unnecessary.*
  5. Add key path and other relevant urls to [devops repo](https://github.com/department-of-veterans-affairs/devops) in the following locations:
  * ansible/roles/review-instance-configure/vars/settings.local.yml
  * ansible/deployment/config/vets-api/prod-settings.local.yml.j2
  * ansible/deployment/config/vets-api/staging-settings.local.yml.j2
  <br/><br/>*Note: Immunizations was also added to dev ansible config but we don't use dev so that should be unnecessary. Text search for `immunization` as reference to formatting.*
  <br/><br/>*Note: If you have any questions or need approvals for devops or manifests PRs, your best point of contact is Rachal Cassity*

  6. Once sandbox is working, you must request production access separately though the same onboarding link above. 
