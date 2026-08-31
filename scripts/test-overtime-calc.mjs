function timeToMinutes(time) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function sessionMinutes(start, finish, breakMinutes) {
  let duration = timeToMinutes(finish) - timeToMinutes(start);
  if (duration < 0) duration += 24 * 60;
  return Math.max(0, duration - breakMinutes);
}

function formatShiftClaimFromMinutes(totalMinutes) {
  const rounded = Math.max(0, Math.round(totalMinutes));
  const hours = Math.floor(rounded / 60);
  const minutes = rounded % 60;
  if (hours === 0 && minutes === 0) return '0 hour';
  if (minutes === 0) return hours === 1 ? '1 hour' : `${hours} hour`;
  if (minutes === 30) return hours === 0 ? '30 min' : `${hours} hour 30 min`;
  if (hours === 0) return `${minutes} min`;
  return `${hours} hour ${minutes} min`;
}

function calculateOvertime(input) {
  const onSiteMinutes = sessionMinutes(
    input.start,
    input.finish,
    input.breakMinutes,
  );
  const normalMinutes = input.fullOvertimeDay
    ? 0
    : Math.round(input.normalShiftHours * 60);
  const overtimeMinutes = Math.max(0, onSiteMinutes - normalMinutes);
  return {
    minutes: overtimeMinutes,
    text: formatShiftClaimFromMinutes(overtimeMinutes),
  };
}

const cases = [
  {
    name: 'weekday 9-2 no break minus 4hr normal',
    input: {
      start: '09:00',
      finish: '14:00',
      breakMinutes: 0,
      normalShiftHours: 4,
      fullOvertimeDay: false,
    },
    expected: '1 hour',
  },
  {
    name: 'Saturday full session',
    input: {
      start: '09:00',
      finish: '14:00',
      breakMinutes: 0,
      normalShiftHours: 4,
      fullOvertimeDay: true,
    },
    expected: '5 hour',
  },
  {
    name: 'bank holiday style full session',
    input: {
      start: '09:00',
      finish: '14:00',
      breakMinutes: 0,
      normalShiftHours: 4,
      fullOvertimeDay: true,
    },
    expected: '5 hour',
  },
  {
    name: 'long day with 1hr break minus 4hr normal',
    input: {
      start: '07:00',
      finish: '17:30',
      breakMinutes: 60,
      normalShiftHours: 4,
      fullOvertimeDay: false,
    },
    expected: '5 hour 30 min',
  },
];

let failed = 0;

for (const testCase of cases) {
  const result = calculateOvertime(testCase.input);
  if (result.text !== testCase.expected) {
    console.error(
      `FAIL: ${testCase.name} — expected "${testCase.expected}", got "${result.text}"`,
    );
    failed += 1;
  }
}

if (failed > 0) {
  console.error(`${failed} overtime calc test(s) failed.`);
  process.exit(1);
}

console.log('Overtime calc tests passed.');
