type GetNextNotificationDate = {
  minHourUTC?: number
  maxHourUTC?: number
}
export const getNextNotificationDate = ({
  minHourUTC = 6,
  maxHourUTC = 19,
}: GetNextNotificationDate): Date => {
  const nextDate = new Date(Date.now() + 86400000)
  nextDate.setUTCHours(getRandomInt(minHourUTC, maxHourUTC))
  nextDate.setUTCMinutes(getRandomInt(0, 59))
  return nextDate
}

export const convertDateToCronExpression = (date: Date): string => {
  const day = date.getDay() + 1
  const minute = date.getUTCMinutes()
  const hour = date.getUTCHours()
  // Minutes | Hours |	Day of month |	Month |	Day of week |	Year
  return `cron(${minute} ${hour} ? * ${day} *)`
}

const getRandomInt = (min: number, max: number) => {
  const min2 = Math.ceil(min)
  const max2 = Math.floor(max)
  return Math.floor(Math.random() * (max2 - min2 + 1) + min2)
}
