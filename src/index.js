/**
 * Based on https://github.com/openlayers/openlayers/blob/main/examples/geolocation-orientation.js
 */

import { Feature, Overlay } from 'ol';
import { Control } from 'ol/control';
import { CLASS_CONTROL, CLASS_UNSELECTABLE } from 'ol/css';
import { inAndOut } from 'ol/easing';
import { LineString } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import { unByKey } from 'ol/Observable';
import { fromLonLat } from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import { calcRotation } from './maths';
import cancelIconSVG from './assets/icon-cancel.svg';
import pauseIconAnimatedSVG from './assets/icon-pause-animated.svg';
import saveIconSVG from './assets/icon-save.svg';
import startIconSVG from './assets/icon-start.svg';
import startIconAnimatedSVG from './assets/icon-start-animated.svg';
import markerSVG from './assets/marker.svg';
import markerHeadingSVG from './assets/marker-heading.svg';
import './assets/main.css';

export function* geotrace(map, options = {}) {
  const view = map.getView();
  const baseLayer = options.layer || map.getAllLayers()
    .find(layer => layer.getProperties().type === 'base');

  // An unaltered history of all observed positions, even if they are excluded
  // from the trail b/c the tracing operation was paused.
  const positionHistory = [];

  // A temporary geometry showing the path of travel during the geotracing
  // operation itself. A separate geometry will be reconstructed from the
  // position history when geotracing concludes, but this preview will be
  // updated in the postrender callback (updateView) as positions are recorded.
  const preview = new LineString([], 'XY');
  const previewLayer = new VectorLayer({
    title: 'Geotracing Preview',
    visible: true,
    source: new VectorSource({
      features: [new Feature({
        type: 'preview',
        geometry: preview,
      })],
    }),
    style: new Style({
      stroke: new Stroke({
        width: 6,
        color: [51, 153, 255, 1],
      }),
    }),
  });
  map.addLayer(previewLayer);

  // Geolocation marker
  const markerEl = document.createElement('div');
  markerEl.id = 'trace-marker';
  markerEl.innerHTML = markerSVG;
  const marker = new Overlay({
    positioning: 'center-center',
    element: markerEl,
    stopEvent: false,
    autoPan: {
      margin: 20,
      animation: {
        duration: 1000,
        easing: inAndOut,
      },
    },
  });
  map.addOverlay(marker);

  let showHeadingPrev = false;
  function updateMarkerIcon(rotation) {
    const showHeadingNext = typeof rotation === 'number';
    if (showHeadingPrev !== showHeadingNext) {
      markerEl.innerHTML = showHeadingNext ? markerHeadingSVG : markerSVG;
      showHeadingPrev = showHeadingNext;
    }
  }

  // This sample geometry is never displayed and only contains the range of
  // positions between the last one recoreded in the position history, and the
  // previous position added to the sample geometry. This trail is used to
  // interpolate sample coordinates within that range during the postrender
  // callback (ie, updateView), providing a smoother animation for the preview
  // preview trail and marker element. Therefore, the range of coordinates are
  // overwritten periodically, whenever a new position is recorded. The geometry
  // itself is an OL LineString, where X = longitude, Y = latitude, Z = rotation
  // (in radians, as opposed to the heading, which is in degrees), and M =
  // timestamp (in milliseconds). M does not correspond to the geolocation's
  // positional timestamp, but rather the time of rendering, so as to render the
  // easing effect on the geometry's transition.
  const sampleTrail = new LineString([], 'XYZM');

  // This sample history maps the rendering timestamps to their corresponding
  // positional timestamps from geolocation events, since they're not directly
  // correlated.
  const sampleHistory = new Map();

  // The average interval (in milliseconds) between geolocation updates, half a
  // second to start, but recalculated each time based on the past 20 updates.
  let meanSamplingRate = 500;
  const sampleSize = 20;

  // Because the sampled coordinates correspond neither to the position history,
  // nor the set coordinates of the sample trail (b/c they can be interpolated),
  // nor to the coordinates of the preview trail when the tracer is paused, the
  // last sampling timstamp must be stored in a separate piece of state.
  let lastSampleTimestamp = 0;

  // Callback for the base layer's postrender event.
  function updateView() {
    // Get the last positional timestamp from history; bail if there is none.
    const [{ timestamp: latestTS } = {}] = positionHistory.slice(-1);
    if (!latestTS) return;

    // Store the current timestamp in local state, then determine where to
    // sample coordinates from the trail, by calculating a point roughly halfway
    // between now and previous sample, based on the mean sampling rate. Then
    // store the sample's timestamp for the next call.
    const now = Date.now();
    const sampleTS = lastSampleTimestamp === 0 ? now
      : Math.max(now - meanSamplingRate * 1.5, lastSampleTimestamp);
    lastSampleTimestamp = sampleTS;

    // Before sampling coordinates from the trail, detect whether there have
    // been any new positions added to the history, and if so, adjust the
    // geometry accordingly. Ideally there should only be one new position added
    // at a time, but to be safe, make sure to include all new positions, and
    // adjust their timestamps by a proportion of the difference between the
    // last timestamp and now (ie, the "strid").
    if (!sampleHistory.has(latestTS)) {
      const lastUpdatedPosition = positionHistory
        .findLast(p => sampleHistory.has(p.timestamp));
      const { timestamp: lastUpdatedTS = 0 } = lastUpdatedPosition || {};
      const samplePositions = positionHistory.filter(p => p.timestamp > lastUpdatedTS);
      const lastCoord = sampleTrail.getLastCoordinate();
      const [,,, lastCoordTS = now - meanSamplingRate] = lastCoord;
      const stride = (now - lastCoordTS) / samplePositions.length;
      const initCoords = lastCoord.length > 0 ? [lastCoord] : [];
      const trailCoords = samplePositions.reduce((coords, position, i) => {
        const {
          coords: { heading, latitude, longitude } = {},
        } = position;
        const previous = coords[coords.length - 1];
        const rotation = calcRotation(previous, heading);
        const ts = lastCoordTS + (i + 1) * stride;
        sampleHistory.set(position.timestamp, ts);
        return [
          ...coords,
          [longitude, latitude, rotation, ts],
        ];
      }, initCoords);

      // Overwrite the trail coordinates.
      sampleTrail.setCoordinates(trailCoords);

      // Reset the mean samplng rate as well.
      if (positionHistory.length >= 2) {
        const [{ timestamp: earliestTS }] = positionHistory.slice(-sampleSize);
        const actualSampleSize = Math.min(positionHistory.length, sampleSize);
        meanSamplingRate = (latestTS - earliestTS) / actualSampleSize;
      }
    }

    // Now that the geometry is ensured to have the latest position history,
    // take the sample coordinates.
    const sample = sampleTrail.getCoordinateAtM(sampleTS, true);
    if (!Array.isArray(sample)) return;

    // Format the sample coordinates the way OpenLayers likes.
    const [lon, lat, rotation] = sample;
    const coords = fromLonLat([lon, lat]);

    // Update the marker's position and icon.
    marker.setPosition(coords);
    updateMarkerIcon(rotation);

    // Determine if the sampled coords should be added to the preview trail
    // based on whether the nearest previous position set the omit flag or not.
    // Setting the omit flag is equivalent to "pausing" the geotracer.
    const nearestPosition = positionHistory.reduce((nearest, position) => {
      const sampleTimestamp = sampleHistory.get(position.timestamp);
      if (!sampleTimestamp || sampleTimestamp > sampleTS) return nearest;
      const nearestSTS = sampleHistory.get(nearest.timestamp);
      if (!nearestSTS || sampleTimestamp > nearestSTS) return position;
      return nearest;
    });
    if (!nearestPosition.omit) preview.appendCoordinate(coords);

    // Recenter and rotate the map view if that option is set to true. Otherwise
    // just rotate the marker overlay itself; the overlay will autopan if it
    // starts to go out of the viewbox.
    if (options.recenter) {
      view.setCenter(coords);
      view.setRotation(-rotation);
    } else {
      markerEl.style.rotate = `${rotation}rad`;
    }

    map.render();
  }

  let done = false;
  function updateGeolocation(position) {
    if (position) positionHistory.push(position);
    if (position && position.done) done = true;
    map.render();
  }

  /**
   * Using the postrender hook (postcompose in OL v. 5 or earlier) produces
   * a smoother animation, for whatever reason. Specific documentation on this
   * seems to be lacking, but it is illustrated in the example linked below.
   * @see https://openlayers.org/en/latest/examples/feature-move-animation.html
   */
  const renderKey = baseLayer.on(['postcompose', 'postrender'], updateView);
  map.render();

  while (!done) updateGeolocation(yield);

  unByKey(renderKey);
  map.removeOverlay(marker);
  map.removeLayer(previewLayer);
  map.render();

  return positionHistory;
}

/**
 * Safari doesn't support using the SVG drawing attribute (d) as a CSS property
 * in combination with the path() function, but CSS provides a much smoother
 * transition than the SVG <animate> element, so detect first if the browser
 * supports path() and use <animate> only as a fallback.
 * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d#using_d_as_a_css_property
 * @see https://caniuse.com/mdn-svg_elements_path_d_path
 */
const cssDPathSupported = window.CSS.supports('(d: path("M0 0h24v24H0z"))');

/**
 * Use this instead of spread syntax with GeolocationPosition instances, b/c it
 * inherits it's properties from up the prototype chain and has no enumerable
 * properties of its own. The same is true with GeolocationCoordinates.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#description
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Enumerability_and_ownership_of_properties
 */
function cloneGeolocation(position) {
  const { coords: rawCoords, timestamp } = position;
  const {
    accuracy, altitude, altitudeAccuracy, heading, latitude, longitude, speed,
  } = rawCoords;
  const coords = {
    accuracy, altitude, altitudeAccuracy, heading, latitude, longitude, speed,
  };
  return { coords, timestamp };
}

export default function geotraceCtrl(map, options = {}) {
  const tracer = geotrace(map, options);
  let paused = !options.immediateStart;

  const mainCtrl = document.createElement('button');
  mainCtrl.type = 'button';
  mainCtrl.name = 'trace';
  mainCtrl.className = 'ol-trace ol-trace-buttons';
  mainCtrl.title = 'Trace a Path';
  mainCtrl.innerHTML = markerHeadingSVG;

  const ctrlContainer = options.element || document.createElement('div');
  ctrlContainer.className = `ol-trace ${CLASS_UNSELECTABLE} ${CLASS_CONTROL}`;
  ctrlContainer.appendChild(mainCtrl);

  mainCtrl.addEventListener('click', () => {
    const viewPort = map.getViewport();
    const liveCtrlClassname = 'geotrace-live-ctrl';
    const liveCtrlsContainer = document.createElement('div');
    liveCtrlsContainer.className = `${liveCtrlClassname}s-container`;
    viewPort.appendChild(liveCtrlsContainer);

    const liveCtrls = document.createElement('div');
    liveCtrls.className = `${liveCtrlClassname}s`;
    liveCtrlsContainer.appendChild(liveCtrls);

    // These classes will be added or removed to the center control to animate
    // the icon state transition.
    const pauseBtnClassName = 'pause-btn';
    const resumeBtnClassName = 'resume-btn';

    // Transition states (as string constants) for the state machine below.
    const STANDBY = 'STANDBY';
    const START = 'START';
    const PAUSE = 'PAUSE';
    const RESUME = 'RESUME';
    const SAVE = 'SAVE';
    const CANCEL = 'CANCEL';

    // Set the initial state as a separate constant to avoid confusion.
    const INIT_STATE = STANDBY;

    // Live control button positions, also for the state machine.
    const LEFT = 'LEFT';
    const CENTER = 'CENTER';
    const RIGHT = 'RIGHT';

    // This is the single store of MUTABLE state for the entire lifespan of the
    // geotracing operation, reflecting one of the legal transition states
    // listed above. It also determines the selection and arrangement of the
    // live control buttons at any given time.
    let CURRENT_STATE = INIT_STATE;

    /**
     * A finite state machine for transitioning between various "live" tracing
     * states. A library like XState might be preferrable for a more rigorous
     * implementation, but this should suffice for now. It's also probably worth
     * evaluating if the geotrace generator function could be refactored as a
     * state machine like this, perhaps reusing major portions of this one.
     * @see https://xstate.js.org/docs/about/concepts.html#finite-state-machines
     * @see https://kentcdodds.com/blog/implementing-a-simple-state-machine-library-in-javascript
    */
    const controlStates = {
      [STANDBY]: {
        buttons: {
          [CENTER]: START,
          [RIGHT]: CANCEL,
        },
        action() {
          let zoomOnceComplete = false;
          function zoomOnce(position) {
            if (zoomOnceComplete || !position) return;
            const view = map.getView();
            const { coords: { latitude, longitude } = {} } = position;
            const coords = fromLonLat([longitude, latitude]);
            view.setCenter(coords);
            view.setZoom(19);
            zoomOnceComplete = true;
          }

          function simulatePositionChange(simTrail) {
            const [{ coords, timestamp } = {}, ...remaining] = simTrail;
            const position = { coords, timestamp, omit: paused };
            zoomOnce(position);
            const { value, done } = tracer.next(position) || {};
            if (done || remaining.length <= 0) return tracer.return(value);
            const [nextPosition] = remaining;
            const delay = nextPosition.timestamp - timestamp;
            const speed = options.simSpeed || 1;
            window.setTimeout(() => {
              simulatePositionChange(remaining);
            }, delay * speed);
            return value;
          }

          if (Array.isArray(options.simulate)) {
            simulatePositionChange(options.simulate);
          } else {
            const {
              maximumAge = 0, enableHighAccuracy = true, timeout = Infinity,
            } = options;
            const geolocOpts = { maximumAge, enableHighAccuracy, timeout };
            const watchId = navigator.geolocation.watchPosition((geoloc = {}) => {
              const position = cloneGeolocation(geoloc);
              const { done } = tracer.next({ ...position, omit: paused });
              if (done) navigator.geolocation.clearWatch(watchId);
              zoomOnce(position);
            }, null, geolocOpts);
          }
        },
      },
      [START]: {
        action() {
          paused = false;
        },
        buttons: {
          [LEFT]: SAVE,
          [CENTER]: PAUSE,
          [RIGHT]: CANCEL,
        },
        icon: cssDPathSupported ? startIconSVG : startIconAnimatedSVG,
        title: 'Start',
      },
      [PAUSE]: {
        action() {
          paused = true;
        },
        buttons: {
          [LEFT]: SAVE,
          [CENTER]: RESUME,
          [RIGHT]: CANCEL,
        },
        render(ctx) {
          if (!cssDPathSupported) ctx.element.innerHTML = pauseIconAnimatedSVG;
          ctx.element.title = 'Pause';
          ctx.element.classList.remove(resumeBtnClassName);
          ctx.element.classList.add(pauseBtnClassName);
        },
      },
      [RESUME]: {
        action() {
          paused = false;
        },
        buttons: {
          [LEFT]: SAVE,
          [CENTER]: PAUSE,
          [RIGHT]: CANCEL,
        },
        render(ctx) {
          if (!cssDPathSupported) ctx.element.innerHTML = startIconAnimatedSVG;
          ctx.element.title = 'Resume';
          ctx.element.classList.remove(pauseBtnClassName);
          ctx.element.classList.add(resumeBtnClassName);
        },
      },
      [SAVE]: {
        icon: saveIconSVG,
        title: 'Save',
        action() {
          tracer.next({ done: true });
          tracer.return();
        },
      },
      [CANCEL]: {
        icon: cancelIconSVG,
        title: 'Cancel',
        action() {
          tracer.next({ done: true });
          tracer.return();
        },
      },
    };

    // Store the control buttons DOM nodes and current listeners in a separate
    // state tree object.
    const controlButtons = [LEFT, CENTER, RIGHT].reduce((crtls, position) => {
      const element = document.createElement('div');
      element.type = 'button';
      const name = `${liveCtrlClassname}-${position.toLowerCase()}`;
      element.name = name;
      element.className = `${liveCtrlClassname} ${name}`;
      liveCtrls.appendChild(element);
      return {
        ...crtls,
        [position]: { element, listener: null },
      };
    }, {});

    // Helpers for adding and removing listeners whenever a state change occurs.
    function addButtonListener(position, listener) {
      const { [position]: btn } = controlButtons;
      btn.element.addEventListener('click', listener);
      btn.listener = listener;
    }
    function removeButtonListeners(state) {
      if (!controlStates[state] || !controlStates[state].buttons) return;
      Object.keys(controlStates[state].buttons).forEach((position) => {
        const { [position]: btn } = controlButtons;
        btn.element.removeEventListener('click', btn.listener);
        btn.listener = null;
      });
    }

    // The main function used to step through each state transition in the
    // finite state machine.
    function stepState(target, event) {
      if (!controlStates[target]) return;
      const state = CURRENT_STATE;
      const { [target]: { action, buttons = {} } } = controlStates;
      if (typeof action === 'function') action({ state, event });
      removeButtonListeners(state);
      Object.entries(buttons).forEach(([position, btnTarget]) => {
        if (!controlStates[btnTarget] || !controlButtons[position]) return;
        const { [btnTarget]: { icon, title, render } } = controlStates;
        const { [position]: { element } } = controlButtons;
        if (typeof icon === 'string') element.innerHTML = icon;
        if (typeof title === 'string') element.title = title;
        if (typeof render === 'function') render({ state, element, event });
        const listener = e => stepState(btnTarget, e);
        addButtonListener(position, listener);
      });
      CURRENT_STATE = target;
    }

    stepState(INIT_STATE);
    if (options.immediateStart) stepState(START);
  }, false);

  return new Control({ element: ctrlContainer });
}
