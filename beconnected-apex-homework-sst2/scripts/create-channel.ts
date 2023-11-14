import { App } from '@slack/bolt'
import fs from 'fs'
;(async () => {
  const app = new App({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    token: process.env.SLACK_BOT_TOKEN,
  })

  const channels = await app.client.conversations.list({
    exclude_archived: true,
    limit: 1000,
  })
  let channel = channels.channels?.find(
    (channel) => channel.name === process.env.SLACK_CHANNEL_NAME
  )

  if (!channel) {
    const response = await app.client.conversations.create({
      name: process.env.SLACK_CHANNEL_NAME as string,
    })
    channel = response.channel
  }

  fs.writeFileSync('channelId', channel?.id as string)
})()
