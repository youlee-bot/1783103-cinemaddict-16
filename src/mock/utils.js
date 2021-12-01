import dayjs from 'dayjs';

//Возвращает случайное число из диапазона
export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

//Выбирает случайный элемент массива
export const gerenerateElement = (array) => (array[getRandomInteger(0, array.length-1)]);

//Возвращает массив уникальных значений
export const generateRandomUniqueArray = (incomingArray, numberOfElement) => {
  let counter = 0;
  const outputArray = [];

  while (counter < numberOfElement) {
    const value = gerenerateElement(incomingArray);
    if ((!outputArray.includes(value))&&(value!=='')){
      outputArray.push(value);
      counter++;
    }
  }
  return outputArray;
};

//конвертирует минуты в часы и минуты
export const minsToHours = (mins) => {
  const hours = (mins / 60);
  const resultHours = Math.floor(hours);
  const minutes = (hours - resultHours) * 60;
  const resultMinutes = Math.round(minutes);
  if (resultHours===0) {
    return `${resultMinutes  }m`;
  } else {
    return `${resultHours  }h ${  resultMinutes  }m`;
  }
};

// генератор дат
export const generateDate = (from) => {
  const fromMilli = dayjs(from);
  const max = dayjs() - fromMilli;
  const dateOffset = Math.floor(Math.random() * max + 1);
  const newDate = dayjs(fromMilli + dateOffset);
  return dayjs(newDate);
};
