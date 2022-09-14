import './style.css';
import GeoJSON from 'ol/format/GeoJSON';
import Map from 'ol/Map';
import View from 'ol/View';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';
import {OSM, Vector as VectorSource} from 'ol/source';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {fromLonLat} from 'ol/proj';
import { featureCollection, multiPoint, multiPolygon } from '@turf/helpers';

// get the AOI
const fileNameToGet = 'Wellington_21Q3_V0_AOI.geojson'
const featureGetResponse = await fetch(`http://localhost:9000/aoi/${fileNameToGet}`)
  .then((data) => {return data.json()})

// convert the coordinates from EPSG:4326 to EPSG:3857s
const coordinatesConverted = featureGetResponse.coordinates[0][0].map(coord => fromLonLat(coord))
// feature collection with AOI feature in it
// a feature collection is required to create the vector source
const featureCollectionToUse = featureCollection([multiPolygon([[coordinatesConverted]])])

// this is the style of different types of geojson features
const styles = {
  'MultiPolygon': new Style({
    stroke: new Stroke({
      color: 'green',
      width: 1,
    }),
    fill: new Fill({
      color: 'rgba(255, 255, 0, 0.2)',
    }),
  })
};

const styleFunction = function (feature) {
  return styles[feature.getGeometry().getType()];
};

const vectorSource = new VectorSource({
  features: new GeoJSON().readFeatures(featureCollectionToUse),
});

const featureExtent = vectorSource.getExtent()

const vectorLayer = new VectorLayer({
  source: vectorSource,
  style: styleFunction,
});

// construct the map
const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    }),
    vectorLayer
  ],
  view: new View({
    center: [0, 0],
    zoom: 2
  })
});

// set the zoom level to the feature being displayed
map.getView().fit(featureExtent);
