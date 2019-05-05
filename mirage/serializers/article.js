import BaseSerializer from './application';

export default BaseSerializer.extend({
  include: Object.freeze(['author']),
});
