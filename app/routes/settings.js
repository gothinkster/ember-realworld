import Route from '@ember/routing/route';
import AuthenticatedRoute from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Route.extend(AuthenticatedRoute, {});
