import '@ionic/core/css/ionic.bundle.css';
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonButton,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonTitle,
  IonToolbar,
  IonToggle
} from '@ionic/react';
import { calendar, contacts, hammer, help, informationCircle, logIn, logOut, map, person, personAdd } from 'ionicons/icons';
import React, { useState } from 'react';
import { connect } from '../data/connect';
import { RouteComponentProps, withRouter } from 'react-router';
import { setDarkMode } from '../data/user/user.actions';
import { Plugins } from '@capacitor/core';
import Axios from 'axios';
import { POINT_CONVERSION_COMPRESSED } from 'constants';
const { Geolocation } = Plugins;


const routes = {
  appPages: [
    { title: 'Notifications', path: '/tabs/schedule', icon: calendar },
    { title: 'Doctors', path: '/tabs/speakers', icon: contacts },
    { title: 'Map', path: '/tabs/map', icon: map },
    { title: 'About', path: '/tabs/about', icon: informationCircle }
  ],
  loggedInPages: [
    { title: 'Account', path: '/account', icon: person },
    { title: 'Support', path: '/support', icon: help },
    { title: 'Logout', path: '/logout', icon: logOut }
  ],
  loggedOutPages: [
    { title: 'Login', path: '/login', icon: logIn },
    { title: 'Support', path: '/support', icon: help },
    { title: 'Signup', path: '/signup', icon: personAdd }
  ]
};

interface Pages {
  title: string,
  path: string,
  icon: { ios: string, md: string },
  routerDirection?: string
}
interface StateProps {
  darkMode: boolean;
  isAuthenticated: boolean;
}

interface DispatchProps {
  setDarkMode: typeof setDarkMode
}

interface MenuProps extends RouteComponentProps, StateProps, DispatchProps { }

const Menu: React.FC<any> = ({id, darkMode, history, isAuthenticated, setDarkMode }) => {
  const [disableMenu, setDisableMenu] = useState(false);
  const [coord,setCoord] = React.useState({latitude:1.1,longitude:1.1})
  React.useEffect(()=>{
    Geolocation.watchPosition({},(position:any,err:any)=>{
      if(!err){
        setCoord(position.coords)
        console.log(position.coords)
      }
    })
  },[1])

  const sendGeolocation = async (e: React.FormEvent) => {
    const headers = {
      'Content-Type': 'application/json',
    }
    console.log(id)
    Axios.post(`http://192.168.0.185:9586/incidents/addincident?id=${id.user2.id}`, { location: {lat:coord.latitude+0.0020,lng:coord.longitude+0.0035} }, {headers:headers})
    .then(function(response){
    console.log('saved successfully')
}).catch((error:any) => {console.log(error)});  
}

  function renderlistItems(list: Pages[]) {
    return list
      .filter(route => !!route.path)
      .map(p => (
        <IonMenuToggle key={p.title} auto-hide="false">
          <IonItem button routerLink={p.path} routerDirection="none">
            <IonIcon slot="start" icon={p.icon} />
            <IonLabel>{p.title}</IonLabel>
          </IonItem>
        </IonMenuToggle>
      ));
  
      }
  return (
    <IonMenu type="overlay" disabled={disableMenu} contentId="main">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Menu</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonList>
          <IonItem>
            <IonLabel>Panic button</IonLabel>
            <IonButton expand="block" size="large" onClick={sendGeolocation}>PANIC</IonButton>
          </IonItem>
        </IonList>
      <IonContent class="outer-content">
        <IonList>
          <IonListHeader>Navigate</IonListHeader>
          {renderlistItems(routes.appPages)}
        </IonList>
        <IonList>
          <IonListHeader>Account</IonListHeader>
          {isAuthenticated ? renderlistItems(routes.loggedInPages) : renderlistItems(routes.loggedOutPages)}
        </IonList>
       
   

        <IonList>
          <IonItem>
            <IonLabel>Dark Theme</IonLabel>
            <IonToggle checked={darkMode} onClick={() => setDarkMode(!darkMode)} />
          </IonItem>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default connect<{}, any, {}>({
  mapStateToProps: (state) => ({
    darkMode: state.user.darkMode,
    isAuthenticated: state.user.isLoggedin,
    id:state
  }),
  mapDispatchToProps: ({
    setDarkMode
  }),
  component: withRouter(Menu)
})
