import { permanentRedirect } from "next/navigation";

/** The enquiry form now lives on /contact; keep old links (and their prefill) working. */
export default async function PlanPage({
  searchParams,
}: {
  searchParams: Promise<{ destination?: string }>;
}) {
  const { destination } = await searchParams;
  permanentRedirect(destination ? `/contact?destination=${encodeURIComponent(destination)}` : "/contact");
}
