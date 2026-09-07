// Get the backend API URL from the Vite environment variable.
const API_URL = import.meta.env.VITE_API_URL;

// Submit the contact form data to the backend.
export async function submitContact(data) {
  // Send a POST request to the contact API.
  const response = await fetch(`${API_URL}/api/contact`, {
    // Tell the server that we are creating/sending data.
    method: "POST",

    // Tell the server that the request body is JSON.
    headers: {
      "Content-Type": "application/json",
    },

    // Convert the JavaScript object into JSON.
    body: JSON.stringify(data),
  });

  // Convert the server response from JSON to a JavaScript object.
  return response.json();
}

// Get all contacts from the backend.
export async function getContacts() {
  // Send a GET request to the contacts API.
  const response = await fetch(`${API_URL}/api/contacts`);

  // Convert the server response from JSON to a JavaScript object.
  return response.json();
}
