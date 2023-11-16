# WealthOS Server

# Getting Started

## Running Locally
- Install Node version 21 using `nvm use 21`
- Intall firebase command line tools globally `npm install -g firebase-tools`
- You will also need a Java SDK to run the firebase-tools, so make sure it is installed on your machine
  - Use `brew install java`. 
  - You may need to symlink it, watch for the install commands, after installing with brew it should be:
`sudo ln -sfn /opt/homebrew/opt/openjdk/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk.jdk`
  - Then verify it works with `java --version` afterwards
- Go into functions directory `cd functions`
- Intall npm modules `npm install`
- Run the firebase emulators `npm run dev`, you will need to authenticate to the firebase console initiallty. Once that is done you can run the `npm run dev` command again to view emulators.
- Firestore, Functions and Auth emulators will be live at `http://localhost:4000/`
- You can make API calls to the endpoint at `http://localhost:5001/wealthos/us-central1/app` 

## Technical Overview (Server)
- The application architecture is written using NodeJS with ExpressJS and Firebase Cloud Firestore as the database provider
- The application uses Firebase Auth for user authentication
- The application runs using serverless architecture with Firebase Cloud Functions