export const sortByField = (field) => {
  const sortUpToDown = (a, b) => {
    if (a[field] < b[field]) {
      return 1;
    }
    if (a[field] > b[field]) {
      return -1;
    }
    return 0;
  };
  return sortUpToDown;
};

export const sortByDate = (a, b) => {
  if (a.release.date < b.release.date) {
    return 1;
  }
  if (a.release.date > b.release.date) {
    return -1;
  }
  return 0;
};
