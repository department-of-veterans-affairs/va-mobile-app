import React, { FC } from 'react'

import { TextView } from 'components'
import { useTheme } from 'utils/hooks'
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
  const { gutter, standardMarginBetween, condensedMarginBetween, contentMarginBottom } = theme?.dimensions?
  const error = !!errorMessage

  return (
    <>
      <TextView
        mx={gutter}
        variant={'BitterBoldHeading'}
        accessibilityLabel={titleA11yLabel}
        accessibilityRole={'header'}
        mb={titleMarginBottom ? titleMarginBottom : !extraInformationText && !error ? contentMarginBottom : 0}>
        {title}
      </TextView>
      {!!extraInformationText && (
        <TextView variant="HelperText" mt={condensedMarginBetween} mb={!error ? standardMarginBetween : 0} mx={gutter}>
          {extraInformationText}
        </TextView>
      )}
      <AppointmentFlowErrorAlert errorMessage={errorMessage} mb={standardMarginBetween} mt={standardMarginBetween} />
    </>
  )
}

export default AppointmentFlowTitleSection
