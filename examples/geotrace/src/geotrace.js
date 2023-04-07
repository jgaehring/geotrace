/**
 * Based on https://github.com/openlayers/openlayers/blob/main/examples/geolocation-orientation.js
 */

import { Overlay } from 'ol';
import { Control } from 'ol/control';
import { CLASS_CONTROL, CLASS_UNSELECTABLE } from 'ol/css';
import { LineString } from 'ol/geom';
import { fromLonLat } from 'ol/proj';
import createControlButton from './controlButton';

// For converting the map rotation (in radians) to degrees.
function radToDeg(rad) {
  return (rad * 360) / (Math.PI * 2);
}

// For converting the heading (in degrees) to radians.
function degToRad(deg) {
  return (deg * Math.PI * 2) / 360;
}

// Modulo for negative values
function negMod(n) {
  return ((n % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
}

function calcRotation(trail, heading) {
  const rotation = degToRad(heading);
  const trailCoords = trail.getCoordinates();
  const previous = trailCoords[trailCoords.length - 1];
  const prevRotation = previous && previous[2];

  if (typeof prevRotation !== 'number') return rotation;

  // Force the rotation change to be less than 180°.
  let rotationDelta = rotation - negMod(prevRotation);
  if (Math.abs(rotationDelta) > Math.PI) {
    const sign = rotationDelta >= 0 ? 1 : -1;
    rotationDelta = -sign * (2 * Math.PI - Math.abs(rotationDelta));
  }
  return prevRotation + rotationDelta;
}

export default function geotrace(map, options = {}) {
  const view = map.getView();

  // An ol LineString to record geolocation positions along the path of travel.
  // X = longitude; Y = latitude; Z = heading (radians); M = timestamp (ms).
  // The Z dimension is actually used to store the rotation (heading).
  const trail = new LineString([], 'XYZM');

  // Geolocation marker
  const markerEl = document.createElement('object');
  markerEl.id = 'trace-marker';
  markerEl.type = 'image/svg+xml';
  markerEl.data = '/marker-heading.svg';
  const marker = new Overlay({
    positioning: 'center-center',
    element: markerEl,
    stopEvent: false,
  });

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

  const updateGeolocation = (position) => {
    const {
      heading, latitude, longitude, accuracy, speed,
    } = position.coords;

    const rotation = calcRotation(trail, position.coords.heading);
    const coords = [longitude, latitude, rotation, position.timestamp];
    trail.appendCoordinate(coords);
    const trailCoords = trail.getCoordinates();

    if (heading && speed) markerEl.data = '/marker-heading.svg';
    else markerEl.data = '/marker.svg';

    if (trailCoords.length >= 2) {
      const timestamps = trailCoords.map(c => c[3]);
      const [latest] = timestamps.slice(-1);
      const [earlier] = timestamps.slice(-sampleSize);
      meanSamplingRate = (latest - earlier) / sampleSize;
    }

    console.log([
      `Position: ${longitude.toFixed(2)}, ${latitude.toFixed(2)}`,
      `Accuracy: ${accuracy}`,
      `Heading: ${Math.round(radToDeg(heading))}&deg;`,
      `Speed: ${(speed * 3.6).toFixed(1)} km/h`,
      `Delta: ${Math.round(meanSamplingRate)}ms`,
    ].join('\n'));

    const sampleTS = sampleTimestamp(position.timestamp);
    const sampleCoords = trail.getCoordinateAtM(sampleTS, true);

    if (sampleCoords) {
      const centerCoords = fromLonLat(sampleCoords);
      view.setCenter(centerCoords);
      marker.setPosition(centerCoords);

      const sampleRotation = -sampleCoords[2];
      view.setRotation(sampleRotation);
      view.setZoom(19);

      map.render();
    }
  };

  if (options.position) {
    updateGeolocation(options.position);
  }

  const geolocateBtnOpts = {
    tooltip: 'Trace a Path',
    svg: '/marker-heading.svg',
  };

  let watchId = null;
  function geolocateBtnOnClick() {
    map.addOverlay(marker);

    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      watchId = null;
      return;
    }

    watchId = navigator.geolocation.watchPosition(updateGeolocation, null, {
      maximumAge: 0,
      enableHighAccuracy: true,
      timeout: Infinity,
    });
  }

  const geolocateBtn = createControlButton('trace', geolocateBtnOpts);
  geolocateBtn.addEventListener('click', geolocateBtnOnClick, false);

  function simulatePositionChange(simTrail) {
    const [current, ...remaining] = simTrail;
    updateGeolocation(current);
    if (remaining.length <= 0) return;
    const [next] = remaining;
    const delay = next.timestamp - current.timestamp;
    window.setTimeout(() => {
      simulatePositionChange(remaining);
    }, delay * 2);
  }
  const simulateBtnOpts = {
    tooltip: 'Trace a Path',
    html: '&#x1F3C3;',
  };
  function simulateBtnOnClick() {
    if (options.simulate && Array.isArray(options.simulate.data)) {
      simulatePositionChange(options.simulate.data);
    }
  }
  const simulateBtn = createControlButton('simulate', simulateBtnOpts);
  simulateBtn.addEventListener('click', simulateBtnOnClick);

  const container = options.element || document.createElement('div');
  container.className = `ol-trace ${CLASS_UNSELECTABLE} ${CLASS_CONTROL}`;
  container.appendChild(geolocateBtn);
  if (options.simulate && Array.isArray(options.simulate.data)) {
    container.appendChild(simulateBtn);
  }
  return new Control({ element: container });
}
