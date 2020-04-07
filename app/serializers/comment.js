import RESTSerializer, { EmbeddedRecordsMixin } from '@ember-data/serializer/rest';

export default class CommentSerializer extends RESTSerializer.extend(EmbeddedRecordsMixin) {
  attrs = {
    author: { embedded: 'always' },
  };
}
