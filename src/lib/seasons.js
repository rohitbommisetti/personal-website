// Which seasonal footer to show. Add ?season=christmas|newyear (or none) to preview one.
const LABELS = {
  christmas: 'Merry Christmas',
  newyear: 'Happy New Year',
};

export const seasonFor = (date) => {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  if (month === 12 && day >= 20 && day <= 26) return 'christmas';
  if ((month === 12 && day === 31) || (month === 1 && day <= 2)) return 'newyear';
  return null;
};

// The year being celebrated: on Dec 31 that's next year.
export const newYear = (date) => (date.getMonth() === 11 ? date.getFullYear() + 1 : date.getFullYear());

export const currentSeason = (date = new Date()) => {
  const override = new URLSearchParams(window.location.search).get('season');
  if (override === 'none') return null;
  const id = LABELS[override] ? override : seasonFor(date);
  if (!id) return null;
  return { id, label: id === 'newyear' ? `Happy ${newYear(date)}` : LABELS[id] };
};
