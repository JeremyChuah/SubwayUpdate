// subwayData.js
const fs = require('fs');

// Read and parse subway data from file
function parseSubwayRouteData() {
    const data = fs.readFileSync('./subwayInfo/routes.txt', 'utf8');
    const lines = data.trim().split('\n');
    const routesMap = new Map();
    lines.map(line => {
        const fields = line.split(',');
        const route_id = fields[1];
        const route_long_name = fields[3];
        routesMap.set(route_id, route_long_name);
    });
    return routesMap;
}

function parseSubwayStopData() {
    const data = fs.readFileSync('./subwayInfo/stops.txt', 'utf8');
    const lines = data.trim().split('\n');
    const stopsMap = new Map();
    lines.forEach(line => {
        const fields = line.split(',');
        const stop_id = fields[0];
        const stop_name = fields[1];
        const stop_lat = parseFloat(fields[2]);
        const stop_lon = parseFloat(fields[3]);
        const direction = stop_id.slice(-1); // Get the direction indicator (N or S)

        // Check if the stop has direction indicators N or S
        if (direction === 'N' || direction === 'S') {
            // Create an object with stop information
            const stopInfo = {
                station_name: stop_name,
                latitude: stop_lat,
                longitude: stop_lon
            };

            // Map stop_id to stopInfo object
            stopsMap.set(stop_id, stopInfo);
        }
    });
    return stopsMap;
}

// Export the parsed subway data
module.exports = {
    parseSubwayRouteData,
    parseSubwayStopData
};