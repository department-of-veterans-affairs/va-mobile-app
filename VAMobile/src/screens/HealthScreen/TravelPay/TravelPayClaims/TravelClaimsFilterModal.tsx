import React, { Dispatch, FC, SetStateAction, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal, Pressable, PressableProps, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Button, ButtonVariants } from '@department-of-veterans-affairs/mobile-component-library'

import { Box, BoxProps, RadioGroup, TextView, TextViewProps, VAScrollView, radioOption } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { setAccessibilityFocus } from 'utils/accessibility'
import { useTheme } from 'utils/hooks'
import { TravelPayClaimData } from 'api/types'
import { SortOption, SortOptionType } from 'screens/HealthScreen/TravelPay/TravelPayClaims/TravelClaimsFilter'
import TravelClaimsFilterCheckboxGroup from './TravelClaimsFilterCheckboxGroup'

type TravelClaimsFilterModalProps = {
  claims: Array<TravelPayClaimData>
  currentFilter: Set<string>,
  setCurrentFilter: Dispatch<SetStateAction<Set<string>>>,
  currentSortBy: SortOptionType,
  setCurrentSortBy: Dispatch<SetStateAction<SortOptionType>>,
}

const TravelClaimsFilterModal: FC<TravelClaimsFilterModalProps> = ({
  claims,
  currentFilter,
  setCurrentFilter,
  currentSortBy,
  setCurrentSortBy,
}) => {
  const [modalVisible, setModalVisible] = useState(false)
  const [showScrollView, setShowScrollView] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState<Set<string>>(currentFilter);
  const [selectedSortBy, setSelectedSortBy] = useState(currentSortBy);

  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const insets = useSafeAreaInsets()
  const ref = useRef(null)

  const totalClaims = claims.length

  // Allow filtering by any of the statuses that appear in the list, and 'All'
  const statusToCount: Map<string, number> = new Map()
  claims.forEach((claim) => {
    const status = claim.attributes.claimStatus
    const existingCount = statusToCount.get(status) ?? 0
    statusToCount.set(status, existingCount + 1)
  })

  const filterOptions = Array.from(statusToCount.keys()).map((status) => ({
    optionLabelKey: `${status} (${statusToCount.get(status)!})`,
    value: status,
  }))

  filterOptions.sort((a, b) => (a.optionLabelKey > b.optionLabelKey ? 1 : -1))
  filterOptions.unshift({
    optionLabelKey: `${t('travelPay.statusList.filterOption.all')} (${totalClaims})`,
    value: 'all',
  }) // TODO: Union const

  // Workaround to fix issue with ScrollView nested inside a Modal - affects Android
  // https://github.com/facebook/react-native/issues/48822
  useEffect(() => {
    if (modalVisible) {
      const timeout = setTimeout(() => setShowScrollView(true), 50)
      return () => clearTimeout(timeout)
    } else {
      setShowScrollView(false)
    }
  }, [modalVisible])

  const showModal = () => {
    setModalVisible(true)
    // onShowAnalyticsFn && onShowAnalyticsFn()
  }

  const onCancelPressed = () => {
    setModalVisible(false)
    // onCancel && onCancel()
    setAccessibilityFocus(ref)
  }

  const onApplyPressed = () => {
    setModalVisible(false)
    setCurrentFilter(selectedFilter)
    setCurrentSortBy(selectedSortBy)
    setAccessibilityFocus(ref)
  }

  const toggleFilter = (filterKey: string) => { // TODO: use callback?
    setSelectedFilter(prevFilter => {
      // If selecting 'all', then:
      // 1. if 'all' is already selected, then selecting it again will deselect everything
      // 2. if 'all' is not already selected, then selecting it will select everything
      if (filterKey === 'all') {
        return prevFilter.has('all')
        ? new Set()
        : new Set(['all', ...claims.map(claim => claim.attributes.claimStatus)])
      }

      // Normal toggle behavior
      return prevFilter.has(filterKey)
        ? new Set([...prevFilter].filter(key => key !== filterKey))
        : new Set([...prevFilter, filterKey]);
    })
  }

  const filterGroup = {
    items: filterOptions,
    onSetOption: (filterKey: string) => toggleFilter(filterKey),
    selectedValues: selectedFilter,
    title: t('travelPay.statusList.filterBy'),
    type: 'checkbox',
  }

  const sortGroup = {
    items: [
      { optionLabelKey: t('travelPay.statusList.sortOption.recent'), value: SortOption.Recent },
      { optionLabelKey: t('travelPay.statusList.sortOption.oldest'), value: SortOption.Oldest },
    ],
    onSetOption: (sortBy: SortOptionType) => {
      console.log('setting sort by: ', sortBy)
      setSelectedSortBy(sortBy)
    },
    selectedValue: selectedSortBy,
    title: t('travelPay.statusList.sortBy'),
    type: 'radio',
  }

  const groups = [
    // Less margin on the first group to account for the title margin already there.
    <Box key="filterGroup" mt={-theme.dimensions.condensedMarginBetween}>
      <TravelClaimsFilterCheckboxGroup
        options={filterGroup.items}
        onChange={filterGroup.onSetOption}
        radioListTitle={filterGroup.title}
        selectedValues={selectedFilter}
      />
    </Box>,
    <Box key="sortGroup">
      <RadioGroup
        options={sortGroup.items}
        onChange={sortGroup.onSetOption}
        isRadioList={true}
        radioListTitle={sortGroup.title}
        value={sortGroup.selectedValue}
      />
    </Box>
  ]

  const actionsBarBoxProps: BoxProps = {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'list',
    minHeight: theme.dimensions.touchableMinHeight,
    borderBottomColor: 'menuDivider',
    borderBottomWidth: 1,
    py: theme.dimensions.buttonPadding,
    px: theme.dimensions.gutter,
    ml: insets.left,
    mr: insets.right,
  }

  const commonButtonProps: TextViewProps = {
    variant: 'MobileBody',
    color: 'showAll',
    allowFontScaling: false,
  }

  const cancelButtonProps: PressableProps = {
    accessible: true,
    accessibilityRole: 'button',
    accessibilityHint: t('cancel.picker.a11yHint'),
    testID: 'radioButtonCancelTestID',
  }

  const applyButtonProps: PressableProps = {
    accessible: true,
    accessibilityRole: 'button',
    accessibilityHint: t('done.picker.a11yHint'),
    testID: 'radioButtonApplyTestID',
  }

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        supportedOrientations={['portrait', 'landscape']}
        onRequestClose={() => {
          setModalVisible(!modalVisible)
        }}>
        <Box flex={1} flexDirection="column" accessibilityViewIsModal={true}>
          <Box backgroundColor="modalOverlay" opacity={0.8} pt={insets.top} />
          <Box backgroundColor="list" pb={insets.bottom} flex={1}>
            <Box {...actionsBarBoxProps}>
              <Pressable onPress={onCancelPressed} {...cancelButtonProps}>
                <TextView {...commonButtonProps}>{t('cancel')}</TextView>
              </Pressable>
              <Box flex={4}>
                <TextView
                  variant="MobileBodyBold"
                  accessibilityRole={'header'}
                  textAlign={'center'}
                  allowFontScaling={false}>
                    {t('travelPay.statusList.filterAndSort')}
                </TextView>
              </Box>
              <Pressable onPress={onApplyPressed} {...applyButtonProps}>
                <TextView {...commonButtonProps}>{t('apply')}</TextView>
              </Pressable>
            </Box>
            {showScrollView && (
              <VAScrollView testID="travelClaimsFilterModalTestId" bounces={false}>
                {groups}
              </VAScrollView>
            )}
          </Box>
        </Box>
      </Modal>
      <View
        ref={ref}
        accessibilityRole="button"
        accessibilityLabel={t('travelPay.statusList.filterAndSort')}
        accessibilityHint={t('travelPay.statusList.filterAndSort')}>
        <Button
          onPress={showModal} label={t('travelPay.statusList.filterAndSort')}
          buttonType={ButtonVariants.Secondary}
          testID="travelClaimsFilterModalButtonTestId"
        />
      </View>
    </View>
  )
}

export default TravelClaimsFilterModal
