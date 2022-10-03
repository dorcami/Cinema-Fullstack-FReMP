<h1># Cinema-Fullstack-FReMP</h1>
A python (flask), react and mongodb web application for managing a streaming service

<a href="https://youtu.be/yWvn0nYYXl4">For a 1-minute demo press here</a>

The web app consists out of a React client (with bootstrap as the decorative framework) that sends requests to a flask made python main server.
The main server uses several data sources, in the form of a MongoDB database and json files, and sends requests to a secondary server made using flask.
The secondary server uses two external web services for creating the initial movies and members databases, stores them in equivalent MongoDB databases and sends the required data to the main server when needed.
Both servers are using a Router -> Business Layer (logic) -> Data Access Layer architechture for accessing and manipulating any data in every data source.

For authentication, jwt token are used, with user custom session times.
The data is protected both in the servers and in the client - 
For the server, the data is protected using jwt and users permissions.
for the client, the external functionality is permission based (You see what you're authorized to see), and you are allowed to visit endpoints that you are authorized for (permission based also).

The app is responsive for all screens sizes.


Architechture scheme:

<img src="https://github.com/dorcami/Cinema-Fullstack-FReMP/blob/rawfiles/Screen%20Shot%202022-10-03%20at%2019.43.45.png" width="1200px"/>

