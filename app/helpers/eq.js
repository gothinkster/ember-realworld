import { helper } from '@ember/component/helper';

export function eq([a, b] /*, hash*/) {
  return a === b;
}

export default helper(eq);
