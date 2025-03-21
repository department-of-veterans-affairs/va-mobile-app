import React, { FC } from 'react'
import { StyleSheet, View } from 'react-native'
import { WebView } from 'react-native-webview'

export type MapProps = {
  latitude: number
  longitude: number
}

const Map: FC<MapProps> = ({ latitude, longitude }) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
      <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css"/>
      <style>
        #map { height: 100vh; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var arc =  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          maxZoom: 19,
        });
        var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
        });
        var map = L.map('map', {
          center: [${latitude}, ${longitude}],
          zoom: 15,
          layers: [osm]
        });
        var baseMaps = {
          'Street': osm,
          'Satellite': arc
        };
        L.control.layers(baseMaps).addTo(map);
        L.marker([${latitude}, ${longitude}]).addTo(map);
      </script>
    </body>
    </html>
  `

  return <WebView source={{ html }} style={styles.container} />
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 250,
  },
})

export default Map
