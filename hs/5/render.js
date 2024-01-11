export function layout(title, content) {
  return `
  <html>
  <head>
    <title>${title}</title>
    <style>
      body {
        padding: 80px;
        font: 16px Helvetica, Arial;
      }
      h1 {
        font-size: 2em;
      }
      h2 {
        font-size: 1.2em;
      }
      #posts {
        margin: 0;
        padding: 0;
      }
      #posts li {
        margin: 40px 0;
        padding: 0;
        padding-bottom: 20px;
        border-bottom: 1px solid #eee;
        list-style: none;
      }
      #posts li:last-child {
        border-bottom: none;
      }
      textarea {
        width: 500px;
      }
      input[type=text],
      textarea {
        border: 1px solid #eee;
        border-top-color: #ddd;
        border-left-color: #ddd;
        border-radius: 2px;
        padding: 15px;
        font-size: .8em;
      }
      input[type=text] {
        width: 500px;
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
export function list(posts) {
  let list = [];
  for (let post of posts) {
    list.push(`
    <li>
      <h2>${post.title}</h2>
      <p><a href="/post/${post.id}">查看電話</a></p>
    </li>
    `);
  }
  let content = `
  <h1>聯絡人</h1>
  <p>你有 <strong>${posts.length}</strong> 通訊聯絡人!</p>
  <p><a href="/post/new">創建聯絡人</a></p>
  <p><a href="/search/search">查找聯絡人</a></p>
  `;
  /*
  const nameToFind = "范逸俊";
  const regex = new RegExp(`<h2>${nameToFind}</h2>`);

  const filteredList = list.filter(item => regex.test(item));*/
  content += `
  <ul id="posts">
    ${list.join("\n")}
  </ul>
  `;
  return layout("Posts", content);
}
export function newPost() {
  return layout(
    "New Post",
    `
  <h1>新聯絡人</h1>
  <p>創建新聯絡人</p>
  <form action="/post" method="post">
    <p><input type="text" placeholder="姓名" name="title"></p>
    <p><textarea placeholder="電話" name="body"></textarea></p>
    <p><input type="submit" value="新增"></p>
  </form>
  `,
  );
}
export function search() {
  return layout(
    "New Post",
    `
  <h1>查找聯絡人</h1>
  <form action="/search" method="post">
    <p><input type="text" placeholder="要查找的姓名" name="name"></p>
    <p><input type="submit" value="查詢"></p>
  </form>
  `,
  );
}
export function found(name,number) {
  return layout(
    "New Post",
    `
  <h1>查找聯絡人</h1>
  <form action="/search" method="post">
    <p><input type="text" placeholder="要查找的姓名" name="name"></p>
    <p><input type="submit" value="查詢"></p>
  </form>
  <h1>名字：${name}</h1>
  <p>電話：${number}</p>
  `,
  );
}
export function not_found() {
  return layout(
    "New Post",
    `
  <h1>查找聯絡人</h1>
  <form action="/search" method="post">
    <p><input type="text" placeholder="要查找的姓名" name="name"></p>
    <p><input type="submit" value="查詢"></p>
  </form>
  <h1>未找到</h1>
  `,
  );
}
export function show(post) {
  return layout(
    post.title,
    `
    <h1>${post.title}</h1>
    <pre>${post.body}</pre>
  `,
  );
}
