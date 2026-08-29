type Props = {
  className?: string;
  alt?: string;
  cropMark?: boolean;
};

export default function WaylumeLogo({ className = "", alt = "Waylume Travel" }: Props) {
  return <img src="/waylume-mark.webp" alt={alt} className={className} />;
}
