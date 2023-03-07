# Review Instances

Our Github workflow creates a review instance based on your branch once a PR passes all its checks. You find the URLs for the website and API, as well as the instance name, when expanding the 'Show environments'  link within the 'This branch was successfully deployed' section of the PR.

![](../../../../static/img/backend/review-instance-deploy-link.png)

With the SOCKS proxy running, access the web deployment by clicking the button labeled 'View Deployment'. It will have a URL similar to:

`http://a8710e1eb08cd469aa43874b25f86278.review.vetsgov-internal`

The API backing it will have a URL with '-api' appended to the first part of the path, and ending in '/mobile':

`http://a8710e1eb08cd469aa43874b25f86278-api.review.vetsgov-internal/mobile`

## API Calls

### Making Requests
As with the URLs you've been accessing so far, all API requests must go through the SOCKS proxy. You can configure this in your API client (Postman, Insomnia, Paw, etc). The proxy URL is `socks5h://127.0.0.1:2001`. Requests, as in staging and production, require that you include an 'Authorization' header with a [bearer token](./ApiTokens.md#fetching-api-tokens). An example request using the SOCKS proxy to the user endpoint would look like below.

```
curl --proxy socks5h://127.0.0.1:2001 --request GET \
  --url http://a8710e1eb08cd469aa43874b25f86278-api.review.vetsgov-internal/mobile/v1/user \
  --header 'Authorization: Bearer EESBp0xiLD6p1g86q4g1'
  --header 'X-Key-Inflection: camel'
```

## Console Access

You can SSH into the review instance and test code directly in a review instance Rails console. You retrieve the instance name via the Jenkins console output. To get to Jenkins, return to the PR on Github and click 'Show environments' within the 'This branch was successfully deployed' section. Click the 'Deployed' link to the left of the 'View deployment' button. This will open Jenkins. Next, select 'Console Output' from the menu on the left.

![](../../../../static/img/backend/jenkins-console-output.png)

Then search for "SSH at".
```
07:15:00  [0;32m  msg: Review instance available at http://9bbbb1184faf0a6cb1c551390c073923.review.vetsgov-internal/, or via SSH at ip-172-30-18-119.us-gov-west-1.compute.internal[0m
```

In the example above 'ip-172-30-18-119.us-gov-west-1.compute.internal' is the address for the instance. To open a Rails console SSH in and then run the console Docker command as below.
```
ssh ip-172-30-18-119.us-gov-west-1.compute.internal
cd ~/vets-api; docker-compose -f docker-compose.review.yml exec vets-api bundle exec rails c
{"host":"0fca69c2c0fa","application":"vets-api-server","environment":"production","timestamp":"2021-12-02T16:32:05.979827Z","level":"info","level_index":2,"pid":632,"thread":"65000","name":"Rails","message":"Raven 2.13.0 ready to catch errors"}
2021-12-02 16:32:08.420676 W [632:65000] SemanticLogger::Appenders -- Ignoring attempt to add a second console appender: SemanticLogger::Appender::File since it would result in duplicate console output.
Loading production environment (Rails 6.1.4.1)
irb(main):001:0>
```
To generate a user session, see section [User Token](#User-Token) below then follow [User Sign-in](StagingInstances.md#User-Sign-in) instructions.

## User Token
Currently, there are two authentication options, IAM and SIS. IAM authentication isn't working for RIs or staging right now for unknown reasons that may not be fixed because IAM is being deprecated for SIS, which is why the instructions in the next section (User Sessions) don't work right now on RIs.
We lack the ability to log in via SIS on RIs due to limitations the SIS team is working on. We expect this to be fixed at some point, but in the meantime it means we have to use staging to help us spoof the sign-in process with the instructions below:
1. Open a browser and start the authorization process for your review instance (remember your `-api`)
```
http://dc02d94d6648a008950cc9c84056a860-api.review.vetsgov-internal/v0/sign_in/authorize?type=idme&code_challenge_method=S256&acr=loa3&client_id=mobile&code_challenge=1BUpxy37SoIPmKw96wbd6MDcvayOYm3ptT-zbe6L_zM=
```
2. Open network tab on browser Inspector then complete sign in. After sign in, you will be redirected to staging and there will be a failed callback request in the Inspector network tab.
3. With your network tab still open, replace `https://staging-api.va.gov` in your browswer url bar with your review instance (remember your `-api`) and go to that url
4. In the network tab, you should see another request to `/callback`. In the request headers, there will be a `location` with a value starting with `vamobile:` that will contain a code that can be used to exchange tokens. The code should look something like `7ca6321-ca3e-4b51-8a4f-4b8ecf2f1597`
5. To get a token with that code, ensure that your socks proxy is running and send the following Curl using your review instance and code:
```
curl --proxy socks5h://127.0.0.1:2001 -X POST http://dbded860eb589f4ccfef2b1470e8472d-api.review.vetsgov-internal/v0/sign_in/token -H 'Content-Type: application/json' -d '{"grant_type": "authorization_code", "code_verifier": "5787d673fb784c90f0e309883241803d", "code": "69a8cdea-6251-413f-8773-0ff7c5c82877"}'
```
2. Open network tab on browser Inspector then complete sign in
3. After sign in, you should notice a failed request that looks similar to:
```
https://staging-api.va.gov/idHlwZSI6ImlkbWUiLCJjbGllbnRfaWQiOiJ3ZWIiLCJjb2RlX2NoYWxsZW5nZSI6IjFCVXB4eTM3U29JUG1Ldzk2d2JkNk1EY3ZheU9ZbTNwdFQtemJlNkxfek0iLCJjbGllbnRfc3RhdGUiOm51bGwsImNvZGUiOiJmYjNmMTVjOWU0ZDcxNWNkNjEyNjBhMmM1NzYxNzY3YyJ9.EINudwac8qI5JCFPpsYsN7Q7AkyJaQb7jzO78ZJU_GWyPsy4VShRUuYRuxegeBClnjrqkXkfqE78vU5Jjp7aViWLDmDcs2WAJaMwsFRwNEwfQi0g-XUXxWqjVup_rWfDTYWMlxNCipj3xhLN2ACMkFjxoXXlWoob_didzURc1vBEuozkseAAcsA0UOPMexnIjAfFvk11dhR6bC5_Ql14aS22WTE7D-rrngtPCTo_J4Fe-vOgpn-PPV_t5AyiLhzpqDkRlaWTbihwJ_6JpZ8FctkT42Vz4zGk6XTS33BjGv8yJvJYwgEwC2FeVpg-Em49zfkc47Bgl7DEjlDNs624lQ&code=8cb3d1e45111430eafd6e2f155f067e0
```
4. Replace `https://staging-api.va.gov` with your review instance and go to that url in your browser (still having your network tab open)
5. Find a response in the network tab that has redirect to the `vamobile:` with a code that can be used to exchange tokens. Code should look something like `7ca6321-ca3e-4b51-8a4f-4b8ecf2f1597`
6. To get a token with that code, send the following Curl but with your review instance and code:
```
curl -X POST http://dbded860eb589f4ccfef2b1470e8472d-api.review.vetsgov-internal/v0/sign_in/token -H 'Content-Type: application/json' -d '{"grant_type": "authorization_code", "code_verifier": "5787d673fb784c90f0e309883241803d", "code": "69a8cdea-6251-413f-8773-0ff7c5c82877"}'
```


