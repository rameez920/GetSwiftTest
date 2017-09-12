# GetSwiftTest
Code test for GetSwift job application


## How do I run this on my machine?
```bash
  npm install
  node index.js
```

## To get delivery assignments go to 
```bash
  localhost:3000/deliveries
```

## Assessment

 To create my solution I used Node.js and Express to create a webserver 
that hosts an API endpoint where the client can recieve data about the 
delivery assignments. The application first makes ajax calls to the GetSwift
API to get data on drones and packages and then assigns each drone to the 
appropriate package. After a successful API call the client then recives a
JSON response with the approproate data. 
 
 In a production environment the envision my solutution being deployed onto a cloud
 hosting service such as AWS or Heroku as either it's own API or part of a larger one.
 Clients can then recieve data on deliveries by using a mobile app or a desktop web app
 which consumes this API. 
 
 One drawback to this solution is that everytime a client makes a request to the server 
 the script that assigns drones to packages get executed each time. I can imagine this being
 costly and slow in a situation with thousands of jobs and thousands of requests. To avoid this 
 issue another approach could be after assigning drones to packages to deliver, the data is then stored
 in a database. The API then just performs a query to the database to recieve delivery data for the user. 
 
