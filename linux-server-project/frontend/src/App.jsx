// Import useState for managing component state.
import { useState } from "react";

// Import the API functions from api.js.
import { submitContact, getContacts } from "./api";

function App() {
  // Store the name input value.
  const [name, setName] = useState("");

  // Store the email input value.
  const [email, setEmail] = useState("");

  // Store the message input value.
  const [message, setMessage] = useState("");

  // Store the contacts received from the backend.
  const [contacts, setContacts] = useState([]);

  // Store success or error messages.
  const [status, setStatus] = useState("");

  // Handle the contact form submission.
  async function handleSubmit(event) {
    // Prevent the browser from refreshing the page.
    event.preventDefault();

    try {
      // Send the form data to the backend.
      await submitContact({ name, email, message });

      // Clear the form inputs after successful submission.
      setName("");
      setEmail("");
      setMessage("");

      // Show a success message.
      setStatus({ type: "success", text: "Message sent successfully!" });
    } catch {
      // Show an error message if the request fails.
      setStatus({ type: "error", text: "Failed to send message. Please try again." });
    }
  }

  // Load all contacts from the backend.
  async function loadContacts() {
    try {
      // Get contacts from the backend API.
      const data = await getContacts();

      // Store the contacts in state.
      setContacts(data.contacts);
    } catch {
      // Show an error message if loading fails.
      setStatus({ type: "error", text: "Failed to load messages." });
    }
  }

  return (
    <div className="page">
      {/* Page header. */}
      <header className="hero">
        <span className="hero-badge">Get in touch</span>
        <h1>Contact Us</h1>
        <p>Questions, feedback, or just saying hi — we'd love to hear from you.</p>
      </header>

      {/* Contact form. */}
      <form onSubmit={handleSubmit}>
        <div className="card">
          <h2 className="card-title">Send a message</h2>
          <p className="card-subtitle">We usually reply within one business day.</p>

          {/* Name input. */}
          <div className="field">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              placeholder="Jane Doe"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>

          {/* Email input. */}
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="jane@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          {/* Message textarea. */}
          <div className="field">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              placeholder="How can we help?"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              required
            />
          </div>

          {/* Display success or error status. */}
          {status && (
            <p className={`status status-${status.type}`}>{status.text}</p>
          )}

          {/* Submit the contact form. */}
          <button type="submit" className="btn btn-primary">
            Send Message
          </button>
        </div>
      </form>

      {/* Saved messages. */}
      <div className="card">
        <h2 className="card-title">Messages</h2>
        <p className="card-subtitle">Everything that has been submitted so far.</p>

        {/* Load contacts from the backend. */}
        <button type="button" onClick={loadContacts} className="btn btn-secondary">
          Load Messages
        </button>

        {/* Display contacts when they are loaded. */}
        {contacts.length > 0 && (
          <ul className="message-list">
            {contacts.map((contact) => (
              <li key={contact.id}>
                <div className="message-header">
                  <span className="message-name">{contact.name}</span>
                  <span className="message-email">{contact.email}</span>
                </div>
                <p className="message-body">{contact.message}</p>
              </li>
            ))}
          </ul>
        )}

        {contacts.length === 0 && (
          <p className="empty-state">No messages loaded yet — click the button above.</p>
        )}
      </div>

      {/* Footer. */}
      <footer className="footer">© 2026 · Built with React &amp; Vite</footer>
    </div>
  );
}

export default App;
