import { IonItemDivider, IonItemGroup, IonLabel, IonList, IonListHeader, IonAlert, AlertButton, IonCard, IonFab, IonIcon, IonItem } from '@ionic/react';
import React, { useState, useCallback } from 'react';
import { Session } from '../models/Session';
import SessionListItem from './SessionListItem';
import { SessionGroup } from '../models/SessionGroup';
import { Time } from '../components/Time';
import { connect } from '../data/connect';
import Map from './Map';

import { addFavorite, removeFavorite } from '../data/sessions/sessions.actions';
import {IonModal, IonButton, IonContent} from '@ionic/react'
interface OwnProps {
  sessionGroups: SessionGroup[]
  listType: 'all' | 'favorites'
  hide: boolean;
}

interface StateProps {
  favoriteSessions: number[];
}

interface DispatchProps {
  addFavorite: typeof addFavorite;
  removeFavorite: typeof removeFavorite;
}

interface SessionListProps extends OwnProps, StateProps, DispatchProps { };

const SessionList: React.FC<any> = ({ incidents }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertHeader, setAlertHeader] = useState('');
  const [alertButtons, setAlertButtons] = useState<(AlertButton | string)[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loc,setLoc] = useState<any>([])
  const handleShowAlert = useCallback((header: string, buttons: AlertButton[]) => {
    setAlertHeader(header);
    setAlertButtons(buttons);
    setShowAlert(true);
  }, [1]);

  if (incidents.length === 0) {
    return (
      <IonList>
        <IonListHeader>
          No Sessions Found
        </IonListHeader>
      </IonList>
    );
  }

  return (
    <>
      <IonList>

      <IonModal isOpen={showModal}>
      <Map locations={loc} mapCenter={(loc[0])?loc[0]:{
    "id": 3,
    "name": "Ionic HQ",
    "lat": 43.074395,
    "lng": -89.381056
  }}/>

        <IonButton onClick={() => setShowModal(false)}>Close Modal</IonButton>
      </IonModal>
      <IonButton onClick={() => setShowModal(true)}>Show Modal</IonButton>
        {incidents.map((incident:any, index: number) => (
          //<IonLabel>{incident.id+"  "}</IonLabel>
          <IonCard>
           <IonContent fullscreen class="ion-padding">
         
          </IonContent>
            <IonFab>
              <IonIcon name="pin"></IonIcon>
            </IonFab>
            <IonFab>
              <IonButton expand="block" onClick={() => {setShowModal(true);setLoc([{lng:incident.location.lng,lat:incident.location.lat}]);console.log(loc)}}>Show Map</IonButton>
            </IonFab>
            <IonItem>
              <IonIcon name="photo" ></IonIcon>
              <h2>{incident.id+ " "}</h2>
              <p>{incident.name}</p>
            </IonItem>
            <IonItem>
            <h2>Longitude is {incident.location.lng} </h2>
            <h2> ---</h2>
            {/* {
              latitude:incident.location.lng,
              longitude:incident.location.lat,
            } */}
            <h2> Latitude is {incident.location.lat}</h2>
            </IonItem>
           
          </IonCard>

       
        ))}
      </IonList>
     
      <IonAlert
        isOpen={showAlert}
        header={alertHeader}
        buttons={alertButtons}
        onDidDismiss={() => setShowAlert(false)}
      ></IonAlert>
    </>
  );
};

export default connect({
  mapStateToProps: (state) => ({
    favoriteSessions: state.data.favorites
  }),
  mapDispatchToProps: ({
    addFavorite,
    removeFavorite
  }),
  component: SessionList
});