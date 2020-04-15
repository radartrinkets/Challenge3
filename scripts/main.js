
document.addEventListener("DOMContentLoaded", function(e) {

// Set api token for mapbox
mapboxgl.accessToken = 'pk.eyJ1IjoicmFkYXJ0cmlua2V0cyIsImEiOiJjazhyODV0YTIwN21wM2VwNjlyNjR4YmZ2In0.YY70N_F9VoD5-YRisQVojg';

// api token for openWeatherMap
var openWeatherMapUrl = 'https://api.openweathermap.org/data/2.5/weather';
var openWeatherMapUrlApiKey = '4f25a5e50352a1b20b607ffd8388234e';

// Determine cities
var cities = [
  {
    name: 'Den Haag',
    coordinates: [4.300700, 52.070498]
  },
  {
    name: 'Parijs',
    coordinates: [2.352222, 48.856614]
  },
  {
    name: 'New York',
    coordinates: [-74.005941, 40.712784]
  },
  {
    name: 'Berlijn',
    coordinates: [13.404954, 52.520007]
  },
  
];

// Initiate map
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/radartrinkets/ck914s0450uy91irugye9rhkb',
  center: [4.895168, 52.370216],
  zoom: 11,
  
  
});


document.getElementById('denhaag').addEventListener('click', function(){
  map.flyTo({
    center: [4.300700, 52.070498], essential:true
  });
});



document.getElementById('parijs').addEventListener('click', function(){
  map.flyTo({
    center: [2.352222, 48.856614], essential:true
  });
});

document.getElementById('newyork').addEventListener('click', function(){
  map.flyTo({
    center: [-74.005941, 40.712784], essential:true
  });
});

document.getElementById('berlijn').addEventListener('click', function(){
  map.flyTo({
    center: [13.404954, 52.520007], essential:true
  });
});


// get weather data and plot on map
map.on('load', function () {
  cities.forEach(function(city) {
    // Usually you do not want to call an api multiple times, but in this case we have to
    // because the openWeatherMap API does not allow multiple lat lon coords in one request.
    var request = openWeatherMapUrl + '?' + 'appid=' + openWeatherMapUrlApiKey + '&lon=' + city.coordinates[0] + '&lat=' + city.coordinates[1];

    // Get current weather based on cities' coordinates
    fetch(request)
      .then(function(response) {
        if(!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then(function(response) {
        // Then plot the weather response + icon on MapBox
        plotImageOnMap(response.weather[0].icon, city)
      })
      .catch(function (error) {
        console.log('ERROR:', error);
      });
  });
});

function plotImageOnMap(icon, city) {
  map.loadImage(
    'http://openweathermap.org/img/w/' + icon + '.png',
    function (error, image) {
      if (error) throw error;
      map.addImage("weatherIcon_" + city.name, image);
      map.addSource("point_" + city.name, {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [{
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: city.coordinates
            }
          }]
        }
      });
      map.addLayer({
        id: "points_" + city.name,
        type: "symbol",
        source: "point_" + city.name,
        layout: {
          "icon-image": "weatherIcon_" + city.name,
          "icon-size": 1.3
        }
      });
    }
  );
}

});