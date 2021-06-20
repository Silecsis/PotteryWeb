/* Fichero de rutas de la web.
   Llama a las diferentes vistas. */

import Vue from 'vue'
import Router from 'vue-router'
import Register from '@/views/auth/Register'
import PasswordRequest from '@/views/auth/PasswordRequest'
import Dashboard from '@/views/Dashboard'

import Users from '@/views/Users/Users'
import EditProfile from '@/views/Users/EditProfile'
import NewUser from '@/views/Users/NewUser'
import EditUser from '@/views/Users/EditUser'

import Materials from '@/views/Materials/Materials'
import NewMaterial from '@/views/Materials/NewMaterial'
import EditMaterial from '@/views/Materials/EditMaterial'

import MyPieces from '@/views/Pieces/MyPieces'
import EditMyPiece from '@/views/Pieces/EditMyPiece'
import Pieces from '@/views/Pieces/Pieces'
import EditPiece from '@/views/Pieces/EditPiece'
import AddSale from '@/views/Pieces/AddSale'
import AddMySale from '@/views/Pieces/AddMySale'
import DetailPiece from '@/views/Pieces/DetailPiece'

import MySales from '@/views/Sales/MySales'
import Sales from '@/views/Sales/Sales'
import EditSale from '@/views/Sales/EditSale'
import EditMySale from '@/views/Sales/MyEditSale'
import NewMyPiece from '@/views/Pieces/NewMyPiece'

import Msg from '@/views/Messages/Msg'

import Login from '@/views/auth/login'

Vue.use(Router)

const router = new Router();

router.beforeEach((to, from, next) => {
  switch (to.name) {
    case 'Login':
      router.app.$store.commit('SET_LAYOUT', 'login-layout');
      break;

    case 'Register':
      router.app.$store.commit('SET_LAYOUT', 'login-layout');
      break;

    case 'PasswordRequest':
      router.app.$store.commit('SET_LAYOUT', 'login-layout');
      break;  

    default:
      router.app.$store.commit('SET_LAYOUT', 'principal-layout');
      break;
  }

  var user = JSON.parse(sessionStorage.getItem('user'));

  //CONTROL DE QUE NO ENTRE EN VISTAS DE USUARIO ADMIN SIN SER ADMIN
  if ((to.name == 'Users' || 
       to.name == 'EditUser' ||
       to.name == 'NewUser' ||
       to.name == 'EditMaterial' ||
       to.name == 'NewMaterial' ||
       to.name == 'EditPiece' ||
       to.name == 'EditSale' ||
       to.name == 'AddSale') 
      && (!user || user.type == 'user')) {
    next({ name: 'Dashboard', query: { error: 'no-admin' } });

  //CONTROL DE QUE NO ENTRE EN VISTAS PARA USUARIOS LOGADO SIN ESTAR LOGADO  
  } else if((to.name == 'EditProfile' ||
             to.name == 'Materials' ||
             to.name == 'MyPieces' ||
             to.name == 'MySales' ||
             to.name == 'EditMySale' ||
             to.name == 'EditMyPiece' ||
             to.name == 'NewMyPiece' ||
             to.name == 'AddMySale' ||
             to.name == 'Msg') && (!user)){
    next({ name: 'Dashboard', query: { error: 'no-login' } });
  }else{
    next();
  }
});

router.addRoutes(
  [
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard,

    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,

    },
    {
      path: '/passwordRequest',
      name: 'PasswordRequest',
      component: PasswordRequest,

    },
    //USUARIOS
    {
      path: '/users',
      name: 'Users',
      component: Users
    },
    {
      path: '/users/editProfile/:id',
      name: 'EditProfile',
      component: EditProfile
    },
    {
      path: '/users/editUser/:id',
      name: 'EditUser',
      component: EditUser
    },
    {
      path: '/users/newUser',
      name: 'NewUser',
      component: NewUser
    },
    //MATERIALES
    {
      path: '/materials',
      name: 'Materials',
      component: Materials
    },
    {
      path: '/materials/:id',
      name: 'EditMaterial',
      component: EditMaterial
    },
    {
      path: '/Materials/NewMaterial',
      name: 'NewMaterial',
      component: NewMaterial
    },

    //PIEZAS
    {
      path: '/myPieces/:id',
      name: 'MyPieces',
      component: MyPieces
    }, 
    {
      path: '/mypieces/:idUser/:id',
      name: 'EditMyPiece',
      component: EditMyPiece
    },
    {
      path: '/mypieces',
      name: 'NewMyPiece',
      component: NewMyPiece
    },
    {
      path: '/pieces',
      name: 'Pieces',
      component: Pieces
    },
    {
      path: '/pieces/detail/:id',
      name: 'DetailPiece',
      component: DetailPiece
    },
    {
      path: '/pieces/:id',
      name: 'EditPiece',
      component: EditPiece
    },
    
    {
      path: '/addsale/:id',
      name: 'AddSale',
      component: AddSale
    },
    {
      path: '/addmysale/:idUser/:id',
      name: 'AddMySale',
      component: AddMySale
    },
    //VENTAS

    {
      path: '/mySales/:id',
      name: 'MySales',
      component: MySales
    },
    {
      path: '/sales',
      name: 'Sales',
      component: Sales
    },   
    {
      path: '/sales/:id',
      name: 'EditSale',
      component: EditSale
    },
    {
      path: '/mysales/:idUser/:id',
      name: 'EditMySale',
      component: EditMySale
    },
    //MENSAJES
    {
      path: '/menssage/:idUser',
      name: 'Msg',
      component: Msg
    },
  ]

);

//Parte para solucionar error que salta en consola sobre
//la navegación al mismo lugar
var originPush = Router.prototype.push;

Router.prototype.push=function(location,oncomplete,onabort){
  if(router.app.$route.name != location.name){
    originPush.call(router,location,oncomplete,onabort);
  }
}

export default router;