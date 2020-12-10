import { Box, TextView, VAButton, VAPicker, VATextInput } from 'components'
import { NAMESPACE } from '../../../constants/namespaces'
import { ScrollView } from 'react-native'
import { useTranslation } from '../../../utils/hooks'
import React, { FC } from 'react'
import theme from 'styles/themes/standardTheme'

// TODO: DOCUMENTATION!!
export type Covid19VaccinationFormScreenProps = {}
const Covid19VaccinationFormScreen: FC<Covid19VaccinationFormScreenProps> = () => {
  const t = useTranslation(NAMESPACE.HOME)

  // TODO: Form state

  // TODO: need to know what the values the back end is expecting.
  const sameZipCodeOptions = [
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' },
    { value: 'unsure', label: 'Unsure' },
  ]

  // TODO: need to know what the values the back end is expecting.
  const interestedInVaccine = [
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' },
    { value: 'unsure', label: "I'm Not Sure Yet" },
    { value: 'na', label: 'I prefer not to answer' },
  ]

  // TODO: Validation

  return (
    <ScrollView>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom}>
        <TextView variant={'BitterBoldHeading'} textAlign={'center'} p={theme.dimensions.textXPadding}>
          Fill out the form below to sign up
        </TextView>
        <TextView variant={'MobileBody'} p={theme.dimensions.textXPadding}>
          We’ll send you regular updates on how we’re providing COVID-19 vaccines across the country—and when you can get your vaccine if you want one. You don't need to sign up to
          get a vaccine.
        </TextView>
        <Box mt={theme.dimensions.marginBetween}>
          <TextView variant={'MobileBody'} mx={theme.dimensions.gutter} mb={5}>
            {t('covid19Vaccinations.firstName.label')}
          </TextView>
          <VATextInput inputType={'none'} onChange={() => {}} placeholderKey={'home:covid19Vaccinations.firstName.placeholder'} />
        </Box>
        <Box mt={theme.dimensions.marginBetween}>
          <TextView variant={'MobileBody'} mx={theme.dimensions.gutter} mb={5}>
            {t('covid19Vaccinations.lastName.label')}
          </TextView>
          <VATextInput inputType={'none'} onChange={() => {}} placeholderKey={'home:covid19Vaccinations.lastName.placeholder'} />
        </Box>
        <Box mt={theme.dimensions.marginBetween}>
          <TextView variant={'MobileBody'} mx={theme.dimensions.gutter} mb={5}>
            {t('covid19Vaccinations.birthday.label')}
          </TextView>
          <VATextInput inputType={'none'} onChange={() => {}} placeholderKey={'home:covid19Vaccinations.birthday.placeholder'} />
        </Box>
        <Box mt={theme.dimensions.marginBetween}>
          <TextView variant={'MobileBody'} mx={theme.dimensions.gutter} mb={5}>
            {t('covid19Vaccinations.email.label')}
          </TextView>
          <VATextInput inputType={'email'} onChange={() => {}} placeholderKey={'home:covid19Vaccinations.email.placeholder'} />
        </Box>
        <Box mt={theme.dimensions.marginBetween}>
          <TextView variant={'MobileBody'} mx={theme.dimensions.gutter} mb={5}>
            {t('covid19Vaccinations.phone.label')}
          </TextView>
          <VATextInput inputType={'phone'} onChange={() => {}} placeholderKey={'home:covid19Vaccinations.phone.placeholder'} />
        </Box>
        <Box mt={theme.dimensions.marginBetween}>
          <TextView variant={'MobileBody'} mx={theme.dimensions.gutter} mb={5}>
            {t('covid19Vaccinations.zipCode.label')}
          </TextView>
          <VATextInput inputType={'none'} onChange={() => {}} placeholderKey={'home:covid19Vaccinations.zipCode.placeholder'} />
        </Box>
        {/*TODO: a11y hints? Any other accessibility needs?*/}
        <Box mt={theme.dimensions.marginBetween}>
          <TextView variant={'MobileBody'} mx={theme.dimensions.gutter} mb={5}>
            {t('covid19Vaccinations.sameZipcode')}
          </TextView>
          <VAPicker selectedValue={'yes'} onSelectionChange={() => {}} pickerOptions={sameZipCodeOptions} />
        </Box>
        {/*TODO: a11y hints? Any other accessibility needs?*/}
        <Box mt={theme.dimensions.marginBetween}>
          <TextView variant={'MobileBody'} mx={theme.dimensions.gutter} mb={5}>
            {t('covid19Vaccinations.interestedInVaccine')}
          </TextView>
          <VAPicker selectedValue={'yes'} onSelectionChange={() => {}} pickerOptions={interestedInVaccine} />
        </Box>
        {/*TODO: a11y hint. Any other accessibility needs?*/}
        <Box mt={theme.dimensions.marginBetween} mx={theme.dimensions.gutter}>
          <VAButton onPress={() => {}} label={t('covid19Vaccinations.signUp')} textColor={'primaryContrast'} backgroundColor={'button'} />
        </Box>
      </Box>
    </ScrollView>
  )
}

export default Covid19VaccinationFormScreen
