//********ESTE DOCUMENTO MANIPULA AL profile.html********//

//VARIABLES
const btnLogout = document.getElementById('btnlogout');
const btnToPost = document.getElementById('btnSave');
const inputPrivacy = document.getElementById('inputPrivacy');
// Post es el texto que escribe el usuario
const post = document.getElementById('post');
// Posts es el ID donde el usuario pone todo su post
const posts = document.getElementById('posts');
var userName = document.getElementById('user-name');
var userImage = document.getElementById('user-pic');
var emailUser = document.getElementById('emailUser');

// Cargamos los post publicos de TODOS los usuarios (ultimos 50)
let loadPosts = () => {
  userdata = firebase.auth().currentUser.uid;

  //Cargamos todos los Post que cotengan el valor public como FALSO
  // let starCountRef = firebase.database().ref('posts/' + postId + '/starCount');
  // starCountRef.on('value', (snapshot) => {
  //   updateStarCount(postElement, )
  // });

  ref = firebase.database().ref('posts')

  ref
    .orderByChild('private')
    .once('value', snapshot => {
      let userpost = snapshot.val();
      //console.log(userdata)
      //console.log(userpost)
      for (let post in userpost) {
        //Cargamos el contenido de cada post
        let body = userpost[post]['body'];
        let uid = userpost[post]['uid'];
        let name = userpost[post]['name']
        let private = userpost[post]['private']
        let likes = userpost[post]['starCount']
        let idPost = post;

        // Si el id del usuario no coincide con el UID del post
        // Ejecutamos la funcion createPost con el parametro FALSE
        if (userdata === uid) {
          createPost(body, idPost, name, true, likes);
        } else {
          if (!private) {
            createPost(body, idPost, name, false, likes);
          }
        }
      }
    });
};

window.onload = () => {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log("Este es el id del usuario:", user.uid)

      var displayName = user.displayName;
      var userPhoto = user.photoURL;
      var emailU = user.email;

      userName.textContent = displayName;
      emailUser.textContent = emailU;
      userImage = user.photoURL;
      loadPosts()


    } else {
      window.location.href = 'index.html';
      console.log('No esta logueado');
    }
  });
};

const createPost = (body, idPost, username, private, likes) => {
  //console.log(idPost, likes)
  //Obtenemos el Id del usuario actual.
  let userdata = firebase.auth().currentUser;
  let postKey = idPost;
  //Obtenemos si se ha seleccionado publico o privado

  /*   Al no tener ID el post supongo que es un post nuevo
  Lo pasamos por la función "writeNewPost" para poder
  Crearle un ID y escribir sus datos */
  if (postKey === undefined) {
    postKey = writeNewPost(userdata.uid, post.value, userdata.displayName, inputPrivacy.selectedIndex);
  }

  // Div que contendrá mi post
  const maxiPost = document.createElement('div');
  maxiPost.className = 'container mt-1'
  const cardPost = document.createElement('div');
  cardPost.className = 'card w-100'
  const contPost = document.createElement('div');
  contPost.className = 'card-body'
  //DIV para el nombre
  const divName = document.createElement('p')
  divName.className = 'card-title'
  const textPost = document.createElement('textarea');
  textPost.className = 'card-text'
  divName.setAttribute('id', 'postname')
  divName.innerHTML = username
  textPost.setAttribute('id', postKey);
  textPost.disabled = true;
  textPost.innerHTML = body;

  const btnLike = document.createElement('input');
  btnLike.className = 'btn btn-primary'
  btnLike.setAttribute('value', 'Te inspira');
  btnLike.setAttribute('type', 'button');
  btnLike.setAttribute('data-like', likes);
  const showLikes = document.createElement('p');
  showLikes.setAttribute('id', 'clicks');
  showLikes.innerHTML = likes + ' Te inspira';

  maxiPost.appendChild(cardPost);
  cardPost.appendChild(contPost);
  contPost.appendChild(divName);
  contPost.appendChild(textPost);

  //showLikes(likes, showLikes)
  // Nos aseguramos que el post sea nuestro si es asi
  // creamos los botoenes para editarlo y borrarlo
  //console.log(private)
  if (private) {
    // Botón para actualizar el post
    const btnUpdate = document.createElement('input');
    btnUpdate.className = 'btn btn-primary'
    btnUpdate.setAttribute('id', 'Cod-' + postKey);
    btnUpdate.setAttribute('value', 'Editar');
    btnUpdate.setAttribute('type', 'button');
    contPost.appendChild(btnUpdate); // APPEND

    // Botón para borrar el post
    const btnDelete = document.createElement('input');
    btnDelete.className = 'btn btn-primary'
    btnDelete.setAttribute('value', 'Eliminar');
    btnDelete.setAttribute('type', 'button');
    contPost.appendChild(btnDelete); // APPEND


    //Como el post es nuestro, agregamos las funcionalidades
    // de borrar y editar.

    btnUpdate.addEventListener('click', () => {

      textPost.disabled = !textPost.disabled;

      if (textPost.disabled) {
        btnUpdate.value = 'Editar';
      } else {
        btnUpdate.value = 'Guardar';
      }

      editPost(textPost.value, userdata.uid, postKey);
    });

    btnDelete.addEventListener('click', () => {
      //Ejecutamos la funcion para eliminar el post
      //Le pasamos el Id del usuario y el ID del post a eliminar

      // Con este while eliminamos el div del post eliminado.

      swal({
          title: "¿Seguro?",
          text: "¡Ya no podrá recuperar esta publicación!",
          /*         icon: "warning", */
          buttons: true,
          dangerMode: true,
        })
        .then((willDelete) => {
          /*           console.log(willDelete) */
          if (willDelete) {
            deletePost(userdata.uid, postKey);
            while (contPost.firstChild) contPost.removeChild(contPost.firstChild)
            swal("Tu publicación ha sido eliminada!", {
              icon: "success",
            });
          } else {
            swal("Tu publicación está segura");
          }
        });

    });
  }


  contPost.appendChild(btnLike); // APPEND
  contPost.appendChild(showLikes); // APPEND
  let currentLikes = 0;

  //Llamando a al botón para que ejecute la función de botón like
  btnLike.addEventListener('click', e => {
   
    // currentLikes++;
    // let currentLikes = parseInt(btnLike.getAttribute('data-like'));
    console.log(currentLikes)
    //  let count += currentLikes;

    function likes(){ 
      return firebase.database().ref('posts/' + postKey + '/userlikes' )
      .once('value')
    }
    const result = likes();

    result.then(resuelve)
    function resuelve(snapshot){
      currentLikes = Object.values(snapshot.val())
      currentLikes.map(item => {
        if(item == userdata.uid){

          console.log("no cuneta")
        }else{
          console.log("anade")
        }
      })
      console.log(Object.values(snapshot.val()))
      
    }
  
  console.log(result);
  

    likePost( currentLikes.length,userdata.uid, postKey);
    textLikes(currentLikes,showLikes);
  });

  //Hacemos los append para encadenar los botones y los div
  posts.appendChild(maxiPost);
};

const textLikes = (likes, container) => {
  console.log(likes)
  //contLikes = document.getElementById('clicks')
  container.innerHTML = `${likes} Te inspira`;
}

let starCount = 0;

//BOTON PARA CUANDO DAMOS PUBLICAR
btnToPost.addEventListener('click', () => {
  if (post.value != '') {
    let userdata = firebase.auth().currentUser;
    createPost(post.value, undefined, userdata.displayName, true, starCount);
    post.value = ''
  }
});

btnLogout.addEventListener('click', () => {
  firebase
    .auth()
    .signOut()
    .then(function () {
      console.log('Cerro Sesión');
    })
    .catch(function (error) {
      console.log('Error al cerrar Sesión');
    });
});

function reload_page() {
  window.location.reload();
}
