import { seasonFor, newYear } from './seasons';

const on = (month, day, year = 2027) => seasonFor(new Date(year, month - 1, day));

test('picks the right occasion for each window', () => {
  expect(on(10, 31)).toBeNull();
  expect(on(12, 19)).toBeNull();
  expect(on(12, 20)).toBe('christmas');
  expect(on(12, 26)).toBe('christmas');
  expect(on(12, 27)).toBeNull();
  expect(on(12, 31)).toBe('newyear');
  expect(on(1, 2)).toBe('newyear');
  expect(on(1, 3)).toBeNull();
  expect(on(7, 20)).toBeNull();
});

test('celebrates the upcoming year on New Year’s Eve', () => {
  expect(newYear(new Date(2026, 11, 31))).toBe(2027);
  expect(newYear(new Date(2027, 0, 1))).toBe(2027);
});
