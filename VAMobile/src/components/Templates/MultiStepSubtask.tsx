import React, { createContext, useCallback, useContext, useState } from 'react'

import { ParamListBase, useFocusEffect } from '@react-navigation/native'
import { TransitionPresets, createStackNavigator } from '@react-navigation/stack'

import { useSnackbar } from '@department-of-veterans-affairs/mobile-component-library'

import { FullScreenSubtask, FullScreenSubtaskProps } from 'components'

/**
 * Hook allowing child screens to set props on parent template
 * @param props - Props to set on FullScreenSubtask
 */
export const useSubtaskProps = (props: FullScreenSubtaskProps) => {
  const { setSubtaskProps } = useContext(SubtaskContext)

  useFocusEffect(
    useCallback(() => {
      setSubtaskProps(props)
    }, []), // eslint-disable-line react-hooks/exhaustive-deps
  )
}

type SubtaskContextValue = {
  setSubtaskProps: React.Dispatch<React.SetStateAction<FullScreenSubtaskProps>>
}

export const SubtaskContext = createContext<SubtaskContextValue>({} as SubtaskContextValue)

const subtaskScreenOptions = {
  headerShown: false,
  ...TransitionPresets.SlideFromRightIOS,
}

type MultiStepSubtaskProps<T extends ParamListBase> = FullScreenSubtaskProps & {
  /** Child routes to render in the StackNavigator */
  children: React.ReactNode
  /** Stack navigator to wrap child routes */
  stackNavigator: ReturnType<typeof createStackNavigator<T>>
}

function MultiStepSubtask<T extends ParamListBase>({ ...props }: MultiStepSubtaskProps<T>) {
  const snackbar = useSnackbar()
  const { children, stackNavigator } = props
  const [subtaskProps, setSubtaskProps] = useState<FullScreenSubtaskProps>({})

  return (
    <FullScreenSubtask {...subtaskProps}>
      <SubtaskContext.Provider value={{ setSubtaskProps }}>
        <stackNavigator.Navigator
          screenOptions={subtaskScreenOptions}
          screenListeners={{
            transitionStart: (e) => {
              if (e.data.closing) {
                snackbar.hide()
              }
            },
            blur: () => {
              snackbar.hide()
            },
          }}>
          {children}
        </stackNavigator.Navigator>
      </SubtaskContext.Provider>
    </FullScreenSubtask>
  )
}

export default MultiStepSubtask
