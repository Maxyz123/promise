# Promise Intelligent Web Project News Center

Group Name: Promise
Group Members: Ze Yu, Lijia Liu, Kaihang Zhu


### Setup

```
git clone https://github.com/Maxyz123/promise


package.json:
	"dependencies": {
	    "cookie-parser": "~1.4.4",
	    "debug": "~2.6.9",
	    "ejs": "~2.6.1",
	    "express": "~4.16.1",
	    "http-errors": "~1.6.3",
	    "mongoose": "^6.2.8",
	    "morgan": "~1.9.1",
	    "socket.io": "^3.1.1",
	    "idb": "5.0.8",
	    "fs-extra": "~5.0.0",
	    "serve-favicon": "~2.4.5",
	    "serve-static": "^1.13.2",
	    "swagger-ui-express": "^4.3.0"
  }
```

### Before start

Install Mongodb version 4.0.28.

https://www.mongodb.com/try/download/community


### Start the project

Make sure you have installed mongodb and already have it run.
```
mongod
```

### Data Resource
Images are stored in "Assignment starting point/public/images", fill in the Image (URL) to upload a news report.

Images URL:
	1. cathedral.jpg URL: "./images/cathedral.jpg"
	2. test.png URL: "./images/test.png"

### Description

Our project is base on express Node.js, using mongodb as database, connecting with mongoose.

## Features
1.	Standard main page to show all news reports dynamically in MongoDB database.
2.	Users can submit new reports to the back-end data resource service in new report page.
3.	By selecting news titles or pictures, people can pass the image URL to index and create a new Chatting Room.
4.	Using Socket to implement communication between rooms in same ID and sync the pictures, annotations and chatting messages.
5.	People can chat, post pictures, make notes and annotations, and search information using knowledge graph in the Chat room.
6.	Using Knowledge Graph to let users search for different type of information online.
7. 	Using IndexedDB to record users history and enable them to view the history when they connect to the same room again.
8.	Using service workers to implement offline service.
9.	Canvas set in chatting rooms so that users can draw annotations and the socket.io will share the annotation between rooms in the same Room Number.
10. 	Using Swagger to record project structure and features document.
