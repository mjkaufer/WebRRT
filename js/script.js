let two = undefined

const padding = 50

function init() {
	let rrtContainer = document.getElementById('rrt')
	rrtContainer.innerHTML == ''
	let boundingRect = rrtContainer.getBoundingClientRect()

	let twoParams = {
		width: boundingRect.width,
		height: boundingRect.height,
	}

	two = new Two(twoParams).appendTo(rrtContainer)

	let startNode = new Node(padding, padding)
	let endNode = new Node(twoParams.width - padding, twoParams.height - padding)
	// let endNode = new Node(padding * 10, padding * 5)

	rrt = new RRT(two, startNode, endNode)
	// rrt.addObstacle(new Obstacle(two,
	// 	new Node(twoParams.width / 2 - padding,
	// 		twoParams.height / 2 - padding), padding * 2, padding * 3))
	rrt.addObstacle(new Obstacle(two,
		new Node(twoParams.width / 12,
			twoParams.height / 3), padding, padding * 3))
	rrt.addObstacle(new Obstacle(two,
		new Node(twoParams.width / 2 - padding,
			twoParams.height / 2 - padding), padding * 2, padding * 3))
	rrt.addObstacle(new Obstacle(two,
		new Node(twoParams.width * 2 / 3 - padding,
			twoParams.height / 3), padding * 2, padding * 1.5))
	// rrt.startSearching()
}

init()
// window.onresize = init