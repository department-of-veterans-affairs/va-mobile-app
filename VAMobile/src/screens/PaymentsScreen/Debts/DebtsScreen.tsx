import React, { useEffect, useRef, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Pressable, PressableProps, ScrollView } from 'react-native'

import { StackScreenProps } from '@react-navigation/stack'

import { Icon, IconProps } from '@department-of-veterans-affairs/mobile-component-library'

import { useDebts } from 'api/debts'
import { DebtRecord } from 'api/types/DebtData'
import {
  AlertWithHaptics,
  Box,
  ClickToCallPhoneNumber,
  FeatureLandingTemplate,
  LoadingComponent,
  MultiTouchCard,
  Pagination,
  PaginationProps,
  TextView,
} from 'components'
import EmptyStateMessage from 'components/EmptyStateMessage'
import PhoneNumberComponent from 'components/PhoneNumberComponent'
import { VAScrollViewProps } from 'components/VAScrollView'
import { DEFAULT_PAGE_SIZE } from 'constants/common'
import { NAMESPACE } from 'constants/namespaces'
import ResolveDebtButton from 'screens/PaymentsScreen/Debts/ResolveDebt/ResolveDebtButton'
import { PaymentsStackParamList } from 'screens/PaymentsScreen/PaymentsStackScreens'
import { getDebtInfo } from 'utils/debts'
import { displayedTextPhoneNumber } from 'utils/formattingUtils'
import { useRouteNavigation, useTheme } from 'utils/hooks'

type DebtsScreenProps = StackScreenProps<PaymentsStackParamList, 'Debts'>

function DebtsScreen({ navigation }: DebtsScreenProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()

  const { data: debtsData, isFetching: loadingDebts, error: debtsError, summary } = useDebts()

  const isEmpty = (summary?.count ?? 0) === 0

  const debts: DebtRecord[] = debtsData?.data || []

  const scrollViewRef = useRef<ScrollView | null>(null)
  const scrollViewProps: VAScrollViewProps = {
    scrollViewRef: scrollViewRef,
  }
  const [page, setPage] = useState(1)
  const { perPage, totalEntries } = {
    perPage: DEFAULT_PAGE_SIZE,
    totalEntries: debtsData?.data.length || 0,
  }
  const [debtsToShow, setDebtsToShow] = useState<DebtRecord[]>([])

  useEffect(() => {
    const debtsList = debtsData?.data?.slice((page - 1) * perPage, page * perPage)
    setDebtsToShow(debtsList || [])
  }, [debtsData, page, perPage])

  const helpIconProps: IconProps = {
    name: 'HelpOutline',
    fill: theme.colors.icon.active,
  }

  const headerButton = {
    label: t('help'),
    icon: helpIconProps,
    onPress: () => {
      navigateTo('DebtHelp')
    },
    testID: 'debtHelpID',
  }

  const debtDetailsClicked = (debt: DebtRecord) => {
    navigateTo('DebtDetails', { debt })
  }

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
      totalEntries: totalEntries,
      pageSize: perPage,
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

  function renderContent() {
    const listItems = debtsToShow.map((debt, idx) => {
      const debtInfo = getDebtInfo(t, debt)
      const iconProps: IconProps = {
        name: debtInfo.variant === 'info' ? 'Info' : 'Warning',
        fill: debtInfo.variant === 'info' ? theme.colors.icon.info : theme.colors.icon.warning,
      }
      const detailsPressableProps: PressableProps = {
        onPress: () => debtDetailsClicked(debt),
        accessible: true,
        accessibilityRole: 'link',
        accessibilityLabel: t('debts.reviewDetails'),
      }

      const mainContent = (
        <>
          {/* Header */}
          <TextView mb={theme.dimensions.condensedMarginBetween} variant="MobileBodyBold">
            {debtInfo.header}
          </TextView>
          {/* Balance */}
          <TextView mb={theme.dimensions.condensedMarginBetween} variant="MobileBody">
            <Trans
              i18nKey="debts.currentBalance.amount"
              components={{ bold: <TextView variant="MobileBodyBold" /> }}
              values={{ amount: debtInfo.balance }}
            />
          </TextView>
          {/* Summary with icon */}
          <Box flexDirection="row" alignItems="center">
            <Icon {...iconProps} />
            <Box ml={theme.dimensions.condensedMarginBetween} flexShrink={1}>
              <TextView variant="HelperText">
                <Trans
                  i18nKey={debtInfo.summaryKey}
                  components={{
                    // This handles bolding text
                    bold: <TextView variant="HelperTextBold" />,
                    // This handles phone number links
                    tel: <PhoneNumberComponent variant="inline" />,
                  }}
                  values={{
                    balance: debtInfo.balance,
                    endDate: debtInfo.endDate,
                  }}
                />
              </TextView>
            </Box>
          </Box>
          {/* Review details link */}
          <Pressable {...detailsPressableProps}>
            <Box
              display={'flex'}
              flexDirection={'row'}
              justifyContent={'space-between'}
              alignItems={'center'}
              minHeight={theme.dimensions.touchableMinHeight}
              pt={5}>
              <TextView flex={1} variant={'HelperTextBold'} color={'link'}>
                {t('debts.reviewDetails')}
              </TextView>
              <Icon
                name={'ChevronRight'}
                fill={theme.colors.icon.chevronListItem}
                width={theme.dimensions.chevronListItemWidth}
                height={theme.dimensions.chevronListItemHeight}
              />
            </Box>
          </Pressable>
          {/* Resolve debt button */}
          {debtInfo.resolvable && <ResolveDebtButton debt={debt} />}
        </>
      )
      return (
        <Box key={idx} pb={theme.dimensions.condensedMarginBetween}>
          <MultiTouchCard
            orderIdentifier={t('debts.orderIdentifier', { idx: idx + 1, total: debts.length })}
            mainContent={mainContent}
          />
        </Box>
      )
    })
    return (
      <Box mx={theme.dimensions.gutter}>
        <>
          <TextView mb={theme.dimensions.standardMarginBetween} variant="MobileBody">
            <Trans i18nKey="debts.subtitle" components={{ bold: <TextView variant="MobileBodyBold" /> }} />
          </TextView>
          {listItems}
        </>
      </Box>
    )
  }

  function serviceErrorAlert() {
    return (
      <AlertWithHaptics variant="error" header={t('debts.error.header')} description={t('debts.error.description')}>
        <ClickToCallPhoneNumber phone={t('8008270648')} displayedText={displayedTextPhoneNumber(t('8008270648'))} />
      </AlertWithHaptics>
    )
  }

  return (
    <FeatureLandingTemplate
      headerButton={headerButton}
      backLabel={t('payments.title')}
      backLabelOnPress={navigation.goBack}
      scrollViewProps={scrollViewProps}
      title={t('debts.title')}
      testID="debtsTestID"
      backLabelTestID="debtsBackTestID">
      {loadingDebts ? (
        <LoadingComponent text={t('debts.loading')} />
      ) : debtsError ? (
        serviceErrorAlert()
      ) : isEmpty ? (
        <EmptyStateMessage title={t('debts.empty.title')} body={t('debts.empty.body')} phone={t('8008270648')} />
      ) : (
        <>
          {renderContent()}
          {renderPagination()}
        </>
      )}
    </FeatureLandingTemplate>
  )
}

export default DebtsScreen
