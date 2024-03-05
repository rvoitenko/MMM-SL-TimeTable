const NodeHelper = require('node_helper');
const axios = require('axios');
const Log = console; // Using console for logging, adjust if you have a different logger

module.exports = NodeHelper.create({
    start: function () {
        Log.info('MMM-SL-TimeTable helper started...');
    },

    // Schedule the next data fetch
    scheduleNextFetch: function (config) {
        const self = this;
        // Clear any existing timeout to ensure only one instance runs
        if (this.fetchTimeout) {
            clearTimeout(this.fetchTimeout);
        }
        this.fetchTimeout = setTimeout(() => {
            self.getDepartures(config);
        }, config.updateInterval);
    },


    getDepartures: async function (config) {
        const self = this;
        try {
            const departurePromises = config.stations.map(station =>
                self.fetchDeparturesForStation(station, config.apikey)
            );

            const results = await Promise.all(departurePromises);
            self.sendSocketNotification('DEPARTURES', results.flat());

            // Schedule the next fetch after successfully fetching departures
            self.scheduleNextFetch(config);
        } catch (error) {
            Log.error('Error fetching departures:', error);
            self.sendSocketNotification('FETCH_ERROR', error.message);

            // Attempt to schedule the next fetch even if the current one fails
            self.scheduleNextFetch(config);
        }
    },

    fetchDeparturesForStation: async function (station, apikey) {
        try {
            let params = {
                id: station.stationId.toString(),
                format: 'json',
                accessId: apikey,
            };

            if (station.lines && station.lines.length > 0 && station.lines[0].direction) {
                params.direction = station.lines[0].direction;
            }

            const response = await axios.get('https://api.resrobot.se/v2.1/departureBoard', { params });

            Log.info(`Successfully fetched departures for station ${station.stationId}`);

            return response.data.Departure.map(dep => {
                const lineDetails = dep.ProductAtStop || (dep.Product && dep.Product.length > 0 ? dep.Product[0] : {});
                return {
                    TransportMode: lineDetails.catIn, // Assuming catIn is directly under ProductAtStop
                    LineNumber: lineDetails.displayNumber || lineDetails.num || "",
                    Destination: dep.direction || "",
                    DisplayTime: this.formatDepartureTime(dep.time || ""),
                };
            });
        } catch (error) {
            Log.error(`Error fetching departures for station ${station.stationId}:`, error);
            throw error; // Rethrow to handle it in the calling function
        }
    },

    formatDepartureTime: function (timeString) {
        var timeParts = timeString.split(":");
        return `${timeParts[0]}:${timeParts[1]}`; // Return formatted time HH:MM
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === 'GET_DEPARTURES') {
            this.getDepartures(payload);
        }
    }
});
