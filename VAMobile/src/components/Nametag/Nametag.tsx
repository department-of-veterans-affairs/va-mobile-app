import React from 'react'

import NametagLegacy from 'components/Nametag/NametagLegacy'
import NametagVsc from 'components/Nametag/NametagVsc'
import { featureEnabled } from 'utils/remoteConfig'

export const Nametag = () => {
  const isNewVSCCardAllowed = featureEnabled('veteranStatusCardUpdate')
  return isNewVSCCardAllowed ? <NametagVsc /> : <NametagLegacy />
}

export default Nametag
