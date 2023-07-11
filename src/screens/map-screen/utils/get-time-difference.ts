export function getTimeDifference(
  dateTimeFrom: Date | null,
  dateTimeUntil: Date | null
) {
  if (!dateTimeFrom || !dateTimeUntil) {
    return null;
  }
  // get total seconds between the times
  var delta = Math.abs(dateTimeUntil.getTime() - dateTimeFrom.getTime()) / 1000;

  // calculate (and subtract) whole days
  // var durationDays = Math.floor(delta / 86400);
  // delta -= durationDays * 86400;

  // calculate (and subtract) whole hours
  var durationHours = Math.floor(delta / 3600) % 24;
  delta -= durationHours * 3600;

  // calculate (and subtract) whole minutes
  var durationMinutes = Math.floor(delta / 60) % 60;
  //delta -= minutes * 60;

  return { durationHours, durationMinutes };
}
