// Monthly mail is fulfilled once per fully paid edition, regardless of the
// Square collection cadence. A biweekly charge is 12/26 of the monthly price.
export type ShopBillingCadence = "monthly" | "fortnightly";
export const billingCadence = (value: unknown): ShopBillingCadence | null =>
  value === "monthly" || value === "fortnightly" ? value : null;
export const instalmentCents = (monthly: number, cadence: ShopBillingCadence): number => {
  if (!Number.isInteger(monthly) || monthly < 100) throw new Error("Invalid subscription price");
  return cadence === "fortnightly" ? Math.max(1, Math.round(monthly * 12 / 26)) : monthly;
};
export const instalmentsPerMail = (cadence: ShopBillingCadence) => cadence === "fortnightly" ? 2 : 1;

export function mailPaymentStatus(cadence: ShopBillingCadence, confirmedPayments: number, mailedEditions: number, status: string) {
  const required = instalmentsPerMail(cadence);
  const unused = Math.max(0, Math.floor(confirmedPayments) - Math.max(0, Math.floor(mailedEditions)) * required);
  return {
    required, unused,
    eligible: status === "active" && unused >= required,
    paid_instalments: Math.min(unused, required),
    label: status !== "active" ? "Hold — subscription not active" :
      unused >= required ? "Paid — ready to mail" :
      unused > 0 ? "Part paid — do not send" : "Unpaid — do not send",
  };
}
