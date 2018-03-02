import RSVP from 'rsvp';
import { run } from '@ember/runloop';

let loadedScripts = {};

export default function loadScript(url) {
  let promise = loadedScripts[url];

  if (!promise) {
    promise = new RSVP.Promise((resolve, reject) => {
      let element = document.createElement('script');

      element.type = 'text/javascript';
      element.async = false;

      element.addEventListener('load', () => {
        run(() => {
          resolve();
        });
      }, false);

      element.addEventListener('error', () => {
        let error = new Error(`Could not load script ${url}`);

        run(() => {
          reject(error);
        });
      }, false);

      element.src = url;

      let firstScript = document.getElementsByTagName('script')[0];

      firstScript.parentNode.insertBefore(element, firstScript);
    });

    loadedScripts[url] = promise;
  }

  return promise;
}
