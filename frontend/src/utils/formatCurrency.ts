export const formatCurrency = (number: number) => {
  if (number === 0) {
    return 'FREE'
  }

  return '$' + number.toLocaleString()
}
