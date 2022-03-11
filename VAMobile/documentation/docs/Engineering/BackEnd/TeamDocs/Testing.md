# Testing

## Prerequisites
This guide assumes that you have locally:
* Configured and turned on the [SOCKS proxy](https://depo-platform-documentation.scrollhelp.site/getting-started/Internal-tools-access-via-SOCKS-proxy.1821081710.html)
* Checked out the [DevOps repo](https://github.com/department-of-veterans-affairs/devops)
* Configured your [AWS credentials and MFA](https://github.com/department-of-veterans-affairs/devops#setup)

## Review Instances

Our Github workflow creates a review instance based on your branch once a PR passes all its checks. You find the URLs for the website and API, as well as the instance name, when expanding the 'Show environments'  link within the 'This branch was successfully deployed' section of the PR.

![](../../../../static/img/backend/review-instance-deploy-link.png)

With the SOCKS proxy running, access the web deployment by clicking the button labeled 'View Deployment'. It will have a URL similar to:

`http://a8710e1eb08cd469aa43874b25f86278.review.vetsgov-internal`

The API backing it will have a URL with '-api' appended to the first part of the path, and ending in '/mobile':

`http://a8710e1eb08cd469aa43874b25f86278-api.review.vetsgov-internal/mobile`

### API Calls
#### API Tokens
You can obtain a token from the [token generator](https://va-mobile-cutter.herokuapp.com) app on Heroku. User credentials are in 1Password. If you do not yet have access to the shared 1Password 'VA.gov' vault ask a teammate to fetch the credentials you need.

#### Making Requests
As with the URLs you've been accessing so far, all API requests must go through the SOCKS proxy. You can configure this in your API client (Postman, Insomnia, Paw, etc). The proxy URL is `socks5h://127.0.0.1:2001`. Requests, as in staging and production, require that you include an 'Authorization' header. An example request using the SOCKS proxy to the user endpoint would look like below.

```
curl --proxy socks5h://127.0.0.1:2001 --request GET \
  --url http://a8710e1eb08cd469aa43874b25f86278-api.review.vetsgov-internal/mobile/v0/user \
  --header 'Authorization: Bearer EESBp0xiLD6p1g86q4g1'
  --header 'X-Key-Inflection: camel'
```

### Console Access

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

### User sessions

Once you've started a Rails console you'll need a user session to test most features. As with the API calls you'll need an API token. Given a token the IAM session manager will create a user for you.

```
irb(main):001:0> user = IAMSSOeOAuth::SessionManager.new('EESBp0xiLD6p1g86q4g1').find_or_create_user
```

## Staging Instances

### API Calls
API calls are made in a similar way to the review instances above. Note that your API client may not connect to staging if going through the SOCKS proxy. The API URL for staging is http://staging-api.va.gov/mobile.
```
curl --request GET \
  --url https://staging-api.va.gov/mobile/v0/user \
  --header 'Authorization: Bearer 6qdITmRgDqEmsdGyzNj7' \
  --header 'X-Key-Inflection: camel'
```

### Console Access

To connect to a staging instance, open a terminal locally and enter 'mfa' followed by a code from a 2FA tool such as [Authy](https://authy.com/). Change into the devops repo dir, and run the SSM script with 'staging' as an argument. The script will return a numbered list of available instances.

```
mfa {2fa code}
AWS Session credentials saved. Will expire in 12 hours
cd {path to devops checkout dir}
sh utilities/ssm.sh vets-api-server staging
Finding apps for vets-api-server staging
-e Found the following instances:
Instance ID        Private Ip    Name
i-0cb43936846956681    10.247.34.198    dsva-vagov-staging-deployment-vagov-staging-vets-api-server-20211201-221337-asg
i-002a2d845a9bbfb47    10.247.34.238    dsva-vagov-staging-deployment-vagov-staging-vets-api-server-20211201-221337-asg
i-09bf54f2024d20400    10.247.34.61    dsva-vagov-staging-deployment-vagov-staging-vets-api-server-20211201-221337-asg
i-0900c0675f349b4b5    10.247.34.15    dsva-vagov-staging-deployment-vagov-staging-vets-api-server-20211201-221337-asg
i-0304e9c0fc5d4c4e3    10.247.35.117    dsva-vagov-staging-deployment-vagov-staging-vets-api-server-20211201-221337-asg
i-0a9d52a236730155f    10.247.35.40    dsva-vagov-staging-deployment-vagov-staging-vets-api-server-20211201-221337-asg

What instance do you want to connect to? (input only the number eg: 1, 2, 4)
Type 'q' to exit
1) -n              5) -n               9) -n
2) i-0cb43936846956681      6) i-09bf54f2024d20400  10) i-0304e9c0fc5d4c4e3
3) -n              7) -n              11) -n
4) i-002a2d845a9bbfb47      8) i-0900c0675f349b4b5  12) i-0a9d52a236730155f
#?
```

Select an instance by typing its number, e.g. 2. Then change to a super user and run the Docker command to launch the Rails console.

```
#? 2
Starting session to:  i-0cb43936846956681

Starting session with SessionId: First.Last-09fdb960f34e99c93
sh-4.2$ sudo su
[root@ip-10-247-34-198 /]# docker exec -it vets-api bundle exec rails c
{"host":"0fca69c2c0fa","application":"vets-api-server","environment":"production","timestamp":"2021-12-02T16:32:05.979827Z","level":"info","level_index":2,"pid":632,"thread":"65000","name":"Rails","message":"Raven 2.13.0 ready to catch errors"}
2021-12-02 16:32:08.420676 W [632:65000] SemanticLogger::Appenders -- Ignoring attempt to add a second console appender: SemanticLogger::Appender::File since it would result in duplicate console output.
Loading production environment (Rails 6.1.4.1)
irb(main):001:0>
```

You can then create a user session, as in a review instance.
```
irb(main):001:0> user = IAMSSOeOAuth::SessionManager.new('EESBp0xiLD6p1g86q4g1').find_or_create_user
```