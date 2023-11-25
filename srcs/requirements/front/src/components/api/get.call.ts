/*-----------------------------------------------CHANNEL-----------------------------------------------*/
export async function getAllChannels() { 
  try {
    const response = await fetch("http://localhost:3000/channel/getAllChannels", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok)
      return await response.json();
  }
  catch (error) {
    console.error('error: sending GET request', error);
  }
}

export async function getAllNewChannels(userName : string) {
  try {
    const response = await fetch(`http://localhost:3000/channel/getAllNewChannels/${userName}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok)
      return await response.json();
  }
  catch (error) {
    console.error('error: sending GET request', error);
  }
}

export async function getAllChannelsFromUser(userName : string) {
  try {
    const response = await fetch(`http://localhost:3000/user/${userName}/channels`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok)
      return await response.json();
  }
  catch (error) {
    console.error('error: sending GET request', error);
  }
}

export async function getChannelByName(channelName : string) {
  try {
    const response = await fetch(`http://localhost:3000/channel/get/${channelName}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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

export async function isUserInChannel(channelName : string, userName : string) {
  try {
    const response = await fetch(`http://localhost:3000/channel/${channelName}/isUser/${userName}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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
  return false;
}

export async function isUserBanInChannel(channelName : string, userName : string) {
  try {
    const response = await fetch(`http://localhost:3000/channel/${channelName}/isBan/${userName}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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

/*-----------------------------------------------FRIEND-----------------------------------------------*/
export async function isFriend(userName : string, friendName : string){
  try {
    const response = await fetch(`http://localhost:3000/user/isFriend/${userName}/${friendName}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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
  return null;
}

export async function getAllFriends(userName : string) {
  try {
    const response = await fetch(`http://localhost:3000/user/${userName}/friends`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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

export async function getFriendUserNames(userId : number) {
  try {
    const response = await fetch(`http://localhost:3000/user/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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

export async function getUserFriends(userId : number) {
  try {
    const response = await fetch("http://localhost:3000/user/friends", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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
export async function getGameRoomByRoomId(id : number) {
  try {
    const response = await fetch(`http://localhost:3000/gameroom/id/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      return await response.json();
    }
  } 
  catch (error) {
    console.error('error: sending GET request', error);
  }
}

export async function getGameRoomByUserId(userId : number) {
  try {
    const response = await fetch(`http://localhost:3000/gameroom/get/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      return await response.json();
    }
  } 
  catch (error) {
    console.error('error: sending GET request', error);
  }
}

/*-----------------------------------------------MESSAGES-----------------------------------------------*/
export async function getMessagesFromChannel(channelName : string) {
  try {
    const response = await fetch(`http://localhost:3000/channel/${channelName}/messages`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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

export async function getMessage() {
  try {
    const response = await fetch("http://localhost:3000/message", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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

/*-----------------------------------------------NOTIFICATIONS-----------------------------------------------*/
export async function getNotifs(userName : string) {
  try {
    const response = await fetch(`http://localhost:3000/notif/getNotif/${userName}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok){
      return await response.json();
    }
  }
  catch (error) {
    console.error('error: sending GET request', error);
  }
  return null;
}

/*-----------------------------------------------PRIVATEMESSAGES-----------------------------------------------*/
export async function getPrivateMessages(userName1 : string, userName2 : string) {
  try {
    const response = await fetch(`http://localhost:3000/privateMessage/${userName1}/${userName2}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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

export async function getPrivateMessagesByUserName(userName : string) {
  try {
    const response = await fetch(`http://localhost:3000/privateMessage/${userName}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok){
      return await response.json();
    }
  }
  catch (error) {
    console.error('error: sending GET request', error);
  }
  return null;
}

/*-----------------------------------------------USERS-----------------------------------------------*/
export async function isBlock(userName : string, blockedUserName : string){
  try {
    const response = await fetch(`http://localhost:3000/user/${userName}/isBlock/${blockedUserName}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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
  return null;
}

export async function getUsersFromChannel(channelName : string) {
  try {
    const response = await fetch(`http://localhost:3000/channel/${channelName}/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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

export async function getUserByCookie(cookie : string) {
  try {
    const response = await fetch(`http://localhost:3000/user/cookie/${cookie}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const text = await response.text();
      if (!text) {
        return null;
      }

      const responseData = JSON.parse(text);
      return responseData;
    }
  }
  catch (error) {
    console.error('error: sending GET request', error);
  }
  return null;
}

export async function getUserByUserId(userId : number) {
  try {
    const response = await fetch(`http://localhost:3000/user/getUser/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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

export async function getUserByUserName(username : string) {
  try {
    const response = await fetch(`http://localhost:3000/user/getUsername/${username}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      return await response.json();
    }
  } 
  catch (error) {}
}

export async function getAllUsers() {
  try {
    const response = await fetch("http://localhost:3000/user/getAllUsers/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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

/*-----------------------------------------------UTILS-----------------------------------------------*/
export async function getClientFromQueueList(){
  try {
    const response = await fetch("http://localhost:3000/queuelist", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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

export async function sumQueueList(){
  try {
    const response = await fetch("http://localhost:3000/queuelist/sum", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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

export async function checkA2F(userName : string, token : string) {
  try {
    const response = await fetch(`http://localhost:3000/user/checkA2F/${userName}?token=${token}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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