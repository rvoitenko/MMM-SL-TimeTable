# MMM-SL-TimeTable
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](
[Magic Mirror](https://magicmirror.builders/) Module - Display public transport in Stockholm/Sweden. This module use the API's provided by [Trafiklab](https://www.trafiklab.se/api).

![SL PublicTransport Module](https://github.com/rvoitenko/MMM-SL-TimeTable/blob/master/docs/MMM-SL-Screenshot.PNG)

## NOTE
This is a rewrite of the original module [MMM-SL-PublicTransport](https://github.com/boghammar/MMM-SL-PublicTransport) patched to work with the new ResRobot v2.1 API because old API was deprecated.
The functionality is limited to only show departures from a station or a direction. The module does not show any other information like the original module did.

## Get API key
You need to obtain your own API key's from TrafikLab for the following API's

* [ResRobot v2.1](https://www.trafiklab.se/sv/api/trafiklab-apis/resrobot-v21/)

## Install
1. Clone repository into ``../modules/`` inside your MagicMirror folder.
2. Run ``npm install`` inside ``../modules/MMM-SL-TimeTable/`` folder
3. Run ``node findStation.js apiKey stationName`` to find out your Station ID or direction ID.
4. Add the module to the MagicMirror config

## Update
1. Run ``git pull`` inside ``../modules/MMM-SL-TimeTable/`` folder.
2. Run ``npm install`` inside ``../modules/MMM-SL-TimeTable/`` folder

## Configuration

```
modules: [
    ...
    {
        module: 'MMM-SL-TimeTable',
        position: 'top_right',
        header: 'Busses',
        config: {
            apikey: 'your-ResRobot-api-key',         // REQUIRED.
            stations: [                     // REQUIRED at least one entry.
                                            // Definition of the stations that you would like to see
              {
                stationId: station-id,      // REQUIRED. An id of a station. You need to run the utility
                                            // findStation to get the id(s) of the station(s) you want.
                stationName: 'station-name',// Optional. This is the name of the station.
                                            // It's shown in the header if you have set a header on the module
                lines: [                    // Optional. An array of lines that you want to see departing from
                                            // this station.
                  {
                    direction: dir,         // Optional. If present only show departures in this direction
                                            // for this line. You need to run the utility
                                            // findStation to get the id(s) of the direction(s) you want.
                  }
                ]
              },
            ],
            displaycount: 10,               // Optional, show this number of departures for each direction.
            updateInterval: 5*60*1000,      // Optional. Number of milliseconds between calls to
                                            // Trafiklab's API. This value shall preferably be larger then 1 min
                                            // There are limitations on number of calls per minute and month()
            cleanHeader: false,             // If set to true the last update time is not shown
                                            // in the header
            minimal: true                  // Optional. If true show only taable with time, line number and destination name

        }
    },
    ...
]
```

## How to use the ``stations`` parameter
With the ``stations`` configuration parameter you are able to in detail define what you want to see. The basic configuration is that if an optional parameter is not present everything will be shown, i.e. if the ``lines`` parameter is not present for a station all lines will be displayed. However, if it is present you will need to define all lines that you want to see.

### Examples
Show all departures from one station:
```
    ...
    stations: [
        {
            stationId: 740098236,
            stationName: 'Huddinge station'
        }
    ]
    ...
```

Show all departures from **two station**:
```
    ...
    stations: [
        {
            stationId: 740098236,
            stationName: 'Huddinge station'
        },
        {
            stationId: 740064081,
            stationName: 'Vindvägen'
        }
    ]
    ...
```
Please note that having multiple stations will increase the number of API calls made since there's one call per station. You can mitigate this by carefully setting the ``updateInterval`` configuration parameters.

Also, having multiple stations will increase the space that this module takes on screen so use the ``displaycount`` parameter to limit the number of departures shown.

Show all departures from one station and only line 610 from the other station:
```
    ...
    stations: [
        {
            stationId: 2322,
            stationName: 'Erikslund'
        },
        {
            stationId: 2321,
            stationName: 'Vindvägen',
            lines: [{
                direction: 740098236
            }]
        }
    ]
    ...
```


## Find stationid
You need to set a stationid in the configuration and to find that run the following helper

```node findStation.js apikey searchstring```

where ``apikey`` is your API key for the SL ResRobot v2.1 API and ``searchstring`` is the name of the station.

The output will look something like this (searching for 'Huddinge'). Use the Station ID value as the stationId or direction:

```
Station ID: 740098236, Name: HUDDINGE
Station ID: 740000702, Name: Huddinge station
Station ID: 740045550, Name: Huddinge centrum
Station ID: 740045552, Name: Huddinge gymnasium
Station ID: 740045553, Name: Huddinge kommunalkontor
Station ID: 740001178, Name: Huddinge sjukhus
Station ID: 740045555, Name: Huddinge Stationsväg
```

## Screenshot

![SL TimeTable Module](https://github.com/rvoitenko/MMM-SL-TimeTable/blob/master/docs/MMM-SL-Screenshot.PNG)
