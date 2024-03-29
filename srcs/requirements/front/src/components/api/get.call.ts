import { setStatus } from "./post.call";

/*-----------------------------------------------CHANNEL-----------------------------------------------*/
export async function getAllChannels(jwtToken: string) { 
  try {
    const response = await fetch("https://localhost:3000/channel/getAllChannels", {
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
    console.error('getAllChannels: error: sending GET request');
  }
}

export async function getAllNewChannels(userName : string, jwtToken: string) {
  try {
    const response = await fetch(`https://localhost:3000/channel/getAllNewChannels/${userName}`, {
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
    console.error('getAllNewChannels: error: sending GET request');
  }
}

export async function getAllChannelsFromUser(userName : string, jwtToken: string) {
  try {
    const response = await fetch(`https://localhost:3000/user/${userName}/channels`, {
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
    console.error('getAllChannelsFromUser: error: sending GET request');
  }
}

export async function getChannelByName(channelName : string, jwtToken: string) {
  try {
    const response = await fetch(`https://localhost:3000/channel/get/${channelName}`, {
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
    console.error('getChannelByName: error: sending GET request');
  }
  return null;
}

export async function isUserInChannel(channelName : string, userName : string, jwtToken: string) {
  try {
    const response = await fetch(`https://localhost:3000/channel/${channelName}/isUser/${userName}`, {
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
    console.error('isUserInChannel: error: sending GET request');
  }
  return false;
}

export async function isUserBanInChannel(channelName : string, userName : string, jwtToken: string) {
  try {
    const response = await fetch(`https://localhost:3000/channel/${channelName}/isBan/${userName}`, {
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
    console.error('isUserBanInChannel: error: sending GET request');
  }
  return null;
}

/*-----------------------------------------------FRIEND-----------------------------------------------*/
export async function isFriend(userName : string, friendName : string, jwtToken: string){
  try {
    const response = await fetch(`https://localhost:3000/user/isFriend/${userName}/${friendName}`, {
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
    console.error('isFriend: error: sending GET request');
  }
  return null;
}

export async function getAllFriends(userName : string, jwtToken: string) {
  try {
    const response = await fetch(`https://localhost:3000/user/${userName}/friends`, {
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
    console.error('getAllFriends: error: sending GET request');
  }
  return null;
}

export async function getFriendUserNames(userId : number, jwtToken: string) {
  try {
    const response = await fetch(`https://localhost:3000/user/${userId}`, {
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
    console.error('getFriendUserNames: error: sending GET request');
  }
}

export async function getUserFriends(userId : number, jwtToken: string) {
  try {
    const response = await fetch("https://localhost:3000/user/friends", {
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
    console.error('getUserFriends: error: sending GET request');
  }
}

/*-----------------------------------------------GAMEROOM--------------------------------------------*/
export async function getGameRoomByRoomId(id : number, jwtToken: string) {
  try {
    const response = await fetch(`https://localhost:3000/gameroom/id/${id}`, {
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
    console.error('getGameRoomByRoomId: error: sending GET request');
  }
}

export async function getPastGameRoomsByUserId(userId : number, jwtToken: string) {
  try {
    const response = await fetch(`https://localhost:3000/gameroom/getPastGameRooms/${userId}`, {
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
    console.error('getPastGameRoomsByUserId: error: sending GET request');
  }
}

export async function getCurrentGameRoomByUserId(userId : number, jwtToken: string) {
  try {
    const response = await fetch(`https://localhost:3000/gameroom/getCurrentGameRoom/${userId}`, {
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
    console.error('getCurrentGameRoomByUserId: error: sending GET request');
  }
}

export async function getLastGameRoomIfAfk(userId : number, jwtToken: string) {
  try {
    const response = await fetch(`https://localhost:3000/gameroom/getLastGameRoomIfAfk/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwtToken}`
      }
    });
    if (response.ok)
      return await response.text();
  } catch (error) {
    console.error('getLastGameRoomIfAfk: error: sending GET request');
  }
}


/*-----------------------------------------------MESSAGES-----------------------------------------------*/
export async function getMessagesFromChannel(channelName : string, jwtToken: string) {
  try {
    const response = await fetch(`https://localhost:3000/channel/${channelName}/messages`, {
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
    console.error('getMessagesFromChannel: error: sending GET request');
  }
  return null;
}

export async function getMessage(jwtToken: string) {
  try {
    const response = await fetch("https://localhost:3000/message", {
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
    console.error('getMessage: error: sending GET request');
  }
}

export async function getLastPrivateMessage(senderName:string, receiverName:string, jwtToken: string) { 
  try { 
    const response = await fetch(`https://localhost:3000/privateMessage/${senderName}/${receiverName}/lastMessage`, {
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
    console.error('getLastPrivateMessage: error: sending GET request');
  }
}

/*-----------------------------------------------PRIVATEMESSAGES-----------------------------------------------*/
export async function getLastMessage(userName1 : string, userName2 : string, jwtToken: string) { 
  try {
    const response = await fetch(`https://localhost:3000/privateMessage/${userName1}/${userName2}/lastMessage`, {
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
    console.error('getLastMessage: error: sending GET request');
  }
  return null;
}

export async function getPrivateMessages(userName1 : string, userName2 : string, jwtToken: string) {
  try {
    const response = await fetch(`https://localhost:3000/privateMessage/${userName1}/${userName2}`, {
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
    console.error('getPrivateMessages: error: sending GET request');
  }
  return null;
}

export async function getPrivateMessagesByUserName(userName : string, jwtToken: string) {
  try {
    const response = await fetch(`https://localhost:3000/privateMessage/${userName}`, {
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
    console.error('getPrivateMessagesByUserName: error: sending GET request');
  }
  return null;
}
/*-----------------------------------------------SCORE-----------------------------------------------*/

export async function getAllUserScore(gameRoomId: number, jwtToken: string) {
  try {
    const response = await fetch(`https://localhost:3000/score/getAllUserScore/${gameRoomId}`, {
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
    console.error('getAllUserScore: error: sending GET request');
  }
  return null;
}

export async function getScoreByRoomId(gameRoomId: string, jwtToken: string){
  try {
    const response = await fetch(`https://localhost:3000/score/getScoreByRoomId/${gameRoomId}`, {
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
    console.error('getScoreByRoomId: error: sending GET request');
  }
  return null;
}

export async function getGameWinner(gameRoomId: number, jwtToken: string) {
  try {
    const response = await fetch(`https://localhost:3000/score/getGameWinner/${gameRoomId}`, {
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
    console.error('getGameWinner: error: sending GET request');
  }
  return null;
}

/*-----------------------------------------------USERS-----------------------------------------------*/
export async function isBlock(userName : string, blockedUserName : string, jwtToken: string){
  try {
    const response = await fetch(`https://localhost:3000/user/${userName}/isBlock/${blockedUserName}`, {
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
    console.error('isBlock: error: sending GET request');
  }
  return null;
}

export async function isBlocked(userName : string, blockedUserName : string, jwtToken: string){
  try {
    const response = await fetch(`https://localhost:3000/user/${userName}/isBlocked/${blockedUserName}`, {
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
    console.error('isBlocked: error: sending GET request');
  }
  return null;
}

export async function getSocketByUserId(userId: number, jwtToken: string ) { 
  try {
    const response = await fetch(`https://localhost:3000/user/getSocket/${userId}`, {
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
    console.error('getSocketByUserId: error: sending GET request');
  }
}

export async function getUsersFromChannel(channelName : string, jwtToken: string) {
  try {
    const response = await fetch(`https://localhost:3000/channel/${channelName}/users`, {
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
    console.error('getUsersFromChannel: error: sending GET request');
  }
  return null;
}

export async function getUserByUserId(userId : number, jwtToken: string) {
  try {
    const response = await fetch(`https://localhost:3000/user/getUser/${userId}`, {
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
    console.error('getUserByUserId: error: sending GET request');
  }
}

export async function getUserByDisplayName(username: string, jwtToken : string) { 
  try { 
    const response = await fetch  (`https://localhost:3000/user/getUserByDisplayName/${username}`, {
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
    console.error('getUserByDisplayName: error: sending GET request');
  }
}

export async function getUserByUserName(username : string, jwtToken: string) {
  try {
    const response = await fetch(`https://localhost:3000/user/getUsername/${username}`, {
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
  catch (error) {
    console.error('getUserByUserName: error: sending GET request');
  }
}

export async function getAllUsers(jwtToken: string) {
  try {
    const response = await fetch("https://localhost:3000/user/getAllUsers", {
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
    console.error('getAllUsers: error: sending GET request');
  }
}

/*-----------------------------------------------AUTH-----------------------------------------------*/

export async function checkA2F(userName : string, token : string, jwtToken: string) {
  try {
    const response = await fetch(`https://localhost:3000/user/checkA2F/${userName}?token=${token}`, {
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
    console.error('checkA2F: error: sending POST request');
  }
}

/*-----------------------------------------------IMAGES-----------------------------------------------*/

export async function getImage(userImage: string) {
  try {
    const response = await fetch(`https://localhost:3000/public/${userImage}`, {
        method: 'GET',
    });
 
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    } else {
        const blob = await response.arrayBuffer();
        return window.URL.createObjectURL(new Blob([blob]));
    }
  } catch (error) {
    console.error('getImage: error: sending POST request');
  }
}
