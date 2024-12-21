import dayjs from 'dayjs';

export const calculateDaysLeft = (startDate: string): string => {
  const today = dayjs().startOf('day');
  const start = dayjs(startDate).startOf('day');
  const diff = start.diff(today, 'day');

  if (diff > 0) {
    return diff === 1 ? '1 day left' : `${diff} days left`;
  } else if (diff === 0) {
    return 'Traveled';
  } else {
    return 'Traveled';
  }
};
