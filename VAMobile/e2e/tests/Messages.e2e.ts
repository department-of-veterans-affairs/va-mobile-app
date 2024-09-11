import { by, device, element, expect, waitFor } from 'detox'
import { DateTime } from 'luxon'
import { setTimeout } from 'timers/promises'

import {
  CommonE2eIdConstants,
  checkImages,
  loginToDemoMode,
  openHealth,
  openMessages,
  toggleRemoteConfigFlag,
} from './utils'

export async function getDateWithTimeZone(dateString: string) {
  const date = DateTime.fromFormat(dateString, 'LLLL d, yyyy h:m a', { zone: 'America/Chicago' })
  const dateUTC = date.toLocal()
  let dateTime = dateUTC.toLocaleString(Object.assign(DateTime.DATETIME_FULL))
  if (device.getPlatform() === 'android') {
    dateTime = dateTime.replace(' at ', ', ')
  }
  return dateTime
}

export const MessagesE2eIdConstants = {
  MESSAGE_1_ID: 'Unread: Martha Kaplan, Md October 26, 2021 Medication: Naproxen side effects',
  MESSAGE_1_READ_ID: 'Martha Kaplan, Md October 26, 2021 Medication: Naproxen side effects',
  MESSAGE_2_ID: 'Unread: Diana Persson, Md October 26, 2021 Has attachment COVID: Prepping for your visit',
  MESSAGE_2_READ_ID: 'Diana Persson, Md October 26, 2021 Has attachment COVID: Prepping for your visit',
  MESSAGE_3_ID: 'Unread: Sarah Kotagal, Md October 26, 2021 General: Your requested info',
  MESSAGE_4_ID: 'Cheryl Rodger, Md October 26, 2021 Appointment: Please read and prepare appropriately',
  MESSAGE_5_ID: 'Vija A. Ravi, Md October 21, 2021 General: Summary of visit',
  MESSAGE_6_ID: 'Ratana, Narin  October 21, 2021 Test: Preparing for your visit',
  MESSAGE_7_ID: 'Ratana, Narin  September 17, 2021 Education: Good morning to you',
  MESSAGE_10_ID: 'Ratana, Narin  September 17, 2021 COVID: Test',
  FOLDERS_TEXT: 'Folders',
  MESSAGES_ID: 'messagesTestID',
  REVIEW_MESSAGE_REPLY_ID: 'replyTestID',
  ONLY_USE_MESSAGES_TEXT: 'Only use messages for non-urgent needs',
  ATTACHMENTS_BUTTON_TEXT: 'Add Files',
  ATTACHMENT_CAMERA_TEXT: device.getPlatform() === 'ios' ? 'Camera' : 'Camera ',
  ATTACHMENT_PHOTO_GALLERY_TEXT: device.getPlatform() === 'ios' ? 'Photo Gallery' : 'Photo gallery ',
  ATTACHMENT_FILE_FOLDER_TEXT: device.getPlatform() === 'ios' ? 'File Folder' : 'File folder ',
  MESSAGE_INPUT_ID: 'reply field',
  SEND_BUTTON_ID: 'sendButtonTestID',
  SELECT_A_FILE_ID: 'Select a file',
  REPLY_PAGE_TEST_ID: 'replyPageTestID',
  START_NEW_MESSAGE_TO_ID: 'to field',
  START_NEW_MESSAGE_CATEGORY_ID: 'picker',
  START_NEW_MESSAGE_SUBJECT_ID: 'startNewMessageSubjectTestID',
  START_NEW_MESSAGE_MESSAGE_FIELD_ID: 'message field',
  START_NEW_MESSAGE_ADD_FILES_TEXT: 'Add Files',
  START_NEW_MESSAGE_ONLY_USE_MESSAGES_ID: 'startNewMessageOnlyUseMessagesTestID',
  START_NEW_MESSAGE_ID: 'startNewMessageTestID',
  START_NEW_MESSAGE_SAVE_ID: 'startNewMessageSaveTestID',
  START_NEW_MESSAGE_CANCEL_ID: 'startNewMessageCancelTestID',
  MESSAGE_CANCEL_DELETE_TEXT: device.getPlatform() === 'ios' ? 'Delete' : 'Delete ',
  MESSAGE_CANCEL_KEEP_EDITING_TEXT: device.getPlatform() === 'ios' ? 'Keep Editing' : 'Keep Editing ',
  MESSAGE_CANCEL_SAVE_TEXT: device.getPlatform() === 'ios' ? 'Save' : 'Save ',
  VIEW_MESSAGE_ID: 'viewMessageTestID',
  EDIT_DRAFT_MESSAGE_FIELD_ID: 'messageText',
  EDIT_DRAFT_CANCEL_ID: 'editDraftCancelTestID',
  EDIT_DRAFT_CANCEL_DELETE_TEXT: device.getPlatform() === 'ios' ? 'Delete Changes' : 'Delete Changes ',
  EDIT_DRAFT_CANCEL_SAVE_TEXT: device.getPlatform() === 'ios' ? 'Save Changes' : 'Save Changes ',
  EDIT_DRAFT_PAGE_TEST_ID: 'editDraftTestID',
}

const tapItems = async (items: string, type: string) => {
  if (type === 'url' || type === 'map' || type === 'email') {
    await element(by.id(MessagesE2eIdConstants.VIEW_MESSAGE_ID)).scrollTo('bottom')
  }
  await device.disableSynchronization()
  await element(by.text(items)).tap()
  if (type === 'url' || type === 'map') {
    await element(by.text(CommonE2eIdConstants.LEAVING_APP_LEAVE_TEXT)).tap()
  }
  await setTimeout(2000)
  await device.takeScreenshot(items)
  if (device.getPlatform() === 'android') {
    await device.enableSynchronization()
    await device.launchApp({ newInstance: false })
  }
  await setTimeout(3000)
}

let dateWithTimeZone
let messageCollapsed
let messageExpanded

beforeAll(async () => {
  await toggleRemoteConfigFlag(CommonE2eIdConstants.IN_APP_REVIEW_TOGGLE_TEXT)
  await loginToDemoMode()
  await openHealth()
  await openMessages()
})

describe('Messages Screen', () => {
  it('should match the messages page design', async () => {
    await expect(element(by.id(CommonE2eIdConstants.START_NEW_MESSAGE_BUTTON_ID))).toExist()
    await expect(element(by.text('Inbox (3)'))).toExist()
    await expect(element(by.text(MessagesE2eIdConstants.FOLDERS_TEXT))).toExist()
    await expect(element(by.id(MessagesE2eIdConstants.MESSAGE_1_ID))).toExist()
    await expect(element(by.id(MessagesE2eIdConstants.MESSAGE_2_ID))).toExist()
    await expect(element(by.id(MessagesE2eIdConstants.MESSAGE_3_ID))).toExist()
    await expect(element(by.id(MessagesE2eIdConstants.MESSAGE_4_ID))).toExist()
    await expect(element(by.id(MessagesE2eIdConstants.MESSAGE_5_ID))).toExist()
    await expect(element(by.id(MessagesE2eIdConstants.MESSAGE_6_ID))).toExist()
    await expect(element(by.id(MessagesE2eIdConstants.MESSAGE_7_ID))).toExist()
  })

  it('should verify that the messages inbox is scrollable', async () => {
    await element(by.id(MessagesE2eIdConstants.MESSAGES_ID)).scrollTo('bottom')
    await expect(element(by.id(MessagesE2eIdConstants.MESSAGE_10_ID))).toBeVisible()
  })

  it('verify message OLDER than 45 days information', async () => {
    await element(by.id(MessagesE2eIdConstants.MESSAGES_ID)).scrollTo('top')
    await element(by.id(MessagesE2eIdConstants.MESSAGE_2_ID)).tap()
    await expect(element(by.text('This conversation is too old for new replies'))).toExist()
    await expect(
      element(
        by.text(
          'The last message in this conversation is more than 45 days old. To continue this conversation, start a new message.',
        ),
      ),
    ).toExist()
    await expect(element(by.text(MessagesE2eIdConstants.ONLY_USE_MESSAGES_TEXT))).toExist()
    await expect(element(by.id(MessagesE2eIdConstants.REVIEW_MESSAGE_REPLY_ID))).not.toExist()
    await expect(element(by.id(CommonE2eIdConstants.START_NEW_MESSAGE_BUTTON_ID)))
  })

  it('verify the message just opened is displayed as read', async () => {
    await element(by.text('Messages')).tap()
    await expect(
      element(by.id('Diana Persson, Md October 26, 2021 Has attachment COVID: Prepping for your visit')),
    ).toExist()
  })

  it('verify message NEWER than 45 days information', async () => {
    await element(by.id(MessagesE2eIdConstants.MESSAGE_1_ID)).tap()
    await expect(element(by.text(MessagesE2eIdConstants.ONLY_USE_MESSAGES_TEXT))).toExist()
    await expect(element(by.id(MessagesE2eIdConstants.REVIEW_MESSAGE_REPLY_ID))).toExist()
    await expect(element(by.text('Medication: Naproxen side effects'))).toExist()
    await expect(element(by.text('RATANA, NARIN '))).toExist()
    await expect(element(by.text('Only use messages for non-urgent needs'))).toExist()
  })

  it(':android: verify phone links open', async () => {
    await tapItems('8006982411', 'phone')
    await tapItems('800-698-2411', 'phone')
    await tapItems('(800)698-2411,', 'phone')
    await tapItems('(800)-698-2411', 'phone')
    await tapItems('800 698 2411', 'phone')
    await tapItems('+8006982411', 'phone')
    await tapItems('+18006982411', 'phone')
    await tapItems('1-800-698-2411.', 'phone')
  })
  //Currently broken on iOS.  Will be fixed with ticket 7679
  it(':android: verify url links open', async () => {
    await tapItems('https://www.va.gov/', 'url')
    await tapItems('https://rb.gy/riwea', 'url')
    await tapItems('https://va.gov', 'url')
    await tapItems('http://www.va.gov/', 'url')
    await tapItems('https://www.va.gov/education/about-gi-bill-benefits/', 'url')
    await tapItems('www.va.gov', 'url')
    await tapItems('www.google.com', 'url')
    await tapItems('google.com', 'url')
  })

  it(':android: verify email links open', async () => {
    await tapItems('test@va.gov', 'email')
    await tapItems('mailto:test@va.gov', 'email')
  })

  //Currently broken on iOS.  Will be fixed with ticket 7679
  it(':android: verify map links open', async () => {
    if (device.getPlatform() === 'ios') {
      await tapItems('http://maps.apple.com/?q=Mexican+Restaurant&sll=50.894967,4.341626&z=10&t=s', 'map')
    } else {
      await tapItems('http://maps.google.com/?q=50.894967,4.341626', 'map')
    }
  })

  it('verify medication message details', async () => {
    await element(by.text('Messages')).tap()
    await element(by.id('Martha Kaplan, Md October 26, 2021 Medication: Naproxen side effects')).tap()
    await expect(element(by.text('Medication: Naproxen side effects'))).toExist()
    await element(by.text('Messages')).tap()
  })

  it('verify COVID message details', async () => {
    await element(by.id('Diana Persson, Md October 26, 2021 Has attachment COVID: Prepping for your visit')).tap()
    await expect(element(by.text('COVID: Your requested info'))).toExist()
    await element(by.text('Messages')).tap()
  })

  it('verify general message details', async () => {
    await element(by.id(MessagesE2eIdConstants.MESSAGE_3_ID)).tap()
    await expect(element(by.text('General: Vaccine Booster'))).toExist()
    await element(by.text('Messages')).tap()
  })

  it('verify appointment message details', async () => {
    await waitFor(element(by.id(MessagesE2eIdConstants.MESSAGE_4_ID)))
      .toBeVisible()
      .whileElement(by.id(MessagesE2eIdConstants.MESSAGES_ID))
      .scroll(100, 'down')
    await element(by.id(MessagesE2eIdConstants.MESSAGE_4_ID)).tap()
    await expect(element(by.text('Appointment: Preparing for your visit'))).toExist()
    await element(by.text('Messages')).tap()
  })

  it('verify other message details', async () => {
    await waitFor(element(by.id(MessagesE2eIdConstants.MESSAGE_5_ID)))
      .toBeVisible()
      .whileElement(by.id(MessagesE2eIdConstants.MESSAGES_ID))
      .scroll(100, 'down')
    await element(by.id(MessagesE2eIdConstants.MESSAGE_5_ID)).tap()
    await expect(element(by.text('General: COVID vaccine booster?'))).toExist()
    await element(by.text('Messages')).tap()
  })

  it('verify test_results message details', async () => {
    await waitFor(element(by.id(MessagesE2eIdConstants.MESSAGE_6_ID)))
      .toBeVisible()
      .whileElement(by.id(MessagesE2eIdConstants.MESSAGES_ID))
      .scroll(100, 'down')
    await element(by.id(MessagesE2eIdConstants.MESSAGE_6_ID)).tap()
    await expect(element(by.text('Test: Preparing for your visit'))).toExist()
    await element(by.text('Messages')).tap()
  })

  it('verify education message details', async () => {
    await waitFor(element(by.id(MessagesE2eIdConstants.MESSAGE_7_ID)))
      .toBeVisible()
      .whileElement(by.id(MessagesE2eIdConstants.MESSAGES_ID))
      .scroll(100, 'down')
    await element(by.id(MessagesE2eIdConstants.MESSAGE_7_ID)).tap()
    await expect(element(by.text('Education: Good morning to you'))).toExist()
    await element(by.text('Messages')).tap()
  })

  it('should tap on and then cancel the move option', async () => {
    await waitFor(element(by.id(MessagesE2eIdConstants.MESSAGE_1_READ_ID)))
      .toBeVisible()
      .whileElement(by.id(MessagesE2eIdConstants.MESSAGES_ID))
      .scroll(400, 'up')
    await element(by.id(MessagesE2eIdConstants.MESSAGE_1_READ_ID)).tap()
    await element(by.text('Move')).tap()
    await element(by.text('Cancel')).tap()
  })

  it('should tap reply and verify the correct information is displayed', async () => {
    await element(by.id(MessagesE2eIdConstants.VIEW_MESSAGE_ID)).scrollTo('bottom')
    await element(by.id(MessagesE2eIdConstants.REVIEW_MESSAGE_REPLY_ID)).tap()
    await expect(element(by.id('To RATANA, NARIN '))).toExist()
    await expect(element(by.id('Subject Medication: Naproxen side effects'))).toExist()
    await expect(element(by.text(MessagesE2eIdConstants.ATTACHMENTS_BUTTON_TEXT))).toExist()
    await expect(element(by.id(MessagesE2eIdConstants.MESSAGE_INPUT_ID))).toExist()
    await expect(element(by.id(MessagesE2eIdConstants.SEND_BUTTON_ID))).toExist()
  })

  it('reply: verify talk to the veterans crisis line now is displayed', async () => {
    await element(by.text(CommonE2eIdConstants.VETERAN_CRISIS_LINE_BTN_TEXT)).tap()
    await expect(element(by.text('Veterans Crisis Line'))).toExist()
    await element(by.text('Done')).tap()
  })

  it('should tap add files and verify the correct info is displayed', async () => {
    await element(by.text(MessagesE2eIdConstants.ATTACHMENTS_BUTTON_TEXT)).tap()
    await expect(element(by.text('What to know about attaching files'))).toExist()
    await expect(element(by.text('You can attach up to 4 files to each message.'))).toExist()
    await expect(
      element(by.text('You can attach only these file types: DOC, DOCX, GIF, PDF, JPG, PNG, RTF, TXT, XLS, or XLSX.')),
    ).toExist()
    await expect(element(by.text('The maximum size for each file is 6 MB.'))).toExist()
    await expect(element(by.text('The maximum total size for all files attached to 1 message is 10 MB.'))).toExist()
    await expect(element(by.text("We can't save attachments in a draft."))).toExist()
    await expect(element(by.text(MessagesE2eIdConstants.SELECT_A_FILE_ID))).toExist()
  })

  it('should tap cancel and verify that the reply page is displayed', async () => {
    await element(by.text('Cancel')).atIndex(0).tap()
    await expect(element(by.id('To RATANA, NARIN '))).toExist()
    await expect(element(by.id('Subject Medication: Naproxen side effects'))).toExist()
    await expect(element(by.text(MessagesE2eIdConstants.ATTACHMENTS_BUTTON_TEXT))).toExist()
    await expect(element(by.id(MessagesE2eIdConstants.MESSAGE_INPUT_ID))).toExist()
    await expect(element(by.id(MessagesE2eIdConstants.SEND_BUTTON_ID))).toExist()
  })

  it('verify tap select a file action sheet options are correct', async () => {
    await element(by.text(MessagesE2eIdConstants.ATTACHMENTS_BUTTON_TEXT)).tap()
    await element(by.text(MessagesE2eIdConstants.SELECT_A_FILE_ID)).tap()
    await expect(element(by.text(MessagesE2eIdConstants.ATTACHMENT_CAMERA_TEXT))).toExist()
    await expect(element(by.text(MessagesE2eIdConstants.ATTACHMENT_PHOTO_GALLERY_TEXT))).toExist()
    await expect(element(by.text(MessagesE2eIdConstants.ATTACHMENT_FILE_FOLDER_TEXT))).toExist()
  })

  it('should close the action sheet and tap cancel', async () => {
    if (device.getPlatform() === 'android') {
      await element(by.text('Cancel ')).tap()
      await element(by.text('Cancel')).atIndex(1).tap()
    } else {
      await element(by.text('Cancel')).atIndex(2).tap()
      await element(by.text('Cancel')).atIndex(0).tap()
    }
  })

  it('should input text into the message field', async () => {
    await element(by.id(MessagesE2eIdConstants.MESSAGE_INPUT_ID)).replaceText('Testing')
  })

  it('verify cancel action sheet options are correct', async () => {
    await element(by.text('Cancel')).tap()
    await expect(element(by.text('Delete your reply or save as draft?'))).toExist()
    await expect(element(by.text("If you save as a draft, we'll remove the attachments."))).toExist()
    await expect(element(by.text(MessagesE2eIdConstants.MESSAGE_CANCEL_DELETE_TEXT))).toExist()
    await expect(element(by.text(MessagesE2eIdConstants.MESSAGE_CANCEL_SAVE_TEXT))).toExist()
    await expect(element(by.text(MessagesE2eIdConstants.MESSAGE_CANCEL_KEEP_EDITING_TEXT))).toExist()
  })

  it('should tap keep editing and send the message', async () => {
    await element(by.text(MessagesE2eIdConstants.MESSAGE_CANCEL_KEEP_EDITING_TEXT)).tap()
    await element(by.id(MessagesE2eIdConstants.REPLY_PAGE_TEST_ID)).scroll(300, 'down', NaN, 0.8)
    await element(by.id(MessagesE2eIdConstants.SEND_BUTTON_ID)).tap()
    await expect(element(by.text('Message sent'))).toExist()
    await element(by.text('Dismiss')).tap()
  })

  it('should tap and move a message', async () => {
    await element(by.id(MessagesE2eIdConstants.MESSAGE_2_READ_ID)).tap()
    await element(by.text('Move')).tap()
    await element(by.text('Custom Folder 2')).tap()
    if (device.getPlatform() === 'android') {
      await element(by.text('Move')).tap()
    } else {
      await element(by.text('Move')).atIndex(1).tap()
    }
    await expect(element(by.text('Message moved to Custom Folder 2'))).toExist()
    await element(by.text('Dismiss')).tap()
    await element(by.text('Messages')).tap()
  })

  it('tap start new message and verify information', async () => {
    await element(by.id(MessagesE2eIdConstants.MESSAGES_ID)).scrollTo('top')
    await device.disableSynchronization()
    await element(by.id(CommonE2eIdConstants.START_NEW_MESSAGE_BUTTON_ID)).tap()
    await expect(element(by.id(MessagesE2eIdConstants.START_NEW_MESSAGE_TO_ID))).toExist()
    await expect(element(by.id(MessagesE2eIdConstants.START_NEW_MESSAGE_CATEGORY_ID))).toExist()
    await expect(element(by.id(MessagesE2eIdConstants.START_NEW_MESSAGE_MESSAGE_FIELD_ID))).toExist()
    await expect(element(by.text(MessagesE2eIdConstants.START_NEW_MESSAGE_ADD_FILES_TEXT))).toExist()
    await expect(element(by.id(MessagesE2eIdConstants.START_NEW_MESSAGE_ONLY_USE_MESSAGES_ID))).toExist()
  })

  it('new message: verify talk to the veterans crisis line now', async () => {
    await element(by.text(CommonE2eIdConstants.VETERAN_CRISIS_LINE_BTN_TEXT)).tap()
    await expect(element(by.text('Veterans Crisis Line'))).toExist()
    await element(by.text('Done')).tap()
  })

  it('verify only use messages for non-urgent needs information', async () => {
    await element(by.id(MessagesE2eIdConstants.START_NEW_MESSAGE_ID)).scroll(300, 'down', NaN, 0.8)
    await element(by.id(MessagesE2eIdConstants.START_NEW_MESSAGE_ONLY_USE_MESSAGES_ID)).tap()
    await expect(element(by.text('Only use messages for non-urgent needs')))
    await expect(element(by.text('Your care team may take up to 3 business days to reply.'))).toExist()
    await expect(element(by.text('If you need help sooner, use one of these urgent communication options:'))).toExist()
    if (device.getPlatform() === 'android') {
      await element(by.text('Call 988 and select 1')).tap()
      await setTimeout(5000)
      await device.takeScreenshot('messagesHelpCrisisLinePhone')
      await device.launchApp({ newInstance: false })

      await element(by.id('messageHelpTestID')).scrollTo('bottom')

      await element(by.text('TTY: 800-799-4889')).tap()
      await setTimeout(5000)
      await device.takeScreenshot('messagesHelpCrisisLineTTY')
      await device.launchApp({ newInstance: false })

      await element(by.text('Call 911')).tap()
      await setTimeout(5000)
      await device.takeScreenshot('messagesHelpCrisisLineTTY')
      await device.launchApp({ newInstance: false })

      await element(by.id('messageHelpTestID')).scrollTo('top')
    }

    await element(by.text('Text 838255')).tap()
    await setTimeout(5000)
    await device.takeScreenshot('messagesHelpText')
    await device.launchApp({ newInstance: false })

    await element(by.text('Start a confidential chat')).tap()
    await element(by.text(CommonE2eIdConstants.LEAVING_APP_LEAVE_TEXT)).tap()
    await setTimeout(5000)
    await device.takeScreenshot('messagesHelpChat')
    await device.launchApp({ newInstance: false })
    await device.enableSynchronization()
  })

  it('should close the messages help panel', async () => {
    await element(by.id('messagesHelpCloseTestID')).tap()
  })

  it('verify the correct errors displayed on save', async () => {
    await element(by.id(MessagesE2eIdConstants.START_NEW_MESSAGE_SAVE_ID)).tap()
    await expect(element(by.text('We need more information'))).toExist()
    await expect(element(by.text('Select a care team to message')).atIndex(0)).toExist()
    await expect(element(by.text('Select a category')).atIndex(0)).toExist()
    await expect(element(by.text('Enter a message')).atIndex(0)).toExist()
  })

  it('should tap the to field and select a name', async () => {
    await element(by.id(MessagesE2eIdConstants.START_NEW_MESSAGE_TO_ID)).tap()
    await element(by.text('VA Flagship mobile applications interface_DAYT29')).tap()
    await element(by.text('Done')).tap()
  })

  it('should tap the category field and select a category', async () => {
    await waitFor(element(by.id(MessagesE2eIdConstants.START_NEW_MESSAGE_CATEGORY_ID)))
      .toBeVisible()
      .whileElement(by.id(MessagesE2eIdConstants.START_NEW_MESSAGE_ID))
      .scroll(50, 'down')
    await element(by.id(MessagesE2eIdConstants.START_NEW_MESSAGE_CATEGORY_ID)).tap()
    await element(by.text('Medication')).tap()
    await element(by.text('Done')).tap()
  })

  it('should add and delete text in the subject field', async () => {
    await waitFor(element(by.id(MessagesE2eIdConstants.START_NEW_MESSAGE_SUBJECT_ID)))
      .toBeVisible()
      .whileElement(by.id(MessagesE2eIdConstants.START_NEW_MESSAGE_ID))
      .scroll(50, 'down')
    await element(by.id(MessagesE2eIdConstants.START_NEW_MESSAGE_SUBJECT_ID)).replaceText('Testing')
    await element(by.id(MessagesE2eIdConstants.START_NEW_MESSAGE_SUBJECT_ID)).clearText()
  })

  it('verify cancel action sheet display', async () => {
    await element(by.id(MessagesE2eIdConstants.START_NEW_MESSAGE_CANCEL_ID)).tap()
    await expect(element(by.text('Delete message you started or save as draft?'))).toExist()
    await expect(element(by.text("If you save as a draft, we'll remove the attachments."))).toExist()
    await expect(element(by.text(MessagesE2eIdConstants.MESSAGE_CANCEL_DELETE_TEXT))).toExist()
    await expect(element(by.text(MessagesE2eIdConstants.MESSAGE_CANCEL_SAVE_TEXT))).toExist()
    await expect(element(by.text(MessagesE2eIdConstants.MESSAGE_CANCEL_KEEP_EDITING_TEXT))).toExist()
  })

  it('verify the previous made fields are filled on keep editing', async () => {
    await element(by.text(MessagesE2eIdConstants.MESSAGE_CANCEL_KEEP_EDITING_TEXT)).tap()
    await expect(element(by.text('VA Flagship mobile applications interface_DAYT29'))).toExist()
    await expect(element(by.text('Medication'))).toExist()
  })

  it('verify the user is returned to messages inbox on delete', async () => {
    await element(by.id(MessagesE2eIdConstants.START_NEW_MESSAGE_CANCEL_ID)).tap()
    await element(by.text(MessagesE2eIdConstants.MESSAGE_CANCEL_DELETE_TEXT)).tap()
    await expect(element(by.id(CommonE2eIdConstants.START_NEW_MESSAGE_BUTTON_ID))).toExist()
    await expect(element(by.text(MessagesE2eIdConstants.FOLDERS_TEXT))).toExist()
    await expect(
      element(by.id('Diana Persson, Md October 26, 2021 Has attachment COVID: Prepping for your visit')),
    ).toExist()
  })

  it('verify the attachment is on message with attachment', async () => {
    await element(by.id('Diana Persson, Md October 26, 2021 Has attachment COVID: Prepping for your visit')).tap()
    await expect(element(by.text('COVID-19-mRNA-infographic_G_508.pdf (0.17 MB)'))).toExist()
  })

  it('navigate to the sent folder and select the first message', async () => {
    await openHealth()
    await openMessages()
    await element(by.text(MessagesE2eIdConstants.FOLDERS_TEXT)).tap()
    await element(by.text('Sent')).tap()
  })

  it('verify a message threads', async () => {
    await element(
      by.id(
        'Va Flagship Mobile Applications Interface 2_dayt29 November 16, 2021 Appointment: Preparing for your visit',
      ),
    ).tap()
    await element(by.id(MessagesE2eIdConstants.VIEW_MESSAGE_ID)).scrollTo('bottom')
    await expect(element(by.text('Melvin Freeman\nUSMC Veteran'))).toExist()
    await expect(element(by.text('See you at your appointment.  Please do not forget to fast.'))).toExist()
    await expect(element(by.text('Testing '))).toExist()
    await expect(
      element(
        by.text(
          'Please fast for at least 12 hours before your upcoming visit on October 19th. Eating or drinking anything besides water will have an effect on your blood lab  results.  Thank you.',
        ),
      ),
    ).toExist()
  })

  it('verify message threads with more than two lines', async () => {
    await element(by.id(MessagesE2eIdConstants.VIEW_MESSAGE_ID)).scrollTo('bottom')
    messageCollapsed = await device.takeScreenshot('MessageCollapsed')
    checkImages(messageCollapsed)
    await element(
      by.text(
        'Please fast for at least 12 hours before your upcoming visit on October 19th. Eating or drinking anything besides water will have an effect on your blood lab  results.  Thank you.',
      ),
    ).tap()
    await element(by.id(MessagesE2eIdConstants.VIEW_MESSAGE_ID)).scrollTo('bottom')
    messageExpanded = await device.takeScreenshot('MessageExpanded')
    await element(by.text('Sent')).tap()
    await element(by.text('Messages')).tap()
  })

  it('click the newest message in drafts folder', async () => {
    await expect(element(by.text('Drafts (3)'))).toExist()
    await element(by.text('Drafts (3)')).tap()
    await waitFor(element(by.text('Test: Test Inquiry')))
      .toBeVisible()
      .whileElement(by.id(MessagesE2eIdConstants.MESSAGES_ID))
      .scroll(300, 'down', NaN, 0.8)
    await element(by.text('Test: Test Inquiry')).tap()
  })

  it('verify action sheet for edited drafts message', async () => {
    await element(by.id(MessagesE2eIdConstants.EDIT_DRAFT_PAGE_TEST_ID)).scrollTo('bottom')
    await element(by.id(MessagesE2eIdConstants.EDIT_DRAFT_MESSAGE_FIELD_ID)).clearText()
    await element(by.id(MessagesE2eIdConstants.EDIT_DRAFT_MESSAGE_FIELD_ID)).replaceText('Testing')
    await element(by.id(MessagesE2eIdConstants.EDIT_DRAFT_CANCEL_ID)).tap()
    await expect(element(by.text('Delete changes to draft?'))).toExist()
    await expect(element(by.text("If you save your changes, we'll remove the attachments."))).toExist()
    await expect(element(by.text(MessagesE2eIdConstants.EDIT_DRAFT_CANCEL_DELETE_TEXT))).toExist()
    await expect(element(by.text(MessagesE2eIdConstants.EDIT_DRAFT_CANCEL_SAVE_TEXT))).toExist()
    await expect(element(by.text(MessagesE2eIdConstants.MESSAGE_CANCEL_KEEP_EDITING_TEXT))).toExist()
  })

  it('drafts: verify the previous made fields are filled on keep editing', async () => {
    await element(by.text(MessagesE2eIdConstants.MESSAGE_CANCEL_KEEP_EDITING_TEXT)).tap()
    await expect(element(by.text('Testing'))).toExist()
  })

  it('verify that the draft is still in the list after cancel', async () => {
    await element(by.id(MessagesE2eIdConstants.EDIT_DRAFT_CANCEL_ID)).tap()
    await element(by.text(MessagesE2eIdConstants.EDIT_DRAFT_CANCEL_DELETE_TEXT)).tap()
    await expect(element(by.text('Test: Test Inquiry'))).toExist()
  })

  it('verify that no changes were made to draft after cancel', async () => {
    await element(by.text('Test: Test Inquiry')).tap()
    await expect(element(by.text('VA Flagship mobile applications interface 2_DAYT29'))).toExist()
    await expect(element(by.text('Test'))).toExist()
    await expect(element(by.text('Test Inquiry'))).toExist()
  })

  it('verify a draft can be saved and that a alert appears', async () => {
    await element(by.id(MessagesE2eIdConstants.EDIT_DRAFT_PAGE_TEST_ID)).scrollTo('bottom')
    await element(by.id(MessagesE2eIdConstants.EDIT_DRAFT_MESSAGE_FIELD_ID)).clearText()
    await element(by.id(MessagesE2eIdConstants.EDIT_DRAFT_MESSAGE_FIELD_ID)).replaceText('Testing')
    await element(by.id(MessagesE2eIdConstants.EDIT_DRAFT_CANCEL_ID)).tap()
    await element(by.text(MessagesE2eIdConstants.EDIT_DRAFT_CANCEL_SAVE_TEXT)).tap()
    await expect(element(by.text('Draft saved'))).toExist()
    await element(by.text('Dismiss')).tap()
  })

  it('should open a draft message and verify it can be deleted', async () => {
    await waitFor(element(by.text('Test: Test Inquiry')))
      .toBeVisible()
      .whileElement(by.id(MessagesE2eIdConstants.MESSAGES_ID))
      .scroll(300, 'down', NaN, 0.8)
    await element(by.text('Test: Test Inquiry')).tap()
    await element(by.text('More')).tap()
    await element(by.text('Delete')).tap()
    await element(by.text(MessagesE2eIdConstants.MESSAGE_CANCEL_DELETE_TEXT)).tap()
  })

  it('verify that the sent folder opens and is displayed', async () => {
    await element(by.text('Messages')).tap()
    await element(by.text('Sent')).tap()
    await expect(element(by.id(CommonE2eIdConstants.START_NEW_MESSAGE_BUTTON_ID))).toExist()
    await expect(
      element(
        by.id(
          'Va Flagship Mobile Applications Interface 2_dayt29 November 16, 2021 Appointment: Preparing for your visit',
        ),
      ),
    ).toExist()
  })

  it('verify a sent messages can display attachments', async () => {
    await element(
      by.id(
        'Va Flagship Mobile Applications Interface 2_dayt29 November 3, 2021 Has attachment Education: Education Inquiry',
      ),
    ).tap()
    await expect(element(by.text('rn_image_picker_lib_temp_52383988-331b-4acc-baaf-9ae21c8a508e.jpg (0.92 MB)')))
  })

  it('verify that custom folders exist with messages', async () => {
    await element(by.text('Sent')).tap()
    await element(by.text('Messages')).tap()
    await expect(element(by.text('Custom Folder 2'))).toExist()
  })
})
