export function generateRandomNumber(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateTwoRandomSum(min: number, max: number) {
  const first = generateRandomNumber(min, max / 2);
  const second = generateRandomNumber(min, max / 2);
  return Math.min(first + second, max);
}