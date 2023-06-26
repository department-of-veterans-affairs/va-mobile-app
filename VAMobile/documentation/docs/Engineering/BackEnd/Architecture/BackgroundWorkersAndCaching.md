# Background Workers and Caching

## Background Workers

 * Vets-api uses Sidekiq for background processing and scheduling.
 * Mobile typically uses async jobs for caching, updating user accounts, and logging (to avoid taxing the system on a log that would otherwise be hit too often)
 * Mobile has various jobs that can be found in `modules/mobile/app/workers` directory.
 * New job schedules must be initialized in `lib/periodic_jobs.rb` (event-driven async jobs do not need to be set here)
 * When scheduling a new job, try to spread out jobs to run at different times of the day but keep in mind that many upstream services go down for maintenance in the evening and on weekends.

## Caching

 * Caching within Mobile is done on a feature by feature basis. Some services used within vets-api do the caching, and in some cases when performance is struggling, Mobile will implement our own caching.
 * If caching is implemented within Mobile, add a `useCache` parameter to enable/disable caching. This is useful for debugging issues.
 * Cached data within Mobile typically has a Time to Live (TTL) of 30 minutes (session caches are much shorter)
 * Cache TTL can be found in `config/redis.yml`