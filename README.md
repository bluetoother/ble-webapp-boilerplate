quick-demo-boilerplate
=================

## Getting Started

```shell
$ git clone https://github.com/PeterEB/quick-demo-boilerplate.git
$ cd quick-demo-boilerplate
/quick-demo-boilerplate $ npm install
/quick-demo-boilerplate $ npm start
```

## Directory Layout

```shell
.
├── /app/                            # Core framework
│   ├── /components/                 # Generic UI components
│   │   ├── /CardBlock/              # CardBlock component
│   │   ├── /NavBar/                 # NavBar component
│   │   └── /Card/                   # Card component
│   │       ├── /Card.js             # Export all of the Card components
│   │       ├── /Buzzer.js           # Buzzer Card component
│   │       ├── /Flame.js            # Flame Card component
│   │       └── /...                 # etc.
│   ├── /helpers/                    # Helper classes
│   ├── /redux/                      # Application state manager (Redux)
│   │       ├── /modules/            # Ducks
│   │       ├── /clientMiddleware.js # Middleware for async action
│   │       └── /reducer.js          # Combine reducers and middleware
│   ├── /static/                     # Static files such as favicon.ico etc.
│   ├── /styles/                     # CSS styles
│   ├── /client.js                   # React application entry point
│   ├── /index.tpl.html              # Webpack HtmlWebpackPlugin template
│   └── /server.js                   # Server side application
├── /node_modules/                   # 3rd-party libraries and utilities
├── main.js                          # Express server
├── package.json                     # The list of project dependencies and NPM scripts
├── webpack.config.js                # Webpack bundling and optimization settings for `npm start`
└── webpack.production.config.js     # Webpack bundling and optimization settings for `npm build`
```
