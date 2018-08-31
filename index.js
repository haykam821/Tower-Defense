const can = document.getElementById("main");
const ctx = can.getContext("2d");

can.width = window.innerWidth;
can.height = window.innerHeight;

const w = can.width;
const h = can.height;

let entities = [];

function drawRect(context, x = 0, y = 0, width = 20, height = 20, color = "black") {
	context.fillStyle = color;
  context.fillRect(x - width / 2, y - height / 2, width, height);
}

class Entity {
	constructor(x = 0, y = 0, maxHealth = 5) {
  	this.x = x;
    this.y = y;
    
    this.health = maxHealth;
    this.maxHealth = maxHealth;
    
    this.id = randInt(0, 9999);
  }
  
  render(context) {
  	drawRect(context, this.x, this.y);
  }
}

class Beam extends Entity {
	constructor(x, y, endX = w, endY = h) {
  	super(x, y);
		this.endX = endX;
    this.endY = endY;
  }
  
  render(context) {
  	context.strokeStyle = "red";
    context.beginPath();
    context.moveTo(this.x, this.y);
    context.lineTo(this.endX, this.endY);
    context.stroke();
  }
}

class RenderBeam extends Beam {
	constructor() {
  	super(...arguments);
    setTimeout(() => {
    	entities = entities.filter(item => item.id !== this.id);
    });
  }
}

// debug
class Tracer extends Entity {
	constructor() {
  	super(...arguments);
  }
  
  render(context) {
  	drawRect(context, this.x, this.y);
    
  	context.fillStyle = "black";
  	context.fillText(entities.length, 50, 50);
    entities.forEach(entity => {
    	if (!(entity instanceof Beam)) {
      	entities.push(new RenderBeam(this.x, this.y, entity.x, entity.y));
      }
    });
  }
}

class Tower extends Entity {
	constructor() {
  	super(...arguments);
  }
  
  render(context) {
  	drawRect(context, this.x, this.y, 25, 25, "brown");
  	drawRect(context, this.x, this.y, 20, 20, "gold");
  }
}

entities.push(new Tracer(...randPos()));
entities.push(new Tower(...randPos()));

function randInt(min = 0, max = 1) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randPos() {
	return [
  	randInt(0, w),
    randInt(0, h),
  ];
}

function render() {
	ctx.fillStyle = "limegreen";
  
  entities.forEach(entity => entity.render(ctx));

	window.requestAnimationFrame(render);
}
render();
