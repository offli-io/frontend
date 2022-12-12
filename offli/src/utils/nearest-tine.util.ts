export const timeSlots = [
  '00:00 AM',
  '00:30 AM',
  '01:00 AM',
  '01:30 AM',
  '02:00 AM',
  '02:30 AM',
  '03:00 AM',
  '03:30 AM',
  '04:00 AM',
  '04:30 AM',
  '05:00 AM',
  '05:30 AM',
  '06:00 AM',
  '06:30 AM',
  '07:00 AM',
  '07:30 AM',
  '08:00 AM',
  '08:30 AM',
  '09:00 AM',
  '09:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '12:00 PM',
  '12:30 PM',
  '01:00 PM',
  '01:30 PM',
  '02:00 PM',
  '02:30 PM',
  '03:00 PM',
  '03:30 PM',
  '04:00 PM',
  '04:30 PM',
  '05:00 PM',
  '05:30 PM',
  '06:00 PM',
  '06:30 PM',
  '07:00 PM',
  '07:30 PM',
  '08:00 PM',
  '08:30 PM',
  '09:00 PM',
  '09:30 PM',
  '10:00 PM',
  '10:30 PM',
  '11:00 PM',
  '11:30 PM',
]

export const getNearestTime = () => {
  const currentTime = new Date()
  const currentHour = currentTime.getHours()

  const convertedHours = timeSlots.map(date => {
    const time = parseInt(date.split(' ')[0])
    const period = date.split(' ')[1]

    if (time === 12 && period === 'PM') return time

    if (time < 12 && period === 'AM') return time

    return time + 12
  })

  //   const timeSlots = Array.from(new Array(24 * 2)).map(
  //     (_, index) =>
  //       `${index < 20 ? '0' : ''}${Math.floor(index / 2)}:${
  //         index % 2 === 0 ? '00' : '30'
  //       }`
  //   )
  let nearestTime
  const minValue =
    convertedHours[0] > currentHour
      ? convertedHours[0] - currentHour
      : currentHour - convertedHours[0]
  convertedHours.reduce((minVal, hour) => {
    const hourDiff =
      currentHour > hour ? currentHour - hour : hour - currentHour
    if (hourDiff <= minVal) {
      nearestTime = hour
      return hourDiff
    } else {
      return minVal
    }
  }, minValue)

  return !!nearestTime && timeSlots[convertedHours.indexOf(nearestTime)]
}
