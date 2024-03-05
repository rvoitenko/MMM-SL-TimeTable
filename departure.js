function Departure(data) {
    this.TransportMode = data.TransportMode; // You might map this from Product.catOutL or similar
    this.LineNumber = data.LineNumber; // Map from Product.num
    this.Destination = data.Destination; // Use directly if provided
    this.TimeTabledDateTime = data.TimeTabledDateTime; // Combine date and time fields
    this.ExpectedDateTime = data.ExpectedDateTime; // Use realtime date and time if available
    this.JourneyDirection = data.JourneyDirection; // Determine how to set this based on new API data
    this.DisplayTime = data.DisplayTime; // Use directly if provided
}

Departure.prototype.ToString = function() {
    return this.TransportMode + ' ' + this.LineNumber;
}

module.exports = Departure;
