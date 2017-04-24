import Ember from "ember";

export default Ember.Route.extend({
    model: function() {
        return {
            articleContent: Ember.String.htmlSafe(
                "<h1>The song you won't ever stop singing. No matter how hard you try.</h1><p>This is the description for the post.</p><span>Read more...</span>"
            )
        };
    }
});
