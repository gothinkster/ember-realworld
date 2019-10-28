import Controller from '@ember/controller';
import EmberObject, { computed } from '@ember/object';
import { isPresent } from '@ember/utils';
import { compare } from '@ember/utils';
import ENV from '../../config/environment';

const { environment } = ENV;

/**
 * A reusable function to help capture the initial state of a model's property.
 */
const articleState = function() {
  return computed({
    /**
     * By default, retrieve, store, and return the initial value from the model.
     * This value will be cached by `computed`.
     * @param {String} key
     */
    get(key) {
      const value = this.model.get(key);
      this.initialState[key] = value;
      return value;
    },

    /**
     * Set the value on the model so that the model's value can be properly rolled back.
     * Applies to model's computed property, otherwise only model attrs will be rolled back.
     * @param {String} key
     * @param {*} value
     */
    set(key, value) {
      this.model.set(key, value);
      return value;
    },
  });
};

/**
 * An interface to draft articles. Captures the initial state of an article model and helps rollback attributes.
 *
 * Benefits:
 * - Compare the initial state with the model to determine if there are any changes.
 * - Captures and compares the state of computed properties.
 * - Helps determine whether a new model is really dirty because new models are marked dirty regardless of property changes.
 */
export const DraftArticle = EmberObject.extend({
  model: null,

  title: articleState(),
  body: articleState(),
  description: articleState(),
  tags: articleState(),

  initialState: computed('model', {
    get() {
      return {};
    },
    set(key, value) {
      return value;
    },
  }),

  /**
   * Check if the changed attributes are different from what they started out to be.
   * This will determine whether to surface a confirmation dialog with the user to leave without saving changes or not.
   * @returns {Boolean}
   */
  hasDirtyAttributes: computed('{initialState,title,description,body,tags.[]}', function() {
    const { initialState } = this;
    const hasDirtyAttributes = Object.entries(initialState).some(([key, value]) => {
      return compare(value, this[key]) !== 0;
    });

    return hasDirtyAttributes;
  }),

  /**
   * Rollback the draft to the initial state, and rollback the model as well.
   *
   * Rollback of a new model will unload it from the store.
   */
  rollbackAttributes() {
    this.setProperties(this.initialState);
    /**
     * Call the model's `rollbackAttributes` method because it will unload from the store if it is new.
     */
    this.model.rollbackAttributes();
  },

  /**
   * Resets the initial state object.
   */
  resetInitialState() {
    this.set('initialState', {});
  },
});

export default Controller.extend({
  draftArticle: computed('model', function() {
    return DraftArticle.create({
      model: this.model,
    });
  }),

  /**
   * Validate that article title, description, and body are not empty.
   * @returns {Boolean}
   */
  isValid: computed('draftArticle.{title,description,body}', function() {
    const {
      draftArticle: { title, description, body },
    } = this;
    return [title, description, body].every(isPresent);
  }),

  actions: {
    /**
     * Set and save the article changes. Transitions to the article page when save is complete.
     *
     * @param {DraftArticle} draftArticle A draft article.
     * @param {*}
     */
    async saveArticle(draftArticle, { title, description, body, tags }) {
      draftArticle.setProperties({
        title,
        description,
        body,
        tags,
      });

      /**
       * Wrapped in a try catch because errors will stop acceptance tests.
       */
      try {
        await draftArticle.model.save();

        /**
         * Successful save should reset the initial state.
         */
        draftArticle.resetInitialState();

        return this.transitionToRoute('article', draftArticle.model);
      } catch (e) {
        if (environment !== 'test') {
          throw e;
        }
      }
    },

    /**
     * Set draft article properties.
     *
     * @param {DraftArticle} draftArticle A draft article.
     * @param {String} key Name of the property to set.
     * @param {String|Array} value Value of the property to set.
     */
    async changeAttr(draftArticle, key, value) {
      return draftArticle.set(key, value);
    },
  },
});
