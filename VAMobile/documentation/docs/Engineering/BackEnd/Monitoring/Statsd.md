---
title: Statsd Metrics
---

You can create custom Mobile metrics within Vets API by adding new statsd entries to `modules/mobile/config/initializers/statsd.rb`.

![Statsd implementation example in Ruby on Rails](../../../../static/img/backend/statsd.png)

[Read more about Statsd](https://github.com/Shopify/statsd-instrument). In order for metics to be picked up an entry for the associated endpoint must also be in `ansible/deployment/config/revproxy-vagov/vars/nginx_components.yml` in the [DevOps repo](https://github.com/department-of-veterans-affairs/devops)

![nginx_components example code](../../../../static/img/backend/mobile-api-components.png)
