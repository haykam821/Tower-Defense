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

function removeById(id) {
	entities = entities.filter(entity => id !== entity.id);
}

class Entity {
	constructor(x = 0, y = 0, maxHealth = 5) {
  	this.x = x;
    this.y = y;
    
    this.health = randInt(0, maxHealth);
    this.maxHealth = maxHealth;
    
    this.id = performance.now();
  }
  
  render(context) {
  	drawRect(context, this.x, this.y);
  }
  
  renderHealth(context) {
  	const width = 27 * (this.health / this.maxHealth);
  
  	drawRect(context, this.x, this.y + 20, 30, 5);
  	drawRect(context, this.x, this.y + 20, width, 2, "red");
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
    context.lineWidth = 5;
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
    	removeById(this.id)
    }, 100);
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
  ctx.fillRect(0, 0, w, h);
  
  entities.forEach(entity => {
  	entity.render(ctx);
  	entity.renderHealth(ctx);
    
  	if (entity.health < 0) {
    	removeById(entity.id);
    }
  });

	window.requestAnimationFrame(render);
}
render();
