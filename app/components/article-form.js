import Component from '@ember/component';
import { computed } from '@ember/object';
import { isPresent } from '@ember/utils';

export default Component.extend({
  title: '',
  description: '',
  body: '',
  disableSubmit: true,
  errors: undefined,

  tags: computed({
    get() {
      return [];
    },
    set(key, value) {
      return value;
    },
  }),
  /**
   * Stores the new tag text and resets to default empty string when `tags` array changes.
   * @returns {String}
   */
  newTags: computed('tags.[]', {
    get() {
      return '';
    },
    set(key, value) {
      return value;
    },
  }),

  actions: {
    submit() {
      const { title, description, body, tags } = this;
      return this.onSubmit({
        title,
        description,
        body,
        tags,
      });
    },

    change(field, event) {
      return this.onChange(field, event.target.value);
    },

    addTags(tags, value, event) {
      const { keyCode } = event;

      /**
       * Add tags when When enter key or tab key are pressed
       */
      if (keyCode === 13 || keyCode === 9) {
        /**
         * Only prevent default of enter key.
         */
        if (keyCode === 13) {
          event.preventDefault();
        }

        /**
         * Add tags in a comma separated list, if there are any tags after trimming.
         * Ensure the tags aren't already included in the tagList.
         */
        const newTags = event.target.value
          .split(',')
          .map(tag => tag.trim())
          .filter(isPresent)
          .filter(tag => {
            return !tags.includes(tag);
          });
        const isValid = newTags.length;

        if (isValid) {
          return this.onChange('tags', tags.concat(newTags));
        }
      }
    },

    removeTag(tags, tag) {
      /**
       * Create a new tagList array so as to not mutate the source.
       */
      return this.onChange('tags', [...tags].removeObject(tag));
    },
  },
});
