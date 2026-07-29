import type { WeekDay } from "@/types/game";
import type {
  RoutineDefinition,
  RoutinePeriod,
  RoutineProgress,
  RoutineSaveData,
} from "@/types/routines";

export const ROUTINE_SAVE_KEY = "ras-routines-v1";
export const ROUTINE_SCHEMA_VERSION = 1;

export function getLocalDate() {
  return new Date().toLocaleDateString("fr-CA");
}

function parseDate(date: string) {
  return new Date(`${date}T12:00:00`);
}

function formatDate(date: Date) {
  return date.toLocaleDateString("fr-CA");
}

export function addDays(date: string, amount: number) {
  const nextDate = parseDate(date);
  nextDate.setDate(nextDate.getDate() + amount);
  return formatDate(nextDate);
}

function addMonths(date: string, amount: number) {
  const nextDate = parseDate(date);
  const originalDay = nextDate.getDate();

  nextDate.setDate(1);
  nextDate.setMonth(nextDate.getMonth() + amount);

  const lastDay = new Date(
    nextDate.getFullYear(),
    nextDate.getMonth() + 1,
    0
  ).getDate();

  nextDate.setDate(Math.min(originalDay, lastDay));
  return formatDate(nextDate);
}

function daysBetween(first: string, second: string) {
  const milliseconds =
    parseDate(second).getTime() - parseDate(first).getTime();

  return Math.round(milliseconds / 86_400_000);
}

function getWeekDay(date: string) {
  return parseDate(date).getDay() as WeekDay;
}

function getWeekStart(date: string) {
  const weekDay = getWeekDay(date);
  const daysSinceMonday = weekDay === 0 ? 6 : weekDay - 1;
  return addDays(date, -daysSinceMonday);
}

function getDateForWeekDay(weekStart: string, weekDay: WeekDay) {
  const offset = weekDay === 0 ? 6 : weekDay - 1;
  return addDays(weekStart, offset);
}

function getFirstWeekDayOfMonth(
  year: number,
  month: number,
  weekDay: WeekDay
) {
  const firstDate = new Date(year, month - 1, 1, 12);
  const offset = (weekDay - firstDate.getDay() + 7) % 7;
  firstDate.setDate(1 + offset);
  return formatDate(firstDate);
}

function getLastDayOfMonth(date: string) {
  const parsed = parseDate(date);
  return new Date(
    parsed.getFullYear(),
    parsed.getMonth() + 1,
    0,
    12
  ).getDate();
}

function getIntervalDueDate(
  startDate: string,
  date: string,
  intervalDays: number
) {
  const difference = daysBetween(startDate, date);

  if (difference < 0) return null;

  const intervalIndex = Math.floor(difference / intervalDays);
  return addDays(startDate, intervalIndex * intervalDays);
}

function getOpenIntervalDueDate(
  startDate: string,
  date: string,
  intervalDays: number,
  earlyWindowDays = 0
) {
  if (date < startDate) {
    return (
      earlyWindowDays > 0 &&
        date >= addDays(startDate, -earlyWindowDays)
    )
      ? startDate
      : null;
  }

  const currentDueDate = getIntervalDueDate(
    startDate,
    date,
    intervalDays
  );

  if (!currentDueDate || earlyWindowDays === 0) {
    return currentDueDate;
  }

  const nextDueDate = addDays(currentDueDate, intervalDays);

  return date >= addDays(nextDueDate, -earlyWindowDays)
    ? nextDueDate
    : currentDueDate;
}

function getIntervalMonthDueDate(
  startDate: string,
  date: string,
  intervalMonths: number
) {
  if (date < startDate) return null;

  let dueDate = startDate;

  while (addMonths(dueDate, intervalMonths) <= date) {
    dueDate = addMonths(dueDate, intervalMonths);
  }

  return dueDate;
}

function isDueMonth(date: string, intervalMonths: number) {
  const parsed = parseDate(date);
  return parsed.getMonth() % intervalMonths === 0;
}

export function getRoutineTargetCount(routine: RoutineDefinition) {
  if (routine.cadence.kind === "weekly-pattern") {
    return (
      routine.cadence.requiredDays.length +
      routine.cadence.flexibleDayGroups.length
    );
  }

  return routine.targetCount ?? 1;
}

export function getRoutinePeriodKey(
  routine: RoutineDefinition,
  date: string
) {
  const cadence = routine.cadence;

  if (cadence.kind === "daily") {
    return cadence.days.includes(getWeekDay(date)) ? date : null;
  }

  if (cadence.kind === "weekly-pattern") {
    const availableDays = new Set([
      ...cadence.requiredDays,
      ...cadence.flexibleDayGroups.flat(),
    ]);

    return availableDays.has(getWeekDay(date))
      ? `week-${getWeekStart(date)}`
      : null;
  }

  if (cadence.kind === "monthly") {
    if (!isDueMonth(date, cadence.intervalMonths)) return null;
    return `month-${date.slice(0, 7)}`;
  }

  if (cadence.kind === "monthly-day") {
    return parseDate(date).getDate() === cadence.day ? date : null;
  }

  if (cadence.kind === "monthly-first-weekday") {
    const parsed = parseDate(date);
    const dueDate = getFirstWeekDayOfMonth(
      parsed.getFullYear(),
      parsed.getMonth() + 1,
      cadence.weekDay
    );

    return date === dueDate ? dueDate : null;
  }

  if (cadence.kind === "interval-days") {
    const dueDate = getOpenIntervalDueDate(
      cadence.startDate,
      date,
      cadence.intervalDays,
      cadence.earlyWindowDays
    );

    return dueDate ? `due-${dueDate}` : null;
  }

  if (cadence.kind === "interval-months") {
    const dueDate = getIntervalMonthDueDate(
      cadence.startDate,
      date,
      cadence.intervalMonths
    );

    return dueDate ? `due-${dueDate}` : null;
  }

  const parsed = parseDate(date);

  if (parsed.getMonth() + 1 !== cadence.month) return null;

  const dueDate = getFirstWeekDayOfMonth(
    parsed.getFullYear(),
    cadence.month,
    cadence.weekDay
  );

  return date === dueDate ? dueDate : null;
}

export function getRoutinePeriodLabel(
  routine: RoutineDefinition,
  periodKey: string
) {
  if (routine.cadence.kind === "weekly-pattern") {
    const startDate = periodKey.replace("week-", "");
    return `Semaine du ${startDate}`;
  }

  if (routine.cadence.kind === "monthly") {
    return periodKey.replace("month-", "");
  }

  return periodKey.replace("due-", "");
}

export function isRoutineAvailable(
  routine: RoutineDefinition,
  date: string
) {
  return getRoutinePeriodKey(routine, date) !== null;
}

function isWeeklyPatternComplete(
  routine: RoutineDefinition,
  period: RoutinePeriod,
  periodKey: string
) {
  if (routine.cadence.kind !== "weekly-pattern") return false;

  const weekStart = periodKey.replace("week-", "");

  const requiredDaysComplete = routine.cadence.requiredDays.every(
    (weekDay) =>
      period.completionDates.includes(
        getDateForWeekDay(weekStart, weekDay)
      )
  );

  const flexibleGroupsComplete =
    routine.cadence.flexibleDayGroups.every((group) =>
      group.some((weekDay) =>
        period.completionDates.includes(
          getDateForWeekDay(weekStart, weekDay)
        )
      )
    );

  return requiredDaysComplete && flexibleGroupsComplete;
}

export function isRoutinePeriodComplete(
  routine: RoutineDefinition,
  period: RoutinePeriod,
  periodKey: string
) {
  if (routine.cadence.kind === "weekly-pattern") {
    return isWeeklyPatternComplete(routine, period, periodKey);
  }

  return period.count >= getRoutineTargetCount(routine);
}

function getEvaluationPeriodKey(
  routine: RoutineDefinition,
  date: string
) {
  const cadence = routine.cadence;

  if (cadence.kind === "daily") {
    return cadence.days.includes(getWeekDay(date)) ? date : null;
  }

  if (cadence.kind === "weekly-pattern") {
    return getWeekDay(date) === 0
      ? `week-${getWeekStart(date)}`
      : null;
  }

  if (cadence.kind === "monthly") {
    const isLastDay =
      parseDate(date).getDate() === getLastDayOfMonth(date);

    return isLastDay && isDueMonth(date, cadence.intervalMonths)
      ? `month-${date.slice(0, 7)}`
      : null;
  }

  if (
    cadence.kind === "monthly-day" ||
    cadence.kind === "monthly-first-weekday" ||
    cadence.kind === "yearly-first-weekday"
  ) {
    return getRoutinePeriodKey(routine, date);
  }

  if (cadence.kind === "interval-days") {
    const dueDate = getIntervalDueDate(
      cadence.startDate,
      date,
      cadence.intervalDays
    );

    if (!dueDate) return null;

    const nextDueDate = addDays(dueDate, cadence.intervalDays);
    const earlyWindowDays = cadence.earlyWindowDays ?? 0;

    return date ===
      addDays(nextDueDate, -(earlyWindowDays + 1))
      ? `due-${dueDate}`
      : null;
  }

  const dueDate = getIntervalMonthDueDate(
    cadence.startDate,
    date,
    cadence.intervalMonths
  );

  if (!dueDate) return null;

  const nextDueDate = addMonths(dueDate, cadence.intervalMonths);
  return date === addDays(nextDueDate, -1) ? `due-${dueDate}` : null;
}

function createRoutineProgress(): RoutineProgress {
  return {
    currentStreak: 0,
    bestStreak: 0,
    history: [],
  };
}

function createRoutinePeriod(): RoutinePeriod {
  return {
    count: 0,
    completionDates: [],
    finalized: false,
  };
}

export function createRoutineSave(
  routines: RoutineDefinition[],
  today = getLocalDate()
): RoutineSaveData {
  return {
    schemaVersion: ROUTINE_SCHEMA_VERSION,
    lastEvaluatedDate: today,
    progress: Object.fromEntries(
      routines.map((routine) => [
        routine.id,
        createRoutineProgress(),
      ])
    ),
    periods: Object.fromEntries(
      routines.map((routine) => [routine.id, {}])
    ),
    physicalAssessments: [],
  };
}

export function normalizeRoutineSave(
  value: unknown,
  routines: RoutineDefinition[],
  today = getLocalDate()
): RoutineSaveData {
  const fallback = createRoutineSave(routines, today);

  if (
    typeof value !== "object" ||
    value === null ||
    Array.isArray(value)
  ) {
    return fallback;
  }

  const raw = value as Partial<RoutineSaveData>;

  routines.forEach((routine) => {
    const rawProgress = raw.progress?.[routine.id];
    const rawPeriods = raw.periods?.[routine.id];

    fallback.progress[routine.id] = {
      currentStreak:
        typeof rawProgress?.currentStreak === "number"
          ? Math.max(0, Math.round(rawProgress.currentStreak))
          : 0,
      bestStreak:
        typeof rawProgress?.bestStreak === "number"
          ? Math.max(0, Math.round(rawProgress.bestStreak))
          : 0,
      history: Array.isArray(rawProgress?.history)
        ? rawProgress.history.filter(
            (entry) =>
              entry &&
              typeof entry.periodKey === "string" &&
              typeof entry.evaluatedAt === "string"
          )
        : [],
    };

    fallback.periods[routine.id] =
      rawPeriods && typeof rawPeriods === "object"
        ? rawPeriods
        : {};
  });

  fallback.schemaVersion = ROUTINE_SCHEMA_VERSION;
  fallback.lastEvaluatedDate =
    typeof raw.lastEvaluatedDate === "string"
      ? raw.lastEvaluatedDate
      : today;
  fallback.physicalAssessments = Array.isArray(
    raw.physicalAssessments
  )
    ? raw.physicalAssessments
    : [];

  return fallback;
}

function finalizePeriod(
  save: RoutineSaveData,
  routine: RoutineDefinition,
  periodKey: string,
  evaluatedAt: string
) {
  const routinePeriods = save.periods[routine.id] ?? {};
  const period =
    routinePeriods[periodKey] ?? createRoutinePeriod();

  if (period.finalized) return;

  const completed = isRoutinePeriodComplete(
    routine,
    period,
    periodKey
  );

  const progress =
    save.progress[routine.id] ?? createRoutineProgress();
  const streakIncrement = routine.streakIncrement ?? 1;
  const currentStreak = completed
    ? progress.currentStreak + streakIncrement
    : 0;

  save.progress[routine.id] = {
    currentStreak,
    bestStreak: Math.max(progress.bestStreak, currentStreak),
    history: [
      {
        periodKey,
        periodLabel: getRoutinePeriodLabel(routine, periodKey),
        evaluatedAt,
        status: completed ? "completed" : "missed",
        completedCount: period.count,
        targetCount: getRoutineTargetCount(routine),
      },
      ...progress.history,
    ],
  };

  save.periods[routine.id] = {
    ...routinePeriods,
    [periodKey]: {
      ...period,
      finalized: true,
    },
  };
}

export function advanceRoutineSave(
  sourceSave: RoutineSaveData,
  routines: RoutineDefinition[],
  today = getLocalDate()
) {
  const save = structuredClone(sourceSave);
  let cursor = save.lastEvaluatedDate;

  while (cursor < today) {
    routines.forEach((routine) => {
      const periodKey = getEvaluationPeriodKey(routine, cursor);

      if (periodKey) {
        finalizePeriod(save, routine, periodKey, cursor);
      }
    });

    cursor = addDays(cursor, 1);
  }

  save.lastEvaluatedDate = today;
  return save;
}

export function completeRoutinePeriod(
  sourceSave: RoutineSaveData,
  routine: RoutineDefinition,
  date = getLocalDate()
) {
  const periodKey = getRoutinePeriodKey(routine, date);

  if (!periodKey) return sourceSave;

  const save = structuredClone(sourceSave);
  const routinePeriods = save.periods[routine.id] ?? {};
  const period =
    routinePeriods[periodKey] ?? createRoutinePeriod();

  if (period.finalized) return sourceSave;

  const alreadyCompletedToday =
    period.completionDates.includes(date);

  if (
    alreadyCompletedToday &&
    !routine.allowMultiplePerDay
  ) {
    return sourceSave;
  }

  const targetCount = getRoutineTargetCount(routine);

  if (
    routine.allowMultiplePerDay &&
    period.count >= targetCount
  ) {
    return sourceSave;
  }

  const nextPeriod: RoutinePeriod = {
    ...period,
    count: period.count + 1,
    completionDates: alreadyCompletedToday
      ? period.completionDates
      : [...period.completionDates, date],
  };

  save.periods[routine.id] = {
    ...routinePeriods,
    [periodKey]: nextPeriod,
  };

  if (
    isRoutinePeriodComplete(routine, nextPeriod, periodKey)
  ) {
    finalizePeriod(save, routine, periodKey, date);
  }

  return save;
}

export function getRoutinePeriod(
  save: RoutineSaveData,
  routine: RoutineDefinition,
  date = getLocalDate()
) {
  const periodKey = getRoutinePeriodKey(routine, date);

  if (!periodKey) {
    return {
      periodKey: null,
      period: createRoutinePeriod(),
    };
  }

  return {
    periodKey,
    period:
      save.periods[routine.id]?.[periodKey] ??
      createRoutinePeriod(),
  };
}

export function formatRoutineCadence(routine: RoutineDefinition) {
  const cadence = routine.cadence;

  if (cadence.kind === "daily") {
    return cadence.days.length === 7
      ? "Tous les jours"
      : "Jours planifiés";
  }

  if (cadence.kind === "weekly-pattern") {
    return "Objectif hebdomadaire";
  }

  if (cadence.kind === "monthly") {
    return cadence.intervalMonths === 1
      ? "Une fois par mois"
      : `Tous les ${cadence.intervalMonths} mois`;
  }

  if (cadence.kind === "monthly-day") {
    return `Chaque ${cadence.day} du mois`;
  }

  if (cadence.kind === "monthly-first-weekday") {
    return "Premier dimanche du mois";
  }

  if (cadence.kind === "interval-days") {
    return `Tous les ${cadence.intervalDays} jours`;
  }

  if (cadence.kind === "interval-months") {
    return `Tous les ${cadence.intervalMonths} mois`;
  }

  return "Premier dimanche de janvier";
}
