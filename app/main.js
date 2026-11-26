// Bootstrap for the Marlowe household budget site: render the current
// hash route, and re-render whenever the hash changes. The first render
// runs at once so the dashboard is there on the very first paint.
import { render } from './views.js';

window.addEventListener('hashchange', render);
render();
