Base Mechanics are working, and the terrain is being generated on the server side.

The terrain object is being generated when the first client log in the server and the same object is emitted to all subsequent clients that log in subsequently.

The problem now is recieving the terrain before draw() starts.

Still studying promisses and asynchronous JS to take care of this. I guess that's how I can solve it.
