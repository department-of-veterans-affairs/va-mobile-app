import React, { FC } from 'react'

import { TextView } from 'components'
import { useTheme } from 'utils/hooks/useTheme'
import AppointmentFlowErrorAlert from './AppointmentFlowErrorAlert'

type AppointmentModalTitleSectionProps = {
  /** title text */
  title: string
  /** Optional accessibility label for the title */
  titleA11yLabel?: string
  /** Optional text that will appear under title*/
  extraInformationText?: string
  /** Optional text for the error alert */
  errorMessage?: string
  /** Optional value to set the title margin bottom */
  titleMarginBottom?: number
}

/** Common component for the appointment request modal title section.
 * Will show title, optional extra information text, and an optional error alert.
 * */
const AppointmentFlowTitleSection: FC<AppointmentModalTitleSectionProps> = ({ title, extraInformationText, errorMessage, titleMarginBottom, titleA11yLabel }) => {
  const theme = useTheme()
  const error = !!errorMessage

  return (
    <>
      <TextView
        mx={theme.dimensions.gutter}
        variant={'BitterBoldHeading'}
        accessibilityLabel={titleA11yLabel}
        accessibilityRole={'header'}
        mb={titleMarginBottom ? titleMarginBottom : !extraInformationText && !error ? theme.dimensions.contentMarginBottom : 0}>
        {title}
      </TextView>
      {!!extraInformationText && (
        <TextView variant="HelperText" mt={theme.dimensions.condensedMarginBetween} mb={!error ? theme.dimensions.standardMarginBetween : 0} mx={theme.dimensions.gutter}>
          {extraInformationText}
        </TextView>
      )}
      <AppointmentFlowErrorAlert errorMessage={errorMessage} mb={theme.dimensions.standardMarginBetween} mt={theme.dimensions.standardMarginBetween} />
    </>
  )
}

export default AppointmentFlowTitleSection
