Base Mechanics are working, and the terrain is being generated on the server side.

The terrain object is being generated when the first client log in the server and the same object is emitted to all subsequent clients that log in subsequently.

---***---

The terrain is being recieved by the subsequent players and it is the same.

Different user can be logged at the same time and can see each other. Still needing to implement the sync of orbs among players.

---***---

Following the same sync idea behind the terrain but more frequently. Players also need to send another piece of data to signalise who they killed. But perhaps that would be more securelly handled by the server.

---***---

The orb is in sync among players, they can see the same one and interact with it. Still working on all players recieving the orb_taken signal. Based on security i decided to check the orb-take-age (?) on the server side. The players will just need to listen for the signal and present the animations by themselves.

---***---

Orb-take-age (I kinda like that expression, actually) is all done and all balls are properly notified when another player takes an orb. The hunter ball is passed to everybody and the next step is implementing the hunter ball killing the other player. signal sending will follow the same logic as for the taking of the orb, just with some extra steps.

On another hand, I need to start working on the initial interface for the player to put in his ball name and player queue limited (maybe 10-15 players ? I need to stress test it, probably will make the balls smaller and the terrain bigger, though).

---***---

The players are now able to kill each other after getting the orb. Still need to make more tests to make the process more reliable. A killed player already is disconnected from the room automacally and can be placed in anyother iteration loop.

Currently working on the initial user interface so the player can put the name of the ball to play with and the death screen.

---***---

The first working build is done. Tested everything woth Ronnie really quick and there are still A LOT of things to fix like boost timing, jitter handling, respawning upon death, resolution and canvas size. BUT it does work ! Uhuuul. I'm really proud of myself, to be honest. I always thought about how these online games worked and now I feel I got really close to understanding it :))))

---***---

Background animation is done and achieved by using only one SVG file animated with CSS. Quite convenient and lightweight in terms of performance. The initial screen works like a charm. Still need to make the death screen and implement the respawning logic.

All the structure for the music is in place. Only need to produce it on the PO-33 and put in the proper folder.
