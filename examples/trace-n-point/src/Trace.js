import Control from 'ol/control/Control';
import { CLASS_CONTROL, CLASS_UNSELECTABLE } from 'ol/css';
import EventType from 'ol/events/EventType';
import Draw from 'ol/interaction/Draw';

function join(strings, expressions, prev = '') {
  const [strHead, ...strTail] = strings;
  const [expHead = '', ...expTail] = expressions;
  const next = prev + strHead + expHead;
  if (strTail.length < 1) return next;
  return join(strTail, expTail, next);
}
function tagTrimmer(strings, ...exps) {
  return join(strings, exps).replaceAll(/>\s*</g, '><').trim();
}

const pointerSVG = tagTrimmer`
<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
  <mask id="arc">
    <rect x="0" y="0" width="24" height="24" fill="white"/>
    <circle cx="12" cy="16" r="8" fill="black" stroke="none"/>
  </mask>
  <polygon fill="currentColor" points="12 2, 18 12, 6 12" mask="url(#arc)"/>
  <circle cx="12" cy="16" r="6" fill="currentColor" stroke="none"/>
</svg>`;

export default class Trace extends Control {
  constructor(opts) {
    const options = opts || {};

    // Pass the main element and target to the Control constructor.
    const element = document.createElement('div');
    const { target } = options;
    super({ element, target });

    // Set the drawing layer from the constructor options.
    this.layer = options.layer;

    // Define the class name and add it to the element.
    const className = options.className || 'ol-trace';
    element.className = `${className} ${CLASS_UNSELECTABLE} ${CLASS_CONTROL}`;

    // Create elements to contain buttons for drawing and actions.
    const button = document.createElement('button');
    button.className = 'ol-edit-draw';
    button.name = 'trace';
    button.type = 'button';
    button.title = 'Trace a Path';
    button.innerHTML = pointerSVG;
    button.addEventListener(EventType.CLICK, this.enableTrace.bind(this), false);
    if (options.visible === false) button.style.display = 'none';
    if (options.draw) button.draw = options.draw;

    this.button = button;
    element.appendChild(button);
  }

  enableTrace(event) {
    event.preventDefault();

    // If the button is already active, disable all edit features.
    if (this.button.classList.contains('active')) {
      this.disable();
      return;
    }

    this.button.classList.add('active');

    // Enable escape key detection.
    this.enableEscape();

    // Create the draw interaction and add it to the map.
    this.traceInteraction = new Draw({
      source: this.layer.getSource(),
      type: 'LineString',
    });
    this.getMap().addInteraction(this.traceInteraction);
  }

  /**
   * Callback for escape key press. Deactivate all edit features.
   * @param {KeyboardEvent} event The event to handle
   * @private
   */
  handleEscape(event) {
    if (event.key === 'Escape') {
      this.disableTrace();
      document.removeEventListener(EventType.KEYDOWN, this.handleEscape, false);
    }
  }

  /**
   * Enable escape key listener.
   * @private
   */
  enableEscape() {
    this.handleEscape = this.handleEscape.bind(this);
    document.addEventListener(EventType.KEYDOWN, this.handleEscape, false);
  }

  /**
   * Disable all edit interactions, deselect features, deactivate all buttons,
   * and call 'disable' event listeners.
   * @private
   */
  disableTrace() {
    this.getMap().removeInteraction(this.traceInteraction);
    this.button.classList.remove('active');
  }
}
