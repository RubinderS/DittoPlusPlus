<img src="src/resources/clipboard-svgrepo-com.png"
     alt="Markdown Monster icon"
     style="width: 50px; height:50px" />

# Ditto++

Ditto++

## How to run

### Live reloading of just the renderer(front-end) part

when any file in the renderer process is changed, the renderer process reload that change

- Run `npm run build:remote:renderer` to start the live server
- After the server is started run `npm start`

### Live reloading of the whole application

when any file is changed including the main process and renderer process, the whole application will be compiled and started again

- Run `npm run build:remote:main`

### Build in dev and prod modes

- Run `npm run build:dev` and `npm run build:prod` to build in dev and prod modes respectively
- Run `npm start` to run the application

## Package

- Run`npm run pkd:win` and `npm run pkg:mac` to build package for respective platforms
