import { SQSHandler } from 'aws-lambda'
import { SQS } from 'aws-sdk'
import {
  ClientData,
  CreateMomentMessageBody,
  FlowStartMessageBody,
} from './types'
import { Config } from 'sst/node/config'

export const handler: SQSHandler = async (event) => {
  const clients = getClients()

  for (const record of event.Records) {
    const { nextDate } = JSON.parse(record.body) as FlowStartMessageBody
    await sendFlowStartMessage(nextDate, clients)
  }
}

const sendFlowStartMessage = async (nextDate: Date, clients: ClientData[]) => {
  const createMomentQueueUrl = String(process.env.createMomentQueueUrl)
  const queue = new SQS()

  for (const client of clients) {
    const createMomentMessageBody: CreateMomentMessageBody = {
      nextDate,
      ...client,
    }

    await queue
      .sendMessage({
        QueueUrl: createMomentQueueUrl,
        MessageBody: JSON.stringify(createMomentMessageBody),
      })
      .promise()
  }
}

const getClients = (): ClientData[] => {
  return [
    {
      clientName: 'Apex Lab',
      clientSlackSecret: Config.SLACK_SIGNING_SECRET,
      clientChannelId: Config.SLACK_CHANNEL_ID,
    },
  ]
}
