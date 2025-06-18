export function getDefaultLast7DaysRange() {
  const today = new Date();
  const prev7 = new Date();
  prev7.setDate(today.getDate() - 6);
  return {
    start: prev7.toISOString().slice(0, 10),
    end: today.toISOString().slice(0, 10)
  };
}
