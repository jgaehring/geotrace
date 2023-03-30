import geotrace from './geotrace';

const units = 'metric';
const instance = window.farmOS.map.create('map', { units });
instance.addLayer('vector', {
  title: 'Drawing',
  group: 'Editable layers',
  color: 'orange',
});

const geotraceCtrl = geotrace(instance.map);
instance.map.addControl(geotraceCtrl);
