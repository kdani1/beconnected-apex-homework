import { S3Handler } from 'aws-lambda'
import { S3 } from 'aws-sdk'
import { App } from '@slack/bolt'
import { S3ImageMetaData } from './types'
import { Config } from 'sst/node/config'

export const handler: S3Handler = async (event) => {
  const s3 = new S3()
  const slackBotToken = Config.SLACK_BOT_TOKEN
  const publicChannelId = Config.SLACK_CHANNEL_ID

  const app = new App({
    token: slackBotToken,
    signingSecret: 'not needed here',
  })

  for (const record of event.Records) {
    const key = record.s3.object.key
    const bucketName = record.s3.bucket.name
    const metaData = await getS3ObjectMetaData(s3, bucketName, key)

    const timeDifferenceText = getTimeDifference(metaData.timestamp)
    const imageurl = `https://${bucketName}.s3.eu-central-1.amazonaws.com/${metaData.userid}/${metaData.timestamp}`

    // Post a reply to the found message
    try {
      await app.client.chat.postMessage({
        channel: publicChannelId,
        thread_ts: metaData.threadid,
        text: `<@${metaData.userid}> Uploaded a ${timeDifferenceText}`,
        attachments: [
          {
            fallback: 'Uploaded a new picture',
            title: `Check out <@${metaData.userid}>'s new BeConnected picture!`,
            image_url: imageurl,
          },
        ],
      })
      console.log('Reply to the specific message sent successfully.')
    } catch (error) {
      console.error('Error sending reply:', error)
    }
  }
}

const getS3ObjectMetaData = async (
  s3: S3,
  bucketName: string,
  key: string
): Promise<S3ImageMetaData> => {
  const headObjectOutput = await s3
    .headObject({ Bucket: bucketName, Key: key })
    .promise()
  return headObjectOutput.Metadata as S3ImageMetaData
}

// Function to calculate time difference
const getTimeDifference = (timestamp: string): string => {
  // Convert the timestamp string to a number
  const timestampNumber: number = parseInt(timestamp, 10)

  const now: Date = new Date()
  const initialMomentMessagePosted: Date = new Date(timestampNumber)
  const timeDifferenceInSeconds: number =
    (now.getTime() - initialMomentMessagePosted.getTime()) / 1000 // Convert to seconds
  const timeToUploadMins: number = 2
  const timeToUploadSec: number = timeToUploadMins * 60
  const secElapsed: number = Math.floor(timeDifferenceInSeconds)
  const minElapsed: number = Math.floor(secElapsed / 60)
  const hoursElapsed: number = Math.floor(minElapsed / 60)
  const latemin: number = minElapsed - timeToUploadMins
  const latesec: number = secElapsed - timeToUploadSec

  if (secElapsed < timeToUploadSec) {
    return ` new picture in time! 🥳👏`
  } else if (secElapsed < 59 + timeToUploadSec) {
    return `${latesec}s late ⌛⏱️`
  } else if (minElapsed < 59 + timeToUploadMins) {
    return `${latemin}m late ⏰🚶‍♂️`
  } else {
    return `${hoursElapsed}h late 🌅🌘`
  }
}
