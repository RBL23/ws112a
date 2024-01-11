import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import * as render from './Renders.js';

const users = [];
const router = new Router();

router
  .get('/', home)
  .get('/signup', showSignUpForm)
  .post('/signup', signUp)
  .get('/signin', showSignInForm)
  .post('/signin', signIn);

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

async function home(ctx) {
  ctx.response.body = render.home();
}

async function showSignUpForm(ctx) {
  ctx.response.body = render.signUpForm();
}

async function signUp(ctx) {
  const body = ctx.request.body();
  if (body.type === "form") {
    const pairs = await body.value;
    const user = {};
    for (const [key, value] of pairs) {
      user[key] = value;
    }

    const isUsernameTaken = users.some(existingUser => existingUser.name === user.name);

    if (isUsernameTaken) {
      ctx.response.body = render.signUpFailure();
    } else {
      // If the username is available, add the user to the array and display success message
      users.push(user);
      ctx.response.body = render.signUpSuccess();

      // After successful sign-up, redirect to the sign-in page
      ctx.response.redirect('/signin');
    }
  }
}

async function showSignInForm(ctx) {
  ctx.response.body = render.signInForm();
}

async function signIn(ctx) {
  const body = ctx.request.body();
  if (body.type === "form") {
    const pairs = await body.value;
    const inputUser = {};
    for (const [key, value] of pairs) {
      inputUser[key] = value;
    }

    const user = users.find(u => u.name === inputUser.name);
    if (user && user.password === inputUser.password) {
      ctx.response.body = render.signInSuccess();
    } else {
      ctx.response.body = render.signInFailure();
    }
  }
}
console.log('Server is running at http://127.0.0.1:8000');
await app.listen({ port: 8000 });
