import { SQSHandler } from 'aws-lambda'
import { SQS } from 'aws-sdk'
import { createThread } from '../slack/createThread'
import { CreateMomentMessageBody } from './types'

export const handler: SQSHandler = async (event) => {
  for (const record of event.Records) {
    const recordBody = JSON.parse(record.body) as CreateMomentMessageBody
    await createMoment(recordBody)
  }
}

const createMoment = async (recordBody: CreateMomentMessageBody) => {
  const channelUsersQueueUrl = String(process.env.channelUsersQueueUrl)
  const queue = new SQS()

  const response = await createThread(recordBody)
  if (!response || !response.ok || !response.ts) {
    throw new Error('Error creating message thread')
  }

  const messageBody = { ...recordBody, threadId: response.ts }

  await queue
    .sendMessage({
      QueueUrl: channelUsersQueueUrl,
      MessageBody: JSON.stringify(messageBody),
    })
    .promise()
}
