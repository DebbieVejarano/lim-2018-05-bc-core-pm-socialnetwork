//*********AQUÍ SE ALMANECERAN LAS FUNCIONES GENERALES *********/

//FUNCIÓN registro con usuario y contraseña
window.register = (email, name, password, callback) => {
  return firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then( (result) => {
      user = firebase.auth().currentUser;
      user
        .updateProfile({
          displayName: name
        })
        .then(() => {
          callback(result); // Ejecutamos la funcion callback
        });
    })
    .catch((error) => {
      //Si el error es que el correo no es valido mostramos un alert
      if (error.code === 'auth/invalid-email') {
        alert('Correo invalido');
      }

      //Si el error es que la contraseña es muy débil mostramos un alert
      if (error.code === 'auth/weak-password') {
        alert('contraseña no valida debe contener al menos 6 caracteres');
      }

      //Si el email ya esta siendo usado también mostramos un alert
      if (error.code === 'auth/email-already-in-use') {
        alert('El email ya esta en uso');
      }
    });
};

//FUNCIÓN ingresar con usuario y contraseña creado
window.signIn = (email, password) => {
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(() => {
      location.href = 'profile.html';
    })
    .catch((error) => {
      alert('Correo o contraseña invalida');
    });
};

//FUNCIÓN que guarda de datos generales del usuario
const writeUserData = (userId, name, email, imageUrl) => {
  /* 
  
  
  Hacemos un set para guardar los datos del usuario, podriamos pasar mas
  parametros para guardar mas informacion */
  firebase
    .database()
    .ref('users/' + userId)
    .set({
      username: name,
      email: email,
      profile_picture: imageUrl
    })
    .then((data) => {
      /* Con el then esperamos a que estos datos sean guardados antes
      de redirrecionar a la siguiente pagina */
      location.href = 'profile.html';
    });
};

//FUNCIÓN loguearse con google
window.signGoogle = callback => {
  var provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({
    display: 'popup'
  });
  firebase
    .auth()
    .signInWithPopup(provider)
    .then((result) => {
      console.log('Sesión con google');
      callback(result);
      /* var user = result.user; */
      console.log(user);
      /* writeUserData(user.uid, user.displayName, user.email, user.photoURL); */
    })
    .catch((error) => {
      // Handle Errors here.
      console.log(error.code);
      console.log(error.message);
      // The email of the user's account used.
      console.log(error.email);
      // The firebase.auth.AuthCredential type that was used.
      console.log(error.credential);
      // ...
    });
};

//FUNCIÓN loguease con facebook
window.signFacebook = callback => {
  var provider = new firebase.auth.FacebookAuthProvider();
  provider.setCustomParameters({
    display: 'popup'
  });

  firebase
    .auth()
    .signInWithPopup(provider)
    .then((result)=> {
      console.log('Logueado con Fb');
      callback(result);
    })
    .catch((error) => {
      // Handle Errors here.
      console.log(error.code);
      console.log(error.message);
      // The email of the user's account used.
      console.log(error.email);
      // The firebase.auth.AuthCredential type that was used.
      console.log(error.credential);
      // ...
    });
};

//FUNCIÓN que cierra sesión
window.logout = () => {
  firebase
    .auth()
    .signOut()
    .then(() => {
      console.log('Cerro Sesión');
      window.location = 'index.html';
    })
    .catch(error => {
      console.log('Error al cerrar Sesión');
    });
};

// FUNCION para crear post
const writeNewPost = (uid, body, name, private) => {
  // Nos aseguramos de la privacidad del post
 let value = false;

  if (private == 1) {
    value = true;
  }

  // Creamos un objeto donde guardaremos los datos del post
  const postData = {
    name: name,
    uid: uid,
    body: body,
    starCount: 0,
    private: value,
    timestamp: firebase.database.ServerValue.TIMESTAMP
  };

  //Obtenemos una llave para el nuevo post
  const newPostKey = firebase
    .database()
    .ref()
    .child('users-posts')
    .push().key;

  let updates = {};
  updates['/posts/' + newPostKey] = postData;
  updates['/user-posts/' + uid + '/' + newPostKey] = postData;

  firebase
    .database()
    .ref()
    .update(updates);
  return newPostKey;
};

//FUNCIÓN para editar post
const editPost = (text, userId, keyPost) => {
  firebase
    .database()
    .ref('user-posts/' + userId + '/' + keyPost)
    .update({
      body: text
    });

  firebase
    .database()
    .ref('posts/' + keyPost)
    .update({
      body: text
    });

};
const likePost = (Like, userId, keyPost) => {
  firebase
    .database()
    .ref('user-posts/' + userId + '/' + keyPost)
    .update({
      starCount: Like
    });

  firebase
    .database()
    .ref('posts/' + keyPost + "/userlikes/")
    .update({
      userId
    });
    
};
//FUNCIÓN para elimar post
const deletePost = (userId, keyPost) => {
  firebase
    .database()
    .ref()
    .child('/user-posts/' + userId + '/' + keyPost)
    .remove();
  firebase
    .database()
    .ref()
    .child('posts/' + keyPost)
    .remove();
};

//FUNCIÓN para dar Like a los post
const starPost = (userId, stars, starCount, container) => {
  firebase
   .database()
    .ref('user-posts/' + userId + '/' + keyPost)
    .update({
      stars: (starCount + 1)
    });

  firebase
    .database()
    .ref('posts/' + keyPost)
    .update({
      stars: (starCount + 1) 
    });

    showLikes(stars , container)
};

//FUNCIÓN para cambiar privacidad de post

//FUNCIÓN para agregar amigos
