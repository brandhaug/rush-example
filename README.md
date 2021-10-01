# Rush example
A basic example showing the power and simplicity of Rush.js

# Setup
- Install rush with `npm install -g @microsoft/rush`
- Run `rush update` to install dependencies
- Run `npm run start` in `apps/external-app`
- Go to `https://localhost:8080`

# This is how I created this repo
1. Create a project, and set up the app and libs. Add babel and webpack to the app to be able to run it.

```
rush-example/
├── apps
│   └── external-app
│       ├── babel.config.json
│       ├── package.json
│       ├── src
│       │   ├── App.js
│       │   ├── index.css
│       │   ├── index.html
│       │   └── index.js
│       └── webpack.config.js
└── libs
    ├── js-lib
    │   ├── package.json
    │   └── src
    │       ├── index.js
    │       └── number.js
    ├── ui-lib
    │   ├── package.json
    │   └── src
    │       ├── Button.js
    │       ├── CenteredContainer.js
    │       └── index.js
    └── web-lib
        ├── package.json
        └── src
            ├── AddButton.js
            └── index.js
```

2. Run npm install -g @microsoft/rush and rush init in your project root to initialize Rush. This will create the following files:

```
rush-example/
├── common
│   ├── config
│   │   └── rush
│   │       ├── artifactory.json
│   │       ├── build-cache.json
│   │       ├── command-line.json
│   │       ├── common-versions.json
│   │       ├── experiments.json
│   │       ├── pnpm-lock.yaml
│   │       └── version-policies.json
│   ├── git-hooks
│   │   └── commit-msg.sample
│   └── scripts
│       ├── install-run.js
│       ├── install-run-rush.js
│       └── install-run-rushx.js
└── rush.json
```

All the editable files contain documentation of what they are, what they do, and what they can do. Here’s a summary of the important files:

- `rush.json` is the main config file, where you set Rush and Node version, and add your apps and libs.
- `common/config/rush/pnpm-lock.yaml` controls the version of all the dependencies. It’s automatically generated based on each package.json in your project.
- `common/config.rush/command-line.json` is where you define bulk actions. E.g. run npm run test for all apps and libs is parallell.

3. Add all apps and libs inside projects in rush.json. The packageName should match the name in package.json. I have a @rush-example prefix for all packages, which is necessary to complete the next step. This will also avoid naming conflicts with existing npm packages.

```
rush.json

{
  ...  "projects": [
    {
      "packageName": "@rush-example/external-app",
      "projectFolder": "apps/external-app"
    },
    {
      "packageName": "@rush-example/web-lib",
      "projectFolder": "libs/web-lib"
    },
    {
      "packageName": "@rush-example/ui-lib",
      "projectFolder": "libs/ui-lib"
    },
    {
      "packageName": "@rush-example/js-lib",
      "projectFolder": "libs/js-lib"
    }
  ]  ...
}
```

4. Add the excludeNodeModulesExcept function in your app’s JS parser in webpack.config.js. I could probably have made that function prettier, but hey, it works.

```
apps/external-app/webpack.config.js

const excludeNodeModulesExcept = (modules) => {
  let pathSep = path.sep
  if (pathSep == '\\') {
    // must be quoted for use in a regexp:
    pathSep = '\\\\'
  }
  const moduleRegExps = modules.map((modName) => new RegExp('node_modules' + pathSep + modName))

  return function (modulePath) {
    if (/node_modules/.test(modulePath)) {
      for (var i = 0; i < moduleRegExps.length; i++) {
        if (moduleRegExps[i].test(modulePath)) {
          console.log(modulePath)
          return false
        }
      }
      return true
    }
    return false
  }
}module.exports = {
  ...
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: excludeNodeModulesExcept(['@rush-example']),
        use: ['babel-loader']
      },
      ...
     ]
  }
...
}
```

5. Set "main": "src/index.js" in package.json for all your apps and libs. Export all your functions and components in index.js

```
libs/ui-lib/src/index.js

export * from './Button'
export * from './CenteredContainer'
```

6. Add dependencies to package.json by using rush add -p <package_name> inside an app or lib folder.

```
apps/external-app/package.json

{
  "name": "@rush-example/external-app",
  "version": "1.0.0",
  "description": "",
  "scripts": {
    "start": "webpack serve"
  },
  "author": "",
  "license": "ISC",
  "main": "src/index.js",
  "dependencies": {
    "react": "~17.0.2",
    "react-dom": "~17.0.2",
    "@rush-example/web-lib": "~1.0.0",
    "@rush-example/ui-lib": "~1.0.0",
    "@rush-example/js-lib": "~1.0.0"
  },
  "devDependencies": {
    "webpack": "~5.51.1",
    "webpack-cli": "~4.8.0",
    "webpack-dev-server": "~4.1.0",
    "path": "~0.12.7",
    "html-webpack-plugin": "~5.3.2",
    "@babel/core": "~7.15.0",
    "@babel/preset-env": "~7.15.0",
    "@babel/preset-react": "~7.14.5",
    "@babel/node": "~7.14.9",
    "babel-loader": "~8.2.2",
    "css-loader": "~6.2.0",
    "style-loader": "~3.2.1",
    "file-loader": "~6.2.0"
  }
}
```

That’s it! You can now run rush update to install dependencies in all your libs and apps. After that, you can run webpack serve in your app with imported functions and components from your libraries.

```
apps/external-app/src/App.js

import * as React from 'react'

import { AddButton } from '@rush-example/web-lib'
import { CenteredContainer } from '@rush-example/ui-lib'

export const App = () => {
  return (
    <CenteredContainer>
      <h1>Hello world</h1>
      <AddButton a={2} b={3} />
    </CenteredContainer>
  )
}
```

This also means that when you’re updating your libraries, the changes will automatically be rendered in the app! Wow!
