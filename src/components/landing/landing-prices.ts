import {
  cedisFromUsd,
  formatPlanCedis,
  publicPricingModel,
} from "@/domain/customer-plans";

export function landingOffer(fx?: null) {
  const model = publicPricingModel(fx === null ? { fx: null } : {});
  return {
    rateLabel: model.rateLabel,
    plans: model.plans.map((plan) => ({
      id: plan.id,
      name: plan.name,
      dollars: plan.id === "free" ? "$0" : `$${plan.standardUsd}`,
      standard: null,
      cedi:
        plan.id === "free"
          ? "(GH₵0.00)"
          : plan.standardUsd && model.rate
            ? `(≈ ${formatPlanCedis(cedisFromUsd(plan.standardUsd, model.rate.ghsPerUsd))})`
            : model.rateLabel,
      perks: plan.perks.map((perk) => perk.headline),
      href: plan.id === "free" ? "/auth?mode=signup" : "/pricing/plus",
      action: plan.actionLabel,
    })),
  };
}
