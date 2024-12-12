export const findDifferentProperties = (obj1, obj2) => {
  const result = {};
  // Tìm thuộc tính chỉ có trong obj2
  for (let key in obj2) {
    if (
      //   obj2.hasOwnProperty(key) &&
      obj2[key] !== undefined &&
      (!obj1.hasOwnProperty(key) || obj1[key] !== obj2[key])
    ) {
      result[key] = obj2[key];
    }
  }

  return result;
};

export const isEmptyObject = (obj) => Object.keys(obj).length === 0;

export const getValueHasTruely = (obj) => {
  let trueValues = [];
  for (let key in obj) {
    if (obj.hasOwnProperty(key) && obj[key] === true) {
      trueValues.push(key);
    }
  }
  return trueValues;
};

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const stripHtml = (html) => {
  let doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
};

export const setRangeDate = (timeStart, timeEnd) => {
  timeStart = new Date(timeStart);
  timeEnd = new Date(timeEnd);

  let diffMilliseconds = Math.abs(timeEnd - timeStart);
  let diffMinutes = Math.floor(diffMilliseconds / (1000 * 60));

  let hours = Math.floor(diffMinutes / 60);
  let minutes = diffMinutes % 60;

  let result = "";
  if (hours > 0) {
    result += `${hours} giờ `;
  }
  if (minutes > 0) {
    result += `${minutes} phút`;
  }
  return result;
};
