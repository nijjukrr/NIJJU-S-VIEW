import { createStandaloneApplication } from './standalone/application.js';
import { describeError } from './standalone/errors.js';

const launchParams = new URLSearchParams(window.location.hash.slice(1));
const focusedLaunch =
  new URLSearchParams(window.location.search).get('portal') === '1' ||
  launchParams.get('portal') === '1';
if (focusedLaunch)
  document.documentElement.classList.add('nijju-focused-launch');

const application = createStandaloneApplication({
  googleApiKey: import.meta.env.GOOGLE_MAPS_API_KEY,
  cesiumToken: import.meta.env.CESIUM_ION_TOKEN,
  allowQaRegistration: import.meta.env.DEV,
});

application.start().catch((error) => {
  console.error("Nijju's Eye initialization failed:", error);
  const loaderStatus = document.querySelector('#loading-screen .loader-status');
  loaderStatus.textContent = `Error: ${describeError(error)}`;
  loaderStatus.style.color = '#ff4444';
});

export { application };
