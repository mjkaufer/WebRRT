# WebRRT
This is a web-based visualization of the rapidly-exploring random tree algorithm (RRT)

## How does it work?
RRT generates a tree of valid movements, as its name suggests. Random points in space are picked, the closest node to said point is found, and if the points don't have a collision, they are connected! (Unless the points are too far away, in which case the point in the tree connects to a projection of the random point). 9/10 times when randomly sampling, the goal destination is picked; this lets us try and connect our current tree to the goal.

After we find the path to the goal, it's time to smooth it out. Random nodes are compared and if a line can be drawn between these nodes without any collisions, any nodes beteen these nodes are removed.

## TODO
* Have an animated robot follow the path
	* If an animated robot is following path, let it function as a dynamic starting point
		* If a obstacle is placed, the robot recalculates its RRT and adjusts accordingly
* Prevent obstacles from being drawn around start & end points
* Add support for moving the start & end points
	* Prevent start & end points from being placed inside obstacles
