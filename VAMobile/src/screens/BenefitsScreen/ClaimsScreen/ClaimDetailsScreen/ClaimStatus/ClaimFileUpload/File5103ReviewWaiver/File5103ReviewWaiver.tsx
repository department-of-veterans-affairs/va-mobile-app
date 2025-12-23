import React, { useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'

import { Button, ButtonVariants, useSnackbar } from '@department-of-veterans-affairs/mobile-component-library'

import { useClaim, useSubmitClaimDecision } from 'api/claimsAndAppeals'
import {
  AlertWithHaptics,
  Box,
  BoxProps,
  ErrorComponent,
  FieldType,
  FormFieldType,
  FormWrapper,
  LoadingComponent,
  TextView,
  VAScrollView,
} from 'components'
import { useSubtaskProps } from 'components/Templates/MultiStepSubtask'
import SubtaskTitle from 'components/Templates/SubtaskTitle'
import { Events } from 'constants/analytics'
import { ClaimTypeConstants } from 'constants/claims'
import { NAMESPACE } from 'constants/namespaces'
import { FileRequestStackParams } from 'screens/BenefitsScreen/ClaimsScreen/ClaimDetailsScreen/ClaimStatus/ClaimFileUpload/FileRequestSubtask'
import { ScreenIDTypesConstants } from 'store/api'
import { logAnalyticsEvent } from 'utils/analytics'
import { numberOfItemsNeedingAttentionFromVet } from 'utils/claims'
import { useRouteNavigation, useShowActionSheet, useTheme } from 'utils/hooks'

type File5103ReviewWaiverProps = StackScreenProps<FileRequestStackParams, 'File5103ReviewWaiver'>

function File5103ReviewWaiver({ navigation, route }: File5103ReviewWaiverProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const snackbar = useSnackbar()

  const { claimID } = route.params

  const { data: claim, error: loadingClaimError, refetch: refetchClaim, isFetching: loadingClaim } = useClaim(claimID)
  const {
    mutate: submitClaimDecision,
    error: error,
    isPending: loadingSubmitClaimDecision,
  } = useSubmitClaimDecision(claimID)
  const { standardMarginBetween, cardPadding, contentMarginBottom, gutter } = theme.dimensions

  const [submittedDecision, setSubmittedDecision] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [formContainsError, setFormContainsError] = useState(false)
  const [onSaveClicked, setOnSaveClicked] = useState(false)
  const submitWaiverAlert = useShowActionSheet()
  const navigateTo = useRouteNavigation()

  const navigateToClaimsDetailsPage = submittedDecision && !error
  const isClosedClaim = claim?.attributes.decisionLetterSent && !claim?.attributes.open
  const claimType = isClosedClaim ? ClaimTypeConstants.CLOSED : ClaimTypeConstants.ACTIVE
  const numberOfRequests = numberOfItemsNeedingAttentionFromVet(claim?.attributes.eventsTimeline || [])

  useSubtaskProps({
    leftButtonText: t('back'),
    onLeftButtonPress: () => navigation.goBack(),
    leftButtonTestID: 'file5103RequestDetailsBackID',
  })

  useEffect(() => {
    if (navigateToClaimsDetailsPage) {
      navigateTo('ClaimDetailsScreen', { claimID, claimType })
    }
  }, [navigateToClaimsDetailsPage, navigateTo, claimID, claimType])

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

  const onSubmit = (): void => {
    if (claim) {
      logAnalyticsEvent(Events.vama_claim_eval_conf(claim.id, claim.attributes.claimType, numberOfRequests))
    }
    const mutateOptions = {
      onSuccess: () => {
        setSubmittedDecision(true)
        snackbar.show(t('claimDetails.5103.review.waiver.submitted'))
      },
      onError: () =>
        snackbar.show(t('claimDetails.5103.review.waiver.submitted.error'), {
          isError: true,
          offset: theme.dimensions.snackBarBottomOffset,
          onActionPressed: () => onSubmit,
        }),
    }
    submitClaimDecision(claimID, mutateOptions)
  }

  const onSave = (): void => {
    if (claim) {
      logAnalyticsEvent(Events.vama_claim_eval_submit(claim.id, claim.attributes.claimType, numberOfRequests))
    }

    const options = [t('claimDetails.5103.submit.waiver'), t('cancel')]
    submitWaiverAlert(
      {
        options,
        title: t('claimDetails.5103.review.waiver.alertTitle'),
        cancelButtonIndex: 1,
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            onSubmit()
            break
        }
      },
    )
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

      {loadingSubmitClaimDecision || loadingClaim ? (
        <LoadingComponent
          text={loadingSubmitClaimDecision ? t('askForClaimDecision.loading') : t('claimInformation.loading')}
        />
      ) : loadingClaimError ? (
        <ErrorComponent
          screenID={ScreenIDTypesConstants.ASK_FOR_CLAIM_DECISION_SCREEN_ID}
          error={loadingClaimError}
          onTryAgain={refetchClaim}
        />
      ) : (
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
            <Button
              buttonType={ButtonVariants.Primary}
              label={t('claimDetails.5103.submit.waiver')}
              onPress={() => setOnSaveClicked(true)}
            />
          </Box>
        </Box>
      )}
    </VAScrollView>
  )
}

export default File5103ReviewWaiver
