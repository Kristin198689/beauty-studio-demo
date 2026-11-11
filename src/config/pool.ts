// Photo pool for the depth sections. Files live in public/images/pool.
const p = (id: string) =>
  id.startsWith("n_") ? `/images/pool/${id}.jpg` : `/images/pool/s${id}.jpg`;

export const pool = {
  tunnel: ["n_lips", "05_5", "03_2", "n_tri_blonde", "06_1", "n_hands", "05_2b", "06_6", "n_pedi", "05_4", "03_9", "06_3"].map(p),
  deck: ["06_9", "n_hands", "03_5", "05_7", "n_feet2", "06_2", "03_8"].map(p),
  carousel: ["03_1", "n_lips", "05_8", "n_hands", "03_6", "n_pedi", "06_8", "n_tri_blonde", "05_5"].map(p),
  wall: ["03_0", "n_lips", "03_7", "05_0", "n_feet3", "n_hands", "06_0", "n_pedi", "06_7", "03_9", "n_tri_blonde", "06_2", "n_feet2", "06_9", "n_tri_hands"].map(p),
  book: ["n_lips", "06_4", "n_tri_hands", "03_5", "06_8", "n_feet3", "05_2b", "n_hands", "06_9", "n_pedi"].map(p),
  floor: ["03_1", "n_lips", "03_8", "03_9", "05_1", "n_pedi", "05_5", "05_7", "n_hands", "06_1", "05_4", "06_6", "03_5", "n_feet3", "06_9", "06_8", "n_tri_blonde", "03_2", "06_3", "n_feet2", "05_2b", "n_tri_hands", "03_0", "06_0"].map(p),
};
