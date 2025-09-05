import React, { Dispatch, FC, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal, Pressable, PressableProps, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Button, ButtonVariants } from '@department-of-veterans-affairs/mobile-component-library'

import { Box, BoxProps, RadioGroup, TextView, TextViewProps, VAScrollView, radioOption } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { setAccessibilityFocus } from 'utils/accessibility'
import { useTheme } from 'utils/hooks'
import { TravelPayClaimData } from 'api/types'
import { SortOption, SortOptionType } from 'screens/HealthScreen/TravelPay/TravelPayClaims/TravelPayClaimsFilter'
import TravelClaimsFilterCheckboxGroup from './TravelClaimsFilterCheckboxGroup'

export const FILTER_KEY_ALL = 'all';

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

  const filterOptions = useMemo(() => {
    // Allow filtering by any of the statuses that appear in the list, and 'All'
    const statusToCount: Map<string, number> = new Map()
      claims.forEach((claim) => {
        const status = claim.attributes.claimStatus
        const existingCount = statusToCount.get(status) ?? 0
        statusToCount.set(status, existingCount + 1)
      })

      const options = Array.from(statusToCount.keys()).map((status) => ({
        optionLabelKey: `${status} (${statusToCount.get(status)!})`,
        value: status,
      }))

      options.sort((a, b) => (a.optionLabelKey > b.optionLabelKey ? 1 : -1))
      options.unshift({
        optionLabelKey: `${t('travelPay.statusList.filterOption.all')} (${totalClaims})`,
        value: FILTER_KEY_ALL,
      })

      return options
  }, [claims])

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
    setAccessibilityFocus(ref)

    // Reset selections to what they were when the modal appeared
    setSelectedFilter(currentFilter)
    setSelectedSortBy(currentSortBy)
  }

  const onApplyPressed = () => {
    setModalVisible(false)
    setCurrentFilter(selectedFilter)
    setCurrentSortBy(selectedSortBy)
    setAccessibilityFocus(ref)
  }

  const toggleFilter = (filterKey: string) => {
    setSelectedFilter(prevFilter => {
      // If selecting 'all', then:
      // 1. if 'all' is already selected, then selecting it again will deselect everything
      // 2. if 'all' is not already selected, then selecting it will select everything
      if (filterKey === FILTER_KEY_ALL) {
        return prevFilter.has(FILTER_KEY_ALL)
        ? new Set()
        : new Set([FILTER_KEY_ALL, ...claims.map(claim => claim.attributes.claimStatus)])
      }

      // Normal toggle behavior
      return prevFilter.has(filterKey)
        ? new Set([...prevFilter].filter(key => key !== filterKey))
        : new Set([...prevFilter, filterKey]);
    })
  };

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
              <Pressable onPress={onCancelPressed}
                accessible
                accessibilityRole="button"
                accessibilityHint={t('cancel.picker.a11yHint')}
                testID="filterButtonCancelTestID"
              >
                <TextView
                  variant="MobileBody"
                  color="showAll"
                  allowFontScaling={false}
                >
                  {t('cancel')}
                </TextView>
              </Pressable>
              <Box flex={4}>
                <TextView
                  variant="MobileBodyBold"
                  accessibilityRole={'header'}
                  textAlign={'center'}
                  allowFontScaling={false}
                >
                    {t('travelPay.statusList.filterAndSort')}
                </TextView>
              </Box>
              <Pressable
                onPress={onApplyPressed}
                accessible
                accessibilityRole={'button'}
                accessibilityHint={t('done.picker.a11yHint')}
                testID={'filterButtonApplyTestID'}
              >
                <TextView
                  variant="MobileBody"
                  color="showAll"
                  allowFontScaling={false}
                >
                  {t('apply')}
                </TextView>
              </Pressable>
            </Box>
            {showScrollView && (
              <VAScrollView testID="travelClaimsFilterModalTestId" bounces={false}>
                {/* Less margin on the first group to account for the title margin already there. */}
                <Box key="filterGroup" mt={-theme.dimensions.condensedMarginBetween}>
                  <TravelClaimsFilterCheckboxGroup
                    options={filterOptions}
                    onChange={toggleFilter}
                    listTitle={t('travelPay.statusList.filterBy')}
                    selectedValues={selectedFilter}
                  />
                </Box>
                <Box key="sortGroup">
                  <RadioGroup
                    options={[
                      { optionLabelKey: t('travelPay.statusList.sortOption.recent'), value: SortOption.Recent },
                      { optionLabelKey: t('travelPay.statusList.sortOption.oldest'), value: SortOption.Oldest },
                    ]}
                    onChange={setSelectedSortBy}
                    isRadioList={true}
                    radioListTitle={t('travelPay.statusList.sortBy')}
                    value={selectedSortBy}
                  />
                </Box>
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
