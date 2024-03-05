var axios = require('axios');

function getStationId() {
    var opt = {
        method: 'get',
        url: 'https://api.resrobot.se/v2.1/location.name',
        params: {
            input: searchstring,
            format: 'json',
            accessId: apikey
        },
        responseType: 'json'
    };

    axios(opt)
        .then(function (response) {
            var resp = response.data;
            if (resp && resp.stopLocationOrCoordLocation && resp.stopLocationOrCoordLocation.length > 0) {
                resp.stopLocationOrCoordLocation.forEach(function (location) {
                    if (location.StopLocation) {
                        console.log("Station ID: " + location.StopLocation.extId + ", Name: " + location.StopLocation.name);
                    }
                });
            } else {
                console.log("No stop locations or coordinate locations found for the given search string.");
            }
        })
        .catch(function (err) {
            console.error('Error making API request:', err.message); // Debug: log any error message received during the request
        });
}

var apikey = process.argv[2];
var searchstring = process.argv[3];
getStationId(); // Call getStationId directly instead of main
