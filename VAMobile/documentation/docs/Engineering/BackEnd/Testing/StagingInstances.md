# Staging Instances

## API Calls
API calls are made in a similar way to the review instances above. Note that your API client may not connect to staging if going through the SOCKS proxy. The API URL for staging is http://staging-api.va.gov/mobile. Staging uses the same [API tokens](./ApiTokens.md#fetching-api-tokens) as review instances.
```
curl --request GET \
  --url https://staging-api.va.gov/mobile/v1/user \
  --header 'Authorization: Bearer 6qdITmRgDqEmsdGyzNj7' \
  --header 'X-Key-Inflection: camel'
```

## Console Access

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
