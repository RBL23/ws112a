import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import * as render from './render.js';
import { acceptWebSocket, isWebSocketCloseEvent, WebSocket } from "https://deno.land/std/ws/mod.ts";

const contacts = [
  { id: 0, name: '范逸俊', phone: '0909116804' },
  { id: 1, name: '吳成恩', phone: '0910111251' },
];

const router = new Router();

router
  .get('/', list)
  .get('/search', search)
  .get('/contact/new', add)
  .get('/contact/:id', show)
  .post('/search', find)
  .post('/contact', create)
  .get('/api/contacts', getContacts)
  .get('/api/contact/:id', getContact);

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener('listen', ({ hostname, port, secure }) => {
  console.log(`Server listening on ${secure ? 'https://' : 'http://'}${hostname ?? 'localhost'}:${port}`);
});

app.addEventListener('error', (err) => {
  console.error('Error:', err.error);
});

// WebSocket handling
app.addEventListener('upgrade', async (event) => {
  const { request } = event;

  if (request.url.startsWith('/ws')) {
    const ws = await acceptWebSocket(event.request);
    handleWebSocket(ws);
  }
});

async function handleWebSocket(ws) {
  for await (const event of ws) {
    if (typeof event === 'string') {
      // Handle string messages from the client
      handleWebSocketMessage(ws, event);
    } else if (isWebSocketCloseEvent(event)) {
      // Handle WebSocket close event
      handleClose(ws);
    }
  }
}

function handleWebSocketMessage(ws, message) {
  // Handle WebSocket messages from the client
  console.log('WebSocket message:', message);

  // For demonstration purposes, you can broadcast the message to all connected clients
  // Modify this part based on your application's requirements
  broadcastMessage(message);
}

function handleClose(ws) {
  // Handle WebSocket close event
  console.log('WebSocket closed');
}

function broadcastMessage(message) {
  // Broadcast the message to all connected WebSocket clients
  // Modify this part based on your application's requirements
  // In a real application, you may want to keep track of connected clients and send messages selectively
  for (const client of connectedClients) {
    try {
      client.send(message);
    } catch (error) {
      console.error('Error broadcasting message:', error);
    }
  }
}

// Store connected WebSocket clients
const connectedClients = new Set();

async function list(ctx) {
  const response = await fetch('/api/contacts');
  const contacts = await response.json();
  ctx.response.body = await render.list(contacts);
}

async function add(ctx) {
  ctx.response.body = await render.newContact();
}

async function show(ctx) {
  const id = ctx.params.id;
  const response = await fetch('/api/contact/' + id);
  const contact = await response.json();
  if (!contact) ctx.throw(404, 'Invalid contact id');
  ctx.response.body = await render.show(contact);
}

async function search(ctx) {
  ctx.response.body = await render.search();
}

async function find(ctx) {
  const body = ctx.request.body();
  if (body.type === 'form') {
    const pairs = await body.value;
    const name = pairs.find(pair => pair[0] === 'name');
    
    const response = await fetch('/api/contacts');
    const contacts = await response.json();
    const foundContact = contacts.find(contact => contact.name === name[1]);

    if (foundContact) {
      ctx.response.body = await render.found(foundContact);
    } else {
      ctx.response.body = await render.notFound();
    }
  }
}

async function create(ctx) {
  const body = ctx.request.body();
  if (body.type === 'form') {
    const pairs = await body.value;
    const contact = {};
    for (const [key, value] of pairs) {
      contact[key] = value;
    }
    contact.id = contacts.length;
    contacts.push(contact);
    ctx.response.redirect('/');
  }
}

async function getContacts(ctx) {
  ctx.response.body = contacts;
}

async function getContact(ctx) {
  const id = ctx.params.id;
  const contact = contacts[id];
  if (!contact) ctx.throw(404, 'Invalid contact id');
  ctx.response.body = contact;
}

console.log('Server is running at http://127.0.0.1:8000');
await app.listen({ port: 8000 });
