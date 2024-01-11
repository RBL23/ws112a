import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import * as render from './render.js'
import { DB } from "https://deno.land/x/sqlite/mod.ts";

const db = new DB("blog.db");
db.query("CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, body TEXT)");

const router = new Router();

router.get('/', list)
  .get("/search/search",search)
  .get('/post/new', add)
  .get('/post/:id', show)
  .post("/search",find)
  .post('/post', create);

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

function query(sql) {
  let list = []
  for (const [id, title, body] of db.query(sql)) {
    list.push({id, title, body})
  }
  return list
}
async function list(ctx) {
  let posts = query("SELECT id, title, body FROM posts")
  console.log('list:posts=', posts)
  ctx.response.body = await render.list(posts);
}
async function add(ctx) {
  ctx.response.body = await render.newPost();
}
async function show(ctx) {
  const pid = ctx.params.id;
  let posts = query(`SELECT id, title, body FROM posts WHERE id=${pid}`)
  let post = posts[0]
  console.log('show:post=', post)
  if (!post) ctx.throw(404, 'invalid post id');
  ctx.response.body = await render.show(post);
}
async function find(ctx) {
  const body = ctx.request.body()
  if (body.type === "form") {
    const pairs = await body.value
    let name,number
    for(let i of pairs)
      name=i
    let posts = query("SELECT id, title, body FROM posts")
    const found = posts.some(post => post.title === name[1]);

    if (found) {
      for(let i of posts){
        if(i.title==name[1])
          number=i.body
      }
      ctx.response.body = await render.found(name[1],number);
    } else {
      ctx.response.body = await render.not_found();
    }
  }
}
async function create(ctx) {
  const body = ctx.request.body()
  if (body.type === "form") {
    const pairs = await body.value
    const post = {}
    for (const [key, value] of pairs) {
      post[key] = value
    }
    console.log('create:post=', post)
    db.query("INSERT INTO posts (title, body) VALUES (?, ?)", [post.title, post.body]);
    ctx.response.redirect('/');
  }
}
console.log('Server run at http://127.0.0.1:8000')
await app.listen({ port: 8000 });
