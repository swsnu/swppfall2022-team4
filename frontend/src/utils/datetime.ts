export function processTime(dateString: string) {
  const date = new Date(dateString);
  return date.toString();
}

export function timeAgoFormat(dateString: string) {
  const dateNow = new Date();
  const date = new Date(dateString);

  const timeDiff = dateNow.valueOf() - date.valueOf(); // (ms)
  const timeDiffInSec = Math.ceil(timeDiff / 1000);

  if (timeDiffInSec < 60) {
    return timeDiffInSec + '초 전';
  }
  const timeDiffInMinute = Math.ceil(timeDiffInSec / 60);
  if (timeDiffInMinute < 60) {
    return timeDiffInMinute + '분 전';
  }
  const timeDiffInHour = Math.ceil(timeDiffInMinute / 60);
  if (timeDiffInHour < 24) {
    return timeDiffInHour + '시간 전';
  }
  const timeDiffInDays = Math.ceil(timeDiffInHour / 24);
  if (timeDiffInDays < 365) {
    return timeDiffInDays + '일 전';
  }
  return '오래전';
}

export function dateDiff(dateString: string) {
  const dateNow = Date.now();
  const date = new Date(dateString);
  const timeDiff = dateNow - date.getTime();
  return Math.floor(timeDiff / 86400000) + 1;
}
