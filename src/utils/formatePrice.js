export function formatPrice(price) {
    return String(price).length > 6 ? String(price).slice(0, 7) : String(price);
  }