import { SQSHandler } from 'aws-lambda'
import { sendDmMessage } from 'slack/sendDmMessage'
import { makeShortLinkText } from 'slack/utils'
import { SendDmMessageBody } from './types'

export const handler: SQSHandler = async (event) => {
  for (const record of event.Records) {
    const recordBody = JSON.parse(record.body) as SendDmMessageBody
    await sendDirectMessageToUser(recordBody)
  }
}

const sendDirectMessageToUser = async (recordBody: SendDmMessageBody) => {
  const siteUrl = String(process.env.siteUrl)

  const appUrl = `${siteUrl}?uploadUrl=${encodeURIComponent(
    recordBody.uploadLink
  )}`

  const messageHeader = `, it is time to share your moment. Hurry up! ⏳`
  const message = `Upload your moment --> ${makeShortLinkText(appUrl, '📸')}`

  await sendDmMessage({ ...recordBody, message, messageHeader })
}
