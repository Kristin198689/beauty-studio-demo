// Photo slots. Put files in public/images and set the path here (e.g. "/images/hero/bg-desktop.webp").
// null renders a neutral placeholder with the right proportions.
export type ImageSlot =
  | "heroBgDesktop"
  | "heroBgMobile"
  | "heroSlot"
  | "introA"
  | "introB"
  | "servicesPortrait"
  | "previewLashes"
  | "previewNails"
  | "previewHair"
  | "walk1"
  | "walk2"
  | "walk3"
  | "walk4"
  | "walk5"
  | "walk6"
  | "walk7"
  | "walk8"
  | "walk9"
  | "walk10"
  | "walk11"
  | "walk12"
  | "walk13"
  | "walk14"
  | "slice"
  | "footerFill"
  | "aboutPortrait"
  | "contactPortrait";

export const images: Record<ImageSlot, string | null> = {
  heroBgDesktop: "/images/hero/bg-desktop.jpg",
  heroBgMobile: "/images/hero/bg-mobile.jpg",
  heroSlot: "/images/hero/slot.jpg",
  introA: "/images/intro/a.jpg",
  introB: "/images/intro/b.jpg",
  servicesPortrait: "/images/services/portrait.jpg",
  previewLashes: "/images/services/preview-lashes.jpg",
  previewNails: "/images/services/preview-nails-crop.jpg",
  previewHair: "/images/services/preview-hair.jpg",
  walk1: "/images/gallery/walk-1.jpg",
  walk2: "/images/gallery/walk-2-crop.jpg",
  walk3: "/images/gallery/walk-3.jpg",
  walk4: "/images/gallery/walk-4.jpg",
  walk5: "/images/gallery/walk-5.jpg",
  walk6: "/images/gallery/walk-6.jpg",
  walk7: "/images/gallery/walk-7.jpg",
  walk8: "/images/gallery/walk-8.jpg",
  walk9: "/images/gallery/walk-9.jpg",
  walk10: "/images/gallery/walk-10.jpg",
  walk11: "/images/gallery/walk-11.jpg",
  walk12: "/images/gallery/walk-12.jpg",
  walk13: "/images/gallery/walk-13.jpg",
  walk14: "/images/gallery/walk-14.jpg",
  slice: "/images/gallery/slice.jpg",
  footerFill: "/images/footer/fill.jpg",
  aboutPortrait: "/images/about/portrait.jpg",
  contactPortrait: "/images/contact/portrait-nails.jpg",
};

// Optional looping hero video (mp4, muted, no audio). null = no video.
export const heroVideo: string | null = null;
