---
title: Monthly App Store Reviews
sidebar_position: 2
---

# Monthly App Store Review Process

## Step 1: Download the reviews from the [feedback hub](https://feedback-hub-e659c24714b9.herokuapp.com/)

1. Select App Store or Play Store at the top.
2. Ensure “All” ratings are selected from the dropdown.
3. Input the date range for the month you are working on.
4. Tap “search”.
5. Click the “Download as .csv” button to export.

## Step 2: Import the data to Google Sheets 
[In the spreadsheet](https://docs.google.com/spreadsheets/d/1Lj65hvWUkdTpmpvsObOOD2hjG8CHAiQ7z0mCeowabh0/edit?usp=sharing), create two new sheets for the month (one for overview and one for reviews) and import the reviews for the corresponding date into that month’s "reviews" sheet.
- _Note: You can duplicate a previous month and remove the data._

## Step 3: Clean up the import

1. Verify that data pulled in correctly
2. Add wrapping to the grids
3. Verify that the conditional formatting for the ratings pulled in (you should see red, green, etc. in the column).
    - If not, apply it to the column.
4. Define the range for the tags column (i.e. TagMarch24). 
    - This allows the spreadsheet to do the math and pull the totals into the overview sheet.

## Step 4: Analyze the data

1. Update the overview with the correct dates and review totals for the month.
2. Read each review and add a corresponding tag.
    - Refer to the primary tag list sheet found within the spreadsheet.
    - _Note: Not every review needs to be tagged. Use your best judgment._
3. Verify that the totals for each tag have been pulled into the overview sheet.
4. By looking at your overview, focus on the keywords with the most tags and then count each review with the corresponding tag.
4. Determine if the trending sentiment for the tag is positive, negative, or mixed. 
    - Include the total (for example, if there are 20 total and 17 positive, you’d add “17 Positive” to the trending sentiment column).
5. Pull out a few of the reviews that you think are important and add them to the review sample column (try to limit the samples to 2-4).
    - If the trending sentiment is “mixed”, try to pull both positive and negative samples into the overview.

## Step 5: Find or create a new folder on Github
In the [App Store Reviews folder on Github](https://github.com/department-of-veterans-affairs/va.gov-team/tree/master/products/va-mobile-app/reporting/App-Stores-Reviews), find or create the folder for the corresponding quarter.

If you are adding app store reviews for a month in an existing quarter’s folder, select the month that you are updating and edit the file.

### How to create a folder for a new quarter

1. Create the new folder (add a file in Github and `/` at the end to create a new folder).
    - Follow the naming convention of the previous quarters (four digit year followed by a hyphen and then the quarter).
2. Create placeholder files for all three months in the quarter. 
    - Follow the naming convention of the other files (i.e. 2024-04-Summary-VA-Mobile-App-Store-Reviews.md)
3. Add a readme.md file to the folder (content can be copied from the readme.md file in another folder, but be sure to update the dates in the file to the new quarter).
        
## Step 6: Add the overview to Github

1. Back in your app store review sheet, select only your table in the overview and then [convert the overview table to markdown](https://tabletomarkdown.com/convert-spreadsheet-to-markdown/).
2. Paste the converted markdown table into your Github file.
3. Above the table, add a title in the following format: **2024 Q1 Summary VA Mobile App Store Reviews**
    - Do not forget to update the date.
4. Back in your overview sheet, copy rows 1-3 with the date, number of reviews, etc. and paste those into your file on Github. 
    - Add bold styling to the date.
5. Preview your file and if everything looks good, commit the changes.

## Step 7: Add the full list of reviews to Github
__Note:__ To protect PII (Personal Identifiable Information), when you are pulling in the full list of reviews into Github, delete the author column prior to copying the table. You can restore it after by undoing the action (edit > undo or ⌘+Z).

Replace any personally identifiable information in any of the reviews with [redacted].

1. After removing the author column, select the full table and then [convert the overview table to markdown](https://tabletomarkdown.com/convert-spreadsheet-to-markdown/).
2. Paste the converted markdown table into your Github file.
3. Preview your file and if everything looks good, commit the changes.
4. If you have not already done so, restore the author column in the Google sheet.

## Step 8: Notify the team on Slack
After the app store reviews have been added to Github, share the findings in the following Slack channel:
- [#va-mobile-app](https://dsva.slack.com/archives/C018V2JCWRJ) (in DSVA)
    - Provide a short description and link back to that month's overview page on Github.