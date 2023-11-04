/*-----------------------------------------------FRIENDS-----------------------------------------------*/
export async function removeFriend(userName: string, friendName: string) {
	try {
		const response = await fetch(`http://localhost:3000/user/friend/delete/${friendName}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ userName: userName, friendName: friendName }),
		});

		if (response.ok)
			return true;
		else {
			console.error("error: unable to delete friend");
			return false;
		}
	}
	catch (error) {
		console.error("error: sending DELETE request", error);
		return false;
	}
}

/*-----------------------------------------------CHANNELS-----------------------------------------------*/
export async function removeChannel(channelName : string) { 
	try { 
		const response = await fetch(`http://localhost:3000/channel/delete/${channelName}`, { 
			method: "DELETE", 
			headers: { 
				"Content-Type": "application/json", 
			}, 
			body: JSON.stringify({ channelName: channelName }), 
		}); 
		if (response.ok)
			return true;
		else {
			console.error("error: unable to delete channel");
			return false;
		}
	}
	catch (error) {
		console.error("error: sending DELETE request", error);
		return false;
	}
}