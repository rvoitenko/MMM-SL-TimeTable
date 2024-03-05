Module.register("MMM-SL-TimeTable", {
	defaults: {
		apikey: 'PleaseProvideYourOwn',
		stations: [],
		updateInterval: 5 * 60 * 1000, // every 5 minutes
		minimal: false
	},

	start: function () {
		Log.info("Starting module: " + this.name);
		this.departures = [];
		this.loaded = false;
		this.updateDepartures();
		this.scheduleUpdate();
	},
	getStyles: function () {
		return [
			"MMM-SL-TimeTable.css",
			"font-awesome.css"
		];
	},
	// Schedule next departure update
	scheduleUpdate: function (delay) {
		var nextLoad = this.config.updateInterval;
		if (typeof delay !== "undefined" && delay >= 0) {
			nextLoad = delay;
		}
		var self = this;
		setTimeout(function () {
			self.updateDepartures();
		}, nextLoad);
	},

	// Update departure information
	updateDepartures: function () {
		this.sendSocketNotification("GET_DEPARTURES", this.config);
	},

	// Override socket notification handler.
	socketNotificationReceived: function (notification, payload) {
		if (notification === "DEPARTURES") {
			this.departures = payload;
			this.loaded = true;
			this.updateDom(this.config.animationSpeed);
		}
	},

	// --------------------------------------- Find the icon for this type of ride
	// Returns a HTML element that shall be added to the current row
	getRideIcon: function (dep) {
		switch (dep.TransportMode) {
			case 'BLT': return 'fas fa-bus'; // Example for bus
			case 'ULT': return 'fas fa-subway'; // Example for metro
			case 'SLT': return 'fas fa-tram'; // Example for tram
			case 'FLT': return 'fas fa-ship'; // Example for ship
			case 'JLT': return 'fas fa-train'; // Example for train
			default: return ''; // Default case if no match
		}
	},



	// Override dom generator.
	getDom: function() {
		var wrapper = document.createElement("div");

		if (!this.loaded) {
			wrapper.innerHTML = "Loading departures...";
			wrapper.className = "dimmed light small";
			return wrapper;
		}

		var table = document.createElement("table");
		table.className = "small table";

		// Add the table header only if minimal mode is not enabled
		if (!this.config.minimal) {
			table.appendChild(this.createTableHeader());
		}

		this.departures.slice(0, this.config.displayCount).forEach(departure => {
			var row = document.createElement("tr");

			// Transport mode icon
			var iconCell = document.createElement("td");
			var iconClass = this.getRideIcon(departure); // Use the updated getRideIcon function
			if (iconClass) {
				var iconElement = document.createElement("i");
				iconElement.className = iconClass; // Set the FontAwesome classes
				iconCell.appendChild(iconElement);
			} else {
				iconCell.innerHTML = ''; // Ensure cell is not empty if no icon class is returned
			}
			row.appendChild(iconCell);

			// Line number
			var lineCell = document.createElement("td");
			lineCell.innerHTML = departure.LineNumber; // Just the line number, icon is in a separate cell
			row.appendChild(lineCell);

			// Destination
			var destinationCell = document.createElement("td");
			destinationCell.innerHTML = departure.Destination;
			row.appendChild(destinationCell);

			// Departure time formatted without seconds
			var departureTimeCell = document.createElement("td");
			var timeString = departure.DisplayTime; // Assuming this is like "09:56:00"
			var timeParts = timeString.split(":");
			var displayTime = timeParts[0] + ":" + timeParts[1]; // Format time HH:MM
			departureTimeCell.innerHTML = displayTime;
			row.appendChild(departureTimeCell);

			table.appendChild(row);
		});

		wrapper.appendChild(table);
		return wrapper;
	},



	createTableHeader: function () {
		if (this.config.minimal) {
			// Return an empty row if minimal mode is enabled
			return document.createElement("tr");
		}

		var header = document.createElement("tr");

		// Add an empty header for the icon column
		var iconHeader = document.createElement("th");
		header.appendChild(iconHeader);

		var lineHeader = document.createElement("th");
		lineHeader.innerHTML = "Line";
		header.appendChild(lineHeader);

		var destinationHeader = document.createElement("th");
		destinationHeader.innerHTML = "Destination";
		header.appendChild(destinationHeader);

		var departureHeader = document.createElement("th");
		departureHeader.innerHTML = "Time";
		header.appendChild(departureHeader);

		return header;
	},



});
