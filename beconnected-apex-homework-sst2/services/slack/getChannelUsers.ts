import { ClientData } from '../lambdas/types'
import { getApp } from './app'

export const getSlackChannelUsers = async ({
  clientSlackSecret,
  clientChannelId,
}: ClientData) => {
  const app = getApp(clientSlackSecret)

  const users = await app.client.users.list()
  const bots = (users.members || [])
    .filter((user) => user.is_bot)
    .map((bot) => bot.id)

  const { members } = await app.client.conversations.members({
    channel: clientChannelId,
  })
  if (!members) {
    throw new Error('Error while fetching channel users')
  }
  return members.filter((user) => !bots.includes(user))
}
