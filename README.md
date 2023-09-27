# pktwallet-console

An experimental browser based UI for interacting with the pktwallet JSON-RPC server.

![Screenshot](https://github.com/PKT-Watch/pktwallet-console/blob/main/assets/pktwallet-console-screenshot.png)

# Requirements

- [pktd](https://github.com/pkt-cash/pktd) - the PKT Cash full node software which also includes pktwallet.
- [node js](https://nodejs.org/en) - version 18 or greater.

# Getting started

1. Start up pktwallet, providing an RPC username and password
   
   ```./bin/pktwallet --rpcuser=USER --rpcpass=PASSWORD --noservertls```

2. Clone this repository and navigate to the `node-rest-api` directory.
3. Open `app.js` in an editor and update the `rpcUser` and `rpcPass` constants to match the values used in step 1.
4. Build the application

   ```npm install```
   
5. Start up the API
   
   ```node app.js```

6. Open `index.html` in your web browser.

# How to use

1. Select a command from the list to view the documentation. The documentation specifies any required parameters and their type.
2. Use the `Parameters` panel to add any paraeters.
3. Press the `Execute Command` button to issue the command to pktwallet.
    
