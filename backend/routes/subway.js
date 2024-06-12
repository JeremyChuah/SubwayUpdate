const express = require('express');
const router = express.Router();
const axios = require('axios');
const protobuf = require('protobufjs');


const protoFiles = ['./proto/gtfs-realtime-NYCT.proto'];
const subwayData = require('../subwayInfo/subwayInfo');

const routeData = subwayData.parseSubwayRouteData();
const stopData = subwayData.parseSubwayStopData();

router.get('/ACE', async (req, res) => {
    try {

        const root = await protobuf.load(protoFiles);
        // Make a request to the MTA API to fetch the GTFS-RT data
        const response = await fetch("https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-ace");

        const FeedMessage = root.lookupType('FeedMessage');

        // Check if the response was successful
        if (!response.ok) {
            const error = new Error(`${response.url}: ${response.status} ${response.statusText}`);
            error.response = response;
            throw error;
        }

        // Get the binary data as an ArrayBuffer
        const buffer = await response.arrayBuffer();

        // Decode the GTFS-RT data using GtfsRealtimeBindings
        const feed = FeedMessage.decode(new Uint8Array(buffer));

        const entityData = [];

        for (const entity of feed.entity) {
            if (entity.tripUpdate && entity.tripUpdate.stopTimeUpdate.length > 0) {
                const stopUpdates = [];
                for (const stopUpdate of entity.tripUpdate.stopTimeUpdate) {
                    const currentTime = new Date();
                    const thrityMinPast = new Date(currentTime.getTime() + 30 * 60 * 1000);
                    const arrivalTime = new Date(stopUpdate.arrival.time * 1000);
                    if (stopUpdate.arrival && arrivalTime >= currentTime && arrivalTime <= thrityMinPast) {
                        stopUpdates.push({
                            stop: stopData.get(stopUpdate.stopId),
                            arrivalTime: new Date(stopUpdate.arrival.time * 1000).getTime()
                        });
                    }
                }
                entityData.push({
                    stopUpdates: stopUpdates,
                    currentRoute: routeData.get(entity.tripUpdate.trip.routeId),
                    routeId: entity.tripUpdate.trip.routeId,
                    last_station: stopData.get(entity.tripUpdate.stopTimeUpdate.at(-1).stopId).station_name
                });
            }
        }
        res.send(entityData);
    } catch (error) {
        console.error('Error fetching and parsing GTFS-RT data:', error);
        res.status(500).json({ error: 'Failed to fetch and parse GTFS-RT data' });
    }
})

module.exports = router;