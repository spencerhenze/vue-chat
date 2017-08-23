import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = {
	joined: false,
	name: '',
	messages: [],
	room:''
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
	}


};

const getters = {
	messages: (state) => {
		return state.messages;
	}
};

export default new Vuex.Store({
	state,
	mutations,
	actions,
	getters,
    strict: true
});