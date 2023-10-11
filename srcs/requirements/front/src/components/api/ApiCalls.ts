export async function insertUser(userName) {
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
      console.error('error: while sending GET request', errorText);
    }
  } 
  catch (error) {
    console.error('error: while sending GET request', error);
  }
}