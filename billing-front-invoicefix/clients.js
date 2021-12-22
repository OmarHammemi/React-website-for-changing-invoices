const express = require('express');
const cors = require('cors')
const app = express();

app.use(cors());

app.use('/clients', (req, res) => {
  res.send({
    "Clients":[
      {
        "id":0,
        "name":"Jeff"
      },
      {
        "id":1,
        "name":"Joe"
      },
      {
        "id":2,
        "name":"John"
      },
      {
        "id":3,
        "name":"Billy"
      },
      {
        "id":4,
        "name":"Horace"
      },
      {
        "id":5,
        "name":"Greg"
      }
    ]
  });
});

app.listen(8081, () => console.log('API is running on http://localhost:8081/clients'));
