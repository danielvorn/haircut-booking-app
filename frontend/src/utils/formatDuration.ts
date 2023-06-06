export const formatDuration = (minutes: number): string => {
  const hours: number = Math.floor(minutes / 60)
  const remainingMinutes: number = minutes % 60

  const hourText: string = hours === 1 ? 'hour' : 'hours'
  const minuteText: string = remainingMinutes === 1 ? 'minute' : 'minutes'

  if (minutes >= 60) {
    if (remainingMinutes === 0) {
      return `${hours} ${hourText}`
    }
    return `${hours} ${hourText} ${remainingMinutes} ${minuteText}`
  }

  return `${minutes} ${minuteText}`
}
