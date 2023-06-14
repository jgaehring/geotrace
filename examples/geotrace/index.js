import geotraceCtrl from 'farmos-map-geotrace';

const units = 'metric';
const instance = window.farmOS.map.create('map', { units });
instance.addLayer('vector', {
  title: 'Drawing',
  group: 'Editable layers',
  color: 'orange',
});

const ctrl = geotraceCtrl(instance.map);
instance.map.addControl(ctrl);

const simDataRequest = new XMLHttpRequest();
simDataRequest.open('GET', 'sim.json');
simDataRequest.onload = () => {
  const { data } = JSON.parse(simDataRequest.responseText);
  const opts = {
    simulate: data,
    immediateStart: true,
  };
  const simCtrl = geotraceCtrl(instance.map, opts);
  instance.map.addControl(simCtrl);
};
simDataRequest.send();
