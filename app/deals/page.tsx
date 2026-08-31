import { permanentRedirect } from "next/navigation";

/** Legacy URL — promotions now live at /promotions. */
export default function DealsPage() {
  permanentRedirect("/promotions");
}
