# Background Processes

## Background Workers

 * Vets-api uses Sidekiq for background processing and scheduling.
 * Mobile typically uses async jobs for caching, updating user accounts, and logging (to avoid taxing the system on a log that would otherwise be hit too often)
 * Mobile has various jobs that can be found in `modules/mobile/app/workers` directory.
 * New job schedules must be initialized in `lib/periodic_jobs.rb` (event driven async jobs do not need to be set here)
 * When scheduling a new job, keep in mind that many upstream services go down for maintenance in the evening and weekends. Also try to spread out jobs to run at different times of day.

## Caching

 * Caching within Mobile is done on a feature by feature basis. Some services used within vets-api do the caching, and in some cases when performance is struggling, Mobile will implement our own caching.
 * If caching is implemented within Mobile, add a `useCache` parameter to enable/disable caching. This is useful for debugging issues. 
 * Cached data within Mobile typically has a Time to Live (TTL) of 30 minutes (session caches are much shorter)
 * Cache TTL can be found in `config/redis.yml`

## Parallel processes
 
 * To improve performance, if multiple upstream calls need to be made and do not need to be made in a sequence, it's recommended to make both calls concurrently using the `parallel` gem. 
 * An example of this can be found at in the Mobile claims and appeals index call.