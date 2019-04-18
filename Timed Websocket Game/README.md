Base Mechanics are working, and the terrain is being generated on the server side.

The terrain object is being generated when the first client log in the server and the same object is emitted to all subsequent clients that log in subsequently.

The terrain is being recieved by the subsequent players and it is the same.

Different user can be logged at the same time and can see each other. Still needing to implement the sync of orbs among players.

Following the same sync idea behind the terrain but more frequently. Players also need to send another piece of data to signalise who they killed. But perhaps that would be more securelly handled by the server.
