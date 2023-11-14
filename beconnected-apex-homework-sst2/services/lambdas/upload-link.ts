import { SQSHandler } from 'aws-lambda'
import { S3, SQS } from 'aws-sdk'
import { UploadLinkMessageBody, S3ImageMetaData } from './types'

export const handler: SQSHandler = async (event) => {
  for (const record of event.Records) {
    const recordBody = JSON.parse(record.body) as UploadLinkMessageBody
    await createS3UploadLink(recordBody)
  }
}

const createS3UploadLink = async ({
  userId,
  threadId,
  clientSlackSecret,
  nextDate,
  clientChannelId,
}: UploadLinkMessageBody) => {
  const sendDmQueueUrl = String(process.env.sendDmQueueUrl)
  const bucketName = String(process.env.bucketName)

  const queue = new SQS()
  const s3 = new S3()
  const timestamp = Date.now().toString()

  const metaData: S3ImageMetaData = {
    userid: userId,
    threadid: threadId,
    clientslacksecret: clientSlackSecret,
    timestamp,
    clientchannelid: clientChannelId,
  }

  const expiryInSeconds = Math.floor((+new Date(nextDate) - Date.now()) / 1000)

  const uploadLink = await s3.getSignedUrlPromise('putObject', {
    Bucket: bucketName,
    Key: `${userId}/${timestamp}`,
    Expires: expiryInSeconds,
    ACL: 'public-read',
    ContentType: 'image/*',
    Metadata: metaData,
  })

  await queue
    .sendMessage({
      QueueUrl: sendDmQueueUrl,
      MessageBody: JSON.stringify({
        clientSlackSecret,
        userId,
        uploadLink,
      }),
    })
    .promise()
}
