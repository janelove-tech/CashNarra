import { publicPricingModel } from "@/domain/customer-plans";
import { PlusReview } from "@/components/plus-review";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Review Plus — CashNarra",
  description: "Review the Plus price before continuing. This step does not charge you.",
};

export default function PlusReviewPage() {
  return <PlusReview model={publicPricingModel()} />;
}
