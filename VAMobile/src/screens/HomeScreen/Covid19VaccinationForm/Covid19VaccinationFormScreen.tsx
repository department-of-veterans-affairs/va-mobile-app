import { TextInput } from 'react-native'
import React, { FC, useRef } from 'react'

import { Box, ButtonTypesConstants, TextView, VAButton, VAModalPicker, VAScrollView, VATextInput } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { testIdProps } from 'utils/accessibility'
import { useTranslation } from 'utils/hooks'
import VADatePicker from 'components/VADatePicker'
import theme from 'styles/themes/standardTheme'

/**
 * Screen for displaying and submitting the VA COVID-19 Vaccine interest questionnaire
 */
export type Covid19VaccinationFormScreenProps = Record<string, unknown>

// TODO: unit tests
const Covid19VaccinationFormScreen: FC<Covid19VaccinationFormScreenProps> = () => {
  const t = useTranslation(NAMESPACE.HOME)

  const zipCodeRef = useRef<TextInput>(null)

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
    <VAScrollView {...testIdProps('COVID-19-Vaccine-form-page')}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <TextView variant={'BitterBoldHeading'} textAlign={'center'} p={theme.dimensions.textXPadding}>
          {t('covid19Vaccinations.heading')}
        </TextView>
        <TextView variant={'MobileBody'} p={theme.dimensions.textXPadding}>
          {t('covid19Vaccinations.instructions')}
        </TextView>
        <Box mt={theme.dimensions.standardMarginBetween}>
          <TextView variant={'MobileBody'} mx={theme.dimensions.gutter} mb={theme.dimensions.textInputLabelMarginBottom}>
            {t('covid19Vaccinations.firstName.label')}
          </TextView>
          <VATextInput inputType={'none'} onChange={(): void => {}} />
        </Box>
        <Box mt={theme.dimensions.standardMarginBetween}>
          <TextView variant={'MobileBody'} mx={theme.dimensions.gutter} mb={theme.dimensions.textInputLabelMarginBottom}>
            {t('covid19Vaccinations.lastName.label')}
          </TextView>
          <VATextInput inputType={'none'} onChange={(): void => {}} />
        </Box>
        <Box mt={theme.dimensions.standardMarginBetween}>
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
        <Box mt={theme.dimensions.standardMarginBetween}>
          <TextView variant={'MobileBody'} mx={theme.dimensions.gutter} mb={theme.dimensions.textInputLabelMarginBottom}>
            {t('covid19Vaccinations.email.label')}
          </TextView>
          <VATextInput inputType={'email'} onChange={(): void => {}} />
        </Box>
        <Box mt={theme.dimensions.standardMarginBetween}>
          <TextView variant={'MobileBody'} mx={theme.dimensions.gutter} mb={theme.dimensions.textInputLabelMarginBottom}>
            {t('covid19Vaccinations.phone.label')}
          </TextView>
          <VATextInput inputType={'phone'} onChange={(): void => {}} />
        </Box>
        <Box mt={theme.dimensions.standardMarginBetween}>
          <TextView variant={'MobileBody'} mx={theme.dimensions.gutter} mb={theme.dimensions.textInputLabelMarginBottom}>
            {t('covid19Vaccinations.zipCode.label')}
          </TextView>
          <VATextInput inputType={'none'} onChange={(): void => {}} inputRef={zipCodeRef} />
        </Box>
        {/*TODO: a11y hints? Any other accessibility needs?*/}
        <Box mt={theme.dimensions.standardMarginBetween}>
          <TextView variant={'MobileBody'} mx={theme.dimensions.gutter} mb={theme.dimensions.textInputLabelMarginBottom}>
            {t('covid19Vaccinations.sameZipcode')}
          </TextView>
          <VAModalPicker selectedValue={'yes'} onSelectionChange={(): void => {}} pickerOptions={sameZipCodeOptions} />
        </Box>
        {/*TODO: a11y hints? Any other accessibility needs?*/}
        <Box mt={theme.dimensions.standardMarginBetween}>
          <TextView variant={'MobileBody'} mx={theme.dimensions.gutter} mb={theme.dimensions.textInputLabelMarginBottom}>
            {t('covid19Vaccinations.interestedInVaccine')}
          </TextView>
          <VAModalPicker selectedValue={'yes'} onSelectionChange={(): void => {}} pickerOptions={interestedInVaccine} />
        </Box>
        <Box mt={theme.dimensions.standardMarginBetween} mx={theme.dimensions.gutter}>
          <VAButton
            onPress={(): void => {}}
            label={t('covid19Vaccinations.signUp')}
            buttonType={ButtonTypesConstants.buttonPrimary}
            a11yHint={t('covid19Vaccinations.submitButtonA11yHint')}
          />
        </Box>
      </Box>
    </VAScrollView>
  )
}

export default Covid19VaccinationFormScreen
