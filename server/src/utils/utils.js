// Như tiêu đề của từng function
const getFirstDayOfPreviousMonth = (date) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() - 1, 1);
  return d;
};

const getLastDayOfNextMonth = (date) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + 2, 0);
  return d;
};

const hasKeysAndValues = (obj) => {
  return obj && typeof obj === "object" && Object.keys(obj).length > 0;
};

module.exports = {
  getFirstDayOfPreviousMonth,
  getLastDayOfNextMonth,
  hasKeysAndValues,
};
