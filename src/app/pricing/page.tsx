import { publicPricingModel } from "@/domain/customer-plans";
import { PricingPreview } from "@/components/pricing-preview";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Choose your plan — CashNarra",
  description:
    "Keep your money records in one place. Compare Free and Plus.",
};

export default function PricingPage() {
  return <PricingPreview model={publicPricingModel()} />;
}
