interface ObjectOne {
  [key: string]: any;
}

interface ObjectTwo {
  [key: string]: any;
}

export function getMatchingProperties(obj1: ObjectOne, obj2: ObjectTwo): ObjectOne {
  const result: ObjectOne = {};

  Object.keys(obj2).forEach((key) => {
    //TODO fix this unsafe method
    //eslint-disable-next-line
    if (obj1.hasOwnProperty(key)) {
      result[key] = obj1[key];
    }
  });

  return result;
}
