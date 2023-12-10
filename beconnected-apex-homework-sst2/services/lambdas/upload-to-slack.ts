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
    console.error(key)

    // Format today's date as 'yyyy.mm.dd'
    const today = new Date()
    const formattedDate = `${today.getFullYear()}.${(today.getMonth() + 1)
      .toString()
      .padStart(2, '0')}.${today.getDate().toString().padStart(2, '0')}`

    // Construct the channel name without special characters
    const baseChannelName = 'DailyFeed-BeConnected'
    const sanitizedDate = formattedDate.replace(/\W/g, '') // Remove non-word characters
    const dailyChannelName = `${baseChannelName}_${sanitizedDate}`.toLowerCase()

    const channelsListResponse = await app.client.conversations.list({
      types: 'public_channel,private_channel',
    })
    const channels = channelsListResponse.channels || [] // Use an empty array if channels is undefined

    // Identify channels with the name "Daily Feed BeConnected" and delete them
    const channelsToDelete = channels.filter((channel: any) => {
      const shouldDelete =
        channel.name.startsWith(baseChannelName.toLowerCase()) &&
        channel.name !== dailyChannelName
      return shouldDelete
    })

    for (const channelToDelete of channelsToDelete) {
      // Check if channelId is defined and not null before making the API call
      if (channelToDelete.id !== undefined && channelToDelete.id !== null) {
        try {
          // Check if the channel exists before attempting to archive it
          const channelInfo = await app.client.conversations.info({
            channel: channelToDelete.id,
          })

          if (channelInfo.ok) {
            // Check if the channel information and 'is_archived' property exist
            if (
              channelInfo.channel &&
              channelInfo.channel.is_archived !== undefined
            ) {
              // Channel exists, check if it's already archived
              if (!channelInfo.channel.is_archived) {
                // Channel is not archived, proceed with archiving
                await app.client.conversations.archive({
                  channel: channelToDelete.id,
                })
              } else {
                console.log(
                  `Channel ${channelToDelete.name} is already archived.`
                )
              }
            } else {
              console.error(
                `Invalid channel information for ${channelToDelete.name}`
              )
              // Handle errors if necessary
            }
          } else {
            console.error(
              `Error getting channel info for ${channelToDelete.name}: `,
              channelInfo.error
            )
            // Handle errors if necessary
          }
        } catch (error) {
          console.error(
            `Error archiving channel ${channelToDelete.name}: `,
            error
          )
          // Handle errors if necessary
        }
      }
    }

    let channelId: string

    // Find the channel ID based on the channel name
    const channel = channels.find((c: any) => c.name === dailyChannelName)

    channelId = channel?.id ?? ''

    try {
      // Create the channel if it was not found
      if (channelId === '') {
        const response = await app.client.conversations.create({
          name: dailyChannelName,
          is_private: true,
          restrict_access: true,
        })
        channelId = response.channel?.id ?? ''
      }
    } catch (error) {
      // If an error occurs, assume that the channel already exists and continue
      console.error('Error creating channel: ', error)
    }
    // Check if the user is already in the channel
    const userInChannelResponse = await app.client.conversations.members({
      channel: channelId,
    })

    // Use optional chaining and nullish coalescing to handle possible undefined
    const userInChannelMembers = userInChannelResponse?.members ?? []

    // Check if the user exists
    const user = await app.client.users.info({
      user: metaData.userid,
    })

    // If user is not in the channel and exists, then invite and upload the daily post
    if (!userInChannelMembers.includes(metaData.userid) && user) {
      await app.client.conversations.invite({
        channel: channelId,
        users: metaData.userid,
      })
      const getTimeDifference = (timestamp: string): string => {
        // Convert the timestamp string to a number
        const timestampNumber: number = parseInt(timestamp, 10)

        const now: Date = new Date()
        const uploadedTime: Date = new Date(timestampNumber)
        const timeDifferenceInSeconds: number =
          (now.getTime() - uploadedTime.getTime()) / 1000 // Convert to seconds
        const timeToUploadMins: number = 2
        const timeToUploadSec: number = timeToUploadMins * 60
        const secElapsed: number = Math.floor(timeDifferenceInSeconds)
        const minElapsed: number = Math.floor(secElapsed / 60)
        const hoursElapsed: number = Math.floor(minElapsed / 60)
        const latemin: number = minElapsed - timeToUploadMins
        const latesec: number = secElapsed - timeToUploadSec

        if (secElapsed < timeToUploadSec) {
          return ` in time! 🥳👏`
        } else if (secElapsed < 59 + timeToUploadSec) {
          return `${latesec}s late ⌛⏱️`
        } else if (minElapsed < 59 + timeToUploadMins) {
          return `${latemin}m late ⏰🚶‍♂️`
        } else {
          return `${hoursElapsed}h late 🌅🌘`
        }
      }

      // Upload the post to the daily private channel.
      const timeDifferenceText: string = getTimeDifference(metaData.timestamp)
      const imageurl = `https://${bucketName}.s3.eu-central-1.amazonaws.com/${metaData.userid}/${metaData.timestamp}`
      await app.client.chat.postMessage({
        channel: channelId,
        attachments: [
          {
            fallback: 'Uploaded a new picture',
            title: `Come check out <@${metaData.userid}> just uploaded a new BeConnected picture!`,
            text: `Uploaded ${timeDifferenceText}`,
            image_url: imageurl,
          },
        ],
      })
      await app.client.chat.postMessage({
        channel: publicChannelId,
        attachments: [
          {
            text: `<@${metaData.userid}> just uploaded a new BeConnected picture ${timeDifferenceText}! Upload yours to join!`,
          },
        ],
      })
    } else {
      console.log(
        `User already in the daily channel, so we assume that he already posted today.`
      )
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
