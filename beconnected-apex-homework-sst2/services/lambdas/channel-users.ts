import { SQSHandler } from 'aws-lambda'
import { SQS } from 'aws-sdk'
import { getSlackChannelUsers } from 'slack/getChannelUsers'
import { ChannelUsersMessageBody, UploadLinkMessageBody } from './types'

export const handler: SQSHandler = async (event) => {
  const queue = new SQS()
  for (const record of event.Records) {
    const recordBody = JSON.parse(record.body) as ChannelUsersMessageBody
    const users = await getChannelUsers(recordBody)
    await pushChannelUsersToNextQueue(queue, users)
  }
}

const getChannelUsers = async (
  recordBody: ChannelUsersMessageBody
): Promise<UploadLinkMessageBody[]> => {
  const userIds = await getSlackChannelUsers(recordBody)

  return userIds.map((userId) => ({
    ...recordBody,
    userId,
  }))
}

const pushChannelUsersToNextQueue = async (
  queue: SQS,
  users: UploadLinkMessageBody[]
) => {
  const uploadLinkQueueUrl = String(process.env.uploadLinkQueueUrl)
  for (const user of users) {
    await queue
      .sendMessage({
        QueueUrl: uploadLinkQueueUrl,
        MessageBody: JSON.stringify(user),
      })
      .promise()
  }
}
