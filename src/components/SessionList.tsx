import { IonItemDivider, IonItemGroup, IonLabel, IonList, IonListHeader, IonAlert, AlertButton } from '@ionic/react';
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
console.log(incidents)
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
          <IonLabel>{incident.id+"  "}</IonLabel>
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