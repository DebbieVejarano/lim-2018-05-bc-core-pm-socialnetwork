//


const login = document.getElementById('login');
const logout = document.getElementById('logout');
const user_name = document.getElementById('user_name');
const btnLogout = document.getElementById("btnLogout");
const btnSignin = document.getElementById("btnSignin");
const register = document.getElementById("register");
const email = document.getElementById("email");
const password = document.getElementById("password");
const btnGoogle = document.getElementById('btnGoogle');
const btnFb = document.getElementById('btnFb');
const bd = document.getElementById('bd');
const btnSave = document.getElementById('btnSave');
const post = document.getElementById('post');
const posts = document.getElementById('posts');


window.onload = () => {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log('User is signed in.');
      login.classList.add("hiden");
      bd.classList.remove("hiden");
      posts.classList.remove("hiden");
      logout.classList.remove("hiden");
      user_name.innerHTML = `Bienvenida ${user.displayName}`;
    } else {
      
      console.log('No esta logueado');
      login.classList.remove("hiden");
      logout.classList.add("hiden");
      posts.classList.add("hiden");S
      bd.classList.add("hiden")
    }
  });

}

/* 
function writeUserData(userId, name, email, imageUrl) {
  firebase.database().ref('users/' + userId).set({
    username: name,
    email: email,
    profile_picture: imageUrl
  });
} */


function writeNewPost(uid, body) {
  // A post entry.
  var postData = {
    uid: uid,
    body: body,
  };

  // Get a key for a new Post.
  var newPostKey = firebase.database().ref().child('posts').push().key;

  // Write the new post's data simultaneously in the posts list and the user's post list.
  var updates = {};
  updates['/posts/' + newPostKey] = postData;
  updates['/user-posts/' + uid + '/' + newPostKey] = postData;

  firebase.database().ref().update(updates);
  return newPostKey;
}

btnSave.addEventListener('click', () => {
  var userId = firebase.auth().currentUser.uid;
  const newPost = writeNewPost(userId, post.value);


  var btnUpdate = document.createElement("input");
  btnUpdate.setAttribute("value", "Update");
  btnUpdate.setAttribute("type", "button");
  var btnDelete = document.createElement("input");
  btnDelete.setAttribute("value", "Delete");
  btnDelete.setAttribute("type", "button");
  var contPost = document.createElement('div');
  var textPost = document.createElement('textarea')
  textPost.setAttribute("id", newPost);

  textPost.innerHTML = post.value;

  btnDelete.addEventListener('click', () => {

    firebase.database().ref().child('/user-posts/' + userId + '/' + newPost).remove();
    firebase.database().ref().child('posts/' + newPost).remove();

    while (posts.firstChild) posts.removeChild(posts.firstChild);

    alert('The user is deleted successfully!');
    reload_page();

  });

  btnUpdate.addEventListener('click', () => {
    const newUpdate = document.getElementById(newPost);
    const nuevoPost = {
      body: newUpdate.value,
    };

    var updatesUser = {};
    var updatesPost = {};

    updatesUser['/user-posts/' + userId + '/' + newPost] = nuevoPost;
    updatesPost['/posts/' + newPost] = nuevoPost;

    firebase.database().ref().update(updatesUser);
    firebase.database().ref().update(updatesPost);

  });

  contPost.appendChild(textPost);
  contPost.appendChild(btnUpdate);
  contPost.appendChild(btnDelete);
  posts.appendChild(contPost);
})



/* register.addEventListener('click', () =>{
  firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
    .then(function () {
      console.log('Se creo el usuario')
    })
    .catch(function (error) {
      console.log(error.code, error.message)
    });
  })
 */

/*btnSignin.addEventListener('click', () => {
  firebase.auth().signInWithEmailAndPassword(email.value, password.value)
  .then(function (){
    console.log('Inició Sesión');
  })
  .catch(function(error) {
    console.log('Contraseña incorrecta');
  });
})*/

btnLogout.addEventListener('click', () => {
  firebase.auth().signOut().then(function() {
    console.log('Cerro Sesión');
  }).catch(function(error) {
    console.log('Error al cerrar Sesión');
  });
})
/* btnGoogle.addEventListener('click', () => {
  var provider = new firebase.auth.GoogleAuthProvider();
    
    provider.setCustomParameters({
      'display' : 'popup'
    });
  firebase.auth().signInWithPopup(provider).then(function(result){
    
    console.log('Inicio sesión con google')
    var user = result.user;
    writeUserData(user.uid, user.displayName, user.email, user.photoURL);

  }).catch(function(error){
    console.log(error.code);
    console.log(error.message);
    console.log(error.email);
    console.log(error.credential);
    

  });
}) */

/* btnFb.addEventListener('click', () => {
  var provider = new firebase.auth.FacebookAuthProvider();

  provider.setCustomParameters({
    'display': 'popup'
  });
  firebase.auth().signInWithPopup(provider)
  .then(function (result) { console.log('Inicio sesión con facebook')

  }).catch(function (error) {
    console.log(error.code);
    console.log(error.message);
    console.log(error.email);
    console.log(error.credential);
  });

}); */
function reload_page() {
  window.location.reload();
}
