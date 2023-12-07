import React from 'react'

import { waygateNativeAlert, WaygateToggleType } from 'utils/waygateConfig'
import { useRouteNavigation } from 'utils/hooks'

export const navigateWithWaygate = (toggleType: WaygateToggleType, goTo: string ) => {
    const navigateTo = useRouteNavigation()
    
    if (waygateNativeAlert(toggleType)) {
        navigateTo(goTo)()
    }
}