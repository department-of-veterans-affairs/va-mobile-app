# Translations

## Translation Files

All visible copy in the app should be located in language specific translation files to support the ability of the app to decide client side which language it will display. Translations are stored in JSON files located under `src/translations/<language>` and split into separate files by namespace.

### Files and Namespaces

Within a language directory, the translation files are split into files for each namespace representing different sections of the app. There is also a `common` namespace used for strings used throughout the app like "Save" or "Cancel".

### Translation Keys
Strings are identified in the app through a key associated with the value in their language file. This key must be consistent across all language files for their respective values, the key itself is not translated.

```"claimPhase.details.phaseFive": "Complete",```

This is an example of a string in the `claims` namespace. The key is `claimPhase.details.phaseFive` and the translated value is `Complete`.

### Adding a New String
- If it is specific to a screen or will only be used within certain parts of the app (for example, "Take photos and upload to your claim") it should be placed in the file for the namespace associated with that copy.
- If it is used in a common component or will be used across the app in nonspecific contexts (for example "confirm" or "refreshes the page") then it should go in the `common` namespace.
- Maintain keys in alphabetical order within the JSON file.

## Using Translations

Translation values are accessed via the `useTranslation` hook. This hook creates a translation function for a namespace or list of namespaces provided as an argument.

```
const { t } = useTranslation(NAMESPACE.COMMON)
```

For basic usage, the translation function takes in the desired key as the only argument and will resolve to the display value associated with that key.

```
t('claimDetails.needHelp')
``` 

This value can be used like any other string, either placed directly into a TextView component:

```
<TextView variant="MobileBodyBold" >
  {t('claimDetails.needHelp')}
</TextView>
```

Or passed in as a prop to a component that will decide where and how to display it:

```
<VAButton
    label={t('fileUpload.submit')}
    testID={t('fileUpload.submit')}
    buttonType={ButtonTypesConstants.buttonPrimary}
    a11yHint={t('fileUpload.uploadFileA11yHint')}
/>
```

### Strings With Parameters

Sometimes text will not be static and includes values that are user, code, or API driven and cannot be added to the translation file itself. In the translated string in the translation files, the `{{}}` notation provides a spot in the string to place dynamic values.

```
"listPosition": "{{position}} of {{total}}",
```

This allows this translation to take in two values, position and total that will be placed in the translated value. To use this with our translation function:

```
t('listPosition', { position: myPosition, total: totalEntries })
```

### Multiple Namespaces

To use multiple namespaces, either create another function with the desired namespace

```
const { t } = useTranslation(NAMESPACE.COMMON)
const { t: tCommon } = useTranslation(NAMESPACE.COMMON)
```

or create one translation function for multiple namespaces where the usage will be prefixed with the desired namespace

```
const { t } = useTranslation([NAMESPACE.COMMON, NAMESPACE.HEALTH])

const myCommonString = t('health:key.in.health')
```
