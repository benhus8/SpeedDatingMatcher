import { pl } from './pl';

const dict = pl; // For now single locale
export function t(key) {
  return dict[key] || key;
}
