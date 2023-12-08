import { waygateNativeAlert, WaygateToggleType } from 'utils/waygateConfig'
import { useRouteNavigation } from 'utils/hooks'

export const navigateWithWaygate = (goTo: string) => {
    const navigateTo = useRouteNavigation()
    
    if (waygateNativeAlert(`WG_${goTo}` as WaygateToggleType)) {
        navigateTo(goTo)()
    }
}