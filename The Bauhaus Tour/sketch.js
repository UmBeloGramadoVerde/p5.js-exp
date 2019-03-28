let ZOOM_RUA = 16;
let ZOOM_CIDADE = 8.7;
let PITCH_CIDADE = 45;
let PITCH_RUA = 90;
let BEARING_1 = 0;
let BEARING_2 = 90;
let BEARING_3 = 180;
let BEARING_4 = 270;

function setup() {
  mapboxgl.accessToken = 'pk.eyJ1IjoiY29kaW5ndHJhaW4iLCJhIjoiY2l6MGl4bXhsMDRpNzJxcDh0a2NhNDExbCJ9.awIfnl6ngyHoB3Xztkzarw';

  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v10',
    center: [11.323544, 50.979492],
    zoom: 8.7,
    bearing: 27,
    pitch: 90
  });

  map.on('load', function() {
    // Insert the layer beneath any symbol layer.
    var layers = map.getStyle().layers;

    var labelLayerId;
    for (var i = 0; i < layers.length; i++) {
      if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
        labelLayerId = layers[i].id;
        break;
      }
    }

    map.addLayer({
      'id': '3d-buildings',
      'source': 'composite',
      'source-layer': 'building',
      'filter': ['==', 'extrude', 'true'],
      'type': 'fill-extrusion',
      'minzoom': 15,
      "overlay": {
        "type": "image",
        "url": "https://docs.mapbox.com/mapbox-gl-js/assets/radar.gif",
        "coordinates": [
          [-80.425, 46.437],
          [-71.516, 46.437],
          [-71.516, 37.936],
          [-80.425, 37.936]
        ]
      },
      'paint': {
        'fill-extrusion-color': '#aaa',

        // use an 'interpolate' expression to add a smooth transition effect to the
        // buildings as the user zooms in
        'fill-extrusion-height': [
          "interpolate", ["linear"],
          ["zoom"],
          15, 0,
          15.05, ["get", "height"]
        ],
        'fill-extrusion-base': [
          "interpolate", ["linear"],
          ["zoom"],
          15, 0,
          15.05, ["get", "min_height"]
        ],
        'fill-extrusion-opacity': .6
      }
    }, labelLayerId);
  });

  var chapters = {
    'start': {
      bearing: 27,
      center: [11.323544, 50.979492],
      zoom: ZOOM_CIDADE,
      pitch: PITCH_CIDADE
    },
    'weimar-high': {
      bearing: 27,
      center: [11.323544, 50.979492],
      zoom: ZOOM_CIDADE,
      pitch: PITCH_CIDADE
    },
    'weimar-street-1': {
      bearing: BEARING_1,
      center: [11.323544, 50.979492],
      zoom: ZOOM_RUA,
      pitch: PITCH_RUA
    },
    'weimar-street-2': {
      bearing: BEARING_2,
      center: [11.324544, 50.969492],
      zoom: ZOOM_RUA,
      pitch: PITCH_RUA
    },
    'dessau-high': {
      center: [12.24555, 51.83864],
      bearing: BEARING_1,
      zoom: ZOOM_CIDADE,
      pitch: PITCH_CIDADE
    },
    'dessau-street-1': {
      center: [12.24555, 51.83864],
      bearing: BEARING_1,
      zoom: ZOOM_RUA,
      pitch: PITCH_RUA
    },
    'dessau-street-2': {
      center: [12.25555, 51.83864],
      bearing: BEARING_2,
      zoom: ZOOM_RUA,
      pitch: PITCH_RUA
    },
    'berlin-high': {
      bearing: BEARING_2,
      center: [13.404954, 52.520008],
      zoom: ZOOM_CIDADE,
      pitch: PITCH_CIDADE
    },
    'berlin-street-1': {
      bearing: BEARING_1,
      center: [13.444954, 52.520008],
      zoom: ZOOM_RUA,
      pitch: PITCH_RUA
    },
    'berlin-street-2': {
      bearing: BEARING_2,
      center: [13.377775, 52.516266],
      zoom: ZOOM_RUA,
      pitch: PITCH_RUA
    },
    'berlin-street-3': {
      bearing: BEARING_3,
      center: [13.454954, 52.530008],
      zoom: ZOOM_RUA,
      pitch: PITCH_RUA
    },
    'berlin-street-4': {
      bearing: BEARING_4,
      center: [13.404954, 52.520008],
      zoom: ZOOM_RUA,
      pitch: PITCH_RUA
    },
    'berlin-street-5': {
      bearing: BEARING_4,
      center: [13.414954, 52.520008],
      zoom: ZOOM_RUA,
      pitch: PITCH_RUA
    },
    'brasilia-high': {
      bearing: BEARING_1,
      center: [-47.856829906, -15.800496798],
      zoom: ZOOM_CIDADE,
      pitch: PITCH_CIDADE
    },
    'brasilia-street-1': {
      bearing: BEARING_4,
      center: [-47.859829906, -15.800096798],
      zoom: ZOOM_RUA,
      pitch: PITCH_RUA
    },
    'telaviv-high': {
      bearing: BEARING_1,
      center: [34.855499, 32.109333],
      zoom: ZOOM_CIDADE,
      pitch: PITCH_CIDADE
    },
    'telaviv-street-1': {
      bearing: BEARING_4,
      center: [34.855499, 32.169333],
      zoom: ZOOM_RUA,
      pitch: PITCH_RUA
    },
  };

  window.onscroll = function() {
    var chapterNames = Object.keys(chapters);
    for (var i = 0; i < chapterNames.length; i++) {
      var chapterName = chapterNames[i];
      if (isElementOnScreen(chapterName)) {
        setActiveChapter(chapterName);
        break;
      }
    }
  };

  var activeChapterName = 'start';

  function setActiveChapter(chapterName) {
    if (chapterName === activeChapterName) return;

    map.flyTo(chapters[chapterName]);

    document.getElementById(chapterName).setAttribute('class', 'active');
    document.getElementById(activeChapterName).setAttribute('class', '');

    activeChapterName = chapterName;
  }

  function isElementOnScreen(id) {
    var element = document.getElementById(id);
    var bounds = element.getBoundingClientRect();
    return bounds.top < window.innerWidth && bounds.bottom > 0;
  }
}