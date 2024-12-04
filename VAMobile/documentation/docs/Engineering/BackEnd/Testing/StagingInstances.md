---
title: Staging Instances
---

## API Calls

API calls are made in a similar way to the review instances above. Note that your API client may not connect to staging if going through the SOCKS proxy. The API URL for staging is: staging-api.va.gov/mobile. Staging uses the same [API tokens](./ApiTokens.md#fetching-api-tokens) as review instances.

```bash
curl --request GET \
  --url https://staging-api.va.gov/mobile/v1/user \
  --header 'Authorization: Bearer 6qdITmRgDqEmsdGyzNj7' \
  --header 'X-Key-Inflection: camel'
```

## Console Access

To connect to a staging instance, first ensure you have [requested access to EKS](https://github.com/department-of-veterans-affairs/va.gov-team/issues/new?assignees=&labels=external-request%2Cplatform-tech-team-support%2Cops-access-request&projects=&template=vetsapi-argo-terminal-access.yaml&title=Vets-api+terminal+access+for+%5Bindividual%5D).

After you have access, you can see the staging pods through the [web](https://argocd.vfs.va.gov/applications/vets-api-staging?resource=). After signing in with your account and visiting the link, you will see several things

At the top, you'll see the last time the pods were synced to HEAD. On the right, you'll see a long list of pods running the staging site. Click on one that has `vets-api-web` in the name.

You'll see "TERMINAL" as a tab. From here, you have access to the console. You can run any commands you would in a local terminal here. For instance, run `bundle exec rails c` if you'd like to run a rails console.

### User Sign In

You can then fetch an [api token](ApiTokens.md#fetching-api-tokens) and use that token to create a SIS user session:

```ruby
irb(main):001:0> token = SignIn::AccessTokenJwtDecoder.new(access_token_jwt: 'crazylongsistoken').perform(with_validation: true)
irb(main):001:0> user = User.find(token.user_uuid)
```

If the user comes back as nil, this means it's not in redis due to inactivity. If that happens, make any API request for the user and try again. The API request will load the user into redis as part of the authentication process.
