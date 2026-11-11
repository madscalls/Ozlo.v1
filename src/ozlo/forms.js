// Which form Ozlo should morph into, guessed from what the visitor types.
// The AI's reply will confirm or correct this later ({ reply, form, mood }).
// Forms other than "core" need their morph frames before they can play.

export const FORMS = {
  core: { label: 'Ozlo', ready: true },
  hat: { label: 'Hat', ready: true, keywords: ['hat', 'hats', 'cap', 'caps', 'beanie', 'snapback'] },
  shirt: { label: 'Shirt', ready: false, keywords: ['shirt', 'shirts', 't-shirt', 'tee', 'tees', 'apparel', 'hoodie', 'merch'] },
  car: { label: 'Car / wrap', ready: true, keywords: ['wrap', 'wraps', 'truck', 'van', 'car', 'vehicle', 'fleet', 'lettering'] },
  sign: { label: 'Yard sign', ready: false, keywords: ['sign', 'signs', 'signage', 'yard', 'banner', 'banners', 'storefront'] },
  sticker: { label: 'Sticker', ready: false, keywords: ['sticker', 'stickers', 'decal', 'decals', 'magnet', 'magnets'] },
  card: { label: 'Business card', ready: false, keywords: ['card', 'cards', 'business card', 'print', 'flyer', 'flyers'] },
};

// Returns the first form whose keyword appears in the text, or null.
export function matchForm(text) {
  const t = ` ${text.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ')} `;
  for (const [form, info] of Object.entries(FORMS)) {
    if (!info.keywords) continue;
    if (info.keywords.some((k) => t.includes(` ${k} `))) return form;
  }
  return null;
}
