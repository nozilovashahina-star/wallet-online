export const formatMoney = (amount, currency = "so'm") => {
  if (amount === undefined || amount === null) return `0 ${currency}`;
  const formatted = Math.abs(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${formatted} ${currency}`;
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const timeStr = `${hours}:${minutes}`;

  if (isToday) {
    return `Bugun, ${timeStr}`;
  }

  const monthsUz = [
    'Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyun',
    'Iyul', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'
  ];

  const day = date.getDate();
  const month = monthsUz[date.getMonth()];
  return `${day}-${month}, ${timeStr}`;
};

export const getRelativeTimeString = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 10) return "Hozirgina";
  if (diffInSeconds < 60) return `${diffInSeconds} soniya avval`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} daqiqa avval`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} soat avval`;
  return formatDate(dateString);
};
