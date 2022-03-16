"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[9659],{5994:function(e,t,i){i.r(t),i.d(t,{frontMatter:function(){return s},contentTitle:function(){return c},metadata:function(){return u},toc:function(){return l},default:function(){return g}});var n=i(87462),a=i(63366),r=(i(67294),i(3905)),o=["components"],s={},c="IAM",u={unversionedId:"Engineering/BackEnd/Architecture/Iam",id:"Engineering/BackEnd/Architecture/Iam",title:"IAM",description:"Authentication Sequence Diagram",source:"@site/docs/Engineering/BackEnd/Architecture/Iam.md",sourceDirName:"Engineering/BackEnd/Architecture",slug:"/Engineering/BackEnd/Architecture/Iam",permalink:"/va-mobile-app/docs/Engineering/BackEnd/Architecture/Iam",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Feature Flagging",permalink:"/va-mobile-app/docs/Engineering/BackEnd/Architecture/FeatureFlagging"},next:{title:"JSON-API",permalink:"/va-mobile-app/docs/Engineering/BackEnd/Architecture/JsonApi"}},l=[{value:"Authentication Sequence Diagram",id:"authentication-sequence-diagram",children:[],level:2},{value:"Vets-API Authentication Activity Diagram",id:"vets-api-authentication-activity-diagram",children:[],level:2},{value:"Provider Details",id:"provider-details",children:[],level:2},{value:"Test Users",id:"test-users",children:[],level:2}],d={toc:l};function g(e){var t=e.components,s=(0,a.Z)(e,o);return(0,r.kt)("wrapper",(0,n.Z)({},d,s,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"iam"},"IAM"),(0,r.kt)("h2",{id:"authentication-sequence-diagram"},"Authentication Sequence Diagram"),(0,r.kt)("p",null,(0,r.kt)("img",{src:i(30738).Z})),(0,r.kt)("h2",{id:"vets-api-authentication-activity-diagram"},"Vets-API Authentication Activity Diagram"),(0,r.kt)("p",null,(0,r.kt)("img",{src:i(17577).Z})),(0,r.kt)("h2",{id:"provider-details"},"Provider Details"),(0,r.kt)("p",null,"DSLogon - Oldest authentication method. Connected to DoD. Vets who already have this login info can use it to access services on VA.gov and Mobile that don't require MFA. "),(0,r.kt)("p",null,"MHV - Allows users to use their My HealtheVet credentials to utilize other services such as va.gov and our mobile app. Similar to DSLogon users, authenticating this way can't access services that require users to have MFA."),(0,r.kt)("p",null,"Id.me - Owned by a 3rd party company, paid for by the VA. Requires identity verification and MFA (via OTPs)."),(0,r.kt)("p",null,"Login.gov - Newest authentication method. Recently built and owned by the VA. Requires identity verification and MFA (via many different options). Long term goal is to move everyone to login.gov so all users will be verified and the VA can stop paying for id.me"),(0,r.kt)("h2",{id:"test-users"},"Test Users"),(0,r.kt)("p",null,'DSLogon - Currently we only have one DSL test user, Arfan Russel. The login password in for can be found in the VA Mobile 1Password under "DSlogon staging (claims)"'),(0,r.kt)("p",null,"MHV - Users can be found here: ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/department-of-veterans-affairs/va.gov-team-sensitive/blob/master/Administrative/vagov-users/mhv-lower-env-test-accounts.md"},"MHV test users"),". Premium users are the only ones who work with the mobile app."),(0,r.kt)("p",null,"Id.me - Can be found here: ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/department-of-veterans-affairs/va.gov-team-sensitive/blob/master/Administrative/vagov-users/mvi-staging-users.csv"},"MVI staging test users")," or can be found in the VA.gov 1Password vault under ",(0,r.kt)("a",{parentName:"p",href:"mailto:vets.gov.user+NNN@gmail.com"},"vets.gov.user+NNN@gmail.com")," where NNN is a number 1 to 3 digits long."),(0,r.kt)("p",null,'Login.gov - Located in the VA.gov 1Password vault. Can be found by searching "login.gov".'))}g.isMDXComponent=!0},30738:function(e,t,i){t.Z=i.p+"assets/images/iam-authentication-sequence-diagram-688f3c20767914d4560437180ea1541e.png"},17577:function(e,t,i){t.Z=i.p+"assets/images/vets-api-authentication-activity-diagram-39c63a3b8739bf2152e450378351d110.png"}}]);