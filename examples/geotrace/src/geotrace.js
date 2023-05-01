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
import createControlButton from './controlButton';

export function* geotrace(map, options = {}) {
  const view = map.getView();
  const baseLayer = options.layer || map.getAllLayers()
    .find(layer => layer.getProperties().type === 'base');

  // An ol LineString to record geolocation positions along the path of travel.
  // X = longitude; Y = latitude; Z = heading (radians); M = timestamp (ms).
  // The Z dimension is actually used to store the rotation (heading).
  const trail = new LineString([], 'XYZM');

  // A separate linestring will actually display the trail while geotracing.
  const preview = new LineString([], 'XY');
  const previewLayer = new VectorLayer({
    title: 'Geotrace',
    visible: true,
    source: new VectorSource({
      features: [new Feature({
        type: 'trail',
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
  const markerEl = document.createElement('object');
  markerEl.id = 'trace-marker';
  markerEl.type = 'image/svg+xml';
  markerEl.data = '/marker-heading.svg';
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

  function updateMarkerIcon(rotation) {
    const { pathname: prev } = new URL(markerEl.data);
    const next = typeof rotation === 'number' ? '/marker-heading.svg' : '/marker.svg';
    if (prev !== next) markerEl.data = next;
  }

  // The average interval (in milliseconds) between geolocation updates, half a
  // a second to start, but recalculated each time based on the past 20 updates.
  let meanSamplingRate = 500;
  const sampleSize = 20;

  // The getCoordinateAtM() method will interpolate a value anywhere along the
  // LineString, so the trail coordinates are sampled from an earlier timespan
  // between 1 and 2 times the sampling rate in order to keep the motion of the
  // the position marker smooth and consistent.
  let previousSampleTimestamp = 0;
  const sampleTimestamp = (timestamp) => {
    const sampleTS = previousSampleTimestamp !== 0
      ? Math.max(timestamp - meanSamplingRate * 1.5, previousSampleTimestamp)
      : timestamp; // Don't make any adjustments for the first sample timestamp.
    previousSampleTimestamp = sampleTS;
    return sampleTS;
  };

  function updateView() {
    const sampleTS = sampleTimestamp(Date.now());
    const sampleCoords = trail.getCoordinateAtM(sampleTS, true);

    if (!Array.isArray(sampleCoords)) return;

    // Format the sample coordinates the way OpenLayers likes.
    const [lon, lat, rotation] = sampleCoords;
    const coords = fromLonLat([lon, lat]);

    // Update the marker's position and icon.
    marker.setPosition(coords);
    updateMarkerIcon(rotation);

    // Update the prevew trail here with the marker, rather than with the main trail.
    preview.appendCoordinate(coords);

    // Recenter and rotate the the map view if that option is set to true, but
    // otherwise just rotate the marker overlay itself; the overlay will autopan
    // if it starts to go out of the viewbox.
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
    if (position.done) done = true;
    if (!position.coords || position.omit || done) return trail;
    const {
      heading, latitude, longitude, accuracy, speed,
    } = position.coords;

    // Update the main trail coordinates.
    const rotation = calcRotation(trail, position.coords.heading);
    const coords = [longitude, latitude, rotation, Date.now()];
    trail.appendCoordinate(coords);

    // Recalculate the mean samplng rate.
    const trailCoords = trail.getCoordinates();
    if (trailCoords.length >= 2) {
      const timestamps = trailCoords.map(c => c[3]);
      const [latest] = timestamps.slice(-1);
      const [earlier] = timestamps.slice(-sampleSize);
      meanSamplingRate = (latest - earlier) / sampleSize;
    }

    console.log([
      `Position: ${longitude.toFixed(2)}, ${latitude.toFixed(2)}`,
      `Accuracy: ${accuracy}`,
      `Heading: ${heading}\u00B0`,
      `Speed: ${(speed * 3.6).toFixed(1)} km/h`,
      `Delta: ${Math.round(meanSamplingRate)}ms`,
    ].join('\n'));

    return trail;
  }

  // An initial position option can be provided, to kick off the tracing operation.
  if (options.position) {
    const { position } = options;
    updateGeolocation(position);

    // Format the initial position coords the way OpenLayers likes.
    const { coords: { latitude, longitude, heading } } = position;
    const rotation = calcRotation(trail, heading);
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
   * Using the postrender (postcompose in OpenLayers v. 5 or earlier) produces
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

  return trail;
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
    window.setTimeout(() => {
      simulatePositionChange(remaining);
    }, delay * 2);
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
  const start = () => startFn(map, startOpts);

  const button = createControlButton('trace', {
    tooltip: 'Trace a Path',
    svg: '/marker-heading.svg',
  });
  const container = options.element || document.createElement('div');
  container.className = `ol-trace ${CLASS_UNSELECTABLE} ${CLASS_CONTROL}`;
  container.appendChild(button);

  button.addEventListener('click', () => {
    if (!tracer) tracer = start();

    const startButton = createControlButton('trace', {
      tooltip: 'Start Tracing',
      html: '▶️',
    });
    startButton.addEventListener('click', () => {
      if (tracer && typeof tracer.next === 'function') paused = !paused;
    }, false);
    container.appendChild(startButton);

    const pauseButton = createControlButton('trace', {
      tooltip: 'Pause Tracing',
      html: '⏸️',
    });
    pauseButton.addEventListener('click', () => {
      if (tracer && typeof tracer.next === 'function') paused = !paused;
    }, false);
    container.appendChild(pauseButton);

    const stopButton = createControlButton('trace', {
      tooltip: 'Stop Tracing',
      html: '⏹️',
    });
    stopButton.addEventListener('click', () => {
      if (tracer && typeof tracer.next === 'function') {
        tracer.next({ done: true });
        tracer.return();
        tracer = null;

        startButton.remove();
        pauseButton.remove();
        stopButton.remove();
      }
    }, false);
    container.appendChild(stopButton);

  }, false);

  return new Control({ element: container });
}
