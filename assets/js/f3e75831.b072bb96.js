"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[8133],{66148:function(e,n,t){t.r(n),t.d(n,{frontMatter:function(){return r},contentTitle:function(){return l},metadata:function(){return c},toc:function(){return p},default:function(){return d}});var i=t(87462),s=t(63366),a=(t(67294),t(3905)),o=["components"],r={},l="Review Instances",c={unversionedId:"Engineering/BackEnd/Testing/ReviewInstances",id:"Engineering/BackEnd/Testing/ReviewInstances",title:"Review Instances",description:"Our Github workflow creates a review instance based on your branch once a PR passes all its checks. You find the URLs for the website and API, as well as the instance name, when expanding the 'Show environments'  link within the 'This branch was successfully deployed' section of the PR.",source:"@site/docs/Engineering/BackEnd/Testing/ReviewInstances.md",sourceDirName:"Engineering/BackEnd/Testing",slug:"/Engineering/BackEnd/Testing/ReviewInstances",permalink:"/va-mobile-app/docs/Engineering/BackEnd/Testing/ReviewInstances",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Prerequisites",permalink:"/va-mobile-app/docs/Engineering/BackEnd/Testing/Prerequisites"},next:{title:"Staging Instances",permalink:"/va-mobile-app/docs/Engineering/BackEnd/Testing/StagingInstances"}},p=[{value:"API Calls",id:"api-calls",children:[{value:"Making Requests",id:"making-requests",children:[],level:3}],level:2},{value:"Console Access",id:"console-access",children:[],level:2},{value:"User sessions",id:"user-sessions",children:[],level:2}],u={toc:p};function d(e){var n=e.components,r=(0,s.Z)(e,o);return(0,a.kt)("wrapper",(0,i.Z)({},u,r,{components:n,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"review-instances"},"Review Instances"),(0,a.kt)("p",null,"Our Github workflow creates a review instance based on your branch once a PR passes all its checks. You find the URLs for the website and API, as well as the instance name, when expanding the 'Show environments'  link within the 'This branch was successfully deployed' section of the PR."),(0,a.kt)("p",null,(0,a.kt)("img",{src:t(59841).Z})),(0,a.kt)("p",null,"With the SOCKS proxy running, access the web deployment by clicking the button labeled 'View Deployment'. It will have a URL similar to:"),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"http://a8710e1eb08cd469aa43874b25f86278.review.vetsgov-internal")),(0,a.kt)("p",null,"The API backing it will have a URL with '-api' appended to the first part of the path, and ending in '/mobile':"),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"http://a8710e1eb08cd469aa43874b25f86278-api.review.vetsgov-internal/mobile")),(0,a.kt)("h2",{id:"api-calls"},"API Calls"),(0,a.kt)("h3",{id:"making-requests"},"Making Requests"),(0,a.kt)("p",null,"As with the URLs you've been accessing so far, all API requests must go through the SOCKS proxy. You can configure this in your API client (Postman, Insomnia, Paw, etc). The proxy URL is ",(0,a.kt)("inlineCode",{parentName:"p"},"socks5h://127.0.0.1:2001"),". Requests, as in staging and production, require that you include an 'Authorization' header with a ",(0,a.kt)("a",{parentName:"p",href:"/va-mobile-app/docs/Engineering/BackEnd/Testing/ApiTokens#fetching-api-tokens"},"bearer token"),". An example request using the SOCKS proxy to the user endpoint would look like below."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"curl --proxy socks5h://127.0.0.1:2001 --request GET \\\n  --url http://a8710e1eb08cd469aa43874b25f86278-api.review.vetsgov-internal/mobile/v1/user \\\n  --header 'Authorization: Bearer EESBp0xiLD6p1g86q4g1'\n  --header 'X-Key-Inflection: camel'\n")),(0,a.kt)("h2",{id:"console-access"},"Console Access"),(0,a.kt)("p",null,"You can SSH into the review instance and test code directly in a review instance Rails console. You retrieve the instance name via the Jenkins console output. To get to Jenkins, return to the PR on Github and click 'Show environments' within the 'This branch was successfully deployed' section. Click the 'Deployed' link to the left of the 'View deployment' button. This will open Jenkins. Next, select 'Console Output' from the menu on the left."),(0,a.kt)("p",null,(0,a.kt)("img",{src:t(73450).Z})),(0,a.kt)("p",null,'Then search for "SSH at".'),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"07:15:00  [0;32m  msg: Review instance available at http://9bbbb1184faf0a6cb1c551390c073923.review.vetsgov-internal/, or via SSH at ip-172-30-18-119.us-gov-west-1.compute.internal[0m\n")),(0,a.kt)("p",null,"In the example above 'ip-172-30-18-119.us-gov-west-1.compute.internal' is the address for the instance. To open a Rails console SSH in and then run the console Docker command as below."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},'ssh ip-172-30-18-119.us-gov-west-1.compute.internal\ncd ~/vets-api; docker-compose -f docker-compose.review.yml exec vets-api bundle exec rails c\n{"host":"0fca69c2c0fa","application":"vets-api-server","environment":"production","timestamp":"2021-12-02T16:32:05.979827Z","level":"info","level_index":2,"pid":632,"thread":"65000","name":"Rails","message":"Raven 2.13.0 ready to catch errors"}\n2021-12-02 16:32:08.420676 W [632:65000] SemanticLogger::Appenders -- Ignoring attempt to add a second console appender: SemanticLogger::Appender::File since it would result in duplicate console output.\nLoading production environment (Rails 6.1.4.1)\nirb(main):001:0>\n')),(0,a.kt)("h2",{id:"user-sessions"},"User sessions"),(0,a.kt)("p",null,"Once you've started a Rails console you'll need a user session to test most features. As with the API calls you'll need an ",(0,a.kt)("a",{parentName:"p",href:"/va-mobile-app/docs/Engineering/BackEnd/Testing/ApiTokens#fetching-api-tokens"},"API token"),". Given a token the IAM session manager will create a user for you."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"irb(main):001:0> user = IAMSSOeOAuth::SessionManager.new('EESBp0xiLD6p1g86q4g1').find_or_create_user\n")))}d.isMDXComponent=!0},73450:function(e,n,t){n.Z=t.p+"assets/images/jenkins-console-output-95f3ca71e8904162cb2b4496fc274da8.png"},59841:function(e,n,t){n.Z=t.p+"assets/images/review-instance-deploy-link-6aeb26054716cbb5f15139ef77356a67.png"}}]);