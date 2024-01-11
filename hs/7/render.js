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
      async function viewContact(id) {
        const response = await fetch('/contact/' + id);
        const data = await response.text();
        document.getElementById('contactDetails').innerHTML = data;
      }

      async function searchContacts() {
        const name = prompt('Enter name to search:');
        const response = await fetch('/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `name=${name}`,
        });
        const data = await response.text();
        document.getElementById('contactDetails').innerHTML = data;
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
