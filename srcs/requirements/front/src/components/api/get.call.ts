/*-----------------------------------------------CHANNEL-----------------------------------------------*/
export async function getAllChannels(jwtToken: string) { 
  try {
    const response = await fetch("http://localhost/api/channel/getAllChannels", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwtToken}`
      }
    });
    if (response.ok)
      return await response.json();
  }
  catch (error) {
    console.error('error: sending GET request', error);
  }
}

export async function getAllNewChannels(userName : string, jwtToken: string) {
  try {
    const response = await fetch(`http://localhost/api/channel/getAllNewChannels/${userName}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwtToken}`
      },
    });
    if (response.ok)
      return await response.json();
  }
  catch (error) {
    console.error('error: sending GET request', error);
  }
}

export async function getAllChannelsFromUser(userName : string, jwtToken: string) {
  try {
    const response = await fetch(`http://localhost/api/user/${userName}/channels`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwtToken}`
      }
    });
    if (response.ok)
      return await response.json();
  }
  catch (error) {
    console.error('error: sending GET request', error);
  }
}

export async function getChannelByName(channelName : string, jwtToken: string) {
  try {
    const response = await fetch(`http://localhost/api/channel/get/${channelName}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwtToken}`
      }
    });
    if (response.ok)
      return await response.json();
  }
  catch (error) {
    console.error('error: sending GET request', error);
  }
  return null;
}

export async function isUserInChannel(channelName : string, userName : string, jwtToken: string) {
  try {
    const response = await fetch(`http://localhost/api/channel/${channelName}/isUser/${userName}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwtToken}`
      }
    });
    if (response.ok) {
      const responseData = await response.json();
      return responseData;
    }
  }
  catch (error) {
    console.error('error: sending GET request', error);
  }
  return false;
}

export async function isUserBanInChannel(channelName : string, userName : string, jwtToken: string) {
  try {
    const response = await fetch(`http://localhost/api/channel/${channelName}/isBan/${userName}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwtToken}`
      }
    });
    if (response.ok)
      return await response.json();
  }
  catch (error) {
    console.error('error: sending GET request', error);
  }
  return null;
}

/*-----------------------------------------------FRIEND-----------------------------------------------*/
export async function isFriend(userName : string, friendName : string, jwtToken: string){
  try {
    const response = await fetch(`http://localhost/api/user/isFriend/${userName}/${friendName}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwtToken}`
      }
    });
    if (response.ok) {
      const responseData = await response.json();
      return responseData;
    }
  }
  catch (error) {
    console.error('error: sending GET request', error);
  }
  return null;
}

export async function getAllFriends(userName : string, jwtToken: string) {
  try {
    const response = await fetch(`http://localhost/api/user/${userName}/friends`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwtToken}`
      }
    });
    if (response.ok)
      return await response.json();
  }
  catch (error) {
    console.error('error: sending GET request', error);
  }
  return null;
}

export async function getFriendUserNames(userId : number, jwtToken: string) {
  try {
    const response = await fetch(`http://localhost/api/user/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwtToken}`
      }
    });

    if (response.ok) {
      const responseData = await response.json();
      return responseData;
    }
  } 
  catch (error) {
    console.error('error: sending GET request', error);
  }
}

export async function getUserFriends(userId : number, jwtToken: string) {
  try {
    const response = await fetch("http://localhost/api/user/friends", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwtToken}`
      },
      body: JSON.stringify({ userId: userId }),
    });

    if (response.ok) {
      const responseData = await response.json();
      return responseData;
    }
  } 
  catch (error) {
    console.error('error: sending GET request', error);
  }
}

/*-----------------------------------------------GAMEROOM--------------------------------------------*/
export async function getGameRoomByRoomId(id : number, jwtToken: string) {
  try {
    const response = await fetch(`http://localhost/api/gameroom/id/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwtToken}`
      }
    });
    if (response.ok) {
      return await response.json();
    }
  } 
  catch (error) {
    console.error('error: sending GET request', error);
  }
}

export async function getPastGameRoomsByUserId(userId : number, jwtToken: string) {
  try {
    const response = await fetch(`http://localhost/api/gameroom/getPastGameRooms/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwtToken}`
      }
    });
    if (response.ok) {
      return await response.json();
    }
  } 
  catch (error) {
    console.error('error: sending GET request', error);
  }
}

export async function getCurrentGameRoomByUserId(userId : number, jwtToken: string) {
  try {
    const response = await fetch(`http://localhost/api/gameroom/getCurrentGameRoom/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwtToken}`
      }
    });
    if (response.ok) {
      return await response.json();
    }
  } 
  catch (error) {
    console.error('error: sending GET request', error);
  }
}

export async function getLastGameRoomIfAfk(userId : number, jwtToken: string) {
  try {
    const response = await fetch(`http://localhost/api/gameroom/getLastGameRoomIfAfk/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwtToken}`
      }
    });
    if (response.ok)
      return await response.text();
  } catch (error) {
    console.error('error: sending GET request', error);
  }
}


/*-----------------------------------------------MESSAGES-----------------------------------------------*/
export async function getMessagesFromChannel(channelName : string, jwtToken: string) {
  try {
    const response = await fetch(`http://localhost/api/channel/${channelName}/messages`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwtToken}`
      }
    });
    if (response.ok)
      return await response.json();
  }
  catch (error) {
    console.error('error: sending GET request', error);
  }
  return null;
}

export async function getMessage(jwtToken: string) {
  try {
    const response = await fetch("http://localhost/api/message", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwtToken}`
      }
    });

    if (response.ok) {
      const responseData = await response.json();
      return responseData;
    }
  } 
  catch (error) {
    console.error('error: sending GET request', error);
  }
}

/*-----------------------------------------------PRIVATEMESSAGES-----------------------------------------------*/
export async function getLastMessage(userName1 : string, userName2 : string, jwtToken: string) { 
  try {
    const response = await fetch(`http://localhost/api/privateMessage/${userName1}/${userName2}/lastMessage`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwtToken}`
      }
    });
    if (response.ok)
      return await response.json();
  }
  catch (error) {
    console.error('error: sending GET request', error);
  }
  return null;
}

export async function getPrivateMessages(userName1 : string, userName2 : string, jwtToken: string) {
  try {
    const response = await fetch(`http://localhost/api/privateMessage/${userName1}/${userName2}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwtToken}`
      },
    });
    if (response.ok)
      return await response.json();
  }
  catch (error) {
    console.error('error: sending GET request', error);
  }
  return null;
}

export async function getPrivateMessagesByUserName(userName : string, jwtToken: string) {
  try {
    const response = await fetch(`http://localhost/api/privateMessage/${userName}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwtToken}`
      }
    });
    if (response.ok){
      return await response.json();
    }
    if (response.ok)
      return await response.json();
  }
  catch (error) {
    console.error('error: sending GET request', error);
  }
  return null;
}
/*-----------------------------------------------SCORE-----------------------------------------------*/

export async function getAllUserScore(gameRoomId: number, jwtToken: string) {
  try {
    const response = await fetch(`http://localhost/api/score/getAllUserScore/${gameRoomId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwtToken}`
      }
    });
    if (response.ok)
      return await response.json();
  }
  catch (error) {
    console.error('error: sending GET request', error);
  }
  return null;
}

export async function getScoreByRoomId(gameRoomId: string, jwtToken: string){
  try {
    const response = await fetch(`http://localhost/api/score/getScoreByRoomId/${gameRoomId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwtToken}`
      }
    });
    if (response.ok)
      return await response.text();
  }
  catch (error) {
    console.error('error: sending GET request', error);
  }
  return null;
}

export async function getGameWinner(gameRoomId: number, jwtToken: string) {
  try {
    const response = await fetch(`http://localhost/api/score/getGameWinner/${gameRoomId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwtToken}`
      }
    });
    if (response.ok)
      return await response.text();
  }
  catch (error) {
    console.error('error: sending GET request', error);
  }
  return null;
}

/*-----------------------------------------------USERS-----------------------------------------------*/
export async function isBlock(userName : string, blockedUserName : string, jwtToken: string){
  try {
    const response = await fetch(`http://localhost/api/user/${userName}/isBlock/${blockedUserName}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwtToken}`
      }
    });
    if (response.ok) {
      const responseData = await response.json();
      return responseData;
    }
  }
  catch (error) {
    console.error('error: sending GET request', error);
  }
  return null;
}

export async function getSocketByUserId(userId: number, jwtToken: string ) { 
  try {
    const response = await fetch(`http://localhost:3000/user/getSocket/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwtToken}`
      }
    });
    if (response)
      return await response.json();
  }
  catch (error) {
    console.error('error: sending GET request', error);
  }
}

export async function getUsersFromChannel(channelName : string, jwtToken: string) {
  try {
    const response = await fetch(`http://localhost/api/channel/${channelName}/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwtToken}`
      }
    });
    if (response.ok)
      return await response.json();
  }
  catch (error) {
    console.error('error: sending GET request', error);
  }
  return null;
}

export async function getUserByUserId(userId : number, jwtToken: string) {
  try {
    const response = await fetch(`http://localhost/api/user/getUser/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwtToken}`
      },
    });
    if (response.ok) {
      const responseData = await response.json();
      return responseData;
    }
  } 
  catch (error) {
    console.error('error: sending GET request', error);
  }
}

export async function getUserByUserName(username : string, jwtToken: string) {
  try {
    const response = await fetch(`http://localhost/api/user/getUsername/${username}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwtToken}`
      },
    });
    if (response.ok) {
      return await response.json();
    }
  } 
  catch (error) {}
}

export async function getAllUsers(jwtToken: string) {
  try {
    const response = await fetch("http://localhost/api/user/getAllUsers/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwtToken}`
      }
    });

    if (response.ok) {
      const responseData = await response.json();
      return responseData;
    }
  } 
  catch (error) {
    console.error('error: sending GET request', error);
  }
}

/*-----------------------------------------------AUTH-----------------------------------------------*/

export async function checkA2F(userName : string, token : string, jwtToken: string) {
  try {
    const response = await fetch(`http://localhost/api/user/checkA2F/${userName}?token=${token}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwtToken}`
      },
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

/*-----------------------------------------------IMAGES-----------------------------------------------*/

export async function getImage(userImage: string) {
  try {
    const response = await fetch(`http://localhost:3000/public/${userImage}`, {
        method: 'GET',
    });
 
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    } else {
        const blob = await response.arrayBuffer();
        return window.URL.createObjectURL(new Blob([blob]));
    }
  } catch (error) {
      console.error(`Error: ${error}`);
  }
}
