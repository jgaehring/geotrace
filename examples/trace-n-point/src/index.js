import Trace from './Trace';

const units = 'metric';
const instance = window.farmOS.map.create('map', { units });
const layer = instance.addLayer('vector', {
  title: 'Drawing',
  group: 'Editable layers',
  color: 'orange',
});
const trace = new Trace({ layer, units });
instance.map.addControl(trace);
