function isEffectivelyEmpty(arr) {
    return !Array.isArray(arr) || arr.length === 0 || arr.every(item => {
        if (item === null || item === undefined) return true;
    
        const str = String(item).trim().toLowerCase();
        return str === '' || str === 'null' || str === 'undefined' || str === 'nan' ;
      });
  }

function isEffectivelyEmptyObject(obj) {
    if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) return true;
  
    return Object.values(obj).every(value => {
      if (value === null || value === undefined) return true;
  
      const str = String(value).trim().toLowerCase();
      return str === '' || str === 'null' || str === 'undefined' || str === 'nan';
    });
  }

function filterMapObject(originalMapObj, ...extraKeys) {
    const cleaned = Object.fromEntries(
        Object.entries(originalMapObj).filter(([key, value]) => {
            if (extraKeys) {
                const anyKeyFound = extraKeys.some(extraKey => extraKey === key)
                if (anyKeyFound) {
                    return false;
                }
            }
            return (value !== null && value !== undefined && String(value).trim() !== '') && (key !== null && key !== undefined && String(key).trim() !== '');
            })
            .map(([key, value]) => [key, value])
    );
    return cleaned
}


  export {
    isEffectivelyEmpty,
    isEffectivelyEmptyObject,
    filterMapObject,
  }

