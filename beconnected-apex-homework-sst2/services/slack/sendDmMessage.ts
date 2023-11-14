import { getApp } from './app'
import { generateMessage } from './utils'

export type SendDmMessage = {
  clientSlackSecret: string
  userId: string
  message: string
  messageHeader: string
}

export const sendDmMessage = async ({
  clientSlackSecret,
  userId,
  message,
  messageHeader,
}: SendDmMessage) => {
  const app = getApp(clientSlackSecret)

  const { channel } = await app.client.conversations.open({
    users: userId,
  })
  if (channel?.id) {
    return app.client.chat.postMessage({
      mrkdwn: true,
      channel: channel.id,
      blocks: generateMessage(
        userId,
        undefined,
        message,
        undefined,
        messageHeader
      ).blocks,
    })
  }
}
