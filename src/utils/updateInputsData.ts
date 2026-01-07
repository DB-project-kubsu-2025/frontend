export const getDate = (str: string, format: string = ''): string => {
  if (!str || str == '0' || str.includes('1970')) return '';

  if (format === '') return str;

  const [day, month, year] = str.includes('-')
    ? str.split('-')
    : str.split('.');

  if (format === 'ymd') {
    return `${year}-${month}-${day}`;
  } else if (format === 'dmy') {
    return `${year}.${month}.${day}`;
  }

  return str;
};

export function updateInputsData(
  type: string,
  newValue: any,
  sectionPaths: [string[], string] | string[],
  prevValues: Record<string, any>,
): Record<string, any> {
  if (!sectionPaths) return prevValues;

  // if (type === 'date') newValue = getDate(newValue, 'dmy');

  const updatedValues = { ...prevValues };
  let current = updatedValues;

  if (Array.isArray(sectionPaths[0])) {
    // [ ['a', 'b'], 'field' ]
    console.log('update input data: array');
    const [parentPath, fieldName] = sectionPaths as [string[], string];

    parentPath.slice(0, -1).forEach((key) => {
      if (!current[key]) current[key] = {};
      current = current[key];
    });

    if (parentPath.length) {
      const field = parentPath[parentPath.length - 1];
      if (
        typeof newValue === 'object' &&
        fieldName in newValue &&
        Object.keys(newValue).length > 1
      ) {
        current[field] = newValue;
      } else {
        current[field] = {
          ...(current[field] || {}),
          [fieldName]: newValue,
        };
      }
    } else {
      current[fieldName] = newValue;
    }

    // console.log('1) Обновление поля:', parentPath, '→', fieldName);
    // console.log('Новое значение:', newValue);
    // console.log('Результат:', updatedValues);
  } else {
    // [ 'field' ]
    console.log('update input data: string');
    const flatPath = sectionPaths as string[];
    const lastKey = flatPath[flatPath.length - 1];

    flatPath.slice(0, -1).forEach((key) => {
      if (!current[key]) current[key] = {};
      current = current[key];
    });

    const target = current[lastKey];

    if (Array.isArray(newValue)) {
      current[lastKey] = newValue;
    } else if (Array.isArray(target)) {
      const alreadyExists = target.some((item: any) => item.id === newValue.id);
      if (!alreadyExists) {
        current[lastKey] = [...target, newValue];
      }
    } else {
      current[lastKey] = newValue;
    }

    // console.log('2) Обновление поля:', lastKey, '→', current[lastKey]);
    // console.log('Новое значение:', newValue);
    // console.log('Результат:', updatedValues);
  }
  return updatedValues;
}
