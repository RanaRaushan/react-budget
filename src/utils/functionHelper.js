function isEffectivelyEmpty(arr) {
    return !Array.isArray(arr) || arr.length === 0 || arr.every(item => {
        if (item === null || item === undefined) return true;
    
        const str = String(item).trim().toLowerCase();
        return str === '' || str === 'null' || str === 'undefined' || str === 'nan' ;
      });
  }


function filterMapObject(originalMapObj, extraKey) {
    const cleaned = Object.fromEntries(
        Object.entries(originalMapObj).filter(([key, value]) => {
            if (extraKey) {
                // console.log("fitlering extra key", extraKey, key)
                return (extraKey !== key);
            }
            return (value !== null && value !== undefined && String(value).trim() !== '') && (key !== null && key !== undefined && String(key).trim() !== '');
            })
            .map(([key, value]) => [key, value])
    );
    // console.log("cleaned", cleaned, Object.keys(cleaned).length)
    return cleaned
}


  export {
    isEffectivelyEmpty,
    filterMapObject,
  }

