import Vue from 'vue';
import App from './App.vue';
import VueSocketio from 'vue-socket.io';//library - ties socket connection to our components


import store from './store';

Vue.use(VueSocketio, 'http://localhost:3000');//socket connection uses this address

new Vue({
	el: '#app',
	store,
	render: h => h(App)
})
