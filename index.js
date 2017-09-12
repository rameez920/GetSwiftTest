const express = require('express')
const deliveries = require('./Deliveries')
const app = express()

app.get('/deliveries', function (req, res) {
  deliveries.getDeliveryAssignments().then((assignments) => {
    res.status(200).json(assignments)
  }).catch((error) => {
    res.status(404).json(error)
  })
})

const PORT = process.env.port || 3000

app.listen(PORT, function () {
  console.log('server running at http://localhost:3000')
})
