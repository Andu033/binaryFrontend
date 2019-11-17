import { IonItemDivider, IonItemGroup, IonLabel, IonList, IonListHeader, IonAlert, AlertButton, IonCard, IonFab, IonIcon, IonItem } from '@ionic/react';
import React, { useState, useCallback } from 'react';
import { Session } from '../models/Session';
import SessionListItem from './SessionListItem';
import { SessionGroup } from '../models/SessionGroup';
import { Time } from '../components/Time';
import { connect } from '../data/connect';
import { addFavorite, removeFavorite } from '../data/sessions/sessions.actions';

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

  const handleShowAlert = useCallback((header: string, buttons: AlertButton[]) => {
    setAlertHeader(header);
    setAlertButtons(buttons);
    setShowAlert(true);
  }, []);

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
        {incidents.map((incident:any, index: number) => (
          //<IonLabel>{incident.id+"  "}</IonLabel>
          <IonCard>
          
            <IonFab>
              <IonIcon name="pin"></IonIcon>
            </IonFab>
            <IonFab>
              <button ion-fab>TRACK
                <IonIcon name="pin"></IonIcon>
              </button>
            </IonFab>
            <IonItem>
              <IonIcon name="photo" ></IonIcon>
              <h2>{incident.id+ " "}</h2>
              <p>{incident.name}</p>
            </IonItem>
            <IonItem>
            <h2>Longitude is {incident.location.lng} </h2>
            <h2> ---</h2>
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