function update_var_array(curr, step_size) {
  for (var i = 0; i < curr.length; i++) {
    curr[i] += step_size[i]; 
  }
}

function check_if_quantity_is_at_target(quantity, target, tolerance) {
  for (var i = 0; i < quantity.length; i++) {
    if (Math.abs(quantity[i] - target[i]) > Math.abs(2 * tolerance[i])) {
      return false; 
    } 
  }
  return true;
}

class Circle {

  constructor(x, y, rad) {
    this.pos = [x,y];
    this.rad = [rad];

    this.color = [0, 0, 0];

    this.moving = false;
    this.pos_target = [0,0];
    this.pos_step_size = [0,0];
    this.pos_speed = 0.01;

    this.scaling = false;
    this.rad_target = [0];
    this.rad_step_size = [0];
    this.rad_speed = 0.01;

    this.changing_color = false;
    this.color_target = [0,0,0];
    this.color_step_size = [0,0,0];
    this.color_speed = 0.01;
  }

  render() {
    ctx.fillStyle = "hsl(" + String(Math.floor(this.color[0])) + "," + String(Math.floor(this.color[1])) + "%," + String(Math.floor(this.color[2])) + "%)";
    ctx.beginPath();
    ctx.arc(this.pos[0], this.pos[1], this.rad, 0, 2*Math.PI);
    ctx.fill();
  }

  update() {
    if (this.moving) {
      update_var_array(this.pos, this.pos_step_size);
      if (check_if_quantity_is_at_target(this.pos, this.pos_target, this.pos_step_size)) {
        this.pos = this.pos_target;
        this.moving = false;
      }
    }

    if (this.scaling) {
      update_var_array(this.rad, this.rad_step_size);
      if (check_if_quantity_is_at_target(this.rad, this.rad_target, this.rad_step_size)) {
        this.rad = this.rad_target;
        this.scaling = false; 
      } 
    }

    if (this.changing_color) {
      update_var_array(this.color, this.color_step_size);
      if (check_if_quantity_is_at_target(this.color, this.color_target, this.color_step_size)) {
        this.color = this.color_target;
        this.changing_color = false; 
      } 
    }
  }

  move(target_x, target_y) {
    this.moving = true;
    this.pos_target = [target_x, target_y];
    
    this.pos_step_size[0] = (target_x - this.pos[0]) * this.pos_speed;
    this.pos_step_size[1] = (target_y - this.pos[1]) * this.pos_speed;
  }

  set_radius(rad) {
    this.scaling = true;
    this.rad_target = [rad];
    this.rad_step_size[0] = (this.rad_target - this.rad) * this.rad_speed;
  }

  set_color(h,s,l) {
    this.changing_color = true;
    this.color_target = [h,s,l];
    this.color_step_size[0] = (h - this.color[0]) * this.color_speed;
    this.color_step_size[1] = (s - this.color[1]) * this.color_speed;
    this.color_step_size[2] = (l - this.color[2]) * this.color_speed;
  }
}

var ctx;
var offset = 0;
var step = 1;
var fraction = 0.5;

var initial_rad = 60;
var whole_circle, part_circle;

function draw() {
  ctx.clearRect(0, 0, 500, 500);
  whole_circle.update();
  whole_circle.render();
  part_circle.update();
  part_circle.render();
}

function march() {
  offset += step;

  if (offset == 0 || offset == 60)
    step *= -1;

  draw();
  setTimeout(march, 20);
}

function start() {
  var c = document.getElementById("main_canvas");
  ctx = c.getContext("2d");

  whole_circle = new Circle(250, 250, initial_rad * 0.5);
  part_circle  = new Circle(250, 250, initial_rad * 0.5);
  march();

}

function get_input() {
  input = document.getElementById("number").value;
  num = eval(input);
  console.log(num);

  numerator_ratio = num / (num + 1);
  denominator_ratio = 1 / (num + 1);

  console.log(numerator_ratio, denominator_ratio, whole_circle.rad)

  whole_circle.move(200, 250);
  whole_circle.set_radius(numerator_ratio * initial_rad);
  whole_circle.set_color(numerator_ratio * 220, 50, 50);

  part_circle.move(300, 250);
  part_circle.set_radius(denominator_ratio * initial_rad);
  part_circle.set_color(denominator_ratio * 220, 50, 50);

}

function handle_click() {
  get_input()
  return false;
}

