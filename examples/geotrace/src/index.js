import geotrace from './geotrace';

const units = 'metric';
const instance = window.farmOS.map.create('map', { units });
instance.addLayer('vector', {
  title: 'Drawing',
  group: 'Editable layers',
  color: 'orange',
});

// Starting position to place the marker and center the map.
const position = {
  coords: {
    latitude: 40.70,
    longitude: -73.90,
    heading: 0,
  },
  timestamp: Date.now(),
};

const simDataRequest = new XMLHttpRequest();
simDataRequest.open('GET', 'sim.json');
simDataRequest.onload = () => {
  const simulate = JSON.parse(simDataRequest.responseText);
  const geotraceCtrl = geotrace(instance.map, { simulate, position });
  instance.map.addControl(geotraceCtrl);
};
simDataRequest.send();
