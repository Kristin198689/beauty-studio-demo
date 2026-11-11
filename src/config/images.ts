// Photo slots. Put files in public/images and set the path here (e.g. "/images/hero/bg-desktop.webp").
// null renders a neutral placeholder with the right proportions.
// "cut" slots are transparent PNG cut-outs used in front of giant type.
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
  | "cut1"
  | "cut2"
  | "cut3"
  | "aboutPortrait"
  | "contactPortrait";

export const images: Record<ImageSlot, string | null> = {
  heroBgDesktop: null,
  heroBgMobile: null,
  heroSlot: null,
  introA: null,
  introB: null,
  servicesPortrait: null,
  previewLashes: null,
  previewNails: null,
  previewHair: null,
  walk1: null,
  walk2: null,
  walk3: null,
  walk4: null,
  walk5: null,
  walk6: null,
  walk7: null,
  cut1: null,
  cut2: null,
  cut3: null,
  aboutPortrait: null,
  contactPortrait: null,
};

// Optional looping hero video (mp4, muted, no audio). null = no video.
export const heroVideo: string | null = null;
