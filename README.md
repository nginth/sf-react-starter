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

### Webpack Configuration

Before we get to writing any React, we need to configure webpack to be able to compile our source code. Create a file called `webpack.config.js` in the root directory of the project.

```js
const webpack = require("webpack");

module.exports = {
  entry: ["./src/index.jsx"],

  output: {
    path: __dirname + "/static/dist/",
    filename: "bundle.js"
  },

  resolve: {
    extensions: [".js", ".jsx"]
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        query: {
          presets: ["env", "react", "stage-1"]
        },
        exclude: /node_modules/
      }
    ]
  },
  plugins: []
};
```

This basically just tells webpack where to look for your source code, how to compile it, and where to put the resulting bundle file. You can find a more in-depth explanation [in the official webpack docs.](https://webpack.js.org/guides/getting-started/#using-a-configuration)

### React Component

Now we'll build a react component to actually populate the page.

In the `/src` folder, create a file `index.jsx` with the following code:

```js
// index.js
import React from "react";
import ReactDOM from "react-dom";

ReactDOM.render(
  <h1>Hello, React+Salesforce!</h1>,
  document.getElementById("root")
);
```

This will render a simple hello-world header on your page. Run `webpack`. If there's no errors, and a `bundle.js` file shows up in your `/static/dist/` directory, then you're set! If you want webpack to watch the `/src` directory for any changes, you can run it as such: `webpack -d --watch`.

### Running on Salesforce

Now we'll actually get the app up and running on your Salesforce instance. First, create a Visualforce page on your Salesforce org with the following markup:

```html
<!-- ReactTest.page -->
<apex:page docType="html-5.0" applyHtmlTag="false" applyBodyTag="false"
           showHeader="false" sidebar="false" standardStylesheets="false"
           title="Unused Title">
<html>
    <body>
        <div id="root"></div>
    </body>
    <script type="text/javascript" src="{!URLFOR($Resource.ReactTestResource, 'bundle.js')}"></script>
</html>
</apex:page>
```

This is an empty container page which is equivalent to the html page we created earlier. One thing to point out is the script tag: notice the src property. This is where your React code bundle will be inserted. You could upload the bundle manually every time, or you could easily upload it automatically every time webpack builds.

### Automatically upload bundle.js as a static resource

There's a plugin for webpack called webpack-salesforce-deploy that you can install as such: `npm install --save-dev webpack-salesforce-deploy`.You'll need to add a new file to the root directory of your project:

```js
//jsforce.config.js
module.exports = {
  username: "<salesforce username>",
  password: "<salesforce password>",
  token: <salesforce token>"",
  url: "https://test.salesforce.com"
};
```

Obviously enter your information in the fields. If you haven't had to get your Salesforce Security Token before you can find out how here: https://help.salesforce.com/articleView?id=user_security_token.htm&type=0. Also, make sure to add this file to your .gitignore so that your secret information isn't leaked to the public. You'll also need to make some changes to your webpack.config.js:

```js
//webpack.config.js
const path = require("path");
const WebpackSalesforceDeployPlugin = require("webpack-salesforce-deploy-plugin");
module.exports = {
    ...
    new WebpackSalesforceDeployPlugin({
      jsConfigPath: __dirname + "/jsforce.config.js",
      resourcePath: __dirname + "/static/dist/bundle.js",
      resourceFolderPath: __dirname + "/static/dist/",
      assetName: "ReactTestResource",
      zipOutputPath: __dirname + "/static/"
    })
    ],
    output: {
      path: __dirname + "/static/dist",
      filename: "bundle.js"
    }
    ...
};
```

Here's what the options to the WebpackSalesforceDeployPlugin mean:

* jsConfigPath: the path of your jsforce.config.js file.
* resourcePath: the path where your React bundle.js is built.
* resourceFolderPath: the path to the folder where your React bundle.js is built (not sure why they need both the resourcePath and the folder path)
* assetName: the desired output name of the Static Resource (this is how it will show up in salesforce)
* zipOutputPath: this plugin will save a copy of the static resource it builds so you can upload it manually if you want; this is the folder where it saves it.
  * note: if you're getting errors regarding some folder like "./../../src/staticresources" then it means that the author hasn't accepted my pull request regarding this option yet. To fix this, replace node_modules/webpack-salesforce-deploy-plugin/index.js with this file: https://github.com/nginth/webpack-salesforce-deploy/blob/zip-output-option/index.js
