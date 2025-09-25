import React, { FC } from 'react'

import { ClickToCallPhoneNumber, TextView } from 'components'
import { useExternalLink } from 'utils/hooks'

type PhoneNumberComponentProps =
  | {
      children?: React.ReactNode
      variant: 'inline'
      ttyBypass?: never
    }
  | {
      children?: React.ReactNode
      variant: 'standalone'
      ttyBypass?: boolean
    }

const PhoneNumberComponent: FC<PhoneNumberComponentProps> = ({ children, ttyBypass, variant }) => {
  const displayedText = Array.isArray(children) ? children[0] : ''
  const phone = displayedText.replace(/\D/g, '') // Strip out non-numeric characters
  const launchExternalLink = useExternalLink()

  if (variant === 'inline') {
    return (
      <TextView
        mb={-2.75}
        variant="HelperText"
        color="link"
        textDecoration="underline"
        textDecorationColor="link"
        onPress={() => {
          launchExternalLink(`tel:${phone}`)
        }}>
        {displayedText}
      </TextView>
    )
  } else {
    return <ClickToCallPhoneNumber phone={phone} displayedText={displayedText} ttyBypass={ttyBypass} />
  }
}

export default PhoneNumberComponent
