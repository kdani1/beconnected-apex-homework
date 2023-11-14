import { App } from '@slack/bolt'
;(async () => {
  const app = new App({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    token: process.env.SLACK_BOT_TOKEN,
  })

  const channels = await app.client.conversations.list({
    exclude_archived: true,
    limit: 1000,
  })

  const channel = channels.channels?.find(
    (channel) => channel.name === process.env.SLACK_CHANNEL_NAME
  )

  await app.client.conversations.archive({
    channel: channel?.id as string,
  })
})()
