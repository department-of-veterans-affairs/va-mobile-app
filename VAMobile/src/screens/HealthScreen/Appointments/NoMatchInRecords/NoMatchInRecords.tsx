import React, { FC, ReactNode } from 'react'

import { AccordionCollapsible, Box, ClickToCallPhoneNumber, TextView, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'

const NoMatchInRecords: FC = () => {
  const t = useTranslation(NAMESPACE.HEALTH)
  const theme = useTheme()

  const accordionContent = (textID: string, textA11yLabelID: string): ReactNode => {
    return (
      <Box mt={theme.dimensions.standardMarginBetween}>
        <Box {...testIdProps(t(`noMatch.${textA11yLabelID}`))}>
          <TextView variant="MobileBody">{t(`noMatch.${textID}`)}</TextView>
        </Box>
        <ClickToCallPhoneNumber phone={t('noMatch.phoneNumber')} displayedText={t('noMatch.phoneNumberDisplayed')} />
      </Box>
    )
  }

  const accordionHeader = (textID: string, textA11yLabelID: string): ReactNode => {
    return (
      <TextView variant="MobileBodyBold" color={'primaryTitle'} {...testIdProps(t(`noMatch.${textA11yLabelID}`))}>
        {t(`noMatch.${textID}`)}
      </TextView>
    )
  }

  return (
    <VAScrollView {...testIdProps('Health care: No match in records')}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom}>
        <Box mx={theme.dimensions.gutter}>
          <Box {...testIdProps(t('noMatch.titleA11yLabel'))} accessibilityRole="header" accessible={true}>
            <TextView variant="BitterBoldHeading">{t('noMatch.title')}</TextView>
          </Box>
          <Box {...testIdProps(t('noMatch.noMatchA11yLabel'))} accessible={true}>
            <TextView variant="MobileBody" my={theme.dimensions.standardMarginBetween}>
              {t('noMatch.noMatch')}
            </TextView>
          </Box>
          <Box {...testIdProps(t('noMatch.whatYouCanDo'))} accessibilityRole="header" accessible={true}>
            <TextView variant="MobileBodyBold" color={'primaryTitle'}>
              {t('noMatch.whatYouCanDo')}
            </TextView>
          </Box>
        </Box>
        <Box mt={theme.dimensions.condensedMarginBetween}>
          <AccordionCollapsible
            header={accordionHeader('currentlyRegisteredPatient', 'currentlyRegisteredPatientA11yLabel')}
            expandedContent={accordionContent('currentlyRegisteredPatientContent', 'currentlyRegisteredPatientContentA11yLabel')}
            testID={t('noMatch.currentlyRegisteredPatientA11yLabel')}
          />
        </Box>
        <Box mt={theme.dimensions.condensedMarginBetween}>
          <AccordionCollapsible
            header={accordionHeader('enrolledInHealthCare', 'enrolledInHealthCareA11yLabel')}
            expandedContent={accordionContent('enrolledInHealthCareContent', 'enrolledInHealthCareContentA11yLabel')}
            testID={t('noMatch.enrolledInHealthCareA11yLabel')}
          />
        </Box>
        <Box mt={theme.dimensions.condensedMarginBetween}>
          <AccordionCollapsible
            header={accordionHeader('notEnrolled', 'notEnrolledA11yLabel')}
            expandedContent={accordionContent('notEnrolledContent', 'notEnrolledContentA11yLabel')}
            testID={t('noMatch.notEnrolledA11yLabel')}
          />
        </Box>
      </Box>
    </VAScrollView>
  )
}

export default NoMatchInRecords
