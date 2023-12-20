import { User } from '../../../../back/node_modules/@prisma/client';

/*-----------------------------------------------CHANNELS-----------------------------------------------*/
export async function addOperator(channelName : string, operatorName : string, jwtToken: string) {
  try {
    const response = await fetch(`http://localhost/api/channel/${channelName}/add/operator/${operatorName}`, {
      method: "POST",
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
    console.error("error: sending POST request", error);
  }
}

export async function checkPass(channelName: string, password: string, jwtToken: string) {
  try {
    const response = await fetch(`http://localhost/api/channel/${channelName}/checkPass`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwtToken}`
      },
      body: JSON.stringify({ password: password }),
    });

    if (response.ok) {
      const responseData = await response.json();
      return responseData;
    }
  }
  catch (error) {
    console.error('error: sending POST request:', error);
  }
}

export async function createChannel(channelName : string, userName : string, invitedUserName : string, jwtToken: string) {
  try {
    const response = await fetch(`http://localhost/api/channel/${channelName}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwtToken}`
      },
      body: JSON.stringify({ channelName: channelName, userName: userName, invitedUserName: invitedUserName }),
    });

    if (response.ok) {
      const responseData = await response.json();
      return responseData;
    }
  }
  catch (error) {
    console.error('error: sending POST request', error);
  }
}

export async function createEmptyChannel(channelName : string, userName : string, jwtToken: string) {
  try {
    const response = await fetch(`http://localhost/api/channel/create/${channelName}/empty`, {
      method: "POST",
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
    console.error('error: sending POST request', error);
  }
}

export async function joinChannel(channelName : string, userName : string, jwtToken: string) {
  try {
    const response = await fetch(`http://localhost/api/channel/${channelName}/join/${userName}`, {
      method: "POST",
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
    console.error('error: sending POST request', error);
  }
}

export async function setAdmin(channelName : string, adminName : string, jwtToken: string) {
  try {
    const response = await fetch(`http://localhost/api/channel/${channelName}/set/admin/${adminName}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwtToken}`
      },
      body: JSON.stringify({ channelName: channelName, adminName: adminName }),
    });
    if (response.ok) {
      const responseData = await response.json();
      return responseData;
    }
  }
  catch (error) {
    console.error("error: sending POST request", error);
  }
}

export async function setPassword(channelName : string, password : string, jwtToken: string) {
  try {
    const response = await fetch(`http://localhost/api/channel/${channelName}/set/password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwtToken}`
      },
      body: JSON.stringify({ channelName: channelName, password: password }),
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

export async function unsetPassword(channelName : string, jwtToken: string) {
  try {
    const response = await fetch(`http://localhost/api/channel/${channelName}/unset/password`, {
      method: "POST",
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
    else {
      const errorText = await response.text();
    }
  }
  catch (error) {
    console.error('error: sending POST request', error);
  }
}

/*-----------------------------------------------FRIENDS-----------------------------------------------*/
export async function addFriend(userName : string, friendName : string, jwtToken: string) {
  try {
    const response = await fetch(`http://localhost/api/user/friend/add/${friendName}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwtToken}`
      },
      body: JSON.stringify({ userName: userName, friendName: friendName }),
    });
    if (response.ok){
      const responseData = await response.json();
      return responseData;
    }
  } 
  catch (error) {
    console.error('error: sending POST request', error);
  }
}
/*-----------------------------------------------MESSAGES-----------------------------------------------*/
export async function insertMessage(message_text : string, jwtToken: string) {
  try {
    const response = await fetch("http://localhost/api/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwtToken}`
      },
      body: JSON.stringify({ message_text: message_text }),
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

export async function insertMessageToChannel(channelName : string, message_text : string, user : User, jwtToken: string) {
  try {
    const response = await fetch(`http://localhost/api/message/${channelName}/post/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwtToken}`
      },
      body: JSON.stringify({ channelName: channelName, message_text: message_text, user: user}),
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

/*-----------------------------------------------PRIVATEMESSAGES-----------------------------------------------*/
export async function createPrivateMessage(userName1 : string, userName2 : string, privateMessageText : string, jwtToken: string) {
  try {
    const response = await fetch(`http://localhost/api/privateMessage/create/${userName1}/${userName2}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwtToken}`
      },
      body: JSON.stringify({ userName1: userName1, userName2: userName2, privateMessageText: privateMessageText }),
    });

    if (response.ok) {
      const responseData = await response.json();
      return responseData;
    }
  }
  catch (error) {
    console.error('error: sending POST request', error);
  }
}

/*-----------------------------------------------USERS-----------------------------------------------*/
export async function banUserFromChannel(channelName : string, userName : string, jwtToken: string) {
  try {
    const response = await fetch(`http://localhost/api/channel/${channelName}/ban/${userName}`, {
      method: "POST",
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
    console.error('error: sending POST request', error);
  }
}

export async function blockUser(userName : string, blockedUserName : string, jwtToken: string) {
  try {
    const response = await fetch(`http://localhost/api/user/${userName}/block/${blockedUserName}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwtToken}`
      },
      body: JSON.stringify({ userName: userName, blockedUserName: blockedUserName }),
    });
    if (response.ok) {
      const responseData = await response.json();
      return responseData;
    }
  }
  catch (error) {
    console.error('error: sending POST request', error);
  }
}

export async function unblockUser(userName : string, unblockedUserName : string, jwtToken: string) {
  try {
    const response = await fetch(`http://localhost/api/user/${userName}/unblock/${unblockedUserName}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwtToken}`
      },
      body: JSON.stringify({ userName: userName, unblockedUserName: unblockedUserName }),
    });
    if (response.ok) {
      const responseData = await response.json();
      return responseData;
    }
  }
  catch (error) {
    console.error('error: sending POST request', error);
  }

}

export async function insertUser(userName: string, image: string, cookie: string, jwtToken: string) {
  try {
    const response = await fetch(`http://localhost/api/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwtToken}`
      },
      body: JSON.stringify({ userName: userName, image: image, socket: "", cookie: cookie }),
    });

    if (response.ok) {
      const responseData = await response.json();
    }
    else {
      const errorText = await response.text();
      console.error('error: sending POST request: ', errorText);
    }
  } catch (error) {
    console.error('error: sending POST request: ', error);
  }
}

export async function muteUserFromChannel(channelName : string, userName : string, duration : number, jwtToken: string) {
  try {
    const response = await fetch(`http://localhost/api/channel/${channelName}/mute/${userName}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwtToken}`
      },
      body: JSON.stringify({ channelName: channelName, userName: userName, duration: duration }),
    });
    if (response.ok) {
      const responseData = await response.json();
      return responseData;
    }
  }
  catch (error) {
    console.error('error: sending POST request', error);
  }
}

export async function setStatus(userName : string, status : string, jwtToken: string) {
  try {
    const response = await fetch(`http://localhost/api/user/${userName}/setStatus`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwtToken}`
      },
      body: JSON.stringify({ userName: userName, status: status }),
    });
    if (response.ok) {
      const responseData = await response.json();
      return responseData;
    }
  }
  catch (error) {
    console.error('error: sending POST request', error);
  }
}

export async function updateUsername(userName : string, newUserName : string, jwtToken: string) {
  try {
    const response = await fetch(`http://localhost/api/user/updateUsername/${userName}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwtToken}`
      },
      body: JSON.stringify({ userName: userName, newUserName: newUserName }),
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

/*-----------------------------------------------GAMEROOM-----------------------------------------------*/

export async function createGameRoom(hostPlayerName : string, invitedPlayerName: string, jwtToken: string) {
  try {
    const response = await fetch(`http://localhost/api/gameroom/createGameRoomInvitation/${hostPlayerName}/${invitedPlayerName}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwtToken}`
      },
      body: JSON.stringify({ hostPlayerName: hostPlayerName, invitedPlayerName: invitedPlayerName }),
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

/*-----------------------------------------------UTILS-----------------------------------------------*/
export async function setClientSocket(userName : string, socket : string, jwtToken: string) {
  try {
    const response = await fetch(`http://localhost/api/user/socket/${socket}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwtToken}`
      },
      body: JSON.stringify({ userName: userName, socket: socket }),
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

export async function updateA2F(userName : string, A2F : boolean, jwtToken: string) {
  try {
    const response = await fetch(`http://localhost/api/user/updateA2F/${userName}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwtToken}`
      },
      body: JSON.stringify({ userName: userName, A2F: A2F }),
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

export async function updateImage(userName : string, image : string, jwtToken: string) {
  try {
    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("image", image);

    const response = await fetch(`http://localhost/api/user/updateImage/${userName}`, {
      method: "POST",
      body: formData,
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
