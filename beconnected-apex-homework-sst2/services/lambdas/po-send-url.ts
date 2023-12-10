import { S3Handler } from 'aws-lambda'
import { App } from '@slack/bolt'
import { Config } from 'sst/node/config'

export const handler: S3Handler = async () => {
  const slackBotToken = Config.SLACK_BOT_TOKEN
  const apiUrl = process.env.API_URL

  const app = new App({
    token: slackBotToken,
    signingSecret: 'not needed here',
  })

  // Function to get the user ID for a specific user group
  async function getUserIdByUserGroup(
    userGroupName: string
  ): Promise<string | undefined> {
    try {
      // Get the list of user groups
      const userGroupsResult = await app.client.usergroups.list()
      const userGroup = userGroupsResult.usergroups?.find(
        (group) => group.name === userGroupName
      )

      if (!userGroup) {
        console.error(`User group '${userGroupName}' not found.`)
        return undefined
      }

      // Get the list of users in the user group
      const usersResult = await app.client.usergroups.users.list({
        usergroup: userGroup!.id as string,
      })

      const userId = usersResult.users?.[0]
      return userId
    } catch (error) {
      console.error('Error fetching user group information from Slack:', error)
      return undefined
    }
  }

  const targetUserGroup = 'PO' // Replace with your actual user group name
  const userIdByUserGroup = await getUserIdByUserGroup(targetUserGroup)

  if (userIdByUserGroup) {
    console.log(
      `User ID in user group '${targetUserGroup}': ${userIdByUserGroup}`
    )
  } else {
    console.error(
      `User in user group '${targetUserGroup}' not found or an error occurred.`
    )
  }

  if (userIdByUserGroup) {
    await app.client.chat.postMessage({
      channel: userIdByUserGroup!, // Use the user's ID as the channel
      attachments: [
        {
          text:
            'Hi PO! Here is the link for you to start a new moment cycle anytime you want, you just need to open the link, wait for it to load, it will display {} when done, after that you can close it ' +
            apiUrl +
            '/trigger',
        },
      ],
    })
  }
}
