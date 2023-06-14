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
