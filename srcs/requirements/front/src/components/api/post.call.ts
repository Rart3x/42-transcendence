export async function addFriend(userName : string, friendName : string) {
  try {
    const response = await fetch(`http://localhost:3000/user/${userName}/friend`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userName: userName, friendName: friendName }),
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

/* USER */

export async function insertUser(userName: string, image: string, cookie: string) {
  try {
    const response = await fetch(`http://localhost:3000/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userName: userName, image: image, socket: "", cookie: cookie }),
    });

    if (response.ok) {
      const responseData = await response.json();
    } else {
      const errorText = await response.text();
      console.error('error: sending POST request: ', errorText);
    }
  } catch (error) {
    console.error('error: sending POST request: ', error);
  }
}

export async function updateUsername(userName : string, newUserName : string) {
  try {
    const response = await fetch(`http://localhost:3000/user/updateUsername/${userName}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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

export async function updateImage(userName : string, image : string) {
  try {
    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("image", image);

    const response = await fetch(`http://localhost:3000/user/updateImage/${userName}`, {
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

export async function insertIntoQueueList(clientSocket : string) {
    try {
      const response = await fetch(`http://localhost:3000/queuelist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ clientSocket: clientSocket }),
      });
  
      if (response.ok) {
        const responseData = await response.json();
      } 
      else {
        const errorText = await response.text();
        console.error('error: sending POST request: ', errorText);
      }
    } 
  catch (error) {
    console.error('error: sending POST request: ', error);
  }
}

export async function insertMessage(message_text : string) {
  try {
    const response = await fetch("http://localhost:3000/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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

export async function setClientSocket(userName : string, socket : string) {
  try {
    const response = await fetch(`http://localhost:3000/user/${socket}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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

