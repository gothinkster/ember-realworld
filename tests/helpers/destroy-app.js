import { run } from '@ember/runloop';

export default function destroyApp(application) {
  if (window.server) {
    window.server.shutdown();
  }
  run(application, 'destroy');
}
