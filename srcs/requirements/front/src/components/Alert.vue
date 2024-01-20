<script>
	export default {
		name: 'Alert',
		props: {
			privateMessage: Array,

			addChannelSuccess: Boolean,
			addChannelFailed: Boolean,
			addFriendSuccess: Boolean,
			addFriendFailed: Boolean,
			addMessageSuccess: Boolean,
			addMessageFailed: Boolean,
			banSuccess: Boolean,
			bannedSuccess: Boolean,
			banFailed: Boolean,
			blockSuccess: Boolean,
			blockFailed: Boolean,
			checkPassFailed: Boolean,
			friendRequestAccepted: Boolean,
			friendRequestDeclined: Boolean,
			invitationFriendSuccess: Boolean,

			invitationInGameSuccess: Boolean,
			inviteInGameSuccess: Boolean,
			inviteInGameFailed: Boolean,
			joinChannelSuccess: Boolean,
			joinChannelFailed: Boolean,
			kickedSuccess: Boolean,
			kickSuccess: Boolean,
			kickFailed: Boolean,
			messageSuccess: Boolean,
			mutedSuccess: Boolean,
			muteSuccess: Boolean,
			muteFailed: Boolean,
			privateSuccess: Boolean,
			privateFailed: Boolean,
			quitSuccess: Boolean,
			quitFailed: Boolean,
			removeChannelSuccess: Boolean,
			removeChannelFailed: Boolean,
			removeFriendSuccess: Boolean,
			removeFriendFailed: Boolean,
			setPassSuccess: Boolean,
			setPassFailed: Boolean,
			unblockSuccess: Boolean,
			unblockFailed: Boolean,
			unsetPassSuccess: Boolean,
			unsetPassFailed: Boolean,
			userDoesntExist: Boolean,
			userNameAlreadyTaken: Boolean,
			userNotFound: Boolean,

			modalIsOpen: Boolean,

			openMessageModalFromAlert: Function,
			socketEmit: Function,

			channelNameBanned: String,
			channelNameKicked: String,
			channelNameMuted: String,
			hostName: String,
			messageSenderName: String,
			quitChannelName: String,
			userName: String,
		},
	};
</script>

<template>
	<!--AddChannel-->
	<div v-if="addChannelSuccess" class="toast toast-start">
		<div class="alert alert-success">
		<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
			<span>Channel created successfully.</span>
		</div>
	</div>
	<div v-if="addChannelFailed" class="toast toast-start">
		<div class="alert alert-error">
			<span>Failed to create Channel</span>
		</div>
	</div>
	<!--AddFriend-->
	<div v-if="addFriendSuccess" class="toast toast-start">
		<div class="alert alert-success">
			<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
			<span>Friend added successfully.</span>
		</div>
	</div>
	<div v-if="addFriendFailed" class="toast toast-start">
		<div class="alert alert-error">
			<span>Failed to add friend.</span>
		</div>
	</div>
	<!--AddMessage-->
	<div v-if="addMessageSuccess" class="toast toast-start">
		<div class="alert alert-success">
			<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
			<span>Message sended successfully.</span>
		</div>
	</div>
	<div v-if="addMessageFailed" class="toast toast-start">
		<div class="alert alert-error">
			<span>Failed to send message</span>
		</div>
	</div>
	<!--Ban-->
	<div v-if="banSuccess" class="toast toast-start">
		<div class="alert alert-success">
		<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
		</svg>
			<span>User has been banned successfully</span>
		</div>
	</div>
	<!--Banned-->
	<div v-if="bannedSuccess" class="toast toast-start">
		<div class="alert alert-warning">
			<span>You have been banned in {{ channelNameBanned }}</span>
		</div>
	</div>
	<div v-if="banFailed" class="toast toast-start">
		<div class="alert alert-error">
			<span>Failed to ban User</span>
		</div>
	</div>
	<!--Block-->
	<div v-if="blockSuccess" class="toast toast-start">
		<div class="alert alert-success">
			<span>User blocked successfully.</span>
		</div>
	</div>
	<div v-if="blockFailed" class="toast toast-start">
		<div class="alert alert-error">
		<span>Failed to block User</span>
		</div>
	</div>
	<!--CheckPass-->
	<div v-if="checkPassFailed" class="toast toast-start">
		<div class="alert alert-error">
			<span>Invalid Password</span>
		</div>
	</div>
	<!--FriendRequest-->
	<div v-if="invitationFriendSuccess" class="toast toast-start">
		<div role="alert" class="alert">
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-info shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
			<span>{{ hostName }} invite you as Friend</span>
			<div>
				<button class="btn btn-sm btn-primary" @click="socketEmit('friendRequestAccepted')">Accept</button>
				<button class="btn btn-sm" @click="socketEmit('friendRequestDeclined')">Deny</button>
			</div>
		</div>
	</div>
	<!--InviteInGame-->
	<div v-if="friendRequestAccepted" class="toast toast-start">
		<div class="alert alert-success">
			<span>User has accepted the friend request</span>
		</div>
	</div>
	<div v-if="friendRequestDeclined" class="toast toast-start">
		<div class="alert alert-error">
			<span>User has declined the friend request</span>
		</div>
	</div>
	<!--InvitationInGame-->
	<div v-if="invitationInGameSuccess" class="toast toast-start">
		<div role="alert" class="alert">
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-info shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
			<span>{{ hostName }} invite you in a Game</span>
			<div>
				<button class="btn btn-sm btn-primary" @click="socketEmit('invitationInGameAccepted')">Accept</button>
				<button class="btn btn-sm" @click="socketEmit('invitationInGameDeclined')">Deny</button>
			</div>
		</div>
	</div>
	<!--InviteInGame-->
	<div v-if="inviteInGameSuccess" class="toast toast-start">
		<div class="alert alert-success">
			<span>User has accepted the invitation</span>
		</div>
	</div>
	<div v-if="inviteInGameFailed" class="toast toast-start">
		<div class="alert alert-error">
		<span>User has declined the invitation</span>
		</div>
	</div>
	<!--JoinChannel-->
	<div v-if="joinChannelSuccess" class="toast toast-start">
		<div class="alert alert-success">
			<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
			<span>User has joined successfully a Channel</span>
		</div>
	</div>
	<div v-if="joinChannelFailed" class="toast toast-start">
		<div class="alert alert-error">
			<span>Failed to join Channel</span>
		</div>
	</div>
	<!--Kick-->
	<div v-if="kickSuccess" class="toast toast-start">
		<div class="alert alert-success">
			<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
			<span>User has been kicked successfully</span>
		</div>
	</div>
	<div v-if="kickFailed" class="toast toast-start">
		<div class="alert alert-error">
			<span>Failed to kick User</span>
		</div>
	</div>
	<!--Kicked-->
	<div v-if="kickedSuccess" class="toast toast-start">
		<div class="alert alert-warning">
			<span>You have been kicked from {{ channelNameKicked }}</span>
		</div>
	</div>
	<!--Message-->
	<div v-if="messageSuccess && !modalIsOpen" class="toast toast-start">
		<div role="alert" class="alert shadow-lg">
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-info shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
			<div>
				<h3 class="font-bold">New message from {{ messageSenderName }}</h3>
			</div>
			<button class="btn btn-sm" @click="openMessageModalFromAlert(messageSenderName, userName)">Open</button>
		</div>
	</div>
	<!--Mute-->
	<div v-if="muteSuccess" class="toast toast-start">
		<div class="alert alert-success">
			<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
			<span>User has been muted successfully</span>
		</div>
	</div>
	<div v-if="muteFailed" class="toast toast-start">
		<div class="alert alert-error">
			<span>Failed to mute User</span>
		</div>
	</div>
	<!--Muted-->
	<div v-if="mutedSuccess" class="toast toast-start">
		<div class="alert alert-warning">
			<span>You have been muted in {{ channelNameMuted }}</span>
		</div>
	</div>
	<!--Private-->
	<div v-if="privateSuccess" class="toast toast-start">
		<div class="alert alert-success">
			<span>Private mod set/unset successfully</span>
		</div>
	</div>
	<div v-if="privateFailed" class="toast toast-start">
		<div class="alert alert-error">
			<span>Failed to set private mod</span>
		</div>
	</div>
	<!--Quit-->
	<div v-if="quitSuccess" class="toast toast-start">
		<div class="alert alert-success">
			<span>You quit successfully {{ quitChannelName }}</span>
		</div>
	</div>
	<div v-if="quitFailed" class="toast toast-start">
		<div class="alert alert-error">
			<span>Failed to quit {{ quitChannelName }}</span>
		</div>
	</div>
	<!--RemoveChannel-->
	<div v-if="removeChannelSuccess" class="toast toast-start">
		<div class="alert alert-success">
			<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
			<span>Channel deleted successfully</span>
		</div>
	</div>
	<div v-if="removeChannelFailed" class="toast toast-start">
		<div class="alert alert-error">
			<span>Failed to delete Channel</span>
		</div>
	</div>
	<!--RemoveFriend-->
	<div v-if="removeFriendSuccess" class="toast toast-start">
		<div class="alert alert-success">
			<span>Friend deleted successfully</span>
		</div>
	</div>
	<div v-if="removeFriendFailed" class="toast toast-start">
		<div class="alert alert-error">
			<span>Failed to delete Friend</span>
		</div>
	</div>
	<!--SetPassword-->
	<div v-if="setPassSuccess" class="toast toast-start">
		<div class="alert alert-success">
			<span>Set password successfully.</span>
		</div>
	</div>
	<div v-if="setPassFailed" class="toast toast-start">
		<div class="alert alert-error">
			<span>Failed to set password</span>
		</div>
	</div>
	<!--UnsetPassword-->
	<div v-if="unsetPassSuccess" class="toast toast-start">
		<div class="alert alert-success">
			<span>Unset password successfully.</span>
		</div>
	</div>
	<div v-if="unsetPassFailed" class="toast toast-start">
		<div class="alert alert-error">
			<span>Failed to unset password</span>
		</div>
	</div>
	<!--UnblockPassword-->
    <div v-if="unblockSuccess" class="toast toast-start">
		<div class="alert alert-success">
			<span>User unblocked successfully.</span>
		</div>
	</div>
	<div v-if="unblockFailed" class="toast toast-start">
		<div class="alert alert-error">
			<span>Failed to unblock User</span>
		</div>
  	</div>
	<!--UserDoesntExist-->
	<div v-if="userDoesntExist" class="toast toast-start">
		<div class="alert alert-error">
			<span>User doesn't exist</span>
		</div>
	</div>
	<!--UserNameTaken-->
	<div v-if="userNameAlreadyTaken" class="toast toast-start">
		<div class="alert alert-error">
			<span>Username already taken</span>
		</div>
	</div>
	<!--UserNotFound-->
	<div v-if="userNotFound" class="toast toast-start">
		<div class="alert alert-error">
			<span>User not found</span>
		</div>
	</div>
</template>

<style scoped>
	.toast { z-index: 9999; }
</style>