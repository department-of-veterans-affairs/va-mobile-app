# Models

Unlike a typical Rails app, most of the models in the mobile module do not use ActiveRecord. Most of our models are populated from upstream data sources, so there's no need to store the data in a local database, which makes them a bad fit for ActiveRecord. As a result, most vets-api models inherit from `Dry::Struct` instead of `ActiveRecord::Base` to represent data. Dry structs use [`Dry::Types`](https://dry-rb.org/gems/dry-types) to validate attribute data types.


## Serializers

Mobile serializers use `JSONAPI::Serializer` and they do two things:
- ensure that our responses are formatted as valid [JSONAPI](./JSONAPI.md)
- determine which attributes from the model are included in the response

## Best Practice

- all data should be converted to models in order to use type validation
- all nested attributes should be fully detailed within the data model in order to whitelist and validate all attributes that will be serialized. In other words, if a model has an attribute that is a hash or an array of hashes, all attributes in the hash should also be validated with `Dry::Types`. For example, a hash could look like:
```
  attribute :debt_history do
    attribute :date, Types::Date
    attribute :letter_code, Types::String
    attribute :description, Types::String
  end
```
an array of hashes could look like:
```
  attribute :debt_history, Types::Array do
    attribute :date, Types::Date
    attribute :letter_code, Types::String
    attribute :description, Types::String
  end
```
- all data should be serialized to ensure JSONAPI compliance
