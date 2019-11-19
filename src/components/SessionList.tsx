import { IonItemDivider, IonItemGroup, IonLabel, IonList, IonListHeader, IonAlert, AlertButton, IonCard, IonFab, IonIcon, IonItem } from '@ionic/react';
import React, { useState, useCallback } from 'react';
import { Session } from '../models/Session';
import SessionListItem from './SessionListItem';
import { SessionGroup } from '../models/SessionGroup';
import { Time } from '../components/Time';
import { connect } from '../data/connect';
import Map from './Map';
import Axios from 'axios'

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
  const del = (id:any)=>{
    Axios.get(`http://192.168.0.185:9586/incidents/invalidate?id=${id}`).then((response) => {
      

    })
  }
  const going = (id:any)=>{
    Axios.get(`http://192.168.0.185:9586/incidents/ongoing?id=${id}`).then((response) => {
      

    })
  }
  const ban = (id:any)=>{
    Axios.get(`http://192.168.0.185:9586/incidents/ban?id=${id}`).then((response) => {
      

    })
  }
  
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
     
        {incidents.map((incident:any, index: number) => (
          <IonCard color="danger">
           <IonContent fullscreen class="ion-padding">
         
          </IonContent>
            <IonFab>
              <IonIcon name="pin"></IonIcon>
            </IonFab>
            <IonFab>
              <IonButton expand="block" onClick={() => {setShowModal(true);setLoc([{lng:incident.location.lng,lat:incident.location.lat}]);console.log(loc)}}>Show Map</IonButton>
              <IonButton expand="block" onClick={() => {del(incident.id)}}>finish</IonButton>
              <div style={{alignSelf:"right"}}><IonButton  expand="block" onClick={() => {del(incident.id);ban(incident.id)}}>BAN</IonButton>
        <IonButton expand="block" onClick={() => {going(incident.id)}} disabled={incident.help}>{incident.help?"taken":"go"}</IonButton></div>
            </IonFab>
            <div style={{}}>
            <IonItem>
              <IonIcon name="photo"  ></IonIcon>
              <h2>{incident.id+ " "}</h2>
            </IonItem>
            <IonItem >
              <div style={{textAlign:"center",width:"100%",height:"100%"}}>
              <p>{incident.name}</p>

            <h2>Longitude is {incident.location.lng} </h2>
            <h2> ---</h2>
            {/* {
              latitude:incident.location.lng,
              longitude:incident.location.lat,
            } */}
            <h2> Latitude is {incident.location.lat}</h2>
            </div>
            </IonItem>
           </div>
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