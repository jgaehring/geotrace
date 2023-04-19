import { geolocate, geosimulate } from './geotrace';

const units = 'metric';
const instance = window.farmOS.map.create('map', { units });
instance.addLayer('vector', {
  title: 'Drawing',
  group: 'Editable layers',
  color: 'orange',
});

// Starting position to place the marker and center the map.
const geolocateOpts = {
  position: {
    coords: {
      latitude: 40.70,
      longitude: -73.90,
      heading: 0,
    },
    timestamp: Date.now(),
  },
};
const geotraceCtrl = geolocate(instance.map, geolocateOpts);
instance.map.addControl(geotraceCtrl);

const simulateOpts = {
  position: {
    coords: {
      speed: 1.7330950498580933,
      accuracy: 5,
      altitudeAccuracy: 8,
      altitude: 238,
      longitude: 5.868668798362713,
      heading: 67.5,
      latitude: 45.64444874417562,
    },
    timestamp: 1394788264972,
  },
};
const simDataRequest = new XMLHttpRequest();
simDataRequest.open('GET', 'sim.json');
simDataRequest.onload = () => {
  const { data } = JSON.parse(simDataRequest.responseText);
  const simulateCtrl = geosimulate(instance.map, data, simulateOpts);
  instance.map.addControl(simulateCtrl);
};
simDataRequest.send();
