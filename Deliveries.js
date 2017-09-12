const request = require('request')
const haversine = require('haversine')

// assign drones to packages for delivery
const getDeliveryAssignments = async function() {
try {
  let availableDrones = await getDroneList()

  let unassignedPackages = await getPackageList()
  let assignments = [] // list of packages assigned to drones

  //iterate through drone list and assign to appropriate package
  //until there are no more drones or packages
  let packageIndex = availableDrones.length - 1
  while (availableDrones.length - 1 >= 0) {
    //find the drone with the shortest delivery time
    let assignedDrone = assignDronetoPackage(availableDrones, unassignedPackages[packageIndex])

    //add new assignment to list of assignments
    assignments.push({
      droneId: assignedDrone.droneId,
      packageId: unassignedPackages[packageIndex].packageId,
      deadline: unassignedPackages[packageIndex].deadline
    })
    //remove assinged drone and package from list
    availableDrones.splice(assignedDrone.index, 1)
    unassignedPackages.pop()

    packageIndex --;
    // if there are no more packages exit the loop
    if (!unassignedPackages.length > 0) {break}
  }

  let unassignedPackageIds = unassignedPackages.map((item) => {
    return item.packageId
  })

  let results = {
    assignments: assignments,
    unassignedPackageIds: unassignedPackageIds
  }

  return results

} catch(error) {
  console.log(error)
}
}

//assign drone with shortest delivery time to the package
function assignDronetoPackage(drones, item) {
  let assignedDrone = new Object()
  let shortestDeliveryTime = null

  for (let i = 0; i < drones.length; i++) {
    let newDeliveryTime = getDeliveryTime(drones[i], item)
    if (shortestDeliveryTime) {

      if (newDeliveryTime < shortestDeliveryTime) {
        shortestDeliveryTime = newDeliveryTime
        assignedDrone.droneId = drones[i].droneId
        assignedDrone.index = i
      }

     } else  {
      //at the begininging of the list
      shortestDeliveryTime = newDeliveryTime
      assignedDrone.droneId = drones[i].droneId
      assignedDrone.index = i
    }
  }
  return assignedDrone

}

//calculates total delivery time between drone and package that needs to be delivered
function getDeliveryTime(drone, delivery) {
  // location of depo: 303 Collins Street, Melbourne, VIC 3000
  const depo =  {latitude: -37.8176789, longitude: 144.95796380000002}
  const droneSpeed = 50 //50 km/hr

  const depoToDestination = haversine(depo, delivery.destination)
  let distanceBackToDepo;

  //if drone already has package it needs to deliver that first then
  //go back to depo to grab and deliver package
  if (drone.package) {
      //distance needed to travel for delivery of current package in posession
      let currentDeliveryDistance = haversine(drone.location, drone.packages.destination)
      distanceBackToDepo = haversine(drone.packages.destination, depo)

      return (currentDeliveryDistance + distanceBackToDepo + depoToDestination) / droneSpeed
  } else {
      distanceBackToDepo = haversine(drone.location, depo)
      return (distanceBackToDepo + depoToDestination) / droneSpeed
  }
}

//GET list of drones from API
function getDroneList() {
  return new Promise((resolve, reject) => {
    request('https://codetest.kube.getswift.co/drones', function (error, response, body) {
      if (body)
        resolve(JSON.parse(body));
      else
        reject(error);
    });
  })
}

//GET list of packages from API sorted by deadline
function getPackageList() {
  return new Promise((resolve, reject) => {
    request('https://codetest.kube.getswift.co/packages', function (error, response, body) {
      if (body) {
        let packages = JSON.parse(body)
        //sort packages according to delivery time
        //latest delivery to soonest delivery
        packages.sort((package1, package2) => {
          return package2.deadline - package1.deadline
        })
        resolve(packages);
      } else {
        reject(error);
      }

    });
  })
}

module.exports = {
  getDeliveryAssignments: getDeliveryAssignments
}
