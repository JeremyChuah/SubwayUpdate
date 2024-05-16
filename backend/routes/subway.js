const express = require('express');
const router = express.Router();
const axios = require('axios');
const protobuf = require('protobufjs');


const protoFiles = [
    './proto/gtfs-realtime-NYCT.proto'];


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

        feed.entity.forEach((entity) => {
            
            // Check if the entity contains a trip update
            if (entity.tripUpdate && entity.tripUpdate.trip) {
                const tripDescriptor = entity.tripUpdate;

                // Log the trip information
                console.log('Trip Descriptor:', tripDescriptor);
            }
            
            // Check if the entity contains a vehicle position
            if (entity.vehicle && entity.vehicle.trip) {
                const tripDescriptor = entity.vehicle;
                console.log('Trip Descriptor:', tripDescriptor);
            }
            console.log('//////////////////////////////');
        });
        res.send("HI");
    } catch (error) {
        console.error('Error fetching and parsing GTFS-RT data:', error);
        res.status(500).json({ error: 'Failed to fetch and parse GTFS-RT data' });
    }
})

module.exports = router;