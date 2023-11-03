/* ----- USER ----- */
export async function getAllChannels(userName : string) {
  try {
    const response = await fetch(`http://localhost:3000/user/${userName}/channels`, {
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
    if (response.ok) {
      return await response.json();
    }
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

export async function getUserByUsername(username : string) {
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

export async function getUserByUserId(userId : number) {
  try {
    const response = await fetch(`http://localhost:3000/user/userId/${userId}`, {
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

