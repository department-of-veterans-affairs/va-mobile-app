import React, { ReactElement } from 'react'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import { Asset, ImagePickerResponse } from 'react-native-image-picker/src/types'

import { Icon } from '@department-of-veterans-affairs/mobile-component-library'
import { ActionSheetOptions } from '@expo/react-native-action-sheet'
import { TFunction } from 'i18next'

import { ClaimAttributesData, ClaimEventData, FILE_REQUEST_STATUS, FILE_REQUEST_TYPE } from 'api/types'
import { Box, BoxProps, TextView } from 'components'
import { Events } from 'constants/analytics'
import { DISABILITY_COMPENSATION_CLAIM_TYPE_CODES, MAX_NUM_PHOTOS } from 'constants/claims'

import { logAnalyticsEvent } from './analytics'

/** function that determines if a request file has been uploaded or received for a claim's event*/
export const hasUploadedOrReceived = (event: ClaimEventData): boolean => {
  const { uploaded, type } = event
  // anything marked with uploaded true is assumed to have been uploaded
  if (uploaded) {
    return true
  }

  // Sometimes the uploaded set to true is not enough, so will need to check the types to determine if it was received as well
  // The website checks the following types to determine if something have been uploaded/received
  switch (type) {
    case FILE_REQUEST_TYPE.RECEIVED_FROM_YOU:
    case FILE_REQUEST_TYPE.RECEIVED_FROM_OTHERS:
    case FILE_REQUEST_TYPE.OTHER_DOCUMENTS_LISTS:
      return true
    default:
      return false
  }
}
/** function that returns the tracked items that need uploads from a claimant or have had uploads from a claimant */
export const currentRequestsForVet = (events: ClaimEventData[]): ClaimEventData[] => {
  const notUploadedRequests = events.filter(
    (event: ClaimEventData) =>
      event.status === FILE_REQUEST_STATUS.NEEDED &&
      event.type === FILE_REQUEST_TYPE.STILL_NEED_FROM_YOU &&
      event.uploadsAllowed,
  )
  const uploadedRequests = events.filter(
    (event: ClaimEventData) =>
      (event.status === FILE_REQUEST_STATUS.SUBMITTED_AWAITING_REVIEW &&
        event.type === FILE_REQUEST_TYPE.STILL_NEED_FROM_YOU) ||
      event.type === FILE_REQUEST_TYPE.RECEIVED_FROM_YOU,
  )

  return [...notUploadedRequests, ...uploadedRequests]
}

/** function that returns the tracked items that need uploads from a claimant */
export const itemsNeedingAttentionFromVet = (events: ClaimEventData[]): ClaimEventData[] => {
  return events.filter(
    (event: ClaimEventData) =>
      event.status === FILE_REQUEST_STATUS.NEEDED &&
      event.type === FILE_REQUEST_TYPE.STILL_NEED_FROM_YOU &&
      !event.uploaded &&
      event.uploadsAllowed,
  )
}

/** function that returns the number of tracked items that need uploads from a claimant */
export const numberOfItemsNeedingAttentionFromVet = (events: ClaimEventData[]): number => {
  return itemsNeedingAttentionFromVet(events).length
}

/** function that returns a boolean for a claim indicating if there are files that can be uploaded */
export const needItemsFromVet = (attributes: ClaimAttributesData): boolean => {
  return (
    !attributes.decisionLetterSent &&
    attributes.open &&
    attributes.documentsNeeded &&
    numberOfItemsNeedingAttentionFromVet(attributes.eventsTimeline) > 0
  )
}

/** function to get the claim phase in base 5 rather than base 10 */
export const getUserPhase = (phase: number): number => {
  if (phase < 3) {
    return phase
  } else if (phase >= 3 && phase < 7) {
    return 3
  }
  return phase - 3
}

/**
 * Returns true if the given file type is a jpeg, jpg, gif, txt, pdf, or bmp file
 *
 * @param fileType - given file type to check if valid
 */
export const isValidFileType = (fileType: string): boolean => {
  const imageValidTypes = ['jpeg', 'jpg', 'public.image', 'gif', 'bmp']
  const textValidTypes = ['txt', 'pdf', 'text/plain', 'application/pdf', 'public.plain-text', 'com.adobe.pdf']
  const validFileTypes = [...imageValidTypes, ...textValidTypes]

  return !!validFileTypes.find((type) => fileType.includes(type))
}

// Maximum total size of all images uploaded from the camera or camera roll
export const MAX_TOTAL_FILE_SIZE_IN_BYTES = 52428800

/**
 * After the camera takes a photo or a photo is selected from the gallery, if an error exists setError is called to display
 * the error message. If there is no error and the image uri exists, callbackIfUri is called.
 *
 * @param response - response with image data given after image is taken or selected
 * @param setError - function setting the error message
 * @param callbackIfUri - callback function called if there is no error with the image and the uri exists
 * @param totalBytesUsed - total number of bytes used so far by previously selected images/files
 * @param t - translation function
 * @param displayBytesUsed - if true, displays bytes used so far when there is a file size error
 */
export const postCameraLaunchCallback = (
  response: ImagePickerResponse,
  setError: (error: string) => void,
  callbackIfUri: (response: ImagePickerResponse) => void,
  totalBytesUsed: number,
  t: TFunction,
): void => {
  const { assets, errorMessage, didCancel } = response
  if (didCancel) {
    return
  } else if (errorMessage) {
    setError(errorMessage)
  } else {
    let fileSizeAdded = 0
    let badFileType = false
    let badUri = false
    assets?.forEach((asset) => {
      if (asset.fileSize) {
        fileSizeAdded = fileSizeAdded + asset.fileSize
      }
      if (asset.type === undefined || (!!asset.type && !isValidFileType(asset.type))) {
        badFileType = true
        setError(t('fileUpload.fileTypeError'))
      } else if (!asset.uri) {
        badUri = true
      }
    })
    if (assets?.length === 0) {
      badFileType = true
      setError(t('fileUpload.fileTypeError'))
    }
    if (fileSizeAdded + totalBytesUsed > MAX_TOTAL_FILE_SIZE_IN_BYTES) {
      setError(t('fileUpload.fileSizeError'))
    } else if (badFileType === false && badUri === false) {
      setError('')
      callbackIfUri(response)
    }
  }
}

/**
 * Opens up an action sheet with the options to open the camera, the camera roll, or cancel. On click of one of the options,
 * it's corresponding action is implemented (launching the camera or camera roll).
 *
 * @param t - translation function
 * @param showActionSheetWithOptions - hook to open the action sheet
 * @param setError - sets error message
 * @param callbackIfUri - callback when an image is selected from the camera roll or taken with the camera successfully
 * @param totalBytesUsed - total number of bytes used so far by previously selected images/files
 * @param setIsActionSheetVisible - Function for updating the state of the action sheet visibility. Useful for
 * preventing back navigation when action sheet is opened
 **/
export const onAddPhotos = (
  t: TFunction,
  showActionSheetWithOptions: (options: ActionSheetOptions, callback: (i?: number) => void | Promise<void>) => void,
  setError: (error: string) => void,
  callbackIfUri: (response: ImagePickerResponse) => void,
  totalBytesUsed: number,
  claimID: string,
  request?: ClaimEventData,
  setIsActionSheetVisible?: (isVisible: boolean) => void,
): void => {
  const options = [t('fileUpload.camera'), t('fileUpload.photoGallery'), t('cancel')]

  setIsActionSheetVisible && setIsActionSheetVisible(true)
  showActionSheetWithOptions(
    {
      options,
      cancelButtonIndex: 2,
    },
    (buttonIndex) => {
      setIsActionSheetVisible && setIsActionSheetVisible(false)
      switch (buttonIndex) {
        case 0:
          logAnalyticsEvent(
            Events.vama_evidence_cont_1(
              claimID,
              request?.trackedItemId || null,
              request?.type || 'Submit Evidence',
              'camera',
            ),
          )
          launchCamera(
            { mediaType: 'photo', quality: 0.9, includeBase64: true, presentationStyle: 'fullScreen' },
            (response: ImagePickerResponse): void => {
              postCameraLaunchCallback(response, setError, callbackIfUri, totalBytesUsed, t)
            },
          )
          break
        case 1:
          logAnalyticsEvent(
            Events.vama_evidence_cont_1(
              claimID,
              request?.trackedItemId || null,
              request?.type || 'Submit Evidence',
              'gallery',
            ),
          )
          launchImageLibrary(
            { selectionLimit: MAX_NUM_PHOTOS, mediaType: 'photo', quality: 0.9, includeBase64: true },
            (response: ImagePickerResponse): void => {
              postCameraLaunchCallback(response, setError, callbackIfUri, totalBytesUsed, t)
            },
          )
          break
      }
    },
  )
}

/**
 * Delete a photo from the photo array
 *
 * @param image - ImagePickerResponse image selection for deletion
 */
export const deletePhoto = (
  deleteCallbackIfUri: (response: Asset[]) => void,
  deleteIndex: number,
  images: Asset[],
): void => {
  images.splice(deleteIndex, 1)
  deleteCallbackIfUri(images)
}

/**
 * Return the indicators common props
 *
 * @param fs - fontscale function
 */
export const getIndicatorCommonProps = (fs: (val: number) => number) => {
  const indicatorDiameter = fs(30)
  return {
    height: indicatorDiameter > 24 ? 24 : indicatorDiameter,
    width: indicatorDiameter > 24 ? 24 : indicatorDiameter,
    borderRadius: indicatorDiameter > 24 ? 24 : indicatorDiameter,
    justifyContent: 'center',
    textAlign: 'center',
    alignItems: 'center',
    mr: 10,
  } as BoxProps
}

/**
 * Return the indicators number or checkmark icon
 *
 * @param number - number to show in the indicator
 * @param useCheckMark - boolen to show check mark instead of number
 */
export const getIndicatorValue = (number: number, useCheckMark: boolean): ReactElement => {
  if (useCheckMark) {
    return (
      <Box justifyContent={'center'} alignItems={'center'}>
        <Icon width={20} height={20} name={'Check'} fill="#fff" preventScaling={true} />
      </Box>
    )
  } else {
    return (
      <TextView variant="ClaimPhase" textAlign={'center'} mt={-2.5} allowFontScaling={false}>
        {number}
      </TextView>
    )
  }
}

/**
 * Returns true if the provided claim type code is for a disability compensation claim
 *
 * @param claimTypeCode - claimTypeCode attribute for a claim
 */
export function isDisabilityCompensationClaim(claimTypeCode: string) {
  return DISABILITY_COMPENSATION_CLAIM_TYPE_CODES.includes(claimTypeCode)
}

/**
 * Evaluates the disability rating response for existence including the 0 value
 * @param rating - disability rating value
 */
export function isValidDisabilityRating(rating: number | undefined) {
  return rating === 0 || !!rating
}
