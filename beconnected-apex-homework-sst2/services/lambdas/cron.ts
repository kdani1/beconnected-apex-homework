import { CloudWatchEvents, SQS } from 'aws-sdk'
import {
  convertDateToCronExpression,
  getNextNotificationDate,
} from 'domain/scheduler'
import { FlowStartMessageBody } from './types'

export const handler = async () => {
  const nextDate = await scheduleNextNotification()
  await sendFlowStartMessage(nextDate)
}

const sendFlowStartMessage = async (nextDate: Date) => {
  const flowStartQueueUrl = String(process.env.flowStartQueueUrl)

  const queue = new SQS()
  const flowStartMessageBody: FlowStartMessageBody = { nextDate }
  return queue
    .sendMessage({
      QueueUrl: flowStartQueueUrl,
      MessageBody: JSON.stringify(flowStartMessageBody),
    })
    .promise()
}

export const scheduleNextNotification = async (): Promise<Date> => {
  const cloudwatchevents = new CloudWatchEvents()

  const nextDate = getNextNotificationDate({})
  const scheduleExpression = convertDateToCronExpression(nextDate)

  await cloudwatchevents
    .putRule({
      Name: process.env.cloudwatchRuleName as string,
      ScheduleExpression: scheduleExpression,
    })
    .promise()
  return nextDate
}
