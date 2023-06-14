import '@farmos.org/farmos-map/dist/farmOS-map';
import '@farmos.org/farmos-map/dist/farmOS-map.css';
import geotraceCtrl from 'farmos-map-geotrace';
import 'farmos-map-geotrace/dist/geotrace.css';

const units = 'metric';
const instance = window.farmOS.map.create('map', { units });
instance.addLayer('vector', {
  title: 'Drawing',
  group: 'Editable layers',
  color: 'orange',
});

const ctrl = geotraceCtrl(instance.map);
instance.map.addControl(ctrl);
