function isEffectivelyEmpty(arr) {
  return (
    !Array.isArray(arr) ||
    arr.length === 0 ||
    arr.every((item) => {
      if (item === null || item === undefined) return true;

      const str = String(item).trim().toLowerCase();
      return (
        str === '' || str === 'null' || str === 'undefined' || str === 'nan'
      );
    })
  );
}

function isEffectivelyEmptyObject(obj) {
  if (obj === null || typeof obj !== 'object' || Array.isArray(obj))
    return true;

  return Object.values(obj).every((value) => {
    if (value === null || value === undefined) return true;

    const str = String(value).trim().toLowerCase();
    return str === '' || str === 'null' || str === 'undefined' || str === 'nan';
  });
}

function filterMapObject(originalMapObj, ...extraKeys) {
  const cleaned = Object.fromEntries(
    Object.entries(originalMapObj)
      .filter(([key, value]) => {
        if (extraKeys) {
          const anyKeyFound = extraKeys.some((extraKey) => extraKey === key);
          if (anyKeyFound) {
            return false;
          }
        }
        return (
          value !== null &&
          value !== undefined &&
          String(value).trim() !== '' &&
          key !== null &&
          key !== undefined &&
          String(key).trim() !== ''
        );
      })
      .map(([key, value]) => [key, value]),
  );
  return cleaned;
}

function getCurrentYear() {
  return new Date().getFullYear();
}

function getCurrentYearMonthName() {
  return new Date().toLocaleString('default', { month: 'long' });
}

function getYearOption(startFrom = 2023) {
  // Get current year dynamically
  const currentYear = getCurrentYear();

  // Generate years from {startFrom} to current year
  const yearOptions = [];
  for (let year = startFrom; year <= currentYear; year++) {
    yearOptions.push(year);
  }
  return yearOptions;
}

function getFormatedDateFromString(inputDate) {
  const date = new Date(inputDate);
  return getFormatedDate(date);
}

function getFormatedDate(date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export {
  isEffectivelyEmpty,
  isEffectivelyEmptyObject,
  filterMapObject,
  getCurrentYear,
  getCurrentYearMonthName,
  getYearOption,
  getFormatedDateFromString,
  getFormatedDate,
};
