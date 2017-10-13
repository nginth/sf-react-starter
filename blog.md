# How to set up a React environment for use in Salesforce

### Installation
Create a new folder with a name such ass `sf-react-project`. This will be the root folder for the project.

Next, run the following commands to install all the required dependencies for developing with React.

`npm init`
Creates a package.json for your project - describes all your dependencies, etc.

`npm install --save react react-dom react-router-dom express`
This installs React and Express and saves it as a dependency for anyone who wants to build your project later.

`npm install --save-dev webpack babel babel-core babel-loader babel-preset-react babel-preset-env babel-preset-stage-1`
This installs the development dependencies. Webpack is the build tool that calls babel (the JS compiler) and packs all of the JavaScript into one file called `bundle.js`. The babel presets are basically what tells babel how to compile your React JSX and ES6 code into JavaScript that the browser can understand.

### Project structure
Create 2 folders in the root folder you've been working in: `src` and `static`.

Next, create another folder inside `/static` called `dist`. You don't need to create anything in here manually, this is just where webpack will put the `bundle.js` file.

#### HTML Root
Inside `/static`, create a file called `index.html` containing this markup:
```html
<html>
<body>
    <div id="root"></div>
</body>
</html>
```
The `div` with id `root` will be what React hooks onto and renders your application in.

#### React Component
Now we'll build a react component to actually populate the page.

In the `/src` folder, create a file `index.jsx` with the following code:
```js
import React from 'react'
import ReactDOM from 'react-dom'

ReactDOM.render(
    <h1>Hello, React-Salesforce!</h1>,
    document.getElementById('root')
)
```
This will render a simple hello-world header on your page.


