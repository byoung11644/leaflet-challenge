

// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function (data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);

  function createFeatures(earthquakeData) {

    function onEachFeature(feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "<br> Magnitude: " + feature.properties.mag + "<br> Depth: " + feature.geometry.coordinates[2] + "</p>");
    }

    let mapScale = chroma.scale(['lightgreen', 'yellow', 'red', 'black']).domain([1, 700]);
    function getColor(d) {
      return mapScale(d);
    }


    function onEachPoint(feature, latlng) {
      if (feature.properties.mag) {
        return new L.Circle(latlng, {
          radius: Math.pow(feature.properties.mag * 7, 3),
          fillColor: getColor(feature.geometry.coordinates[2]),
          // color: getColor(feature.geometry.coordinates[2]),
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        })
      }
    }




    let earthquakes = L.geoJSON(earthquakeData, {
      style: function (feature) {
        return {
          color: getColor(feature.geometry.coordinates[2])
        };
      },
      pointToLayer: onEachPoint,
      onEachFeature: onEachFeature
    });

    createMap(earthquakes)
  };

  function createMap(earthquake) {

    // Define streetmap and darkmap layers
    let streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/satellite-v9",
      accessToken: API_KEY
    })

    let myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 4,
      layers: [streetmap, earthquake]
    })
  };
});
