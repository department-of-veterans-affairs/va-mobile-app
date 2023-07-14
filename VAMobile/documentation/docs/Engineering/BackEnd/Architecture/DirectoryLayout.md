# Directory Layout

The backend code is located in the [vets-api](https://github.com/department-of-veterans-affairs/vets-api]) repo. The
majority of the code can be found in the [/modules/mobile/](https://github.com/department-of-veterans-affairs/vets-api/tree/1721381f3ca2c3ca65f5be8dbbcf4886f02e067d/modules/mobile)
directory. The module is laid out much like the root of a standard rails project, for instance, it has `app/controllers` and
`app/models` directories. With that knowledge, you can usually navigate to the code you want fairly easily.

## Controllers Directory
```
/modules/mobile/app/controllers  
```
Versioning of controllers happens when there is an incompatibility with schema changes from upstream. This does not
include new fields additions.

## Models Directory
```
/modules/mobile/app/models  
```
The models directory contains several specific types of classes.

#### Standard Models
Even though ActiveRecord is not in use, there are files here that still define the representations of data.

#### Adapters 
Adapters are used whenever we need to _massage_ data from one schema to another. For instance, if we're upgrading to a new
upstream endpoint and the data from the new endpoint changed names and/or is in a different format, we use adapters
so that the new data is backwards compatible.

#### Contracts
Used for validating params in controllers

## Policies
Authorization policies used to verify access to routes and resources

## Serializers
Definitions of how different models should be serialized. These all conform to the JSON API standard.

## Services
Objects used for communicating with upstream service objects. These can be a mixture of services we've written directly,
or proxy objects we've written that communicate with other teams' objects. Usually objects here inherit from
`Common::Client::Base` or are related to configuration for such objects.

## Workers
Background workers. For more information, visit this [link](https://department-of-veterans-affairs.github.io/va-mobile-app/docs/Engineering/BackEnd/Architecture/BackgroundWorkersAndCaching)

## Testing
The various paths for testing are as follows
```
# Specs
/modules/mobile/spec/

# VCR Cassettes
/spec/support/vcr_cassettes/mobile/
```

## Docs
```
/modules/mobile/docs
```

## Misc
#### Lib
```
/lib
```
Traditionally, lib contains code that is not specific to the rails app. our contains:
 - Validation errors classes 
 - Engines
 - Scripts

#### Config
```
/config
```
Standard rails config, such as routes

#### DB
```
/db
```
Data migrations, though we seldom used because we rarely have db backed models
