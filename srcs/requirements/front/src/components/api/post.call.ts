/* ----- USER ----- */

export async function insertUser(userName: string, image: string) {
  try {
    const response = await fetch(`http://localhost:3000/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userName: userName, image: image }),
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
  
  export async function updateUsername(userName : string, newUserName : string) {
    try {
      const response = await fetch(`http://localhost:3000/user/${userName}`, {
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
