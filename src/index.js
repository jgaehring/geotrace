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
  }

  // An initial position option can be provided, to kick off the tracing operation.
  if (options.position) {
    const { position } = options;
    updateGeolocation(position);

    // Format the initial position coords the way OpenLayers likes.
    const { coords: { latitude, longitude, heading } } = position;
    const rotation = calcRotation(null, heading);
    const coords = fromLonLat([longitude, latitude]);

    // Set the marker position and rotation.
    marker.setPosition(coords);
    markerEl.style.rotate = `${rotation}rad`;

    // Recenter here, at the beginning, regardless of whether the recenter option
    // has been set, then zoom and render to get things started.
    view.setCenter(coords);
    view.setZoom(19);
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

export function geolocate(map, options = {}) {
  const {
    maximumAge = 0, enableHighAccuracy = true, timeout = Infinity,
  } = options;
  const opts = { maximumAge, enableHighAccuracy, timeout };
  const tracer = geotrace(map, options);
  let watchId;
  const watcher = (rawPosition) => {
    const position = typeof options.transformPosition === 'function'
      ? options.transformPosition(rawPosition)
      : rawPosition;
    const { done } = tracer.next(position);
    if (done) navigator.geolocation.clearWatch(watchId);
  };
  watchId = navigator.geolocation.watchPosition(watcher, null, opts);
  return tracer;
}

export function geosimulate(map, options = {}) {
  const { simulate: data } = options;
  if (!data || !Array.isArray(data)) {
    throw new Error('Invalid geosimulate data');
  }

  const tracer = geotrace(map, options);
  function simulatePositionChange(simTrail) {
    const [currentPosition, ...remaining] = simTrail;
    const position = typeof options.transformPosition === 'function'
      ? options.transformPosition(currentPosition)
      : currentPosition;
    const { value, done } = tracer.next(position) || {};
    if (done || remaining.length <= 0) return tracer.return(value);
    const [nextPosition] = remaining;
    const delay = nextPosition.timestamp - currentPosition.timestamp;
    const speed = options.speed || 1;
    window.setTimeout(() => {
      simulatePositionChange(remaining);
    }, delay * speed);
    return value;
  }
  simulatePositionChange(data);

  return tracer;
}

export default function geotraceCtrl(map, options) {
  let tracer = null; let paused = false;

  const transformPosition = position => (paused ? { ...position, omit: true } : position);
  const startFn = options.simulate ? geosimulate : geolocate;
  const startOpts = { ...options, transformPosition };

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

    // Transition states (as string constants) for the state machine below.
    const STANDBY = 'STANDBY';
    const START = 'START';
    const PAUSE = 'PAUSE';
    const RESUME = 'RESUME';
    const SAVE = 'SAVE';
    const CANCEL = 'CANCEL';

    // Set the initial state as a separate constant to avoid confusion.
    const INIT_STATE = START;

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
      },
      [START]: {
        action() {
          tracer = startFn(map, startOpts);
        },
        buttons: {
          [LEFT]: SAVE,
          [CENTER]: PAUSE,
          [RIGHT]: CANCEL,
        },
        icon: '▶️',
        title: 'Start',
      },
      [PAUSE]: {
        action() {
          paused = !paused;
        },
        buttons: {
          [LEFT]: RESUME,
          [CENTER]: SAVE,
          [RIGHT]: CANCEL,
        },
        icon: '⏸️',
        title: 'Pause',
      },
      [RESUME]: {
        action() {
          paused = !paused;
        },
        buttons: {
          [LEFT]: SAVE,
          [CENTER]: PAUSE,
          [RIGHT]: CANCEL,
        },
        icon: '▶️',
        title: 'Resume',
      },
      [SAVE]: {
        icon: '💾',
        title: 'Save',
        action() {
          tracer.next({ done: true });
          tracer.return();
          tracer = null;
        },
      },
      [CANCEL]: {
        icon: '❌',
        title: 'Cancel',
        action() {
          tracer.next({ done: true });
          tracer.return();
          tracer = null;
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
  }, false);

  return new Control({ element: ctrlContainer });
}
