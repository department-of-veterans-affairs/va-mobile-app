---
title: Postman
---

## Postman Collection
In the mobile module for vets-api, there is a [postman collection](https://github.com/department-of-veterans-affairs/vets-api/blob/master/modules/mobile/docs/Mobile%20Endpoints.postman_collection.json) that can be downloaded and used to run commands against
the staging instances. In order to use the collection, download the json file.

After installing [Postman](https://www.postman.com), go to the collection section of Postman. From there, you can click "import", and drag
the file into the import window.

### Layout
The top directory `Mobile Endpoints` contains the settings for authorization.
After aquiring a [token](./ApiTokens.md), click on the directory itself, open the `Authorization` tab, and paste the 
token here. Every endpoint within the directory will now use
this token for the requests.
