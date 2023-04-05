import geotrace from './geotrace';

const units = 'metric';
const instance = window.farmOS.map.create('map', { units });
instance.addLayer('vector', {
  title: 'Drawing',
  group: 'Editable layers',
  color: 'orange',
});

const simDataRequest = new XMLHttpRequest();
simDataRequest.open('GET', 'sim.json');
simDataRequest.onload = () => {
  const simulate = JSON.parse(simDataRequest.responseText);
  const geotraceCtrl = geotrace(instance.map, { simulate });
  instance.map.addControl(geotraceCtrl);
};
simDataRequest.send();
