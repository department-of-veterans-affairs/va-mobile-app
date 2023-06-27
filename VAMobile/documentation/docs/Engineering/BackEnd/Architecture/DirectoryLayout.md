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
Description of what we lump in the models directory

## Testing
The various paths for testing are as follows
```
# Specs
/modules/mobile/spec/

# VCR Cassettes
/spec/support/vcr_cassettes/mobile/
```

