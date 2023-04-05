/**
 * Based on https://github.com/openlayers/openlayers/blob/main/examples/geolocation-orientation.js
 */

import { Overlay } from 'ol';
import { Control } from 'ol/control';
import { CLASS_CONTROL, CLASS_UNSELECTABLE } from 'ol/css';
import { LineString } from 'ol/geom';
import { fromLonLat } from 'ol/proj';
import createControlButton from './controlButton';

// Convert radians to degrees
function radToDeg(rad) {
  return (rad * 360) / (Math.PI * 2);
}

// Convert degrees to radians
function degToRad(deg) {
  return (deg * Math.PI * 2) / 360;
}

// Modulo for negative values
function negMod(n) {
  return ((n % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
}

function adjustHeading(trail, heading) {
  const trailCoords = trail.getCoordinates();
  const previous = trailCoords[trailCoords.length - 1];
  const prevHeading = previous && previous[2];

  if (!prevHeading) return prevHeading;

  // Force the rotation change to be less than 180°.
  let headingDiff = heading - negMod(prevHeading);
  if (Math.abs(headingDiff) > Math.PI) {
    const sign = headingDiff >= 0 ? 1 : -1;
    headingDiff = -sign * (2 * Math.PI - Math.abs(headingDiff));
  }
  return prevHeading + headingDiff;
}

export default function geotrace(map, options = {}) {
  const view = map.getView();

  const startCoords = fromLonLat([-73.90, 40.70]);
  view.setCenter(startCoords);
  view.setZoom(19);

  // Geolocation marker
  const markerEl = document.createElement('object');
  markerEl.id = 'trace-marker';
  markerEl.type = 'image/svg+xml';
  markerEl.data = '/marker-heading.svg';
  const marker = new Overlay({
    position: startCoords,
    positioning: 'center-center',
    element: markerEl,
    stopEvent: false,
  });
  map.addOverlay(marker);

  // An ol LineString to record geolocation positions along the path of travel.
  // X = longitude; Y = latitude; Z = heading (radians); M = timestamp (ms).
  // The Z dimension is actually used to store the rotation (heading).
  const trail = new LineString([40.70, -73.90, degToRad(0), Date.now()], 'XYZM');

  let deltaMean = 500; // the geolocation sampling period mean in ms

  const geolocationWatcher = (position) => {
    const {
      latitude, longitude, accuracy, speed,
    } = position.coords;

    const heading = adjustHeading(trail, position.coords.heading);
    const coords = [longitude, latitude, heading, position.timestamp];
    trail.appendCoordinate(coords);

    // only keep the 20 last coordinates
    trail.setCoordinates(trail.getCoordinates().slice(-20));

    if (heading && speed) markerEl.data = '/marker-heading.svg';
    else markerEl.data = '/marker.svg';

    const trailCoords = trail.getCoordinates();
    const len = trailCoords.length;
    if (len >= 2) {
      deltaMean = (trailCoords[len - 1][3] - trailCoords[0][3]) / (len - 1);
    }

    console.log([
      `Position: ${longitude.toFixed(2)}, ${latitude.toFixed(2)}`,
      `Accuracy: ${accuracy}`,
      `Heading: ${Math.round(radToDeg(heading))}&deg;`,
      `Speed: ${(speed * 3.6).toFixed(1)} km/h`,
      `Delta: ${Math.round(deltaMean)}ms`,
    ].join('\n'));
  };

  // A stateful function that updates the view.
  let previousUpdateInMilliseconds = 0;
  function updateView() {

    // use sampling period to get a smooth transition
    let m = Date.now() - deltaMean * 1.5;
    m = Math.max(m, previousUpdateInMilliseconds);
    previousUpdateInMilliseconds = m;

    const coords = trail.getCoordinateAtM(m, true);
    if (coords) {
      const centerCoords = fromLonLat([coords[1], coords[0]]);
      view.setCenter(centerCoords);
      marker.setPosition(centerCoords);

      const rotation = -coords[2];
      view.setRotation(rotation);

      map.render();
    }
  }

  const geolocateBtnOpts = {
    tooltip: 'Trace a Path',
    svg: '/marker-heading.svg',
  };

  let watchId = null;
  function geolocateBtnOnClick() {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      watchId = null;
      return;
    }

    watchId = navigator.geolocation.watchPosition(geolocationWatcher, null, {
      maximumAge: 10000,
      enableHighAccuracy: true,
      timeout: 600000,
    });
    updateView();
  }

  const geolocateBtn = createControlButton('trace', geolocateBtnOpts);
  geolocateBtn.addEventListener('click', geolocateBtnOnClick, false);

  function simulatePositionChange(simTrail) {
    const [current, ...remaining] = simTrail;
    geolocationWatcher(current);
    updateView();
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
