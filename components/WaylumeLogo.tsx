import Image from "next/image";

type Props = {
  className?: string;
  alt?: string;
  cropMark?: boolean;
};

export default function WaylumeLogo({ className = "", alt = "Waylume Travel" }: Props) {
  return <Image src="/waylume-mark.webp" width={220} height={220} alt={alt} className={className} />;
}
