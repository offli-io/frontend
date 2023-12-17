const timeSlots = Array.from(new Array(24 * 2)).map(
  (_, index) => `${index < 20 ? '0' : ''}${Math.floor(index / 2)}:${index % 2 === 0 ? '00' : '30'}`
);

export const generateOptionsOrder = () => {
  const currentHour = new Date().getHours();
  //new Date().getHours() + type === 'from' ? 1 : 2
  const time = `${currentHour}:00`;
  const index = timeSlots?.indexOf(time);
  return timeSlots.slice(index).concat(timeSlots.slice(0, index));
};
