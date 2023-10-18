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
      console.log(responseData);
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

