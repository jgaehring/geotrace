import geotraceCtrl from 'farmos-map-geotrace';

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
const ctrl = geotraceCtrl(instance.map, geolocateOpts);
instance.map.addControl(ctrl);

const simDataRequest = new XMLHttpRequest();
simDataRequest.open('GET', 'sim.json');
simDataRequest.onload = () => {
  const { data: simulate } = JSON.parse(simDataRequest.responseText);
  const opts = {
    simulate,
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
  const simCtrl = geotraceCtrl(instance.map, opts);
  instance.map.addControl(simCtrl);
};
simDataRequest.send();
