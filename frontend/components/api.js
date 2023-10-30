const apiUrl = "https://colab-test.onrender.com/"; // Replace with the new API URL

export default fetch(apiUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    // Handle the response data here
    console.log(data);
  })
  .catch(error => {
    // Handle any errors that occur during the request
    console.error(error);
  });

// fetch(apiUrl)
//   .then(response => response.json())
//   .then(data => console.log(data))
//   .catch(error => console.error(error));