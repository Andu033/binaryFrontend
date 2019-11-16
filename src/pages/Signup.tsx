import React, { useState } from 'react';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonButtons, IonMenuButton, IonRow, IonCol, IonButton, IonList, IonItem, IonLabel, IonInput, IonText } from '@ionic/react';
import './Login.scss';
import { setIsLoggedIn, setUsername } from '../data/user/user.actions';
import { connect } from '../data/connect';
import { RouteComponentProps } from 'react-router';
import {Plugins, CameraResultType} from '@capacitor/core'
import { async } from 'q';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { render } from '@testing-library/react';


interface OwnProps extends RouteComponentProps {}

interface DispatchProps {
  setIsLoggedIn: typeof setIsLoggedIn;
  setUsername: typeof setUsername;
}

interface LoginProps extends OwnProps,  DispatchProps { }

const Login: React.FC<LoginProps> = ({setIsLoggedIn, history, setUsername: setUsernameAction}) => {

  defineCustomElements(window);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [idCard, setIdCard] = useState('');
  const [selfie, setSelfie] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [idCardError, setIdCardError] = useState(false);
  const [idSelfie, setSelfieError] = useState(false);
  const {Camera} =Plugins;




  const takePicture= async()=> {   console.log("a mers")

   const image = await Camera.getPhoto({
   quality: 90,
   allowEditing: false,
   resultType: CameraResultType.Uri
   });
   var imageUrl = (image.webPath)?image.webPath:'';
   console.log("a mers")
   setSelfie(imageUrl)
   var reader = new FileReader();
   //reader.readAsDataURL(new Blob(imageUrl));
   reader.onloadend = function(){
     //gabi aici bagi tu
   }
  };

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    if(!username) {
      setUsernameError(true);
    }
    if(!password) {
      setPasswordError(true);
    }

    if(!idCard) {
      setIdCardError(true);
    }

    if(!selfie) {
      setSelfieError(true);
    }

    if(username && password && idCard && selfie) {
      await setIsLoggedIn(true);
      await setUsernameAction(username);
      history.push('/tabs/schedule', {direction: 'none'});
    }
  };

  return (
    <IonPage id="signup-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton></IonMenuButton>
          </IonButtons>
          <IonTitle>Signup</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>

        <div className="login-logo">
          <img src="assets/img/sign-up.png" alt="Ionic logo" />
        </div>

        <form noValidate onSubmit={login}>
          <IonList>
            <IonItem>
              <IonLabel position="stacked" color="primary">Username</IonLabel>
              <IonInput name="username" type="text" value={username} spellCheck={false} autocapitalize="off" onIonChange={e => {
                setUsername(e.detail.value!);
                setUsernameError(false);
              }}
                required>
              </IonInput>
            </IonItem>

            {formSubmitted && usernameError && <IonText color="danger">
              <p className="ion-padding-start">
                Username is required
              </p>
            </IonText>}

            <IonItem>
              <IonLabel position="stacked" color="primary">Password</IonLabel>
              <IonInput name="password" type="password" value={password} onIonChange={e => {
                setPassword(e.detail.value!);
                setPasswordError(false);
              }}>
              </IonInput>
            </IonItem>

            {formSubmitted && passwordError && <IonText color="danger">
              <p className="ion-padding-start">
                Password is required
              </p>
            </IonText>}

            <IonItem>
              <IonLabel position="stacked" color="primary">Id Card  (please take a picture of your Id Card)</IonLabel>
            </IonItem>
            <IonButton expand="block" onClick={takePicture}>Take pic</IonButton>
              <img alt="Imagine inexistenta" src={selfie}/>

            

            
            <IonItem>
              <IonLabel position="stacked" color="primary">Selfie (please take a selfie)</IonLabel>
            </IonItem>
            <IonButton expand="block" onClick={takePicture}>Take pic</IonButton>
              <img alt="Imagine inexistenta" src={selfie}/>

          </IonList>

          <IonRow>
            <IonCol>
              <IonButton type="submit" expand="block" >Create</IonButton>
            </IonCol>
          </IonRow>
        </form>
             
      </IonContent>
    
    </IonPage>
  );
};

export default connect<OwnProps, {}, DispatchProps>({
  mapDispatchToProps: {
    setIsLoggedIn,
    setUsername
  },
  component: Login
})