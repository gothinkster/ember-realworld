import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class FollowProfileComponent extends Component {
  @service session;
  @service router;

  @action
  followProfile(operation) {
    if (this.session.isLoggedIn) {
      // TODO - We do this because in one area `profile` is from a `belongsTo`, and from the model hook in another. Not sure if there's a better way to do this to access the props.
      let profile = this.args.profile.content || this.args.profile;
      profile[operation]();
    } else {
      this.router.transitionTo('login');
    }
  }
}
