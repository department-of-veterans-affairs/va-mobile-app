import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Animated, Dimensions, Image, Pressable, ScrollView, StyleSheet } from 'react-native'
import { Asset, ImagePickerResponse } from 'react-native-image-picker/src/types'
import { SharedElement, SharedElementNode, SharedElementTransition } from 'react-native-shared-element'

import { StackActions } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'

import { Button } from '@department-of-veterans-affairs/mobile-component-library'
import _ from 'underscore'

import { useClaim, useUploadFileToClaim } from 'api/claimsAndAppeals'
import { ClaimEventData, UploadFileToClaimParamaters } from 'api/types'
import {
  AlertWithHaptics,
  Box,
  FieldType,
  FormFieldType,
  FormWrapper,
  LoadingComponent,
  PhotoAdd,
  PhotoPreview,
  TextView,
} from 'components'
import { SnackbarMessages } from 'components/SnackBar'
import FullScreenSubtask from 'components/Templates/FullScreenSubtask'
import { Events } from 'constants/analytics'
import { MAX_NUM_PHOTOS } from 'constants/claims'
import { DocumentTypes526 } from 'constants/documentTypes'
import { NAMESPACE } from 'constants/namespaces'
import { BenefitsStackParamList } from 'screens/BenefitsScreen/BenefitsStackScreens'
import { logAnalyticsEvent } from 'utils/analytics'
import { deletePhoto, onAddPhotos } from 'utils/claims'
import { bytesToFinalSizeDisplay, bytesToFinalSizeDisplayA11y } from 'utils/common'
import { showSnackBar } from 'utils/common'
import {
  useAppDispatch,
  useBeforeNavBackListener,
  useDestructiveActionSheet,
  useOrientation,
  useRouteNavigation,
  useShowActionSheet,
  useTheme,
} from 'utils/hooks'
import { getWaygateToggles } from 'utils/waygateConfig'

type UploadOrAddPhotosProps = StackScreenProps<BenefitsStackParamList, 'UploadOrAddPhotos'>

function UploadOrAddPhotos({ navigation, route }: UploadOrAddPhotosProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const showActionSheetWithOptions = useShowActionSheet()
  const { claimID, request: originalRequest, firstImageResponse } = route.params
  const { data: claim } = useClaim(claimID)
  const [filesUploadedSuccess, setFilesUploadedSuccess] = useState(false)
  const dispatch = useAppDispatch()
  const isPortrait = useOrientation()
  const [imagesList, setImagesList] = useState(firstImageResponse.assets)
  const { mutate: uploadFileToClaim, isPending: loadingFileUpload } = useUploadFileToClaim(
    claimID,
    originalRequest,
    imagesList,
  )
  const [progress, setProgress] = useState(new Animated.Value(0))
  const [isScene2Visible, setIsScene2Visible] = useState(false)
  const [isInProgress, setIsInProgress] = useState(false)
  const [scene2Ancestor, setScene2Ancestor] = useState<SharedElementNode | null>(null)
  const [scene2Node, setScene2Node] = useState<SharedElementNode | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [totalBytesUsed, setTotalBytesUsed] = useState(
    firstImageResponse.assets?.reduce((total, asset) => (total += asset.fileSize || 0), 0),
  )
  const [assetImage, setAssetImage] = useState<Asset | undefined>(undefined)
  const [assetIndex, setAssetIndex] = useState(0)
  const confirmAlert = useDestructiveActionSheet()
  const navigateTo = useRouteNavigation()
  const [request, setRequest] = useState<ClaimEventData>(originalRequest)
  const scrollViewRef = useRef<ScrollView>(null)
  const snackbarMessages: SnackbarMessages = {
    successMsg: t('fileUpload.submitted'),
    errorMsg: t('fileUpload.submitted.error'),
  }

  const onPressNavigate = (asset: Asset, index: number) => {
    setIsScene2Visible(true)
    setIsInProgress(true)
    setAssetImage(asset)
    setAssetIndex(index)
    Animated.timing(progress, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => setIsInProgress(false))
  }

  const onPressBack = () => {
    setIsInProgress(true)
    Animated.timing(progress, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      setIsScene2Visible(false)
      setIsInProgress(false)
    })
    setAssetImage(undefined)
  }

  const waygate = getWaygateToggles().WG_UploadOrAddPhotos

  useBeforeNavBackListener(navigation, (e) => {
    if (imagesList?.length === 0 || filesUploadedSuccess || (!waygate.enabled && waygate.type === 'DenyContent')) {
      return
    }
    e.preventDefault()
    confirmAlert({
      title: t('fileUpload.discard.confirm.title.photos'),
      message: t('fileUpload.discard.confirm.message.photos'),
      cancelButtonIndex: 0,
      destructiveButtonIndex: 1,
      buttons: [
        {
          text: t('fileUpload.continueUpload'),
        },

        {
          text: t('fileUpload.cancelUpload'),
          onPress: () => {
            navigation.dispatch(e.data.action)
          },
        },
      ],
    })
  })

  useEffect(() => {
    if (filesUploadedSuccess) {
      navigateTo('FileRequest', { claimID: claim?.id || '', claim })
    }
  }, [filesUploadedSuccess, claim, navigateTo])

  const [documentType, setDocumentType] = useState('')
  const [onSaveClicked, setOnSaveClicked] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  useEffect(() => {
    setRequest((prevRequest) => {
      return {
        ...prevRequest,
        documentType,
      }
    })
  }, [documentType])

  const onUploadConfirmed = () => {
    logAnalyticsEvent(
      Events.vama_evidence_cont_3(claim?.id || '', request.trackedItemId || null, request.type, 'photo'),
    )
    const mutateOptions = {
      onMutate: () => {
        logAnalyticsEvent(Events.vama_claim_upload_start(claimID, request.trackedItemId || null, request.type, 'photo'))
      },
      onSuccess: () => {
        setImagesList([])
        setFilesUploadedSuccess(true)
        logAnalyticsEvent(Events.vama_claim_upload_compl(claimID, request.trackedItemId || null, request.type, 'photo'))
        showSnackBar(snackbarMessages.successMsg, dispatch, undefined, true)
      },
      onError: () => showSnackBar(snackbarMessages.errorMsg, dispatch, onUploadConfirmed, false, true),
    }
    const params: UploadFileToClaimParamaters = { claimID, request, files: imagesList || [] }
    uploadFileToClaim(params, mutateOptions)
  }

  const onUpload = (): void => {
    const totalSize = imagesList?.reduce((sum, image) => sum + (image.fileSize || 0), 0)
    logAnalyticsEvent(
      Events.vama_evidence_cont_2(
        claim?.id || '',
        request.trackedItemId || null,
        request.type,
        'photo',
        totalSize || 0,
        imagesList?.length || 0,
      ),
    )

    confirmAlert({
      title: t('fileUpload.submit.confirm.title'),
      message: t('fileUpload.submit.confirm.message'),
      cancelButtonIndex: 0,
      buttons: [
        {
          text: t('cancel'),
        },
        {
          text: t('fileUpload.submit'),
          onPress: onUploadConfirmed,
        },
      ],
    })
  }

  const onDocumentTypeChange = (selectedType: string) => {
    const typeLabel = DocumentTypes526.filter((type) => type.value === selectedType)[0]?.label || selectedType
    logAnalyticsEvent(
      Events.vama_evidence_type(claim?.id || '', request.trackedItemId || null, request.type, 'photo', typeLabel),
    )
    setDocumentType(selectedType)
  }

  const onCheckboxChange = (isChecked: boolean) => {
    if (isChecked) {
      logAnalyticsEvent(
        Events.vama_evidence_conf(claim?.id || '', request.trackedItemId || null, request.type, 'photo'),
      )
    }
    setConfirmed(isChecked)
  }

  const pickerField: Array<FormFieldType<unknown>> = [
    {
      fieldType: FieldType.Picker,
      fieldProps: {
        selectedValue: documentType,
        onSelectionChange: onDocumentTypeChange,
        pickerOptions: DocumentTypes526,
        labelKey: 'fileUpload.documentType',
        isRequiredField: true,
        disabled: false,
      },
      fieldErrorMessage: t('fileUpload.documentType.fieldError'),
    },
    {
      fieldType: FieldType.Selector,
      fieldProps: {
        labelKey: 'fileUpload.evidenceOnlyPhoto',
        selected: confirmed,
        onSelectionChange: onCheckboxChange,
        isRequiredField: true,
      },
      fieldErrorMessage: t('fileUpload.evidenceOnly.error'),
    },
  ]

  const displayImages = (): ReactElement => {
    const { condensedMarginBetween, gutter } = theme.dimensions
    /** Need to subtract gutter margins and margins between pics before dividing screen width by 3 to get the width of each image*/
    const calculatedWidth =
      ((isPortrait ? Dimensions.get('window').width : Dimensions.get('window').height) -
        2 * gutter -
        2 * condensedMarginBetween) /
      3

    const uploadedImages = (): ReactElement[] => {
      return _.map(imagesList || [], (asset, index) => {
        return (
          /** Rightmost photo doesn't need right margin b/c of gutter margins
           * Every 3rd photo, right margin is changed to zero*/
          <Box mt={condensedMarginBetween} mr={condensedMarginBetween} key={index}>
            <PhotoPreview
              width={calculatedWidth}
              height={calculatedWidth}
              image={asset}
              onPress={() => {
                onPressNavigate(asset, index)
              }}
              photoPosition={t(
                imagesList && imagesList?.length > 1 ? 'fileUpload.ofTotalPhotos' : 'fileUpload.ofTotalPhoto',
                {
                  photoNum: index + 1,
                  totalPhotos: imagesList?.length,
                },
              )}
            />
          </Box>
        )
      })
    }

    return (
      <Box display="flex" flexDirection="row" flexWrap="wrap" pl={gutter} pr={condensedMarginBetween}>
        {uploadedImages()}
        {(!imagesList || imagesList.length < MAX_NUM_PHOTOS) && (
          <Box mt={condensedMarginBetween}>
            <PhotoAdd
              width={calculatedWidth}
              height={calculatedWidth}
              onPress={(): void => {
                onAddPhotos(
                  t,
                  showActionSheetWithOptions,
                  setErrorMessage,
                  callbackIfUri,
                  totalBytesUsed || 0,
                  claim?.id || '',
                  request,
                )
              }}
            />
          </Box>
        )}
      </Box>
    )
  }

  const callbackIfUri = (response: ImagePickerResponse): void => {
    if (!snackBar) {
      logAnalyticsEvent(Events.vama_snackbar_null('Claim add photos'))
    }
    snackBar?.hideAll()
    if (response && response.assets && response.assets.length + (imagesList?.length || 0) > MAX_NUM_PHOTOS) {
      setErrorMessage(t('fileUpload.tooManyPhotosError'))
    } else {
      const imagesCopy = imagesList
      response.assets?.forEach((asset) => {
        imagesCopy?.push(asset)
      })
      setImagesList(imagesCopy)
      let fileSizeAdded = 0
      response.assets?.forEach((asset) => {
        if (asset.fileSize) {
          fileSizeAdded = fileSizeAdded + asset.fileSize
        }
      })
      if (fileSizeAdded && totalBytesUsed) {
        setTotalBytesUsed(totalBytesUsed + fileSizeAdded)
      }
    }
  }

  const deleteCallbackIfUri = (response: Asset[]): void => {
    if (response.length === 0) {
      setImagesList([])
      showSnackBar(t('photoRemoved'), dispatch, undefined, true, false, false)
      navigateTo('TakePhotos', { claimID: claim?.id || '', request, focusOnSnackbar: true })
    } else {
      setErrorMessage('')
      setImagesList(response)
      let bytesUsed = 0
      response.forEach((image) => {
        if (image.fileSize) {
          bytesUsed = bytesUsed + image.fileSize
        }
      })
      setTotalBytesUsed(bytesUsed)
      showSnackBar(t('photoRemoved'), dispatch, undefined, true, false, false)
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.main,
    },
    scene: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      resizeMode: 'cover',
      width: Dimensions.get('window').width,
      height: 300,
      borderRadius: 0,
    },
  })

  return (
    <FullScreenSubtask
      scrollViewRef={scrollViewRef}
      leftButtonText={t('cancel')}
      title={t('fileUpload.uploadPhotos')}
      onLeftButtonPress={() => {
        logAnalyticsEvent(
          Events.vama_evidence_cancel_2(claim?.id || '', request.trackedItemId || null, request.type, 'photo'),
        )
        navigation.dispatch(StackActions.pop(2))
      }}>
      {loadingFileUpload ? (
        <LoadingComponent text={t('fileUpload.loading')} />
      ) : (
        <Box mb={theme.dimensions.contentMarginBottom}>
          {!!errorMessage && (
            <Box mb={theme.dimensions.standardMarginBetween}>
              <AlertWithHaptics
                variant="error"
                header={t('fileUpload.PhotosNotUploaded')}
                description={errorMessage}
                scrollViewRef={scrollViewRef}
                focusOnError={onSaveClicked}
              />
            </Box>
          )}
          <TextView variant="MobileBodyBold" accessibilityRole="header" mx={theme.dimensions.gutter}>
            {request.displayName}
          </TextView>
          <Box
            backgroundColor={'contentBox'}
            borderTopWidth={1}
            borderTopColor="primary"
            borderBottomWidth={1}
            borderBottomColor="primary"
            pt={theme.dimensions.standardMarginBetween}
            pb={theme.dimensions.standardMarginBetween}
            display="flex"
            flexDirection="row"
            flexWrap="wrap">
            {displayImages()}
          </Box>
          <Box
            justifyContent="space-between"
            flexDirection="row"
            flexWrap="wrap"
            mx={theme.dimensions.gutter}
            mt={theme.dimensions.condensedMarginBetween}
            mb={theme.dimensions.standardMarginBetween}>
            <TextView variant="HelperText">{t('fileUpload.ofTenPhotos', { numOfPhotos: imagesList?.length })}</TextView>
            <TextView
              variant="HelperText"
              accessibilityLabel={t('fileUpload.ofFiftyMB.a11y', {
                sizeOfPhotos: bytesToFinalSizeDisplayA11y(totalBytesUsed ? totalBytesUsed : 0, t, false),
              })}>
              {t('fileUpload.ofFiftyMB', {
                sizeOfPhotos: bytesToFinalSizeDisplay(totalBytesUsed ? totalBytesUsed : 0, t, false),
              })}
            </TextView>
          </Box>
          <Box mx={theme.dimensions.gutter}>
            <FormWrapper
              fieldsList={pickerField}
              onSave={onUpload}
              onSaveClicked={onSaveClicked}
              setOnSaveClicked={setOnSaveClicked}
            />
            <Box mt={theme.dimensions.textAndButtonLargeMargin}>
              <Button
                onPress={() => {
                  setOnSaveClicked(true)
                }}
                label={t('fileUpload.submit')}
                testID={t('fileUpload.submit')}
              />
            </Box>
          </Box>
          {isScene2Visible ? (
            <Animated.View
              style={{
                ...StyleSheet.absoluteFillObject,
                transform: [
                  {
                    scale: Animated.multiply(0.5, Animated.add(progress, 1)),
                  },
                ],
              }}>
              <SharedElement style={styles.scene} onNode={setScene2Ancestor}>
                <SharedElement onNode={setScene2Node}>
                  <Pressable style={styles.container} onPress={onPressBack}>
                    <Image style={styles.image} source={assetImage} />
                    <TextView
                      variant="MobileBody"
                      mx={theme.dimensions.gutter}
                      mt={theme.dimensions.standardMarginBetween}>
                      {t('fileUpload.fileSize')}
                      <TextView
                        variant="MobileBody"
                        accessibilityLabel={
                          assetImage?.fileSize ? bytesToFinalSizeDisplayA11y(assetImage?.fileSize, t, false) : undefined
                        }>
                        {assetImage?.fileSize ? bytesToFinalSizeDisplay(assetImage?.fileSize, t, false) : undefined}
                      </TextView>
                    </TextView>
                    <TextView
                      variant="MobileBody"
                      mx={theme.dimensions.gutter}
                      my={theme.dimensions.standardMarginBetween}>
                      {t('fileUpload.fileName')}
                      <TextView variant="MobileBody">{assetImage?.fileName}</TextView>
                    </TextView>
                    <Box mx={theme.dimensions.gutter}>
                      <Button
                        label={t('fileUpload.deletePhoto')}
                        a11yHint={t('fileUpload.deletePhoto.a11yHint')}
                        onPress={() => {
                          confirmAlert({
                            title: t('removePhoto'),
                            cancelButtonIndex: 0,
                            destructiveButtonIndex: 1,
                            buttons: [
                              {
                                text: t('keep'),
                              },
                              {
                                text: t('remove'),
                                onPress: () => {
                                  setProgress(new Animated.Value(0))
                                  setIsScene2Visible(false)
                                  deletePhoto(deleteCallbackIfUri, assetIndex, imagesList || [])
                                },
                              },
                            ],
                          })
                        }}
                      />
                    </Box>
                  </Pressable>
                </SharedElement>
              </SharedElement>
            </Animated.View>
          ) : undefined}
          {isInProgress ? (
            <Box>
              <SharedElementTransition
                start={{
                  node: null,
                  ancestor: null,
                }}
                end={{
                  node: scene2Node,
                  ancestor: scene2Ancestor,
                }}
                position={progress}
                animation="fade-out"
                resize="auto"
                align="auto"
              />
            </Box>
          ) : undefined}
        </Box>
      )}
    </FullScreenSubtask>
  )
}

export default UploadOrAddPhotos
