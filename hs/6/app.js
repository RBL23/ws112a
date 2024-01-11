import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import * as render from './Renders.js';
import { oakSession } from "https://deno.land/x/session/mod.ts";

const users = [];
const router = new Router();

const session = new oakSession({
  framework: "oak",
});

router
  .get('/', home)
  .get('/signup', showSignUpForm)
  .post('/signup', signUp)
  .get('/signin', showSignInForm)
  .post('/signin', signIn);

const app = new Application();
app.use(session.use()(session));
app.use(router.routes());
app.use(router.allowedMethods());

async function home(ctx) {
  // Check if user is logged in using session data
  const user = ctx.state.session.get("user");
  if (user) {
    ctx.response.body = render.home(user.name);
  } else {
    ctx.response.body = render.home();
  }
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
      // If the username is available, add the user to the array and store in session
      users.push(user);
      ctx.state.session.set("user", user);
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
      ctx.state.session.set("user", user);
      ctx.response.body = render.signInSuccess();
    } else {
      ctx.response.body = render.signInFailure();
    }
  }
}
console.log('Server is running at http://127.0.0.1:8000');
await app.listen({ port: 8000 });
