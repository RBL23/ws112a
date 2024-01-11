export function layout(title, content) {
  return `
    <html>
    <head>
      <title>${title}</title>
      <style>
        body {
            padding: 40px 400px;
            font: 16px 'Helvetica Neue', sans-serif;
            text-align: center;
            background: #E6E6F2;
        }
        
        h1 {
            font-size: 2.5em;
            color: #333;
        }
        
        p {
            font-size: 1.2em;
            color: #555;
        }
        
        input[type=text] {
            width: 300px;
            padding: 10px;
            font-size: 1em;
            margin-bottom: 10px;
            box-sizing: border-box;
        }
        
        input[type=submit] {
            background-color: #3498db;
            color: #fff;
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 1em;
        }
        
        input[type=submit]:hover {
            background-color: #2980b9;
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

export function homePage() {
  return layout('Weather App', `
    <h1>Welcome to the Weather App!</h1>
    <p>Get the current weather by entering a city below:</p>
    <form action="/weather" method="get">
      <p><input type="text" placeholder="Enter City" name="city"></p>
      <p><input type="submit" value="Get Weather"></p>
    </form>
  `);
}

export function weatherResult(weatherInfo) {
  return layout('Weather Result', `
    <h1>Weather Information</h1>
    <p>${weatherInfo}</p>
    <p><a href="/">Back to Home</a></p>
  `);
}
