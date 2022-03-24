import { ActionSheetOptions } from '@expo/react-native-action-sheet'
import { Asset, ImagePickerResponse } from 'react-native-image-picker/src/types'
import { TFunction } from 'i18next'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'

import { ClaimAttributesData, ClaimEventData, ClaimPhaseData } from 'store/api'
import { MAX_NUM_PHOTOS } from 'constants/claims'

/** function that returns the tracked items that need uploads from a claimant or have had uploads from a claimant */
export const currentRequestsForVet = (events: ClaimEventData[]): ClaimEventData[] => {
  return events.filter((event: ClaimEventData) => event.status === 'NEEDED' && event.type === 'still_need_from_you_list' && event.uploadsAllowed)
}

/** function that returns the tracked items that need uploads from a claimant */
export const itemsNeedingAttentionFromVet = (events: ClaimEventData[]): ClaimEventData[] => {
  return events.filter((event: ClaimEventData) => event.status === 'NEEDED' && event.type === 'still_need_from_you_list' && !event.uploaded && event.uploadsAllowed)
}

/** function that returns the number of tracked items that need uploads from a claimant */
export const numberOfItemsNeedingAttentionFromVet = (events: ClaimEventData[]): number => {
  return itemsNeedingAttentionFromVet(events).length
}

/** function that returns a boolean for a claim indicating if there are files that can be uploaded */
export const needItemsFromVet = (attributes: ClaimAttributesData): boolean => {
  return !attributes.decisionLetterSent && attributes.open && attributes.documentsNeeded && numberOfItemsNeedingAttentionFromVet(attributes.eventsTimeline) > 0
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

/** gets the correct date from each item in an event timeline */
const getItemDate = (item: ClaimEventData): string => {
  if (item.receivedDate) {
    return item.receivedDate
  } else if (item.documents && item.documents.length) {
    return item.documents[item.documents.length - 1].uploadDate
  } else if (item.type === 'other_documents_list' && item.uploadDate) {
    return item.uploadDate
  }

  return item.date ? item.date : ''
}

/** checks to see if this is an event that kicks off a phase that is tracked or if it falls in the middle phases
 * that we roll into phase 3
 */
const isEventOrPrimaryPhase = (event: ClaimEventData): boolean => {
  if (event.type === 'phase_entered' && event.phase) {
    return event.phase <= 3 || event.phase >= 7
  }

  return !!getItemDate(event)
}

/** takse a string that is in the event timeline as 'phase2' and returns a number to represent the phase */
const getPhaseNumber = (phase: string): number => {
  return parseInt(phase.replace('phase', ''), 10)
}

/** groups claim events by phase */
export const groupTimelineActivity = (events: ClaimEventData[]): ClaimPhaseData => {
  const phases: { [key: string]: ClaimEventData[] } = {}
  let activity: ClaimEventData[] = []
  const phaseEvents = events
    .map((event) => {
      if (event.type.startsWith('phase')) {
        return {
          type: 'phase_entered',
          phase: getPhaseNumber(event.type) + 1,
          date: event.date,
        } as ClaimEventData
      }
      return event
    })
    .filter(isEventOrPrimaryPhase)
  phaseEvents.forEach((event) => {
    if (event.type.startsWith('phase') && event.phase) {
      activity.push(event)
      phases[`${getUserPhase(event.phase)}`] = activity
      activity = []
    } else {
      activity.push(event)
    }
  })
  if (activity.length > 0) {
    phases[1] = activity
  }
  return phases
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
 *
 **/
export const onAddPhotos = (
  t: TFunction,
  showActionSheetWithOptions: (options: ActionSheetOptions, callback: (i?: number) => void | Promise<void>) => void,
  setError: (error: string) => void,
  callbackIfUri: (response: ImagePickerResponse) => void,
  totalBytesUsed: number,
): void => {
  const options = [t('fileUpload.camera'), t('fileUpload.photoGallery'), t('common:cancel')]

  showActionSheetWithOptions(
    {
      options,
      cancelButtonIndex: 2,
    },
    (buttonIndex) => {
      switch (buttonIndex) {
        case 0:
          launchCamera({ mediaType: 'photo', quality: 0.9, includeBase64: true }, (response: ImagePickerResponse): void => {
            postCameraLaunchCallback(response, setError, callbackIfUri, totalBytesUsed, t)
          })
          break
        case 1:
          launchImageLibrary({ selectionLimit: MAX_NUM_PHOTOS, mediaType: 'photo', quality: 0.9, includeBase64: true }, (response: ImagePickerResponse): void => {
            postCameraLaunchCallback(response, setError, callbackIfUri, totalBytesUsed, t)
          })
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
export const deletePhoto = (deleteCallbackIfUri: (response: Asset[]) => void, deleteIndex: number, images: Asset[]): void => {
  images.splice(deleteIndex, 1)
  deleteCallbackIfUri(images)
}
