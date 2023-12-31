/*-----------------------------------------------CHANNELS-----------------------------------------------*/
export async function removeChannel(channelName : string, jwtToken : string) { 
	try { 
		const response = await fetch(`http://localhost/api/channel/delete/${channelName}`, { 
			method: "DELETE", 
			headers: { 
				"Content-Type": "application/json", 
				"Authorization": `Bearer ${jwtToken}`
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

export async function unmuteUser(channelName : string, userName : string, jwtToken : string) {
	try {
		const response = await fetch(`http://localhost/api/channel/unmute/${channelName}/${userName}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${jwtToken}`
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
export async function removeFriend(userName: string, friendName: string, jwtToken : string) {
	try {
		const response = await fetch(`http://localhost/api/user/friend/delete/${friendName}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${jwtToken}`
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

export async function removeOperator(channelName : string, operatorName : string, jwtToken : string){
	try {
		const response = await fetch(`http://localhost/api/channel/${channelName}/operator/delete/${operatorName}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${jwtToken}`
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

export async function removeUserFromChannel(channelName: string, friendName: string, jwtToken : string) {
	try {
		const response = await fetch(`http://localhost/api/channel/${channelName}/delete/${friendName}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${jwtToken}`
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

/*-----------------------------------------------GAMEROOM-----------------------------------------------*/

export async function deleteGameRoomById(gameRoomId: string, jwtToken : string) {
	try {
	  const response = await fetch(`http://localhost/api/gameroom/deleteGameRoom/${gameRoomId}`, {
		method: "DELETE",
		headers: {
		  "Content-Type": "application/json",
		  "Authorization": `Bearer ${jwtToken}`
		},
		body: JSON.stringify({ gameRoomId: gameRoomId }),
	  });
	  if (response.ok) {
		const responseData = await response.json();
		return responseData;
	  }
	  else {
		const errorText = await response.text();
	  }
	}
	catch (error) {
	  console.error('error: sending POST request', error);
	}
}
  