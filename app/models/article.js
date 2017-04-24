import DS from "ember-data";

const { attr, belongsTo } = DS;

export default DS.Model.extend({
    title: attr(),
    slug: attr(),
    body: attr(),
    createdAt: attr(),
    updateAt: attr(),
    // tagList: attr(),
    description: attr(),
    author: belongsTo("user"),
    favorited: attr(),
    favoritesCount: attr()
});
