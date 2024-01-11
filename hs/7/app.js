import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import * as render from './render.js';

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
