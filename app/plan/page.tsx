import { redirect } from "next/navigation";

/** The enquiry form now lives on /contact; keep old links (and their prefill) working. */
export default async function PlanPage({
  searchParams,
}: {
  searchParams: Promise<{ destination?: string }>;
}) {
  const { destination } = await searchParams;
  redirect(destination ? `/contact?destination=${encodeURIComponent(destination)}` : "/contact");
}
