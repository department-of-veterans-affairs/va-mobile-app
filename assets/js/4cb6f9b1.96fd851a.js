"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[472],{22508:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>s,default:()=>c,frontMatter:()=>a,metadata:()=>o,toc:()=>h});const o=JSON.parse('{"id":"UX/Foundations/Research/montly-reviews","title":"Monthly App Store Reviews","description":"Overview","source":"@site/docs/UX/Foundations/Research/montly-reviews.md","sourceDirName":"UX/Foundations/Research","slug":"/UX/Foundations/Research/montly-reviews","permalink":"/va-mobile-app/docs/UX/Foundations/Research/montly-reviews","draft":false,"unlisted":false,"tags":[],"version":"current","sidebarPosition":2,"frontMatter":{"title":"Monthly App Store Reviews","sidebar_position":2},"sidebar":"tutorialSidebar","previous":{"title":"Research","permalink":"/va-mobile-app/docs/UX/Foundations/Research/"},"next":{"title":"How We Work","permalink":"/va-mobile-app/docs/UX/How-We-Work/"}}');var i=n(74848),r=n(28453);const a={title:"Monthly App Store Reviews",sidebar_position:2},s="Monthly App Store Review Process",l={},h=[{value:"Overview",id:"overview",level:2},{value:"How-to",id:"how-to",level:2},{value:"Step 1: Download the reviews from the feedback hub",id:"step-1-download-the-reviews-from-the-feedback-hub",level:3},{value:"Step 2: Import the data to Google Sheets",id:"step-2-import-the-data-to-google-sheets",level:3},{value:"Step 3: Clean up the import",id:"step-3-clean-up-the-import",level:3},{value:"Step 4: Analyze the data",id:"step-4-analyze-the-data",level:3},{value:"Step 5: Find or create a new folder on Github",id:"step-5-find-or-create-a-new-folder-on-github",level:3},{value:"How to create a folder for a new quarter",id:"how-to-create-a-folder-for-a-new-quarter",level:4},{value:"Step 6: Add the overview to Github",id:"step-6-add-the-overview-to-github",level:3},{value:"Step 7: Add the full list of reviews to Github",id:"step-7-add-the-full-list-of-reviews-to-github",level:3},{value:"Step 8: Notify the team on Slack",id:"step-8-notify-the-team-on-slack",level:3}];function d(e){const t={a:"a",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",h4:"h4",header:"header",li:"li",ol:"ol",p:"p",strong:"strong",ul:"ul",...(0,r.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(t.header,{children:(0,i.jsx)(t.h1,{id:"monthly-app-store-review-process",children:"Monthly App Store Review Process"})}),"\n",(0,i.jsx)(t.h2,{id:"overview",children:"Overview"}),"\n",(0,i.jsxs)(t.p,{children:["Each month, the VA Mobile app team analyzes all of the app review comments that were left for the app in the ",(0,i.jsx)(t.a,{href:"https://play.google.com/store/apps/details?id=gov.va.mobileapp&hl=en_US",children:"Google Play Store"})," and ",(0,i.jsx)(t.a,{href:"https://apps.apple.com/us/app/va-health-and-benefits/id1559609596",children:"Apple's App Store"})," during the previous month."]}),"\n",(0,i.jsxs)(t.p,{children:["We download the reviews from the ",(0,i.jsx)(t.a,{href:"https://feedback-hub-e659c24714b9.herokuapp.com/app_store/sentiment",children:"Feedback Hub"}),". The Feedback Hub is a site run by the Mobile team that scrapes information from the app stores as well as the ",(0,i.jsx)(t.strong,{children:"/r/VeteransBenefits"})," and ",(0,i.jsx)(t.strong,{children:"/r/Veterans"})," subreddits and displays it in a way that is more usable. We label the comments with ",(0,i.jsx)(t.a,{href:"https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/products/va-mobile-app/reporting/App-Stores-Reviews/Tag%20Definitions",children:"tags"})," relevant to their content, such as \u201caccessibility,\u201d \u201cease of use,\u201d \u201chomepage,\u201d \u201clogin,\u201d \u201cperformance,\u201d or \u201crequests,\u201d then analyze trending sentiments by looking at which tags that used most frequently or more than usual and whether they are used with positive, neutral, negative ratings. Finally, we remove any PII and upload all of the information to Github."]}),"\n",(0,i.jsxs)(t.p,{children:["You can find the full list of comments and corresponding data (OS, user\u2019s app version, date and time of review, rating number, and review title) as well as an overview with the trending sentiment information for each month in the ",(0,i.jsx)(t.a,{href:"https://github.com/department-of-veterans-affairs/va.gov-team/tree/master/products/va-mobile-app/reporting/App-Stores-Reviews",children:"VA Mobile app team\u2019s App Stores Reviews folder in Github"}),".\nYou can review a step-by-step guide to the app store review process below."]}),"\n",(0,i.jsx)(t.h2,{id:"how-to",children:"How-to"}),"\n",(0,i.jsxs)(t.h3,{id:"step-1-download-the-reviews-from-the-feedback-hub",children:["Step 1: Download the reviews from the ",(0,i.jsx)(t.a,{href:"https://feedback-hub-e659c24714b9.herokuapp.com/",children:"feedback hub"})]}),"\n",(0,i.jsxs)(t.ol,{children:["\n",(0,i.jsx)(t.li,{children:"Select App Store or Play Store at the top."}),"\n",(0,i.jsx)(t.li,{children:"Ensure \u201cAll\u201d ratings are selected from the dropdown."}),"\n",(0,i.jsx)(t.li,{children:"Input the date range for the month you are working on."}),"\n",(0,i.jsx)(t.li,{children:"Tap \u201csearch\u201d."}),"\n",(0,i.jsx)(t.li,{children:"Click the \u201cDownload as .csv\u201d button to export."}),"\n"]}),"\n",(0,i.jsx)(t.h3,{id:"step-2-import-the-data-to-google-sheets",children:"Step 2: Import the data to Google Sheets"}),"\n",(0,i.jsxs)(t.p,{children:[(0,i.jsx)(t.a,{href:"https://docs.google.com/spreadsheets/d/1Lj65hvWUkdTpmpvsObOOD2hjG8CHAiQ7z0mCeowabh0/edit?usp=sharing",children:"In the spreadsheet"}),', create two new sheets for the month (one for overview and one for reviews) and import the reviews for the corresponding date into that month\u2019s "reviews" sheet.']}),"\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsx)(t.li,{children:(0,i.jsx)(t.em,{children:"Note: You can duplicate a previous month and remove the data."})}),"\n"]}),"\n",(0,i.jsx)(t.h3,{id:"step-3-clean-up-the-import",children:"Step 3: Clean up the import"}),"\n",(0,i.jsxs)(t.ol,{children:["\n",(0,i.jsx)(t.li,{children:"Verify that data pulled in correctly"}),"\n",(0,i.jsx)(t.li,{children:"Add wrapping to the grids"}),"\n",(0,i.jsxs)(t.li,{children:["Verify that the conditional formatting for the ratings pulled in (you should see red, green, etc. in the column).","\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsx)(t.li,{children:"If not, apply it to the column."}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(t.li,{children:["Define the range for the tags column (i.e. TagMarch24).","\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsx)(t.li,{children:"This allows the spreadsheet to do the math and pull the totals into the overview sheet."}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(t.h3,{id:"step-4-analyze-the-data",children:"Step 4: Analyze the data"}),"\n",(0,i.jsxs)(t.ol,{children:["\n",(0,i.jsx)(t.li,{children:"Update the overview with the correct dates and review totals for the month."}),"\n",(0,i.jsxs)(t.li,{children:["Read each review and add a corresponding tag.","\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsx)(t.li,{children:"Refer to the primary tag list sheet found within the spreadsheet."}),"\n",(0,i.jsx)(t.li,{children:(0,i.jsx)(t.em,{children:"Note: Not every review needs to be tagged. Use your best judgment."})}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(t.li,{children:"Verify that the totals for each tag have been pulled into the overview sheet."}),"\n",(0,i.jsx)(t.li,{children:"By looking at your overview, focus on the keywords with the most tags and then count each review with the corresponding tag."}),"\n",(0,i.jsxs)(t.li,{children:["Determine if the trending sentiment for the tag is positive, negative, or mixed.","\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsx)(t.li,{children:"Include the total (for example, if there are 20 total and 17 positive, you\u2019d add \u201c17 Positive\u201d to the trending sentiment column)."}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(t.li,{children:["Pull out a few of the reviews that you think are important and add them to the review sample column (try to limit the samples to 2-4).","\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsx)(t.li,{children:"If the trending sentiment is \u201cmixed\u201d, try to pull both positive and negative samples into the overview."}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(t.h3,{id:"step-5-find-or-create-a-new-folder-on-github",children:"Step 5: Find or create a new folder on Github"}),"\n",(0,i.jsxs)(t.p,{children:["In the ",(0,i.jsx)(t.a,{href:"https://github.com/department-of-veterans-affairs/va.gov-team/tree/master/products/va-mobile-app/reporting/App-Stores-Reviews",children:"App Store Reviews folder on Github"}),", find or create the folder for the corresponding quarter."]}),"\n",(0,i.jsx)(t.p,{children:"If you are adding app store reviews for a month in an existing quarter\u2019s folder, select the month that you are updating and edit the file."}),"\n",(0,i.jsx)(t.h4,{id:"how-to-create-a-folder-for-a-new-quarter",children:"How to create a folder for a new quarter"}),"\n",(0,i.jsxs)(t.ol,{children:["\n",(0,i.jsxs)(t.li,{children:["Create the new folder (add a file in Github and ",(0,i.jsx)(t.code,{children:"/"})," at the end to create a new folder).","\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsx)(t.li,{children:"Follow the naming convention of the previous quarters (four digit year followed by a hyphen and then the quarter)."}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(t.li,{children:["Create placeholder files for all three months in the quarter.","\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsx)(t.li,{children:"Follow the naming convention of the other files (i.e. 2024-04-Summary-VA-Mobile-App-Store-Reviews.md)"}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(t.li,{children:"Add a readme.md file to the folder (content can be copied from the readme.md file in another folder, but be sure to update the dates in the file to the new quarter)."}),"\n"]}),"\n",(0,i.jsx)(t.h3,{id:"step-6-add-the-overview-to-github",children:"Step 6: Add the overview to Github"}),"\n",(0,i.jsxs)(t.ol,{children:["\n",(0,i.jsxs)(t.li,{children:["Back in your app store review sheet, select only your table in the overview and then ",(0,i.jsx)(t.a,{href:"https://tabletomarkdown.com/convert-spreadsheet-to-markdown/",children:"convert the overview table to markdown"}),"."]}),"\n",(0,i.jsx)(t.li,{children:"Paste the converted markdown table into your Github file."}),"\n",(0,i.jsxs)(t.li,{children:["Above the table, add a title in the following format: ",(0,i.jsx)(t.strong,{children:"2024 Q1 Summary VA Mobile App Store Reviews"}),"\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsx)(t.li,{children:"Do not forget to update the date."}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(t.li,{children:["Back in your overview sheet, copy rows 1-3 with the date, number of reviews, etc. and paste those into your file on Github.","\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsx)(t.li,{children:"Add bold styling to the date."}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(t.li,{children:"Preview your file and if everything looks good, commit the changes."}),"\n"]}),"\n",(0,i.jsx)(t.h3,{id:"step-7-add-the-full-list-of-reviews-to-github",children:"Step 7: Add the full list of reviews to Github"}),"\n",(0,i.jsxs)(t.p,{children:[(0,i.jsx)(t.strong,{children:"Note:"})," To protect PII (Personal Identifiable Information), when you are pulling in the full list of reviews into Github, delete the author column prior to copying the table. You can restore it after by undoing the action (edit > undo or \u2318+Z)."]}),"\n",(0,i.jsx)(t.p,{children:"Replace any personally identifiable information in any of the reviews with [redacted]."}),"\n",(0,i.jsxs)(t.ol,{children:["\n",(0,i.jsxs)(t.li,{children:["After removing the author column, select the full table and then ",(0,i.jsx)(t.a,{href:"https://tabletomarkdown.com/convert-spreadsheet-to-markdown/",children:"convert the overview table to markdown"}),"."]}),"\n",(0,i.jsx)(t.li,{children:"Paste the converted markdown table into your Github file."}),"\n",(0,i.jsx)(t.li,{children:"Preview your file and if everything looks good, commit the changes."}),"\n",(0,i.jsx)(t.li,{children:"If you have not already done so, restore the author column in the Google sheet."}),"\n"]}),"\n",(0,i.jsx)(t.h3,{id:"step-8-notify-the-team-on-slack",children:"Step 8: Notify the team on Slack"}),"\n",(0,i.jsx)(t.p,{children:"After the app store reviews have been added to Github, share the findings in the following Slack channel:"}),"\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.a,{href:"https://dsva.slack.com/archives/C018V2JCWRJ",children:"#va-mobile-app"})," (in DSVA)","\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsx)(t.li,{children:"Provide a short description and link back to that month's overview page on Github."}),"\n"]}),"\n"]}),"\n"]})]})}function c(e={}){const{wrapper:t}={...(0,r.R)(),...e.components};return t?(0,i.jsx)(t,{...e,children:(0,i.jsx)(d,{...e})}):d(e)}},28453:(e,t,n)=>{n.d(t,{R:()=>a,x:()=>s});var o=n(96540);const i={},r=o.createContext(i);function a(e){const t=o.useContext(r);return o.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function s(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:a(e.components),o.createElement(r.Provider,{value:t},e.children)}}}]);