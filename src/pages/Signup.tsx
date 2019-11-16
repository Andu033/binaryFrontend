import React, { useState } from 'react';
import { IonCheckbox, IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonButtons, IonMenuButton, IonRow, IonCol, IonButton, IonList, IonItem, IonLabel, IonInput, IonText } from '@ionic/react';
import './Login.scss';
import { setIsLoggedIn, setUsername } from '../data/user/user.actions';
import {getUser} from "../reducer/user.actions"
import { connect } from '../data/connect';
import { RouteComponentProps } from 'react-router';
import {Plugins, CameraResultType} from '@capacitor/core'
import { async } from 'q';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { render } from '@testing-library/react';

import axios from 'axios';
import * as selectors from '../data/selectors';
interface OwnProps extends RouteComponentProps {}

interface DispatchProps {
  setIsLoggedIn: typeof setIsLoggedIn;
  setUsername: typeof setUsername;
}

interface LoginProps extends OwnProps,  DispatchProps { }

const Login: React.FC<any> = ({id, getUser,setIsLoggedIn, history, setUsername: setUsernameAction}) => {

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

  const [doctor, setDoctor]=useState(false);
  const [doctorError, setDoctorError] = useState(false);



  const login = async (e: React.FormEvent) => {
    const headers = {
      'Content-Type': 'application/json',
    }

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

      axios.post('http://192.168.0.185:9586/users/create', { name: username, password: password, doctor: doctor }, {headers:headers})
        .then(function(response){console.log(response.data)
          getUser(response.data)
        console.log('saved successfully')
  }).catch((error) => {console.log(error)}).finally(()=>{console.log(id)});  
    }
  };

  return (

    <IonPage id="signup-page">
      <IonHeader>
      {console.log(id)}
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
        <h1>{id+""}</h1>


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

            <IonItem>
            <IonLabel position="stacked" color="primary">Doctor  </IonLabel>
              <IonCheckbox color="dark" onIonChange={e => {
                setDoctor(true); 
                setDoctorError(false);
                }}>
            Doctor</IonCheckbox>
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

export default connect<OwnProps, {}, any>({
  mapStateToProps:(state,OwnProps)=>{
    const id = (state.user2)?state.user2.id:undefined
    return {id:state}
  },
  mapDispatchToProps: {
    setIsLoggedIn,
    setUsername,
    getUser
  },
  component: Login
})