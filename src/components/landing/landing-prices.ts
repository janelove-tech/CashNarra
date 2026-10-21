import { formatPlanCedis, publicPricingModel } from "@/domain/customer-plans";

export function landingOffer(fx?: null) {
  const model = publicPricingModel(fx === null ? { fx: null } : {});
  return {
    rateLabel: model.rateLabel,
    plans: model.plans.map((plan) => ({
      id: plan.id,
      name: plan.name,
      dollars: plan.id === "free" ? "$0" : `$${plan.offerUsd}`,
      standard: plan.standardUsd ? `$${plan.standardUsd}` : null,
      cedi:
        plan.id === "free"
          ? "(GH₵0.00)"
          : plan.cediAmount
            ? `(≈ ${formatPlanCedis(plan.cediAmount)})`
            : model.rateLabel,
      perks: plan.perks.slice(0, 4).map((perk) => perk.headline),
      href: plan.id === "free" ? "/auth?mode=signup" : "/pricing/plus",
      action: plan.actionLabel,
    })),
  };
}
