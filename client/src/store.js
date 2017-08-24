import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = {
	joined: false,
	name: '',
	messages: [],
	room:'',
	rooms: [
		// hard-coded chat room objects
		{value: 'superchat', text: 'SuperChat'},
		{value: 'BCW', text: 'Boise Codeworks'},
		{value: 'general', text: 'General'},
		{value: 'dinosaurs', text: 'Dinosaurs'},
	]
};

const mutations = {
	setJoined(state, payload) {
		state.joined = payload;
	},
	setRoom(state, payload){
		state.room=payload
	},
	addMessage(state, payload) {
		state.messages.push(payload);
	},
	
	clearMessages(state){
		state.messages =[];
	},
	addChatRoom(state, payload) {
		state.rooms.push(payload)
	}
 
};

const actions = {
	setJoined({ commit, state }, payload) {
		commit('setJoined', payload);
	},
	setRoom({commit, state}, payload){
		commit('setRoom', payload)
	},
	addMessage({ commit, state }, payload) {
		commit('addMessage', payload);
	},

	clearMessages({commit,state}){
		commit('clearMessages');
	},
	addChatRoom({commit, state}, payload) {
		// check for the values before commiting the change
		if(payload.value && payload.text){
			commit('addChatRoom', payload);
		}
	}


};

const getters = {
	messages: (state) => {
		return state.messages;
	},
	rooms: (state) => {
		return state.rooms
	}
};

export default new Vuex.Store({
	state,
	mutations,
	actions,
	getters,
    strict: true
});