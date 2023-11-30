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
    if (response.ok) {
      const responseData = await response.json();
      return responseData;
    }
	}
	catch (error) {
		console.error("error: sending DELETE request", error);
	}
}

export async function unmuteUser(channelName : string, userName : string) {
	try {
		const response = await fetch(`http://localhost:3000/channel/unmute/${channelName}/${userName}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ channelName: channelName, userName: userName }),
		});
		if (response.ok) {
			const responseData = await response.json();
			return responseData;
		}
	}
	catch (error) {
		console.error("error: sending PUT request", error);
	}
}

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
    if (response.ok) {
      const responseData = await response.json();
      return responseData;
    }
	}
	catch (error) {
		console.error("error: sending DELETE request", error);
	}
}

export async function removeOperator(channelName : string, operatorName : string){
	try {
		const response = await fetch(`http://localhost:3000/channel/${channelName}/operator/delete/${operatorName}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ channelName: channelName, operatorName: operatorName }),
		});
	if (response.ok) {
	  const responseData = await response.json();
	  return responseData;
	}
	}
	catch (error) {
		console.error("error: sending DELETE request", error);
	}
}

export async function removeUserFromChannel(channelName: string, friendName: string) {
	try {
		const response = await fetch(`http://localhost:3000/channel/${channelName}/delete/${friendName}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ channelName: channelName, friendName: friendName }),
		});
    if (response.ok) {
      const responseData = await response.json();
      return responseData;
    }
	}
	catch (error) {
		console.error("error: sending DELETE request", error);
	}
}
