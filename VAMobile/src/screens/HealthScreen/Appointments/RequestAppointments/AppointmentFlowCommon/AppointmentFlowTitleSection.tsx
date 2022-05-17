import { AlertBox, Box, TextView } from 'components'
import React, { FC } from 'react'

import { useTheme } from 'utils/hooks'

type AppointmentModalTitleSectionProps = {
  /** title text */
  title: string
  /** Optional text that will appear under title*/
  extraInformationText?: string
  /** Optional boolean show the error a;ert */
  error?: boolean
  /** Optional text for the error alert */
  errorMessage?: string
  /** Optional value to set the title margin bottom */
  titleMarginBottom?: number
}

/** Common component for the appointment request modal title section.
 * Will show title, optional extra information text, and an optional error alert.
 * */
const AppointmentFlowTitleSection: FC<AppointmentModalTitleSectionProps> = ({ title, extraInformationText, error, errorMessage, titleMarginBottom }) => {
  const theme = useTheme()
  const { gutter, standardMarginBetween, condensedMarginBetween, contentMarginBottom } = theme.dimensions

  return (
    <>
      <TextView
        mx={gutter}
        variant={'BitterBoldHeading'}
        accessibilityRole={'header'}
        mb={titleMarginBottom ? titleMarginBottom : !extraInformationText && !error ? contentMarginBottom : 0}>
        {title}
      </TextView>
      {!!extraInformationText && (
        <TextView variant="HelperText" mt={condensedMarginBetween} mb={!error ? standardMarginBetween : 0} mx={gutter}>
          {extraInformationText}
        </TextView>
      )}
      {error && (
        <Box mx={gutter} mb={standardMarginBetween} mt={standardMarginBetween}>
          <AlertBox border={'error'} title={errorMessage} />
        </Box>
      )}
    </>
  )
}

export default AppointmentFlowTitleSection
