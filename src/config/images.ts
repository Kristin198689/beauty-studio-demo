// Photo slots. Put files in public/images and set the path here (e.g. "/images/hero/lash.webp").
// null renders a neutral placeholder with the right proportions.
export type ImageSlot =
  | "heroBg"
  | "heroSlot"
  | "introA"
  | "introB"
  | "servicesPortrait"
  | "galleryA"
  | "galleryB"
  | "galleryC"
  | "aboutPortrait"
  | "contactPortrait";

export const images: Record<ImageSlot, string | null> = {
  heroBg: null,
  heroSlot: null,
  introA: null,
  introB: null,
  servicesPortrait: null,
  galleryA: null,
  galleryB: null,
  galleryC: null,
  aboutPortrait: null,
  contactPortrait: null,
};
