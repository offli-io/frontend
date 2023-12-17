export function getTimeDifference(dateTimeFrom: Date | null, dateTimeUntil: Date | null) {
  if (!dateTimeFrom || !dateTimeUntil) {
    return null;
  }

  // let durationDays = null
  // get total seconds between the times
  let delta = Math.abs(dateTimeUntil.getTime() - dateTimeFrom.getTime()) / 1000;

  // calculate (and subtract) whole days
  const durationDays = Math.floor(delta / 86400);
  delta -= durationDays * 86400;

  // calculate (and subtract) whole hours
  const durationHours = Math.floor(delta / 3600) % 24;
  delta -= durationHours * 3600;

  // calculate (and subtract) whole minutes
  const durationMinutes = Math.floor(delta / 60) % 60;
  //delta -= minutes * 60;

  return { durationHours, durationMinutes, durationDays };
}
