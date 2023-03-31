/**
 * Based on https://github.com/openlayers/openlayers/blob/main/examples/geolocation-orientation.js
 */

import { Overlay } from 'ol';
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

// To use CSS on an SVG file, without the need to insert a string of raw XML by
// setting the innerHTML, use an <object> element instead and set its data attribute
// to the relative URL of the source file.
function appendSvgFromUrl(element, src, options) {
  const svgObj = document.createElement('object');
  svgObj.type = 'image/svg+xml';
  svgObj.data = src;
  element.appendChild(svgObj);

  /**
   * The <object> HTML tag is not considered "interactive content", so use an
   * overlay <div> to capture the click event when using an svg icon.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Content_categories#interactive_content
   */
  const overlay = document.createElement('div');
  overlay.className = `${options.className} interactive-content-overlay`;
  element.appendChild(overlay);
}

/**
 * @param {String} name A short name, such as 'draw', that can be used to identify
 * the specific button and to format the CSS classes.
 * @param {Object} [options]
 * @property {String} [options.tag='button'] The HTML element to be used.
 * @property {String} [options.className] Override the format of the CSS class.
 * @property {String} [options.tooltip] Tooltip for the button's `title` attr.
 * @property {String} [options.html] The inner HTML to be inserted as the button label.
 * @property {String} [options.svg] A relative URL to an svg file to be used as the label.
 * @returns {HTMLElement} A new HTMLElelemnt; must be appended to DOM separately.
 */
function createControlButton(name, options) {
  const button = document.createElement(options.tag || 'button');
  button.name = name;
  button.type = 'button';
  const className = options.className || `ol-${name}`;
  button.className = `${className} ${className}-buttons`;
  if (options.tooltip) button.title = options.tooltip;

  // Add a label to the button, using either the svg or html content from options,
  // or if neither is provided, just the first letter of the name.
  if (options.svg) appendSvgFromUrl(button, options.svg, { className });
  else if (options.html) button.innerHTML = options.html;
  else {
    const html = `<span>${name.trim().slice(0, 1).toUpperCase()}</span>`;
    button.innerHTML = html;
  }

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

  // An ol LineString to record geolocation positions along the path of travel.
  // X = longitude; Y = latitude; Z = heading (radians); M = timestamp (ms).
  // The Z dimension is actually used to store the rotation (heading).
  const trail = new LineString([40.70, -73.90, degToRad(90), Date.now()], 'XYZM');

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

  const container = options.element || document.createElement('div');
  container.className = `ol-trace ${CLASS_UNSELECTABLE} ${CLASS_CONTROL}`;
  container.appendChild(geolocateBtn);
  return new Control({ element: container });
}
