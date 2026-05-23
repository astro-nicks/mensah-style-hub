// pesewas -> GHS string
export function formatCedis(minor: number): string {
  const cedis = minor / 100;
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    maximumFractionDigits: cedis % 1 === 0 ? 0 : 2,
  }).format(cedis);
}
