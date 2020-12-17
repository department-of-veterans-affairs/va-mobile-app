import { ScrollView, TextInput } from 'react-native'
import RNPickerSelect from 'react-native-picker-select'
import React, { FC, useRef } from 'react'

import { Box, TextView, VAButton, VAPicker, VATextInput } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useTranslation } from 'utils/hooks'
import VADatePicker from 'components/VADatePicker'
import theme from 'styles/themes/standardTheme'

/**
 * Screen for displaying and submitting the VA COVID-19 Vaccine interest questionnaire
 */
export type Covid19VaccinationFormScreenProps = {}

// TODO: unit tests
const Covid19VaccinationFormScreen: FC<Covid19VaccinationFormScreenProps> = () => {
  const t = useTranslation(NAMESPACE.HOME)

  const zipCodeRef = useRef<TextInput>(null)
  const willYouBeInSameZipRef = useRef<RNPickerSelect>(null)
  const gettingVaccineRef = useRef<RNPickerSelect>(null)

  // TODO: Form state

  // TODO: need to know what the values the back end is expecting.
  const sameZipCodeOptions = [
    { value: 'yes', label: t('covid19Vaccinations.yes') },
    { value: 'no', label: t('covid19Vaccinations.no') },
    { value: 'unsure', label: t('covid19Vaccinations.unsure') },
  ]

  // TODO: need to know what the values the back end is expecting.
  const interestedInVaccine = [
    { value: 'yes', label: t('covid19Vaccinations.yes') },
    { value: 'no', label: t('covid19Vaccinations.no') },
    { value: 'unsure', label: t('covid19Vaccinations.notSureYet') },
    { value: 'na', label: t('covid19Vaccinations.preferNotToAnswer') },
  ]

  // TODO: Validation

  // TODO: Tab between inputs
  return (
    <ScrollView>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom}>
        <TextView variant={'BitterBoldHeading'} textAlign={'center'} p={theme.dimensions.textXPadding}>
          {t('covid19Vaccinations.heading')}
        </TextView>
        <TextView variant={'MobileBody'} p={theme.dimensions.textXPadding}>
          {t('covid19Vaccinations.instructions')}
        </TextView>
        <Box mt={theme.dimensions.marginBetween}>
          <TextView variant={'MobileBody'} mx={theme.dimensions.gutter} mb={theme.dimensions.textInputLabelMarginBottom}>
            {t('covid19Vaccinations.firstName.label')}
          </TextView>
          <VATextInput inputType={'none'} onChange={(): void => {}} placeholderKey={'home:covid19Vaccinations.firstName.placeholder'} />
        </Box>
        <Box mt={theme.dimensions.marginBetween}>
          <TextView variant={'MobileBody'} mx={theme.dimensions.gutter} mb={theme.dimensions.textInputLabelMarginBottom}>
            {t('covid19Vaccinations.lastName.label')}
          </TextView>
          <VATextInput inputType={'none'} onChange={(): void => {}} placeholderKey={'home:covid19Vaccinations.lastName.placeholder'} />
        </Box>
        <Box mt={theme.dimensions.marginBetween}>
          <TextView variant={'MobileBody'} mx={theme.dimensions.gutter} mb={theme.dimensions.textInputLabelMarginBottom}>
            {t('covid19Vaccinations.birthday.label')}
          </TextView>
          <VADatePicker
            defaultString={t('home:covid19Vaccinations.birthday.placeholder')}
            onChange={(selectedDate): void => {
              console.log(selectedDate)
            }}
          />
        </Box>
        <Box mt={theme.dimensions.marginBetween}>
          <TextView variant={'MobileBody'} mx={theme.dimensions.gutter} mb={theme.dimensions.textInputLabelMarginBottom}>
            {t('covid19Vaccinations.email.label')}
          </TextView>
          <VATextInput inputType={'email'} onChange={(): void => {}} placeholderKey={'home:covid19Vaccinations.email.placeholder'} />
        </Box>
        <Box mt={theme.dimensions.marginBetween}>
          <TextView variant={'MobileBody'} mx={theme.dimensions.gutter} mb={theme.dimensions.textInputLabelMarginBottom}>
            {t('covid19Vaccinations.phone.label')}
          </TextView>
          <VATextInput inputType={'phone'} onChange={(): void => {}} placeholderKey={'home:covid19Vaccinations.phone.placeholder'} />
        </Box>
        <Box mt={theme.dimensions.marginBetween}>
          <TextView variant={'MobileBody'} mx={theme.dimensions.gutter} mb={theme.dimensions.textInputLabelMarginBottom}>
            {t('covid19Vaccinations.zipCode.label')}
          </TextView>
          <VATextInput inputType={'none'} onChange={(): void => {}} placeholderKey={'home:covid19Vaccinations.zipCode.placeholder'} inputRef={zipCodeRef} />
        </Box>
        {/*TODO: a11y hints? Any other accessibility needs?*/}
        <Box mt={theme.dimensions.marginBetween}>
          <TextView variant={'MobileBody'} mx={theme.dimensions.gutter} mb={theme.dimensions.textInputLabelMarginBottom}>
            {t('covid19Vaccinations.sameZipcode')}
          </TextView>
          <VAPicker
            selectedValue={'yes'}
            onSelectionChange={(): void => {}}
            pickerOptions={sameZipCodeOptions}
            pickerRef={willYouBeInSameZipRef}
            onUpArrow={(): void => zipCodeRef?.current?.focus()}
            onDownArrow={(): void => gettingVaccineRef?.current?.togglePicker()}
          />
        </Box>
        {/*TODO: a11y hints? Any other accessibility needs?*/}
        <Box mt={theme.dimensions.marginBetween}>
          <TextView variant={'MobileBody'} mx={theme.dimensions.gutter} mb={theme.dimensions.textInputLabelMarginBottom}>
            {t('covid19Vaccinations.interestedInVaccine')}
          </TextView>
          <VAPicker
            selectedValue={'yes'}
            onSelectionChange={(): void => {}}
            pickerOptions={interestedInVaccine}
            pickerRef={gettingVaccineRef}
            onUpArrow={(): void => willYouBeInSameZipRef?.current?.togglePicker()}
          />
        </Box>
        <Box mt={theme.dimensions.marginBetween} mx={theme.dimensions.gutter}>
          <VAButton
            onPress={(): void => {}}
            label={t('covid19Vaccinations.signUp')}
            textColor={'primaryContrast'}
            backgroundColor={'button'}
            a11yHint={t('covid19Vaccinations.submitButtonA11yHint')}
          />
        </Box>
      </Box>
    </ScrollView>
  )
}

export default Covid19VaccinationFormScreen
