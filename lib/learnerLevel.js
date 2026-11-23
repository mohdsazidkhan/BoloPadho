/**
 * Learner level from real activity: every ANSWERS_PER_LEVEL tutor answers (each one a SPEND
 * transaction) is one level. Used by /api/chat (after an answer) and /api/user/profile.
 */
export const ANSWERS_PER_LEVEL = 10;

export function levelFor(answers) {
  return Math.floor(Math.max(0, answers || 0) / ANSWERS_PER_LEVEL) + 1;
}

/** Answers still needed to reach the next level. */
export function answersToNextLevel(answers) {
  const n = Math.max(0, answers || 0);
  return ANSWERS_PER_LEVEL - (n % ANSWERS_PER_LEVEL);
}

const DAY = 24 * 60 * 60 * 1000;

/** Whole calendar days between two dates (local time). */
function dayGap(from, to) {
  const a = new Date(from); a.setHours(0, 0, 0, 0);
  const b = new Date(to); b.setHours(0, 0, 0, 0);
  return Math.round((b - a) / DAY);
}

/**
 * Streak after activity now: same day keeps it, the next day adds one, a longer gap restarts at 1.
 * Mutates and returns the user document (caller saves).
 */
export function touchStreak(user, now = new Date()) {
  const gap = user.lastActiveDate ? dayGap(user.lastActiveDate, now) : null;
  if (gap === null || gap > 1 || !user.streak) user.streak = 1;
  else if (gap === 1) user.streak += 1;
  if (user.streak > (user.longestStreak || 0)) user.longestStreak = user.streak;
  user.lastActiveDate = now;
  return user;
}

/** The streak to show: a streak whose last active day is before yesterday has already broken. */
export function liveStreak(user, now = new Date()) {
  if (!user.lastActiveDate || !user.streak) return 0;
  return dayGap(user.lastActiveDate, now) > 1 ? 0 : user.streak;
}
