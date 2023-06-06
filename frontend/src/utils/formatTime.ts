export const formatTime = (time: Date | string) => {
  if (typeof time === 'string') {
    return new Date(time)?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  return time?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
