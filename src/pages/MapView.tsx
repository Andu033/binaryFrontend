import React, { useState } from 'react';
import Map from '../components/Map';
import { IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonPage, IonLabel } from '@ionic/react';
import { Location } from '../models/Location';
import { connect } from '../data/connect';
import * as selectors from '../data/selectors';
import './MapView.scss';
import { RouteComponentProps } from 'react-router';
import Axios from 'axios';


interface OwnProps { }

interface StateProps {
  locations: Location[];
  mapCenter: Location;
}

interface Point { lat: number, lng: number}

interface DispatchProps { }

interface MapViewProps extends OwnProps, StateProps, DispatchProps { };

const MapView: React.FC<MapViewProps> = ({ locations , mapCenter }) => {
 
  const [mapPoint, setMapPoints] = useState<any>([]);
  const array:any = []
  React.useEffect(() => {
    
    Axios.get('http://192.168.0.185:9586/incidents/getincidents').then(function (response) {

      response.data.map((loc:any)=>{ return array.push({lat:loc.location.lat, lng:loc.location.lng})})
      setMapPoints(array)
      console.log("am ajuns aici ba")
      setTimeout(function(){}, 500);
    
      console.log('2', mapPoint)

      })
        .catch(function(error) 
        {
          return false;
        });
  },[1]);


  return (
  <IonPage id="map-view">
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonMenuButton></IonMenuButton>
        </IonButtons>
        <IonTitle>Map</IonTitle>
      </IonToolbar>
    </IonHeader>

    <IonContent class="map-page">
      <Map locations={mapPoint} mapCenter={mapPoint[0]?mapPoint[0]:mapCenter} />
    </IonContent>
  </IonPage>
)};

export default connect<OwnProps, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
    locations: state.data.locations,
    mapCenter: selectors.mapCenter(state)
  }),
  component: MapView
});
