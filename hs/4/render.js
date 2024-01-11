export function home() {
  return layout("Home", "<h1>Welcome to the Home Page</h1>");
}

export function signUpForm() {
  return layout(
    "Sign Up",
    `
      <h1>Sign Up</h1>
      <form action="/signup" method="post">
        <p><input type="text" placeholder="Username" name="name"></p>
        <p><input type="password" placeholder="Password" name="password"></p>
        <p><input type="submit" value="Sign Up"></p>
      </form>
    `
  );
}

export function signUpSuccess() {
  return layout("Sign Up Success", "<h1>Sign Up Successful!</h1>");
}

export function signUpFailure() {
  return layout("Sign Up Failure", "<h1>Username is already taken. Please choose another.</h1>");
}

export function signInForm() {
  return layout(
    "Sign In",
    `
      <h1>Sign In</h1>
      <form action="/signin" method="post">
        <p><input type="text" placeholder="Username" name="name"></p>
        <p><input type="password" placeholder="Password" name="password"></p>
        <p><input type="submit" value="Sign In"></p>
      </form>
    `
  );
}

export function signInSuccess() {
  return layout("Sign In Success", "<h1>Sign In Successful!</h1>");
}

export function signInFailure() {
  return layout("Sign In Failure", "<h1>Invalid username or password. Please try again.</h1>");
}

function layout(title, content) {
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
