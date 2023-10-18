export async function insertUser(userName : string) {
    try {
      const response = await fetch(`http://localhost:3000/user/${userName}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (response.ok) {
        const responseData = await response.json();
      } 
      else {
        const errorText = await response.text();
        console.error('error: sending GET request: ', errorText);
      }
    } 
    catch (error) {
      console.error('error: sending GET request: ', error);
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
      else {
        const errorText = await response.text();
      }
    } 
    catch (error) {
      console.error('error: sending GET request', error);
    }
}