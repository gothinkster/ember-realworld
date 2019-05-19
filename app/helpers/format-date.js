import { helper } from '@ember/component/helper';

export function formatDate([date]) {
  if (!date) {
    return '';
  }
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default helper(formatDate);
