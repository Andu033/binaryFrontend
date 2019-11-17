import React, { useRef, useEffect, CSSProperties } from 'react';
import { Location } from '../models/Location';
import CSS from 'csstype'
interface MapProps {
  locations: Location[]
  mapCenter: Location
}

const Map: React.FC<MapProps> = ({ mapCenter, locations }) => {
  const mapEle = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map>();

  useEffect(() => {

    map.current = new google.maps.Map(mapEle.current, {
      center: {
        lat: mapCenter.lat,
        lng: mapCenter.lng
      },
      zoom: 16
    });

    addMarkers();

    google.maps.event.addListenerOnce(map.current, 'idle', () => {
      if (mapEle.current) {
      }
    });

    function addMarkers() {
      locations.forEach((markerData) => {
        let infoWindow = new google.maps.InfoWindow({
          content: `<h5>${markerData.name}</h5>`
        });
  
        let marker = new google.maps.Marker({
          position: new google.maps.LatLng(markerData.lat, markerData.lng),
          map: map.current!,
          title: markerData.name
        });
  
        marker.addListener('click', () => {
          infoWindow.open(map.current!, marker);
        });
      });
    }

  }, [mapCenter, locations]);
 const style:CSS.Properties={
    position: 'static'  // 20px !important
  };
  return (<>
    <div ref={mapEle} id="ancaaaaaaa" style={{
    position: 'static', height:'100%'  // 20px !important
  }}></div>
    {
     

    }
    </>
  );
}

export default Map;