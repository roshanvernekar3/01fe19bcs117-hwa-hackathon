const inr = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

export function formatPrice(value: number, withCurrency = true) {
  const amount = inr.format(Math.round(Number.isFinite(value) ? value : 0));
  return withCurrency ? `₹${amount}` : amount;
}

export function pad(value: number) {
  return String(value).padStart(2, "0");
}
