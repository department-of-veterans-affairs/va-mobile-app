import React, { FC, useMemo, useState } from 'react'

import * as CommonComponents from 'components'
import { Box, FeatureLandingTemplate, PickerItem, TextView, VAModalPicker, VATextInput } from 'components'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { OnPressOptions } from './PickerOptions'
import { StackScreenProps } from '@react-navigation/stack'
import { useTheme } from 'utils/hooks'
import { useTranslation } from 'react-i18next'
import CommonComponentWhiteList, { PropOptionType } from './CommonComponentWhiteList'

type SandboxScreenSettingsScreenProps = StackScreenProps<HomeStackParamList, 'Sandbox'>

const SandboxScreen: FC<SandboxScreenSettingsScreenProps> = ({ navigation }) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  // Component Picker
  const defaultComponent = 'ClickForActionLink'
  const [selectedOption, setSelectedOption] = useState(defaultComponent)
  const [dynamicProps, setDynamicProps] = useState(CommonComponentWhiteList[defaultComponent].defaultProps)

  // names of all components
  const commonComponentNames = useMemo(() => {
    // Object.keys(CommonComponents) // all common components in src/components
    return Object.keys(CommonComponentWhiteList)
  }, [])

  // picker options
  const pickerOptions: Array<PickerItem> = useMemo(() => {
    return commonComponentNames.map((key) => {
      return {
        label: key,
        value: key,
      }
    })
  }, [commonComponentNames])

  const onSelectComponentOption = (val: string) => {
    setSelectedOption(val)
    const defaultProps = CommonComponentWhiteList[val]?.defaultProps
    if (defaultProps) {
      setDynamicProps(CommonComponentWhiteList[val].defaultProps)
    }
  }

  const componentPicker = () => {
    return <VAModalPicker selectedValue={selectedOption} onSelectionChange={onSelectComponentOption} pickerOptions={pickerOptions} labelKey={'Components'} />
  }
  const renderSandboxComponent = () => {
    const whiteListed = CommonComponentWhiteList[selectedOption]
    if (!whiteListed) {
      return <TextView>{t('text.raw', { text: 'Current option has not been set for Sandbox mode yet' })}</TextView>
    }

    const props = {
      ...dynamicProps,
    }

    // convert DEFAULT to arrow function
    if (!!props.onPress && props.onPress === OnPressOptions.DEFAULT) {
      props.onPress = () => {}
    }

    // @ts-ignore
    const component = CommonComponents[selectedOption as string]
    return React.createElement(component, props)
  }
  const setValues = (value: string, key: string) => {
    const test = {
      ...dynamicProps,
      [key]: value,
    }
    setDynamicProps(test)
  }

  const renderOptions = () => {
    const component = CommonComponentWhiteList[selectedOption]
    if (!component || !component.propOptions) {
      return <></>
    }

    return component.propOptions.map((propOption: PropOptionType, index: number) => {
      let content
      if (typeof propOption === 'string') {
        // @ts-ignore
        const propName = dynamicProps[propOption]
        content = (
          <>
            <TextView>{t('text.raw', { text: propOption })}</TextView>
            <VATextInput
              inputType={'none'}
              onChange={(val) => {
                setValues(val || '', propOption)
              }}
              value={propName as string}
            />
          </>
        )
      } else if (Array.isArray(propOption)) {
        content = <TextView>{t('text.raw', { text: 'Array' })}</TextView>
      } else if (typeof propOption === 'object') {
        // @ts-ignore
        const propName = dynamicProps[propOption.label]
        content = (
          <VAModalPicker
            selectedValue={propName as string}
            onSelectionChange={(selectValue) => {
              setValues(selectValue, propOption.label)
            }}
            pickerOptions={propOption.options as never} // todo fix VAModalPicker to be more flexible
            labelKey={t('text.raw', { text: propOption.label })}
          />
        )
      } else {
        content = <TextView>{t('text.raw', { text: 'Not identified' })}</TextView>
      }
      return (
        <Box key={index} my={2}>
          {content}
        </Box>
      )
    })
  }

  return (
    <FeatureLandingTemplate backLabel={t('debug.title')} backLabelOnPress={navigation.goBack} title={t('sandbox.title')}>
      <Box mx={theme.dimensions.gutter}>
        {componentPicker()}
        <Box my={theme.dimensions.standardMarginBetween}>{renderOptions()}</Box>
        <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom}>
          {renderSandboxComponent()}
        </Box>
      </Box>
    </FeatureLandingTemplate>
  )
}

export default SandboxScreen
