/* ----- USER ----- */
export async function getUserByCookie(cookie) {
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
    console.error('Error: sending GET request', error);
  }
  return null;
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