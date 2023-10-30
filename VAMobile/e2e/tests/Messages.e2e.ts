import { expect, by, element, device, waitFor} from 'detox'
import { loginToDemoMode, openMessages, openHealth, checkImages } from './utils'
import { setTimeout } from "timers/promises"
import { DateTime } from 'luxon'

export async function getDateWithTimeZone(dateString: string) {
  var date = DateTime.fromFormat(dateString, 'LLLL d, yyyy h:m a', {zone: 'America/Chicago'})
  var dateUTC = date.toLocal()
  var dateTime = dateUTC.toLocaleString(Object.assign(DateTime.DATETIME_FULL))
  if (device.getPlatform() === 'android') {
    dateTime = dateTime.replace(' at ', ', ')
  }
  return dateTime
}

export const MessagesE2eIdConstants = {
  MESSAGE_1_ID: 'Unread: Martha Kaplan, Md 10/26/2021 Medication: Naproxen side effects',
  MESSAGE_2_ID: 'Unread: Diana Persson, Md 10/26/2021 Has attachment COVID: Prepping for your visit',
  MESSAGE_10_ID: 'Ratana, Narin  9/17/2021 COVID: Test',
  START_NEW_MESSAGE_BUTTON_ID: 'startNewMessageButtonTestID',
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
}

var dateWithTimeZone

beforeAll(async () => {
  await loginToDemoMode()
  await openHealth()
  await openMessages()
})

describe('Messages Screen', () => { 
	it('should match the messages page design', async () => {
		await expect(element(by.id(MessagesE2eIdConstants.START_NEW_MESSAGE_BUTTON_ID))).toExist()
		await expect(element(by.text('Inbox (3)'))).toExist()
    await expect(element(by.text(MessagesE2eIdConstants.FOLDERS_TEXT))).toExist()
    await expect(element(by.id(MessagesE2eIdConstants.MESSAGE_1_ID))).toExist()
		await expect(element(by.id(MessagesE2eIdConstants.MESSAGE_2_ID))).toExist()	
	})

  it('should verify that the messages inbox is scrollable', async () => {
    await element(by.id(MessagesE2eIdConstants.MESSAGES_ID)).scrollTo('bottom')
    await expect(element(by.id(MessagesE2eIdConstants.MESSAGE_10_ID))).toBeVisible()
  })

  it('should tap on a message OLDER than 45 days and verify the correct info is displayed', async () => {
    await element(by.id(MessagesE2eIdConstants.MESSAGES_ID)).scrollTo('top')
    await element(by.id(MessagesE2eIdConstants.MESSAGE_2_ID)).tap()
    await expect(element(by.text('This conversation is too old for new replies'))).toExist()
    await expect(element(by.text('The last message in this conversation is more than 45 days old. To continue this conversation, start a new message.'))).toExist()
    await expect(element(by.text(MessagesE2eIdConstants.ONLY_USE_MESSAGES_TEXT))).toExist()
    await expect(element(by.id(MessagesE2eIdConstants.REVIEW_MESSAGE_REPLY_ID))).not.toExist()
    await expect(element(by.id(MessagesE2eIdConstants.START_NEW_MESSAGE_BUTTON_ID)))
  })

  it('should tap back and verify the message just opened is displayed as read', async () => {
    await element(by.text('Messages')).tap()
    await expect(element(by.id('Diana Persson, Md 10/26/2021 Has attachment COVID: Prepping for your visit'))).toExist()
  })

  it('should tap on a message NEWER than 45 days and verify the correct info is displayed', async () => {
    await element(by.id(MessagesE2eIdConstants.MESSAGE_1_ID)).tap()
    await expect(element(by.text(MessagesE2eIdConstants.ONLY_USE_MESSAGES_TEXT))).toExist()
    await expect(element(by.id(MessagesE2eIdConstants.REVIEW_MESSAGE_REPLY_ID))).toExist()
    await expect(element(by.text('Medication: Naproxen side effects'))).toExist()
    await expect(element(by.text('RATANA, NARIN '))).toExist()
    dateWithTimeZone = await getDateWithTimeZone('October 26, 2021 5:22 PM')
    await expect(element(by.id(dateWithTimeZone))).toExist()
    await expect(element(by.text('Upset stomach is a common side effect of this medication.  Mild stomach pain is normal, but if you are having severe stomach pains, please let us know or seek in-person care.'))).toExist()
    await expect(element(by.text('Only use messages for non-urgent needs'))).toExist()
  })

  it('should tap on and then cancel the move option', async () => {
    await element(by.text('Move')).tap()
    await element(by.text('Cancel')).tap()
  })

  it('should tap reply and verify the correct information is displayed', async () => {
    await element(by.id(MessagesE2eIdConstants.REVIEW_MESSAGE_REPLY_ID)).tap()
    await expect(element(by.id('To RATANA, NARIN '))).toExist()
    await expect(element(by.id('Subject Medication: Naproxen side effects'))).toExist()
    await expect(element(by.text(MessagesE2eIdConstants.ATTACHMENTS_BUTTON_TEXT))).toExist()
    await expect(element(by.id(MessagesE2eIdConstants.MESSAGE_INPUT_ID))).toExist()
    await expect(element(by.id(MessagesE2eIdConstants.SEND_BUTTON_ID))).toExist()
  })

  it('should tap the talk to the veterans crisis line now and verify it is displayed', async () => {
    await element(by.id('talk-to-the-veterans-crisis-line-now')).tap()
    await expect(element(by.text('Veterans Crisis Line'))).toExist()
    await element(by.text('Done')).tap()
  })

  it('should tap add files and verify the correct info is displayed', async () => {
    await element(by.text(MessagesE2eIdConstants.ATTACHMENTS_BUTTON_TEXT)).tap()
    await expect(element(by.text('What to know about attaching files'))).toExist()
    await expect(element(by.text('You can attach up to 4 files to each message.'))).toExist()
    await expect(element(by.text('You can attach only these file types: DOC, DOCX, GIF, PDF, JPG, PNG, RTF, TXT, XLS, or XLSX.'))).toExist()
    await expect(element(by.text('The maximum size for each file is 6 MB.'))).toExist()
    await expect(element(by.text('The maximum total size for all files attached to 1 message is 10 MB.'))).toExist()
    await expect(element(by.text('We can\'t save attachments in a draft.'))).toExist()
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

  it('should tap add files, tap select a file, and verify the correct action sheet options are displayed', async () => {
    await element(by.text(MessagesE2eIdConstants.ATTACHMENTS_BUTTON_TEXT)).tap()
    await element(by.text(MessagesE2eIdConstants.SELECT_A_FILE_ID)).tap()
    await expect(element(by.text(MessagesE2eIdConstants.ATTACHMENT_CAMERA_TEXT))).toExist()
    await expect(element(by.text(MessagesE2eIdConstants.ATTACHMENT_PHOTO_GALLERY_TEXT))).toExist()
    await expect(element(by.text(MessagesE2eIdConstants.ATTACHMENT_FILE_FOLDER_TEXT))).toExist()
  })

  it('should close the action sheet and tap cancel', async () => {
    if(device.getPlatform() === 'android') {
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

  it('should tap cancel and verify the correct action sheet and options are displayed', async () => {
    await element(by.text('Cancel')).tap()
    await expect(element(by.text('Delete your reply or save as draft?'))).toExist()
    await expect(element(by.text('If you save as a draft, we\'ll remove the attachments.'))).toExist()
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
    await element(by.id('Diana Persson, Md 10/26/2021 Has attachment COVID: Prepping for your visit')).tap()
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

  it('should tap start new message and verify the correct info is displayed', async () => {
    await element(by.id(MessagesE2eIdConstants.START_NEW_MESSAGE_BUTTON_ID)).tap()
    await expect(element(by.id(MessagesE2eIdConstants.START_NEW_MESSAGE_TO_ID))).toExist()
    await expect(element(by.id(MessagesE2eIdConstants.START_NEW_MESSAGE_CATEGORY_ID))).toExist()
    await expect(element(by.id(MessagesE2eIdConstants.START_NEW_MESSAGE_MESSAGE_FIELD_ID))).toExist()
    await expect(element(by.id(MessagesE2eIdConstants.START_NEW_MESSAGE_BUTTON_ID))).toExist()
    await expect(element(by.text(MessagesE2eIdConstants.START_NEW_MESSAGE_ADD_FILES_TEXT))).toExist()
    await expect(element(by.id(MessagesE2eIdConstants.START_NEW_MESSAGE_ONLY_USE_MESSAGES_ID))).toExist()
  })

  it('should tap the talk to the veterans crisis line now and verify it is displayed', async () => {
    await element(by.id('talk-to-the-veterans-crisis-line-now')).tap()
    await expect(element(by.text('Veterans Crisis Line'))).toExist()
    await element(by.text('Done')).tap()
  })

  it('should tap on the only use messages for non-urgent needs and verify the correct info is displayed', async () => {
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
    await element(by.text('Ok')).tap()
    await setTimeout(5000)
    await device.takeScreenshot('messagesHelpChat')
    await device.launchApp({ newInstance: false })
  })

  it('should close the messages help panel', async () => {
    await element(by.id('messagesHelpCloseTestID')).tap()
  })

  it('should tap the save button and verify the correct errors are displayed', async () => {
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
    await waitFor(element(by.id(MessagesE2eIdConstants.START_NEW_MESSAGE_CATEGORY_ID))).toBeVisible().whileElement(by.id(MessagesE2eIdConstants.START_NEW_MESSAGE_ID)).scroll(50, 'down')
    await element(by.id(MessagesE2eIdConstants.START_NEW_MESSAGE_CATEGORY_ID)).tap()
    await element(by.text('Medication')).tap()
    await element(by.text('Done')).tap()
  })

  it('should add and delete text in the subject field', async () => {
    await waitFor(element(by.id(MessagesE2eIdConstants.START_NEW_MESSAGE_SUBJECT_ID))).toBeVisible().whileElement(by.id(MessagesE2eIdConstants.START_NEW_MESSAGE_ID)).scroll(50, 'down')
    await element(by.id(MessagesE2eIdConstants.START_NEW_MESSAGE_SUBJECT_ID)).replaceText('Testing')
    await element(by.id(MessagesE2eIdConstants.START_NEW_MESSAGE_SUBJECT_ID)).clearText()
  }) 

  it('should tap cancel and verify the correct action sheet info is displayed', async() => {
    await element(by.id(MessagesE2eIdConstants.START_NEW_MESSAGE_CANCEL_ID)).tap()
    await expect(element(by.text('Delete message you started or save as draft?'))).toExist()
    await expect(element(by.text('If you save as a draft, we\'ll remove the attachments.'))).toExist()
    await expect(element(by.text(MessagesE2eIdConstants.MESSAGE_CANCEL_DELETE_TEXT))).toExist()
    await expect(element(by.text(MessagesE2eIdConstants.MESSAGE_CANCEL_SAVE_TEXT))).toExist()
    await expect(element(by.text(MessagesE2eIdConstants.MESSAGE_CANCEL_KEEP_EDITING_TEXT))).toExist()
  })

  it('should tap keep editing and verify the previous made fields are still filled', async () => {
    await element(by.text(MessagesE2eIdConstants.MESSAGE_CANCEL_KEEP_EDITING_TEXT)).tap()
    await expect(element(by.text('VA Flagship mobile applications interface_DAYT29'))).toExist()
    await expect(element(by.text('Medication'))).toExist()
  })

  it('should tap cancel, tap delete, and verify the user is returned to the messages screen', async () => {
    await element(by.id(MessagesE2eIdConstants.START_NEW_MESSAGE_CANCEL_ID)).tap()
    await element(by.text(MessagesE2eIdConstants.MESSAGE_CANCEL_DELETE_TEXT)).tap()
    await expect(element(by.id(MessagesE2eIdConstants.START_NEW_MESSAGE_BUTTON_ID))).toExist()
    await expect(element(by.text(MessagesE2eIdConstants.FOLDERS_TEXT))).toExist()
    await expect(element(by.id(MessagesE2eIdConstants.MESSAGE_1_ID))).toExist()
	  await expect(element(by.id('Diana Persson, Md 10/26/2021 Has attachment COVID: Prepping for your visit'))).toExist()	
  })

  it('should tap on a message with an attachment and verify the attachment is there', async () => {
    await element(by.id('Diana Persson, Md 10/26/2021 Has attachment COVID: Prepping for your visit')).tap()
    await expect(element(by.text('COVID-19-mRNA-infographic_G_508.pdf (0.17 MB)'))).toExist()
  })

  it('should navigate to the sent folder and select the first message', async () => {
    await device.launchApp({ newInstance: true })
    await loginToDemoMode()
    await openHealth()
    await openMessages()
    await element(by.text(MessagesE2eIdConstants.FOLDERS_TEXT)).tap()
    await element(by.text('Sent')).tap()
  })

  it('should tap on the first message and verify a message thread is displayed', async () => {
    await element(by.id('Va Flagship Mobile Applications Interface 2_dayt29 11/16/2021 Appointment: Preparing for your visit')).tap()
    dateWithTimeZone = await getDateWithTimeZone('November 12, 2021 6:07 PM')
    await expect(element(by.id('FREEMAN, MELVIN  V ' + dateWithTimeZone + ' '))).toExist()
    dateWithTimeZone = await getDateWithTimeZone('October 21, 2021 10:58 AM')
    await expect(element(by.id('RATANA, NARIN  ' + dateWithTimeZone + ' '))).toExist()
    dateWithTimeZone = await getDateWithTimeZone('October 15, 2021 5:55 PM')
    await expect(element(by.id('FREEMAN, MELVIN  V ' + dateWithTimeZone + ' has attachment'))).toExist()
    dateWithTimeZone = await getDateWithTimeZone('October 1, 2021 5:23 PM')
    await expect(element(by.id('RATANA, NARIN  ' + dateWithTimeZone + ' '))).toExist()
  })

  it('should expand and collapse a message with more than two lines', async () => {
    await element(by.id(MessagesE2eIdConstants.VIEW_MESSAGE_ID)).scrollTo('bottom')
    dateWithTimeZone = await getDateWithTimeZone('October 1, 2021 5:23 PM')
    var messageCollapsed = await element(by.id('RATANA, NARIN  ' + dateWithTimeZone + ' ')).takeScreenshot('MessageCollapsed')
    checkImages(messageCollapsed)
    await element(by.text(dateWithTimeZone)).tap()
    await element(by.id(MessagesE2eIdConstants.VIEW_MESSAGE_ID)).scrollTo('bottom')
    var messageExpanded = await element(by.id('RATANA, NARIN  ' + dateWithTimeZone + ' ')).takeScreenshot('MessageExpanded')
    checkImages(messageExpanded)
    await element(by.text('Sent')).tap()
    await element(by.text('Messages')).tap()
  })

  it('should navigate to the drafts folder and click the newest message', async () => {
    await device.launchApp({ newInstance: true })
    await loginToDemoMode()
    await openHealth()
    await openMessages()
    await element(by.text(MessagesE2eIdConstants.FOLDERS_TEXT)).atIndex(0).tap()
    await expect(element(by.text('Drafts (3)'))).toExist()
    await element(by.text('Drafts (3)')).tap()
    await waitFor(element(by.text('Test: Test Inquiry'))).toBeVisible().whileElement(by.id(MessagesE2eIdConstants.MESSAGES_ID)).scroll(300, 'down', NaN, 0.8)
    await element(by.text('Test: Test Inquiry')).tap()
  })

  it('should enter some text into the draft message, tap cancel and verify the action sheet that appears', async () => {
    await element(by.id(MessagesE2eIdConstants.EDIT_DRAFT_MESSAGE_FIELD_ID)).clearText()
    await element(by.id(MessagesE2eIdConstants.EDIT_DRAFT_MESSAGE_FIELD_ID)).replaceText('Testing')
    await element(by.id(MessagesE2eIdConstants.EDIT_DRAFT_CANCEL_ID)).tap()
    await expect(element(by.text('Delete changes to draft?'))).toExist()
    await expect(element(by.text('If you save your changes, we\'ll remove the attachments.'))).toExist()
    await expect(element(by.text(MessagesE2eIdConstants.EDIT_DRAFT_CANCEL_DELETE_TEXT))).toExist()
    await expect(element(by.text(MessagesE2eIdConstants.EDIT_DRAFT_CANCEL_SAVE_TEXT))).toExist()
    await expect(element(by.text(MessagesE2eIdConstants.MESSAGE_CANCEL_KEEP_EDITING_TEXT))).toExist()
  })

  it('should tap keep editing in the action sheet and verify the text previously entered is displayed', async () => {
    await element(by.text(MessagesE2eIdConstants.MESSAGE_CANCEL_KEEP_EDITING_TEXT)).tap()
    await expect(element(by.text('Testing'))).toExist()
  })

  it('should tap cancel, then delete changes, and verify that the draft is still in the list', async () => {
    await element(by.id(MessagesE2eIdConstants.EDIT_DRAFT_CANCEL_ID)).tap()
    await element(by.text(MessagesE2eIdConstants.EDIT_DRAFT_CANCEL_DELETE_TEXT)).tap()
    await expect(element(by.text('Test: Test Inquiry'))).toExist()
  })

  it('should open the previous editing draft and verify that no changes are displayed', async () => {   
    await element(by.text('Test: Test Inquiry')).tap()
    await expect(element(by.text('VA Flagship mobile applications interface 2_DAYT29'))).toExist()
    await expect(element(by.text('Test'))).toExist()
    await expect(element(by.text('Test Inquiry'))).toExist()
  })

  it('should verify a draft can be saved and that a alert appears stating the draft is saved', async () => {
    await element(by.id('editDraftTestID')).scrollTo('bottom')
    await element(by.id(MessagesE2eIdConstants.EDIT_DRAFT_MESSAGE_FIELD_ID)).clearText()
    await element(by.id(MessagesE2eIdConstants.EDIT_DRAFT_MESSAGE_FIELD_ID)).replaceText('Testing')
    await element(by.id(MessagesE2eIdConstants.EDIT_DRAFT_CANCEL_ID)).tap()
    await element(by.text(MessagesE2eIdConstants.EDIT_DRAFT_CANCEL_SAVE_TEXT)).tap()
    await expect(element(by.text('Draft saved'))).toExist()
    await element(by.text('Dismiss')).tap()
  })

  it('should open a draft message and verify it can be deleted from the more menu option', async () => {
    await element(by.text('Test: Test Inquiry')).tap()
    await element(by.text('More')).tap()
    await element(by.text('Delete')).tap()
    await element(by.text(MessagesE2eIdConstants.MESSAGE_CANCEL_DELETE_TEXT)).tap()
  })

  it('should navigate to folders and verify that the sent folder opens and is displayed correct', async () => {
    await element(by.text('Messages')).tap()
    await element(by.text('Sent')).tap()
    await expect(element(by.id(MessagesE2eIdConstants.START_NEW_MESSAGE_BUTTON_ID))).toExist()
    await expect(element(by.id('Va Flagship Mobile Applications Interface 2_dayt29 11/16/2021 Appointment: Preparing for your visit'))).toExist()
  })

  it('should verify a sent messages can display attachments', async () => {
    await element(by.id('Va Flagship Mobile Applications Interface 2_dayt29 11/3/2021 Has attachment Education: Education Inquiry')).tap()
    await expect(element(by.text('rn_image_picker_lib_temp_52383988-331b-4acc-baaf-9ae21c8a508e.jpg (0.92 MB)')))
  })

  it('should verify that custom folders exist with messages', async () => {
    await element(by.text('Sent')).tap()
    await element(by.text('Messages')).tap()
    await expect(element(by.text('Custom Folder 2'))).toExist()
  })
})
