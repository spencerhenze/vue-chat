<template>
	<div>
		<!--renders before join  -->
		<div v-if="!joined" class="text-center">
			<div class="welcome-header">
				<h1>Welcome to MasterChat!</h1>
				<h3>Select a chat room and enter your name</h3>
			</div>
			<div class="join-block">
				<form @submit.prevent="join">
					<select v-model="room">
						<option selected disabled value="">Choose here</option>
						<option v-for="room in rooms">{{room.text}}</option>
						<!-- <option value="BCW">BCW</option>
						<option value="general">General</option>
						<option value="dinosaurs">Dinosaurs</option> -->
					</select>
					<div>
						<h3>OR</h3>
						<form @submit.prevent="addChatRoom">
							<div class="form-group">
								<input type="text" placeholder="new chat room name" v-model="newRoomName">
								<button type="submit" class="btn btn-primary">Add</button>
							</div>
						</form>
					</div>
					<!--Name entry  -->
					<div class="form-group">
						<input type="text" max="12" class="form-control input-lg text-center" placeholder="Name" v-model="name">
					</div>
					<button class="btn btn-primary btn-lg join" type="submit">Join Chat</button>
				</form>
			</div>
		</div>

		<!--renders after join  -->
		<div v-if="joined">
			<div>
				<h1> {{ room }} </h1>
			</div>
			<div class="chat">
				<div class="row" v-for="item in messages">
					<div class="col-sm-2 text-right">
						<span class="name">{{ item.user }}</span>
					</div>
					<!-- For message -->
					<div class="col-sm-10" v-if="item.message">
						<span class="message">{{ item.message }}</span>
					</div>
					<!-- For picture -->
					<div class="col-sm-10" v-else-if="item.imageurl">
						<img class="msg-pic" :src="item.imageurl" alt="wtf">
					</div>
					<!-- For Link -->
					<div class="col-sm-10" v-else="item.linkurl">
						<a :href="item.linkurl">{{item.linkurl}}</a>
					</div>

				</div>
			</div>
			<div class="text-center">
				<button class="btn btn-primary btn-lg" type="button" @click="leave">Leave Chat</button>
			</div>


			<textarea rows="10" type="text" max="12" class=" red input-lg text-center" placeholder="message" v-model="message"></textarea>
			<button class="btn btn-primary btn-lg" type="button" @click="send">Send Message</button><br>

			<input type="text" max="12" class="form-control input-lg text-center" placeholder="Image Url" v-model="imageurl">
			<button class="btn btn-primary btn-lg" type="button" @click="sendPic">Post Picture</button>

			<input type="text" max="12" class="form-control input-lg text-center" placeholder="Link Url" v-model="linkurl">
			<button class="btn btn-primary btn-lg" type="button" @click="sendLink">Post Link</button>
		</div>




		<!-- <img src="https://puxccbo05z-flywheel.netdna-ssl.com/wp-content/uploads/2015/02/black-mamba-1.jpg"> -->


	</div>
</template>

<script>
	import { mapState } from 'vuex';

	export default {
		name: 'app',
		data: function () {
			return {
				name: '',
				message: '',
				room: '',
				imageurl: '',
				linkurl: '',
				newRoomName: '',
			}
		},
		computed: mapState({
			joined(state) {
				return state.joined;
			},
			messages(state) {
				return state.messages;
			},
			rooms(state) {
				return state.rooms;
			}

		}),
		methods: {
			join: function () {
				if (this.name) {
					this.$store.dispatch('setJoined', true);
					this.$store.dispatch('setRoom', this.room)
					this.$socket.emit('join', this.room, this.name);
				}
			},
			leave: function () {
				this.$store.dispatch('setJoined', false);
				this.$socket.emit('join', this.name);//emit to server
				this.$store.dispatch('clearMessages');
			},
			send: function () {
				if (this.message) {
					this.$socket.emit('message', this.message);
					this.message = '';
				}
			},
			sendPic: function () {
				if (this.imageurl) {
					this.$socket.emit('image', this.imageurl);
					this.imageurl = '';
				}
			},
			sendLink: function () {
				if (this.linkurl) {
					this.$socket.emit('link', this.linkurl);
					this.linkurl = '';
				}
			},
			addChatRoom: function () {
				if (this.newRoomName != '') {
					// send the new room name to the server so it can construct an object and send it back to go in the store
					this.$socket.emit('roomAdded', this.newRoomName);
					this.newRoomName = '';
				}
			}

		},
		sockets: {
			user: function (name) {
				var data = { user: name, message: 'Has joined the chat.' };
				this.$store.dispatch('addMessage', data);
			},

			left: function (name) {
				var data = { user: name, message: 'Has left the chat.' };
				this.$store.dispatch('addMessage', data);
			},
			message: function (data) {
				console.log(data);
				this.$store.dispatch('addMessage', data);
			},
			roomAdded: function (newRoomObj) {
				this.$store.dispatch('addChatRoom', newRoomObj)
				alert(`Chatroom: "${newRoomObj.text}" added successfully!\n\nYou can now select it from the dropdown menu.`)
			}
		}
	}

</script>

<style>
	#app {
		font-family: 'Avenir', Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: #2c3e50;
		margin-top: 60px;
	}

	h1,
	h2 {
		font-weight: normal;
	}

	ul {
		list-style-type: none;
		padding: 0;
	}

	li {
		display: inline-block;
		margin: 0 10px;
	}

	a {
		color: #42b983;
	}

	.chatroom-buttons {
		display: flex;
		align-items: space-around;
	}

	.chat {
		border: 1px solid #ccc;
		border-radius: 6px;
		padding: 10px;
		margin-bottom: 10px;
		max-height: 500px;
		overflow-y: auto;
	}

	.name {
		font-size: 15px;
		font-weight: bold;
		margin-bottom: 5px;
	}

	.message {
		border-radius: 5px !important;
		background: #E0EDFF;
		padding: 5px 12px;
		font-size: 15px;
	}

	.row {}

	.red {
		color: red;
	}

	.join {
		margin-bottom: 10vh;
	}

	textarea {
		width: 72vw;
	}

	.msg-pic {
		width: 100px;
		height: auto;
	}
</style>