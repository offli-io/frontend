const timeSlots = Array.from(new Array(24 * 2)).map(
  (_, index) => `${index < 20 ? '0' : ''}${Math.floor(index / 2)}:${index % 2 === 0 ? '00' : '30'}`
);

export const generateOptionsOrder = () => {
  const time = new Date();
  time.setHours(17, 0, 0);
  const formattedTime = `${time.getHours() < 10 ? '0' : ''}${time.getHours()}:${
    time.getMinutes() < 10 ? '0' : ''
  }${time.getMinutes()}`;
  const index = timeSlots?.indexOf(formattedTime);
  return timeSlots.slice(index).concat(timeSlots.slice(0, index));
};
