import dayjs from 'dayjs';

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const gerenerateElement = (array) => (array[getRandomInteger(0, array.length - 1)]);

export const generateRandomUniqueArray = (incomingArray, numberOfElement) => {
  let counter = 0;
  const outputArray = [];

  while (counter < numberOfElement) {
    const value = gerenerateElement(incomingArray);
    if ((!outputArray.includes(value)) && (value !== '')) {
      outputArray.push(value);
      counter++;
    }
  }
  return outputArray;
};

export const generateDate = (from) => {
  const fromMilli = dayjs(from);
  const max = dayjs() - fromMilli;
  const dateOffset = Math.floor(Math.random() * max + 1);
  const newDate = dayjs(fromMilli + dateOffset);
  return dayjs(newDate);
};
