# Parallel Calls
The mobile API often needs to make requests to external services to fetch data to return to the client. In some cases, a single request from the client can require data from multiple external services. This can cause those requests to be slow and creates a bad user experience.

To mitigate the issue, we use the [Parallel Gem](https://github.com/grosser/parallel), which provides a simple interface for executing functions in parallel using threads. A simple use pattern is:

* Find the common location where code branches off into the multiple network calls.
* Wrap the methods that initiate those branches in lambdas.
* Pass an array of those lambdas to the gem, telling it how many threads to use and specifying that it should execute the `call` method on each lambda to execute it.
* Capture return values if needed.
* It is possible to rescue errors either within lambdas or around the entire parallelization code block. This allows us the ability to capture errors and either log them or provide helpful information back to the client. If we do not rescue, errors will stop execution and be handled as they normally would.
