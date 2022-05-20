export const getObjectWithoutUndefinedValues = (object: any) => {
  const newObject: any = {}
  
  Object.keys(object).forEach(key => {
    if (object[key] !== undefined) {
      newObject[key] = object[key];
    }
  })

  return newObject;
}