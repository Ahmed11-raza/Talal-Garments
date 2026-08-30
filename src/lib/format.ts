export function formatPrice(price: number): string {
  // Prices are whole PKR. We do NOT divide by 100. 
  // 2800 = Rs. 2,800
  return `Rs. ${price.toLocaleString('en-PK')}`
}

export function generateOrderNumber(): string {
  const date = new Date()
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const random = Math.floor(1000 + Math.random() * 9000)
  return `TG-${year}${month}-${random}`
}

export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return new Intl.DateTimeFormat('en-PK', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(d)
}
