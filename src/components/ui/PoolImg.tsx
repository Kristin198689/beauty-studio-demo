import Image from "next/image";

// Decorative photo that fills its (positioned) parent.
export function PoolImg({ src, sizes, priority }: { src: string; sizes: string; priority?: boolean }) {
  return (
    <Image
      src={src}
      alt=""
      fill
      sizes={sizes}
      priority={priority}
      style={{ objectFit: "cover" }}
      draggable={false}
    />
  );
}
