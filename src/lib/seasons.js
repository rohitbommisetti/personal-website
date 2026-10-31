// Which seasonal footer to show. Add ?season=halloween|christmas|newyear|birthday (or none) to preview one.
const LABELS = {
  halloween: 'Happy Halloween',
  christmas: 'Merry Christmas',
  newyear: 'Happy New Year',
  birthday: 'Today’s my birthday',
};

export const seasonFor = (date) => {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  if (month === 10 && day >= 25) return 'halloween';
  if (month === 12 && day >= 20 && day <= 26) return 'christmas';
  if ((month === 12 && day === 31) || (month === 1 && day <= 2)) return 'newyear';
  if (month === 7 && day === 20) return 'birthday';
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
