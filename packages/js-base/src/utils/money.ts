export const getHumanMoneyFromStripeMoney = (price: number): string => {
  const humanPrice = price / 100;

  return `$${humanPrice}`;
}