import Route from '@ember/routing/route';
import UnauthenticatedRoute from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

export default Route.extend(UnauthenticatedRoute, {});
