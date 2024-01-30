import { User } from '../../../../back/node_modules/@prisma/client';

/*-----------------------------------------------CHANNELS-----------------------------------------------*/
export async function addOperator(channelName : string, operatorName : string, jwtToken: string) {
  try {
    const response = await fetch(`https://2D7.42angouleme.fr:3000/channel/${channelName}/add/operator/${operatorName}`, {
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
    console.error("addOperator: error: sending POST request");
  }
}

export async function checkPass(channelName: string, password: string, jwtToken: string) {
  try {
    const response = await fetch(`https://2D7.42angouleme.fr:3000/channel/${channelName}/checkPass`, {
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
    console.error('checkPass: error: sending POST request:');
  }
}

export async function createChannel(channelName : string, userName : string, invitedUserName : string, jwtToken: string) {
  try {
    const response = await fetch(`https://2D7.42angouleme.fr:3000/channel/${channelName}`, {
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
    console.error('createChannel: error: sending POST request');
  }
}

export async function createEmptyChannel(channelName : string, userName : string, jwtToken: string) {
  try {
    const response = await fetch(`https://2D7.42angouleme.fr:3000/channel/create/${channelName}/empty`, {
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
    console.error('createEmptyChannel: error: sending POST request');
  }
}

export async function joinChannel(channelName : string, userName : string, jwtToken: string) {
  try {
    const response = await fetch(`https://2D7.42angouleme.fr:3000/channel/${channelName}/join/${userName}`, {
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
    console.error('joinChannel: error: sending POST request');
  }
}

export async function setAdmin(channelName : string, adminName : string, jwtToken: string) {
  try {
    const response = await fetch(`https://2D7.42angouleme.fr:3000/channel/${channelName}/set/admin/${adminName}`, {
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
    console.error("setAdmin: error: sending POST request");
  }
}

export async function setPassword(channelName : string, password : string, jwtToken: string) {
  try {
    const response = await fetch(`https://2D7.42angouleme.fr:3000/channel/${channelName}/set/password`, {
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
    console.error('setPassword: error: sending POST request');
  }
}

export async function setPrivateChannel(channelName : string, jwtToken: string) {
  try {
    const response = await fetch(`https://2D7.42angouleme.fr:3000/channel/${channelName}/set/private`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwtToken}`
      },
      body: JSON.stringify({ channelName: channelName }),
    });

    if (response.ok)
      return await response.json();
  }
  catch (error) {
    console.error('setPrivate: error: sending POST request');
  }
}

export async function unsetPassword(channelName : string, jwtToken: string) {
  try {
    const response = await fetch(`https://2D7.42angouleme.fr:3000/channel/${channelName}/unset/password`, {
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
    console.error('unsetPassword: error: sending POST request');
  }
}

/*-----------------------------------------------FRIENDS-----------------------------------------------*/
export async function addFriend(userName : string, friendName : string, jwtToken: string) {
  try {
    const response = await fetch(`https://2D7.42angouleme.fr:3000/user/friend/add/${friendName}`, {
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
    console.error('addFriend: error: sending POST request');
  }
}
/*-----------------------------------------------MESSAGES-----------------------------------------------*/
export async function insertMessage(message_text : string, jwtToken: string) {
  try {
    const response = await fetch("https://2D7.42angouleme.fr:3000/message", {
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
    console.error('insertMessage: error: sending POST request');
  }
}

export async function insertMessageToChannel(channelName : string, message_text : string, user : User, jwtToken: string) {
  try {
    const response = await fetch(`https://2D7.42angouleme.fr:3000/message/${channelName}/post/message`, {
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
    console.error('insertMessageToChannel: error: sending POST request');
  }
}

/*-----------------------------------------------PRIVATEMESSAGES-----------------------------------------------*/
export async function createPrivateMessage(userName1: string, userName2: string, messageContent: string, jwtToken: string) {
  try {
    const response = await fetch(`https://2D7.42angouleme.fr:3000/privateMessage/create/${userName1}/${userName2}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwtToken}`
      },
      body: JSON.stringify({ userName1, userName2, messageContent }),
    });

    if (response.ok) {
      return await response.json();
    }
  } 
  catch (error) {
    console.error('createPrivateMessage: error: sending POST request');
  }
}

/*-----------------------------------------------USERS-----------------------------------------------*/
export async function banUserFromChannel(channelName : string, userName : string, jwtToken: string) {
  try {
    const response = await fetch(`https://2D7.42angouleme.fr:3000/channel/${channelName}/ban/${userName}`, {
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
    console.error('banUserFromChannel: error: sending POST request');
  }
}

export async function blockUser(userName : string, blockedUserName : string, jwtToken: string) {
  try {
    const response = await fetch(`https://2D7.42angouleme.fr:3000/user/${userName}/block/${blockedUserName}`, {
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
    console.error('blockUser: error: sending POST request');
  }
}

export async function unblockUser(userName : string, unblockedUserName : string, jwtToken: string) {
  try {
    const response = await fetch(`https://2D7.42angouleme.fr:3000/user/${userName}/unblock/${unblockedUserName}`, {
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
    console.error('unblockUser: error: sending POST request');
  }

}

export async function insertUser(userName: string, image: string, cookie: string, jwtToken: string) {
  try {
    const response = await fetch(`https://2D7.42angouleme.fr:3000/user`, {
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
    console.error('insertUser: error: sending POST request: ');
  }
}

export async function muteUserFromChannel(channelName : string, userName : string, duration : number, jwtToken: string) {
  try {
    const response = await fetch(`https://2D7.42angouleme.fr:3000/channel/${channelName}/mute/${userName}`, {
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
    console.error('muteUserFromChannel: error: sending POST request');
  }
}

export async function setStatus(userName : string, status : string, jwtToken: string) {
  try {
    const response = await fetch(`https://2D7.42angouleme.fr:3000/user/${userName}/setStatus`, {
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
    console.error('setStatus: error: sending POST request');
  }
}

export async function updateUsername(userName : string, newUserName : string, jwtToken: string) {
  try {
    const response = await fetch(`https://2D7.42angouleme.fr:3000/user/updateUsername/${userName}`, {
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
    console.error('updateUsername: error: sending POST request');
  }
}

/*-----------------------------------------------GAMEROOM-----------------------------------------------*/

export async function createGameRoom(hostPlayerName : string, invitedPlayerName: string, jwtToken: string) {
  try {
    const response = await fetch(`https://2D7.42angouleme.fr:3000/gameroom/createGameRoomInvitation/${hostPlayerName}/${invitedPlayerName}`, {
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
    console.error('createGameRoom: error: sending POST request');
  }
}

/*-----------------------------------------------UTILS-----------------------------------------------*/
export async function setClientSocket(userName : string, socket : string, jwtToken: string) {
  try {
    const response = await fetch(`https://2D7.42angouleme.fr:3000/user/socket/${socket}`, {
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
    console.error('setClientSocket: error: sending POST request');
  }
}

export async function updateA2F(userName : string, A2F : boolean, jwtToken: string) {
  try {
    const response = await fetch(`https://2D7.42angouleme.fr:3000/user/updateA2F/${userName}`, {
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
    console.error('updateA2F: error: sending POST request');
  }
}

export async function updateImage(userName : string, image : string, jwtToken: string) {
  try {
    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("image", image);
  
    const response = await fetch(`https://2D7.42angouleme.fr:3000/user/updateImage/${userName}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${jwtToken}`
      },
      body: formData,
    });
    if (response.ok)
      return await response.json();
  } 
  catch (error) {
    console.error('updateImage: error: sending POST request');
  }
}
