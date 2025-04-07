"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[9912],{15567:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>l,contentTitle:()=>c,default:()=>h,frontMatter:()=>r,metadata:()=>s,toc:()=>d});const s=JSON.parse('{"id":"Engineering/BackEnd/Architecture/Endpoint Creation Checklist","title":"Endpoint Creation Checklist","description":"Checklist for creating new endpoints","source":"@site/docs/Engineering/BackEnd/Architecture/Endpoint Creation Checklist.md","sourceDirName":"Engineering/BackEnd/Architecture","slug":"/Engineering/BackEnd/Architecture/Endpoint Creation Checklist","permalink":"/va-mobile-app/docs/Engineering/BackEnd/Architecture/Endpoint Creation Checklist","draft":false,"unlisted":false,"tags":[],"version":"current","frontMatter":{"title":"Endpoint Creation Checklist"},"sidebar":"tutorialSidebar","previous":{"title":"Directory Layout","permalink":"/va-mobile-app/docs/Engineering/BackEnd/Architecture/DirectoryLayout"},"next":{"title":"Error Handling","permalink":"/va-mobile-app/docs/Engineering/BackEnd/Architecture/ErrorHandling"}}');var o=i(74848),t=i(28453);const r={title:"Endpoint Creation Checklist"},c=void 0,l={},d=[{value:"Checklist for creating new endpoints",id:"checklist-for-creating-new-endpoints",level:2},{value:"App Functionality",id:"app-functionality",level:3},{value:"Specs",id:"specs",level:3},{value:"Documentation",id:"documentation",level:3},{value:"Monitoring",id:"monitoring",level:3},{value:"Lighthouse CCG authorization services",id:"lighthouse-ccg-authorization-services",level:3}];function a(e){const n={a:"a",code:"code",em:"em",h2:"h2",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",ul:"ul",...(0,t.R)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(n.h2,{id:"checklist-for-creating-new-endpoints",children:"Checklist for creating new endpoints"}),"\n",(0,o.jsx)(n.h3,{id:"app-functionality",children:"App Functionality"}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:["Added endpoint to routes.rb (",(0,o.jsx)(n.code,{children:"modules/mobile/config/routes.rb"}),")"]}),"\n",(0,o.jsxs)(n.li,{children:["Created new controller method for endpoint (",(0,o.jsx)(n.code,{children:"modules/mobile/app/controllers"}),")"]}),"\n",(0,o.jsxs)(n.li,{children:["Created new serializer (",(0,o.jsx)(n.code,{children:"modules/mobile/app/serializers/mobile"}),") ",(0,o.jsx)(n.em,{children:"(if applicable)"})]}),"\n",(0,o.jsxs)(n.li,{children:["Created new model (",(0,o.jsx)(n.code,{children:"modules/mobile/app/models"}),") ",(0,o.jsx)(n.em,{children:"(if applicable)"})]}),"\n",(0,o.jsxs)(n.li,{children:["Created new pagination contract (",(0,o.jsx)(n.code,{children:"modules/mobile/app/models/mobile/v0/contracts"}),") ",(0,o.jsx)(n.em,{children:"(if applicable)"})]}),"\n"]}),"\n",(0,o.jsx)(n.h3,{id:"specs",children:"Specs"}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:["Wrote request specs for new endpoint in rspec (",(0,o.jsx)(n.code,{children:"modules/mobile/spec/request"}),")"]}),"\n",(0,o.jsxs)(n.li,{children:["Created JSON schema for endpoint (",(0,o.jsx)(n.code,{children:"modules/mobile/spec/support/schemas"}),") ",(0,o.jsx)(n.em,{children:"(if applicable)"})]}),"\n"]}),"\n",(0,o.jsx)(n.h3,{id:"documentation",children:"Documentation"}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:["Created $ref schema for new endpoint (",(0,o.jsx)(n.code,{children:"modules/mobile/docs/schemas"}),")"]}),"\n",(0,o.jsxs)(n.li,{children:["Updated openapi.yaml for new endpoint (",(0,o.jsx)(n.code,{children:"modules/mobile/docs/openapi.yaml"}),")"]}),"\n",(0,o.jsxs)(n.li,{children:["Included standard error responses in docs ",(0,o.jsx)(n.em,{children:"(more responses may be applicable for some endpoints)"}),":"]}),"\n"]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-bash",children:"'401':\n    $ref: '#/components/responses/401'\n'403':\n    $ref: '#/components/responses/403'\n'404':\n    $ref: '#/components/responses/404'\n'408':\n    $ref: '#/components/responses/408'\n'500':\n    $ref: '#/components/responses/500'\n'502':\n    $ref: '#/components/responses/502'\n'503':\n    $ref: '#/components/responses/503'\n'504':\n    $ref: '#/components/responses/504'\n"})}),"\n",(0,o.jsxs)(n.p,{children:["Regenerated ",(0,o.jsx)(n.a,{href:"/va-mobile-app/docs/Engineering/BackEnd/Architecture/OpenAPIDocumentation",children:"OpenAPI documentation"})," HTML file by running ",(0,o.jsx)(n.code,{children:"modules/mobile/docs/generate_static_docs.sh"})]}),"\n",(0,o.jsx)(n.h3,{id:"monitoring",children:"Monitoring"}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:["Added new endpoint to ",(0,o.jsx)(n.code,{children:"SERVICE_GRAPH"})," (",(0,o.jsx)(n.code,{children:"modules/mobile/app/controllers/mobile/v0/maintenance_windows_controller.rb"}),") ",(0,o.jsx)(n.em,{children:"(only applicable for new upstream services used)"}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:["Updated request specs (",(0,o.jsx)(n.code,{children:"modules/mobile/spec/models/service_graph_spec.rb"}),")"]}),"\n"]}),"\n"]}),"\n",(0,o.jsxs)(n.li,{children:["Added new endpoint component to ",(0,o.jsx)(n.code,{children:"api_mobile_components"})," in ",(0,o.jsx)(n.a,{href:"https://github.com/department-of-veterans-affairs/devops",children:"devops repo"})," (",(0,o.jsx)(n.code,{children:"ansible/deployment/config/revproxy-vagov/vars/nginx_components.yml"}),") ",(0,o.jsx)(n.em,{children:"(only applicable if new endpoint not already covered by any existing components)"}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:["Ordered the components accordingly to avoid incorrect matches ",(0,o.jsxs)(n.em,{children:["(Components are used to match the routes of incoming requests. When a new request is received by the vets-api, datadog will attempt to associate it with the first component in the list that matches- e.g. if a new request comes in for ",(0,o.jsx)(n.code,{children:"/mobile/v0/appointments"})," and ",(0,o.jsx)(n.code,{children:"appointment"})," is listed above ",(0,o.jsx)(n.code,{children:"appointments"})," in the components list, it will associate the request with the ",(0,o.jsx)(n.code,{children:"appointment"})," component.)"]})]}),"\n",(0,o.jsxs)(n.li,{children:["Added mapping of component section to ",(0,o.jsx)(n.code,{children:"nginx_api_server.conf.j2"})," (",(0,o.jsx)(n.code,{children:"ansible/deployment/config/revproxy-vagov/templates/nginx_api_server.conf.j2"}),") ",(0,o.jsxs)(n.em,{children:["(if new component section added in ",(0,o.jsx)(n.code,{children:"nginx_components.yml"}),")"]})]}),"\n",(0,o.jsxs)(n.li,{children:["Added mapping of component section to ",(0,o.jsx)(n.code,{children:"nginx_new_api_server.conf.j2"})," (",(0,o.jsx)(n.code,{children:"ansible/deployment/config/revproxy-vagov/templates/nginx_new_api_server.conf.j2"}),") ",(0,o.jsxs)(n.em,{children:["(if new component section added in ",(0,o.jsx)(n.code,{children:"nginx_components.yml"}),")"]})]}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,o.jsx)(n.h3,{id:"lighthouse-ccg-authorization-services",children:"Lighthouse CCG authorization services"}),"\n",(0,o.jsxs)(n.p,{children:["Some Lighthouse APIs use an authorization flow called, client credentials grant (CCG). See ",(0,o.jsx)(n.a,{href:"https://dev-developer.va.gov/explore/authorization/docs/client-credentials?api=va_letter_generator",children:"Lighthouse documentation"})," for more information. Mobile has already implemented this authorization flow with at least the immunizations endpoints so generating the JWT token logic can be borrowed from that."]}),"\n",(0,o.jsx)(n.p,{children:"Adding a new service will require the following steps (For questions on the first two steps, contact Derek Brown):"}),"\n",(0,o.jsxs)(n.ol,{children:["\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.a,{href:"https://developer.va.gov/onboarding/request-sandbox-access",children:"Request sandbox access"})," or ask Lighthouse to expand the permissions of an existing client id we have with them to include the new API. Client ids can be shared by anyone with the same VASI number. All of Vets-api uses the same VASI number so if possible, try to use an existing one. If a new client id is required, follow these steps:","\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:["install ",(0,o.jsx)(n.a,{href:"https://www.npmjs.com/package/pem-jwk",children:"pem-jwk tool"})]}),"\n",(0,o.jsxs)(n.li,{children:["In terminal, execute ",(0,o.jsx)(n.code,{children:"openssl genrsa -out private.pem 2048"})]}),"\n",(0,o.jsx)(n.li,{children:(0,o.jsx)(n.code,{children:"openssl rsa -in private.pem -out public.pem -outform PEM -pubout"})}),"\n",(0,o.jsx)(n.li,{children:(0,o.jsx)(n.code,{children:"cat public.pem | pem-jwk > public.jwk"})}),"\n",(0,o.jsxs)(n.li,{children:["Use the generated public.jwk file as your Oauth submission to Lighthouse and save the ",(0,o.jsx)(n.code,{children:"private.pem"})," file for a later step."]}),"\n",(0,o.jsx)(n.li,{children:"client_id will be provided upon submission of the lighthouse onboarding form"}),"\n"]}),"\n"]}),"\n",(0,o.jsxs)(n.li,{children:["Add a new settings to ",(0,o.jsx)(n.code,{children:"config/settings.yml"})," in the vets-api.","\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:["See section ",(0,o.jsx)(n.a,{href:"/va-mobile-app/docs/Engineering/BackEnd/Architecture/Devops",children:"Adding Local Settings"})]}),"\n",(0,o.jsxs)(n.li,{children:["find the ",(0,o.jsx)(n.a,{href:"https://dev-developer.va.gov/explore/authorization/docs/client-credentials",children:"config values"})]}),"\n",(0,o.jsx)(n.li,{children:'select the the desired service from the "Select an API" dropdown menu and click "Update page"'}),"\n",(0,o.jsxs)(n.li,{children:["the ",(0,o.jsx)(n.code,{children:"aud_claim_url"}),' can be found in the "aud" section of the page']}),"\n",(0,o.jsxs)(n.li,{children:["the ",(0,o.jsx)(n.code,{children:"access_token_url"}),' can be found in the "Retrieving an access token" section. It will be the url in the example POST.']}),"\n",(0,o.jsxs)(n.li,{children:["the ",(0,o.jsx)(n.code,{children:"api_scopes"}),' can be found in the "scopes" section. Only include the ones you need.']}),"\n",(0,o.jsxs)(n.li,{children:["to get the other values, use the left nav bar to navigate to the documentation for the correct API. For example the ",(0,o.jsx)(n.a,{href:"https://dev-developer.va.gov/explore/appeals/docs/appeals?version=current",children:"Appeals Status API"}),"."]}),"\n",(0,o.jsxs)(n.li,{children:["Near the top of the page, there should be a link to that APIs openapi.json. Click this link to reveal the json in a new tab. The ",(0,o.jsx)(n.code,{children:"api_url"})," should be in that page as ",(0,o.jsx)(n.code,{children:"url"}),"."]}),"\n"]}),"\n"]}),"\n",(0,o.jsxs)(n.li,{children:["Add new AWS RSA key if new client id was generated as well as any other sensitive information that can't be publicly shared.","\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:["See section ",(0,o.jsx)(n.a,{href:"/va-mobile-app/docs/Engineering/BackEnd/Architecture/Devops",children:"AWS"})]}),"\n",(0,o.jsx)(n.li,{children:"The formatting of the private RSA key is very particular. the key string should have a new line for every 64 characters. Reference formatting of another RSA key in AWS to see an example."}),"\n"]}),"\n"]}),"\n",(0,o.jsxs)(n.li,{children:["Add new variables Manifests repo and Devops repo as instructed in See section ",(0,o.jsx)(n.a,{href:"/va-mobile-app/docs/Engineering/BackEnd/Architecture/Devops",children:"Devops"})]}),"\n",(0,o.jsx)(n.li,{children:"Once sandbox is working, you must request production access separately though the same onboarding link above."}),"\n"]})]})}function h(e={}){const{wrapper:n}={...(0,t.R)(),...e.components};return n?(0,o.jsx)(n,{...e,children:(0,o.jsx)(a,{...e})}):a(e)}},28453:(e,n,i)=>{i.d(n,{R:()=>r,x:()=>c});var s=i(96540);const o={},t=s.createContext(o);function r(e){const n=s.useContext(t);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:r(e.components),s.createElement(t.Provider,{value:n},e.children)}}}]);