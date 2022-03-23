import React, { FC, ReactNode } from 'react'

import { AccordionCollapsible, Box, ClickToCallPhoneNumber, TextView, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'

const NoMatchInRecords: FC = () => {
  const t = useTranslation(NAMESPACE.HEALTH)
  const theme = useTheme()

  const accordionContent = (textID: string, textA11yLabelID?: string): ReactNode => {
    const a11yProps = textA11yLabelID ? { ...testIdProps(t(`noMatch.${textA11yLabelID}`)) } : {}

    return (
      <Box mt={theme.dimensions.standardMarginBetween}>
        <Box {...a11yProps}>
          <TextView variant="MobileBody">{t(`noMatch.${textID}`)}</TextView>
        </Box>
        <ClickToCallPhoneNumber phone={t('noMatch.phoneNumber')} displayedText={t('noMatch.phoneNumberDisplayed')} />
      </Box>
    )
  }

  const accordionHeader = (textID: string, textA11yLabelID?: string): ReactNode => {
    const a11yProps = textA11yLabelID ? { ...testIdProps(t(`noMatch.${textA11yLabelID}`)) } : {}

    return (
      <TextView variant="MobileBodyBold" color={'primaryTitle'} {...a11yProps}>
        {t(`noMatch.${textID}`)}
      </TextView>
    )
  }

  return (
    <VAScrollView {...testIdProps('Health care: No match in records')}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom}>
        <Box mx={theme.dimensions.gutter}>
          <Box accessibilityRole="header" accessible={true}>
            <TextView variant="BitterBoldHeading" color={'primaryTitle'}>
              {t('noMatch.title')}
            </TextView>
          </Box>
          <Box accessible={true}>
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
            header={accordionHeader('currentlyRegisteredPatient')}
            expandedContent={accordionContent('currentlyRegisteredPatientContent', 'currentlyRegisteredPatientContentA11yLabel')}
          />
        </Box>
        <Box mt={theme.dimensions.condensedMarginBetween}>
          <AccordionCollapsible header={accordionHeader('enrolledInHealthCare')} expandedContent={accordionContent('enrolledInHealthCareContent')} />
        </Box>
        <Box mt={theme.dimensions.condensedMarginBetween}>
          <AccordionCollapsible header={accordionHeader('notEnrolled')} expandedContent={accordionContent('notEnrolledContent')} />
        </Box>
      </Box>
    </VAScrollView>
  )
}

export default NoMatchInRecords
