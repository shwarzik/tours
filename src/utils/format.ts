export const formatPrice = (amount: number, currency: string) => {
  const currencySymbols: Record<string, string> = {
    usd: "$",
    uah: "₴",
    eur: "€",
  };
  const symbol = currencySymbols[currency] || currency.toUpperCase();
  const formattedAmount = amount.toLocaleString("uk-UA");
  return `${formattedAmount} ${symbol}`;
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// Get correct plural form for Ukrainian nouns based on count
export function getPluralForm(count: number, one: string, few: string, many: string) {
  const n = Math.abs(count) % 100;
  const n1 = n % 10;

  if (n > 10 && n < 20) return many;
  if (n1 > 1 && n1 < 5) return few;
  if (n1 === 1) return one;
  return many;
}