"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[9321],{41081:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>c,contentTitle:()=>o,default:()=>p,frontMatter:()=>r,metadata:()=>s,toc:()=>d});var n=a(87462),i=(a(67294),a(3905));a(8209);const r={},o="Schema Contract Testing",s={unversionedId:"Engineering/BackEnd/Features/SchemaContractTesting",id:"Engineering/BackEnd/Features/SchemaContractTesting",title:"Schema Contract Testing",description:"Background",source:"@site/docs/Engineering/BackEnd/Features/SchemaContractTesting.md",sourceDirName:"Engineering/BackEnd/Features",slug:"/Engineering/BackEnd/Features/SchemaContractTesting",permalink:"/va-mobile-app/docs/Engineering/BackEnd/Features/SchemaContractTesting",draft:!1,tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Push Notifications",permalink:"/va-mobile-app/docs/Engineering/BackEnd/Features/PushNotifications"},next:{title:"Datadog",permalink:"/va-mobile-app/docs/Engineering/BackEnd/Monitoring/DataDog"}},c={},d=[{value:"Background",id:"background",level:2},{value:"What is a contract?",id:"what-is-a-contract",level:2},{value:"How does contract testing work?",id:"how-does-contract-testing-work",level:2},{value:"Feature flagging",id:"feature-flagging",level:2},{value:"How to add a new contract",id:"how-to-add-a-new-contract",level:2},{value:"Limitations",id:"limitations",level:2}],l={toc:d},h="wrapper";function p(e){let{components:t,...a}=e;return(0,i.kt)(h,(0,n.Z)({},l,a,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"schema-contract-testing"},"Schema Contract Testing"),(0,i.kt)("h2",{id:"background"},"Background"),(0,i.kt)("p",null,"We developed a schema contract testing libary that alerts us to schema changes in responses from services upstream of the vets-api."),(0,i.kt)("h2",{id:"what-is-a-contract"},"What is a contract?"),(0,i.kt)("p",null,"Within the context of this library, a contract is a means of ensuring that interactions between the vets-api and external services that it consumes remain unchanged over time. They're defined in json files within the vets-api that define the shape of the data that is expected to be received from the external service. The contract specifies which data fields are expected and the data types of the values."),(0,i.kt)("p",null,"Contracts will typically exist per endpoint or resource that is being consumed. For example, the appointments index and immunizations index will require different contracts because the underlying resources are different. Whereas the appointments index and appointment show endpoints return the same resource but will require different contracts because the index will expect an array of appointments while the show will expect a single appointment. However, it is possible for contracts to be applied to multiple endpoints if their format is expected to be identical."),(0,i.kt)("h2",{id:"how-does-contract-testing-work"},"How does contract testing work?"),(0,i.kt)("p",null,"When the vets-api receives information from upstream, we can pass the unaltered response to the testing library. If the response was successful, the library checks the database to see if a contract test record for that contract has been created yet for the current day. If no record exists, it creates one with the response body and initiates a background job for validating the response against the schema. When the background job is executed, it looks up the newly created record and compares the saved response against the contract. If any errors are found, they are raised with a detailed error message to alert developers to investigate. The database record is then updated to include the error details and status of the comparison (i.e., success or schema errors found) to provide a persistent papertrail for debugging."),(0,i.kt)("p",null,"The contract testing library is designed to only run once per day per contract in order to limit the impact on servers."),(0,i.kt)("h2",{id:"feature-flagging"},"Feature flagging"),(0,i.kt)("p",null,"Schema contract testing is feature flagged per contract. This feature is only expected to ever be turned on in staging but could be turned on in production if we ever have reason to think production responses differ from staging."),(0,i.kt)("h2",{id:"how-to-add-a-new-contract"},"How to add a new contract"),(0,i.kt)("ol",null,(0,i.kt)("li",{parentName:"ol"},"add a contract json file. It will require a unique contract name. For example, the appointments index method has a contract called ",(0,i.kt)("inlineCode",{parentName:"li"},"appointments_index.json"),". This name is used to bind the contract and feature flag together. The file can be placed anywhere in the vets-api but best practice is to put it in the module that uses it."),(0,i.kt)("li",{parentName:"ol"},"add a new entry to the ",(0,i.kt)("inlineCode",{parentName:"li"},"schema_contract")," section of ",(0,i.kt)("inlineCode",{parentName:"li"},"config/settings.yml")," that speficies the location of the contract json file."),(0,i.kt)("li",{parentName:"ol"},"add a new feature flag. The feature flag name must be in the format of ",(0,i.kt)("inlineCode",{parentName:"li"},"schema_contract_#{unique_contract_name}"),"."),(0,i.kt)("li",{parentName:"ol"},"in the vets-api, pass the unaltered response from upstream to the validation initator: ",(0,i.kt)("inlineCode",{parentName:"li"},"SchemaContract::ValidationInitiator.call(user:, response:, contract_name: 'unique_contract_name')"))),(0,i.kt)("h2",{id:"limitations"},"Limitations"),(0,i.kt)("p",null,"The tests are only as good as the schema provided. It's critical to specify which properties are required or nullable and to use ",(0,i.kt)("inlineCode",{parentName:"p"},"additionalProperties: false")," within each object within the schema in order to know when properties are added or removed or have suddenly started returning null values."))}p.isMDXComponent=!0}}]);