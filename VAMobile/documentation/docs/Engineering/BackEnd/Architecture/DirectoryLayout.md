# Directory Layout

The backend code is located in the [vets-api](https://github.com/department-of-veterans-affairs/vets-api]) repo. The
majority of the code can be found in the [/modules/mobile/](https://github.com/department-of-veterans-affairs/vets-api/tree/1721381f3ca2c3ca65f5be8dbbcf4886f02e067d/modules/mobile)
directory. The module is laid out much like the root of a standard rails project, for instance, it has `app/controllers` and
`app/models` directories. With that knowledge, you can usually navigate to the code you want fairly easily.

## Controllers Directory
```
/modules/mobile/app/controllers  
```
## Models Directory
```
/modules/mobile/app/models  
```
The models directory contains several specific types of classes. 

#### Adapters 
Adapters are used whenever we need to _massage_ data from one schema to another. For instance, if we're upgrading to a new
upstream endpoint and the data from the new endpoint changed names and/or is in a different format, we use adapters
so that the new data is backwards compatible.

#### Contracts
TODO

## Policies
TODO

## Serializers
TODO

## Services
TODO

## Workers
TODO

## Testing
The various paths for testing are as follows
```
# Specs
/modules/mobile/spec/

# VCR Cassettes
/spec/support/vcr_cassettes/mobile/
```

