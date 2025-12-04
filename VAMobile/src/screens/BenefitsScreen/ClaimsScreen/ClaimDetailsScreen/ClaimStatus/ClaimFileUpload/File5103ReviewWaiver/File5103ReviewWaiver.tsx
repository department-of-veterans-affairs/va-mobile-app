import React, { useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'

import { Button, ButtonVariants } from '@department-of-veterans-affairs/mobile-component-library'

import {
  AlertWithHaptics,
  Box,
  BoxProps,
  FieldType,
  FormFieldType,
  FormWrapper,
  TextView,
  VAScrollView,
} from 'components'
import { useSubtaskProps } from 'components/Templates/MultiStepSubtask'
import SubtaskTitle from 'components/Templates/SubtaskTitle'
import { NAMESPACE } from 'constants/namespaces'
import { FileRequestStackParams } from 'screens/BenefitsScreen/ClaimsScreen/ClaimDetailsScreen/ClaimStatus/ClaimFileUpload/FileRequestSubtask'
import { useTheme } from 'utils/hooks'

type File5103ReviewWaiverProps = StackScreenProps<FileRequestStackParams, 'File5103ReviewWaiver'>

function File5103ReviewWaiver({ navigation }: File5103ReviewWaiverProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  const { standardMarginBetween, cardPadding, contentMarginBottom, gutter } = theme.dimensions
  const [confirmed, setConfirmed] = useState(false)
  const [formContainsError, setFormContainsError] = useState(false)
  const [onSaveClicked, setOnSaveClicked] = useState(false)

  useSubtaskProps({
    leftButtonText: t('back'),
    onLeftButtonPress: () => navigation.goBack(),
    leftButtonTestID: 'file5103RequestDetailsBackID',
  })

  const borderStyles: BoxProps = {
    borderStyle: 'solid',
    borderBottomWidth: 'default',
    borderBottomColor: 'primary',
    borderTopWidth: 'default',
    borderTopColor: 'primary',
  }

  const formFieldsList: Array<FormFieldType<unknown>> = [
    {
      fieldType: FieldType.Selector,
      fieldProps: {
        labelKey: 'claimDetails.5103.review.waiver.confirmation',
        selected: confirmed,
        onSelectionChange: setConfirmed,
        a11yHint: t('claimDetails.5103.review.waiver.confirmation'),
        isRequiredField: true,
        testID: 'checkBox',
      },
      fieldErrorMessage: t('claimDetails.5103.review.waiver.confirmation.error.checkbox'),
    },
  ]

  const onSave = (): void => {
    setOnSaveClicked(true)
    return
  }

  return (
    <VAScrollView testID="file5103ReviewWaiverID">
      {formContainsError && (
        <Box mb={standardMarginBetween}>
          <AlertWithHaptics
            variant="error"
            description={t('claimDetails.5103.review.waiver.confirmation.error.alert')}
            focusOnError={onSaveClicked}
          />
        </Box>
      )}
      <SubtaskTitle title={t('claimDetails.5103.review.waiver')} />
      <Box mb={contentMarginBottom} flex={1}>
        <Box backgroundColor="contentBox" {...borderStyles}>
          <TextView p={cardPadding} variant="MobileBody">
            {t('claimDetails.5103.review.waiver.body1')}
          </TextView>
          <TextView px={cardPadding} mb={theme.dimensions.condensedMarginBetween} variant="MobileBody">
            <Trans
              i18nKey="claimDetails.5103.review.waiver.body2"
              components={{ bold: <TextView variant="MobileBodyBold" /> }}
            />
          </TextView>
        </Box>

        <Box mt={standardMarginBetween} mx={gutter}>
          <FormWrapper
            fieldsList={formFieldsList}
            onSave={onSave}
            setFormContainsError={setFormContainsError}
            onSaveClicked={onSaveClicked}
            setOnSaveClicked={setOnSaveClicked}
          />
        </Box>

        <Box p={cardPadding}>
          <Button buttonType={ButtonVariants.Primary} label={t('claimDetails.5103.submit.waiver')} onPress={onSave} />
        </Box>
      </Box>
    </VAScrollView>
  )
}

export default File5103ReviewWaiver
