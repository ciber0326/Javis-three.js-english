import dayjs from "dayjs";
import 'dayjs/locale/ja';
import relativeTime from 'dayjs/plugin/relativeTime'
import updateLocale from 'dayjs/plugin/updateLocale'

dayjs.extend(relativeTime)
dayjs.extend(updateLocale)
dayjs.locale('ja');
dayjs.updateLocale('ja', {
  relativeTime: {
    past: '%s ago',
    s: 'now',
    m: '1min',
    mm: '%dmin',
    h: '1hour',
    hh: '%dhour',
    d: '1d',
    dd: '%dd',
    M: '1mon',
    MM: '%dmon',
    y: '1year',
    yy: '%dyear',
  },
});

export const compareTime = (date: Date) => {
  return dayjs(date).fromNow()
};