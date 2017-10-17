# How to set up a React environment for use in Salesforce

### Installation
Create a new folder with a name such as `sf-react-project`. This will be the root folder for the project.

Next, run the following commands to install all the required dependencies for developing with React.

```bash
npm init
```
Creates a package.json for your project - describes all your dependencies, etc.

```bash
npm install --save react react-dom react-router-dom express
```
This installs React and Express and saves it as a dependency for anyone who wants to build your project later.

```bash
npm install --save-dev webpack babel babel-core babel-loader babel-preset-react babel-preset-env babel-preset-stage-1
```
This installs the development dependencies. Webpack is the build tool that calls babel (the JS compiler) and packs all of the JavaScript into one file called `bundle.js`. The babel presets are basically what tells babel how to compile your React JSX and ES6 code into JavaScript that the browser can understand.

### Project structure
Create 2 folders in the root folder you've been working in: `src` and `static`.

Next, create another folder inside `/static` called `dist`. You don't need to create anything in here manually, this is just where webpack will put the `bundle.js` file.

### Base HTML Page
Inside `/static`, create a file called `index.html` containing this markup:
```html
<html>
<body>
    <div id="root"></div>
</body>
<script type="text/javascript" src="/static/dist/bundle.js"></script>
</html>
```
The `div` with id `root` will be what React hooks onto and renders your application in. 

### Webpack Configuration

Before we get to writing any React, we need to configure webpack to be able to compile our source code. Create a file called `webpack.config.js` in the root directory of the project. 
```js
const webpack = require("webpack");

module.exports = {
	entry: ["./src/index.jsx"],

	output: {
		path: __dirname + "/static/dist/",
		filename: "bundle.js",
	},

	resolve: {
		extensions: [".js", ".jsx"],
	},

	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				loader: "babel-loader",
				query: {
					presets: ["env", "react", "stage-1"],
				},
				exclude: /node_modules/,
			},
		],
	},
	plugins: [],
};
```

This basically just tells webpack where to look for your source code, how to compile it, and where to put the resulting bundle file. You can find a more in-depth explanation [in the official webpack docs.](https://webpack.js.org/guides/getting-started/#using-a-configuration)

### React Component
Now we'll build a react component to actually populate the page.

In the `/src` folder, create a file `index.jsx` with the following code:
```js
import React from 'react'
import ReactDOM from 'react-dom'

ReactDOM.render(
    <h1>Hello, React+Salesforce!</h1>,
    document.getElementById('root')
)
```
This will render a simple hello-world header on your page. Run `webpack`. If there's no errors, and a `bundle.js` file shows up in your `/static/dist/` directory, then you're set! If you want webpack to watch the `/src` directory for any changes, you can run it as such: `webpack -d --watch`.

### Set up Express server
Now, we need a way to actually serve this static bundle.js file. For development purposes we'll use Express to serve it. To do this, create a file called `app.js` in the project's root directory:
```js
const path = require('path')
const express = require('express')
const app = express()

app.use('/static', express.static('static'))
app.get('*', function(req, res) {
    res.sendFile(__dirname + '/static/index.html')
})

app.listen(8080);
```
Just run this file with node like so:
`node app.js`
and the server should be running.

### Running on Salesforce
Now we'll actually get the app up and running on your Salesforce instance. First, create a Visualforce page on your Salesforce org with the following markup:
```html
<apex:page docType="html-5.0" applyHtmlTag="false" applyBodyTag="false"
           showHeader="false" sidebar="false" standardStylesheets="false"
           title="Unused Title">
<html>
    <body>
        <div id="root"></div>
    </body>
    <script type="text/javascript" src="<localtunnel>"></script>
</html>
</apex:page>
```
This is an empty container page which is equivalent to the html page we created earlier. One thing to point out is the script tag. Notice the src property. You'll replace <localtunnel> with a url you get in the next section.

### Creating a localtunnel to your bundle.js
Install localtunnel:
`npm install -g localtunnel`
This is a convienient tunnel from your machine to the internet. Next, run:
`lt --port 8080`
This will expose your app running locally to the internet. It should output a url. Go to this url in the browser and confirm that your React app is running. If you see the same page as when you go to `localhost:8080`, then you're set! Use `<your url>/static/dist/bundle.js` in place of `<localtunnel>`. 

Now, any time you update your React project, the changes will show up on your Visualforce page! This is very convienient for rapid development. Once you're ready for production, you can deploy your `bundle.js` to Salesforce as a static resource and use it directly from there. This will take advantage of Salesforce's static resource caching and such.


