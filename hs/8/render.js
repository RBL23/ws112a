export function layout(title, content) {
  return `
    <html>
      <head>
        <title>${title}</title>
        <style>
          body {
            padding: 20px;
            font-family: Arial, sans-serif;
          }
  
          h1 {
            font-size: 24px;
          }
  
          h2 {
            font-size: 20px;
          }
  
          ul {
            list-style: none;
            padding: 0;
          }
  
          li {
            margin-bottom: 10px;
          }
  
          form {
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <section id="content">
          ${content}
        </section>
      </body>
    </html>
  `;
}

export function list(contacts) {
  const contactItems = contacts.map(contact => `
    <li>
      <h2>${contact.name}</h2>
      <p><a href="#" onclick="viewContact(${contact.id})">View Phone</a></p>
    </li>
  `);

  const content = `
    <h1>Contacts</h1>
    <p>You have <strong>${contacts.length}</strong> contacts!</p>
    <ul>
      ${contactItems.join('')}
    </ul>
    <p><a href="/contact/new">Add Contact</a></p>
    <p><a href="#" onclick="searchContacts()">Search Contacts</a></p>
    <div id="contactDetails"></div>
    <script>
      const ws = new WebSocket('ws://127.0.0.1:8000/ws');

      ws.addEventListener('open', (event) => {
        console.log('WebSocket connection opened:', event);
      });

      ws.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
        console.log('WebSocket message received:', data);
        // Handle WebSocket messages from the server (update the UI as needed)
        // For demonstration purposes, let's assume the server sends a message with contact details
        document.getElementById('contactDetails').innerHTML = data.name + ' - ' + data.phone;
      });

      ws.addEventListener('close', (event) => {
        console.log('WebSocket connection closed:', event);
      });

      async function viewContact(id) {
        const response = await fetch('/api/contact/' + id);
        const data = await response.json();
        document.getElementById('contactDetails').innerHTML = data.name + ' - ' + data.phone;
      }

      async function searchContacts() {
        const name = prompt('Enter name to search:');
        const response = await fetch('/api/contacts');
        const contacts = await response.json();
        const foundContact = contacts.find(contact => contact.name === name);

        if (foundContact) {
          document.getElementById('contactDetails').innerHTML = foundContact.name + ' - ' + foundContact.phone;
          
          // Send a message to the server to notify it about the found contact
          ws.send(JSON.stringify(foundContact));
        } else {
          document.getElementById('contactDetails').innerHTML = 'Contact not found';
        }
      }
    </script>
  `;

  return layout('Contacts', content);
}

export function newContact() {
  return layout(
    'New Contact',
    `
      <h1>New Contact</h1>
      <form action="/contact" method="post">
        <p><input type="text" placeholder="Name" name="name"></p>
        <p><input type="text" placeholder="Phone" name="phone"></p>
        <p><input type="submit" value="Add"></p>
      </form>
    `
  );
}

export function search() {
  return layout(
    'Search Contacts',
    `
      <h1>Search Contacts</h1>
      <form action="/search" method="post">
        <p><input type="text" placeholder="Enter name" name="name"></p>
        <p><input type="submit" value="Search"></p>
      </form>
    `
  );
}

export function found(contact) {
  return layout(
    'Found Contact',
    `
      <h1>Contact Found</h1>
      <p><strong>Name:</strong> ${contact.name}</p>
      <p><strong>Phone:</strong> ${contact.phone}</p>
    `
  );
}

export function notFound() {
  return layout(
    'Contact Not Found',
    `
      <h1>Contact Not Found</h1>
      <p>No contact found with the specified name.</p>
    `
  );
}

export function show(contact) {
  return layout(
    contact.name,
    `
      <h1>${contact.name}</h1>
      <p>${contact.phone}</p>
    `
  );
}
