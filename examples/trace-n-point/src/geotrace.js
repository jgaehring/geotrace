/**
 * Based on https://github.com/openlayers/openlayers/blob/main/examples/geolocation-orientation.js
 */

import { Geolocation, Overlay } from 'ol';
import { Control } from 'ol/control';
import { CLASS_CONTROL, CLASS_UNSELECTABLE } from 'ol/css';
import { LineString } from 'ol/geom';
import { fromLonLat } from 'ol/proj';

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

function adjustHeading(positions, geolocation) {
  const heading = geolocation.getHeading() || 0;
  const prevCoords = positions.getCoordinates();
  const previous = prevCoords[prevCoords.length - 1];
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
function adjustCoordinates(positions, geolocation) {
  const [x, y] = geolocation.getPosition();
  const heading = adjustHeading(positions, geolocation);
  return [x, y, heading, Date.now()];
}

// TODO use speed instead (from original comments in example code)
const toToggleMarker = (whenMoving, whenStationary) => (heading, speed) => (
  heading && speed ? whenMoving() : whenStationary()
);

// Recenter the view by shifting the coordinates 3/4 from the top of the map.
function recenter(view, mapHeight, coordinates) {
  const resolution = view.getResolution();
  const rotation = -coordinates[2];
  const centerCoords = [
    coordinates[0] - (Math.sin(rotation) * mapHeight * resolution * 1) / 4,
    coordinates[1] + (Math.cos(rotation) * mapHeight * resolution * 1) / 4,
  ];
  view.setCenter(centerCoords);
}

function attachButton(name, onClick, options) {
  const button = document.createElement(options.tag || 'button');
  button.name = name;
  button.type = 'button';
  if (options.tooltip) button.title = options.tooltip;
  const className = options.className || `ol-${name}`;
  button.className = `${className} ${className}-buttons`;

  // Add a label to the button, either with svg or html content from options,
  // or if all else fails, just the first letter of the name.
  if (options.svg) {
    const svg = document.createElement('object');
    svg.type = 'image/svg+xml';
    svg.data = options.svg;
    button.appendChild(svg);
  } else if (options.html) button.innerHTML = options.html;
  else {
    const html = `<span>${name.trim().slice(0, 1).toUpperCase()}</span>`;
    button.innerHTML = html;
  }

  /**
   * The <object> HTML tag is not considered "interactive content", so use an
   * overlay <div> to capture the click event when using an svg icon.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Content_categories#interactive_content
   */
  let clickTarget = button;
  if (options.svg) {
    const overlay = document.createElement('div');
    overlay.className = `${className} interactive-content-overlay`;
    button.appendChild(overlay);
    clickTarget = overlay;
  }
  clickTarget.addEventListener('click', onClick, false);

  return button;
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

  // FIXME: update URL and use objectEl.data
  const whenMoving = () => {
    markerEl.data = '/marker-heading.svg';
  };
  const whenStationary = () => {
    markerEl.data = '/marker.svg';
  };
  const toggleMarker = toToggleMarker(whenMoving, whenStationary);


  // LineString to store the different geolocation positions. This LineString
  // is time aware.
  // The Z dimension is actually used to store the rotation (heading).
  const positions = new LineString([40.70, -73.90, degToRad(90), Date.now()], 'XYZM');

  // Geolocation Control
  const geolocation = new Geolocation({
    projection: view.getProjection(),
    trackingOptions: {
      maximumAge: 10000,
      enableHighAccuracy: true,
      timeout: 600000,
    },
  });

  let deltaMean = 500; // the geolocation sampling period mean in ms

  // Listen to position changes
  geolocation.on('change', () => {
    const position = geolocation.getPosition();
    const accuracy = geolocation.getAccuracy();
    const speed = geolocation.getSpeed() || 0;

    const [x, y, heading, ms] = adjustCoordinates(positions, geolocation);
    positions.appendCoordinate([x, y, heading, ms]);

    // only keep the 20 last coordinates
    positions.setCoordinates(positions.getCoordinates().slice(-20));

    toggleMarker(heading, speed);

    const coords = positions.getCoordinates();
    const len = coords.length;
    if (len >= 2) {
      deltaMean = (coords[len - 1][3] - coords[0][3]) / (len - 1);
    }

    console.log([
      `Position: ${longitude.toFixed(2)}, ${latitude.toFixed(2)}`,
      `Accuracy: ${accuracy}`,
      `Heading: ${Math.round(radToDeg(heading))}&deg;`,
      `Speed: ${(speed * 3.6).toFixed(1)} km/h`,
      `Delta: ${Math.round(deltaMean)}ms`,
    ].join('\n'));
  });

  // A stateful function that updates the view.
  let previousUpdateInMilliseconds = 0;
  function updateView() {

    // use sampling period to get a smooth transition
    let m = Date.now() - deltaMean * 1.5;
    m = Math.max(m, previousUpdateInMilliseconds);
    previousUpdateInMilliseconds = m;

    const coords = positions.getCoordinateAtM(m, true);
    if (coords) {
      const rotation = -coords[2];
      const height = map.getSize()[1];

      recenter(view, height, coords);
      view.setRotation(rotation);
      marker.setPosition(coords);

      map.render();
    }
  }

  const geolocateBtnOpts = {
    tooltip: 'Trace a Path',
    svg: '/marker-heading.svg',
  };
  function geolocateBtnOnClick() {
    geolocation.setTracking(true); // Start position tracking
    map.render();
  }
  const geolocateBtn = attachButton('trace', geolocateBtnOnClick, geolocateBtnOpts);

  const container = options.element || document.createElement('div');
  container.className = `ol-trace ${CLASS_UNSELECTABLE} ${CLASS_CONTROL}`;
  container.appendChild(geolocateBtn);
  return new Control({ element: container });
}
