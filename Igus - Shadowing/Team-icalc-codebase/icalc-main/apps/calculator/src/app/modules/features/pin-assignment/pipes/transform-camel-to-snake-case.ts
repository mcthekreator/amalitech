export default (camelCaseString: string): string => {
  let snakeCaseString = '';

  for (const char of camelCaseString) {
    if (char === char.toUpperCase() && Number.isNaN(parseInt(char, 10))) {
      snakeCaseString += '_';
    }
    snakeCaseString += char.toUpperCase();
  }

  return snakeCaseString;
};
