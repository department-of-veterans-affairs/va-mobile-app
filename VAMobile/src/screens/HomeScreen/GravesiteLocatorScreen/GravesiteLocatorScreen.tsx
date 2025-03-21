import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'

import { StackScreenProps } from '@react-navigation/stack'

import { Button } from '@department-of-veterans-affairs/mobile-component-library'
import { map } from 'underscore'

import { useGravesites } from 'api/gravesiteLocator/getGravesites'
import { BranchOfService, BranchesOfServiceConstants } from 'api/types'
import { Gravesite } from 'api/types'
import {
  Box,
  FeatureLandingTemplate,
  FieldType,
  FormFieldType,
  FormWrapper,
  List,
  ListItemObj,
  LoadingComponent,
  MilitaryBranchEmblem,
  Pagination,
  PaginationProps,
  TextArea,
  TextView,
} from 'components'
import { VAScrollViewProps } from 'components/VAScrollView'
import { DEFAULT_PAGE_SIZE } from 'constants/common'
import { NAMESPACE } from 'constants/namespaces'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { useRouteNavigation, useTheme } from 'utils/hooks'

const MAX_NAME_LENGTH = 25

type GravesiteLocatorScreenProps = StackScreenProps<HomeStackParamList, 'GravesiteLocator'>

function GravesiteLocatorScreen({ navigation }: GravesiteLocatorScreenProps) {
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [page, setPage] = useState(1)
  const [resetErrors, setResetErrors] = useState(false)
  const [onSearchClicked, setOnSearchClicked] = useState(false)
  const [GravesitesToShow, setGravesitesToShow] = useState<Array<Gravesite>>([])
  const {
    data: gravesites,
    isFetching: loading,
    error: gravesitesError,
    refetch: refetchGravesites,
  } = useGravesites(firstName, lastName)

  const scrollViewRef = useRef<ScrollView | null>(null)
  const scrollViewProps: VAScrollViewProps = {
    scrollViewRef: scrollViewRef,
  }

  useEffect(() => {
    const gravesiteList = gravesites?.slice((page - 1) * DEFAULT_PAGE_SIZE, page * DEFAULT_PAGE_SIZE)
    setGravesitesToShow(gravesiteList || [])
  }, [gravesites, page])

  function formatDate(dateStr: string): string {
    if (dateStr.includes('/')) {
      const [month, day, year] = dateStr.split('/')
      const date = new Date(`${year}-${month}-${day}`)
      return date.toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' })
    } else {
      return dateStr
    }
  }

  const getBranchOfService = (branch: string): BranchOfService | undefined => {
    if (branch.includes('AIR FORCE')) {
      return BranchesOfServiceConstants.AirForce
    } else if (branch.includes('ARMY')) {
      return BranchesOfServiceConstants.Army
    } else if (branch.includes('COAST GUARD')) {
      return BranchesOfServiceConstants.CoastGuard
    } else if (branch.includes('MARINE CORPS')) {
      return BranchesOfServiceConstants.MarineCorps
    } else if (branch.includes('NAVY')) {
      return BranchesOfServiceConstants.Navy
    }
  }

  const gravesiteButtons: Array<ListItemObj> = map(GravesitesToShow, (gravesite, index) => {
    const branch = getBranchOfService(gravesite.branch)
    const name = gravesite.d_mid_name
      ? `${gravesite.d_first_name} ${gravesite.d_mid_name} ${gravesite.d_last_name}`
      : `${gravesite.d_first_name} ${gravesite.d_last_name}`
    const deathDate = formatDate(gravesite.d_death_date)

    const gravesiteButton: ListItemObj = {
      content: (
        <Box flex={1} flexDirection="row" alignItems="center">
          {branch ? <MilitaryBranchEmblem branch={branch} width={60} height={60} /> : <Box width={60} height={60} />}
          <Box flex={1} flexDirection="column" mx={theme.dimensions.gutter}>
            <TextView variant="MobileBodyBold">{name}</TextView>
            <TextView variant="MobileBodyTight">{deathDate}</TextView>
            <TextView variant="MobileBodyTight">{`${gravesite.cem_name}, ${gravesite.state}`}</TextView>
          </Box>
        </Box>
      ),
      onPress: () => {
        navigateTo('GravesiteDetails', { gravesite: gravesite })
      },
      a11yHintText: '',
      a11yValue: t('listPosition', { position: index + 1, total: gravesites?.length }),
      // testId: 'gravesiteButton',
    }

    return gravesiteButton
  })

  // Render pagination
  function renderPagination() {
    const paginationProps: PaginationProps = {
      onNext: () => {
        setPage(page + 1)
        scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: false })
      },
      onPrev: () => {
        setPage(page - 1)
        scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: false })
      },
      totalEntries: gravesites?.length || 0,
      pageSize: DEFAULT_PAGE_SIZE,
      page,
    }

    return (
      <Box
        flex={1}
        mt={theme.dimensions.paginationTopPadding}
        mb={theme.dimensions.contentMarginBottom}
        mx={theme.dimensions.gutter}>
        <Pagination {...paginationProps} />
      </Box>
    )
  }

  const firstNameLengthValidation = (): boolean => {
    return firstName.length > MAX_NAME_LENGTH
  }

  const firstNameLettersOnlyValidation = (): boolean => {
    return /[^a-zA-Z]/.test(firstName)
  }

  const lastNameLengthValidation = (): boolean => {
    return lastName.length > MAX_NAME_LENGTH
  }

  const lastNameLettersOnlyValidation = (): boolean => {
    return /[^a-zA-Z]/.test(lastName)
  }

  const lastNameWhiteSpaceOnlyValidation = (): boolean => {
    return !/[\S]/.test(lastName)
  }

  const onSetFirstName = (name: string): void => {
    if (firstName !== name) {
      setResetErrors(true)
    }
    setFirstName(name)
  }

  const onSetLastName = (name: string): void => {
    if (lastName !== name) {
      setResetErrors(true)
    }
    setLastName(name)
  }

  const onSearch = (): void => {
    if (onSearchClicked) {
      setPage(1)
      refetchGravesites()
      setOnSearchClicked(false)
    }
  }

  const formFieldsList: Array<FormFieldType<unknown>> = [
    {
      fieldType: FieldType.TextInput,
      fieldProps: {
        inputType: 'none',
        labelKey: 'gravesite.locator.name.first',
        value: firstName,
        onChange: onSetFirstName,
        // helperTextKey: 'gravesite.locator.name.editHelperText',
        // a11yLabel: 'personalInformation.preferredNameScreen.body.a11yLabel',
        // testID: 'preferredNameTestID',
      },
      validationList: [
        {
          validationFunction: firstNameLettersOnlyValidation,
          validationFunctionErrorMessage: t('gravesite.locator.name.lettersOnly'),
        },
        {
          validationFunction: firstNameLengthValidation,
          validationFunctionErrorMessage: t('gravesite.locator.name.tooManyCharacters'),
        },
      ],
    },
    {
      fieldType: FieldType.TextInput,
      fieldProps: {
        inputType: 'none',
        isRequiredField: true,
        labelKey: 'gravesite.locator.name.last',
        value: lastName,
        onChange: onSetLastName,
        // helperTextKey: 'gravesite.locator.name.editHelperText',
        // a11yLabel: 'personalInformation.preferredNameScreen.body.a11yLabel',
        // testID: 'preferredNameTestID',
      },
      fieldErrorMessage: t('gravesite.locator.name.last.fieldEmpty'),
      validationList: [
        {
          validationFunction: lastNameLettersOnlyValidation,
          validationFunctionErrorMessage: t('gravesite.locator.name.lettersOnly'),
        },
        {
          validationFunction: lastNameWhiteSpaceOnlyValidation,
          validationFunctionErrorMessage: t('gravesite.locator.name.last.fieldEmpty'),
        },
        {
          validationFunction: lastNameLengthValidation,
          validationFunctionErrorMessage: t('gravesite.locator.name.tooManyCharacters'),
        },
      ],
    },
  ]

  return (
    <FeatureLandingTemplate
      title={t('gravesite.locator.title')}
      backLabel={t('home.title')}
      backLabelOnPress={navigation.goBack}
      scrollViewProps={scrollViewProps}>
      <TextArea>
        <FormWrapper
          fieldsList={formFieldsList}
          onSave={onSearch}
          resetErrors={resetErrors}
          setResetErrors={setResetErrors}
          onSaveClicked={onSearchClicked}
          setOnSaveClicked={setOnSearchClicked}
        />
        <Box mt={theme.dimensions.standardMarginBetween}>
          <Button onPress={() => setOnSearchClicked(true)} label={'Search'} />
        </Box>
      </TextArea>
      {loading ? (
        <LoadingComponent text={t('gravesite.locator.searching')} />
      ) : (
        <>
          <Box mt={theme.dimensions.contentMarginTop}>
            <List
              title={t('gravesite.locator.title.results', { count: gravesites?.length ?? 0 })}
              items={gravesiteButtons}
            />
          </Box>
          {renderPagination()}
        </>
      )}
    </FeatureLandingTemplate>
  )
}

export default GravesiteLocatorScreen
