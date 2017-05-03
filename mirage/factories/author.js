import { Factory } from 'ember-cli-mirage';

export default Factory.extend({
  username: 'jake',
  bio: 'i work at statefarm',
  image: 'https://i.stack.imgur.com/xHWG8.jpg',
  following: false
});
