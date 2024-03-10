export function generateRandomNumber(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateRandomVariablesSum(variablesQuantity: number, min: number, max: number): number {
  const randomVariables = [];

  for (let i = 0; i < variablesQuantity; i++) {
    randomVariables.push(generateRandomNumber(min, max / variablesQuantity));
  }

  return randomVariables.reduce((prev, acc) => {
    return prev + acc;
  }, 0);
}