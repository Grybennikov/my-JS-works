var layers = {

	init : function(){
		this.grid = document.getElementById("heroes_map").getContext("2d"); // IT'S 1 LAYER WITH ONLY GRID
		this.selects = document.getElementById("heroes_map_canvas_3").getContext("2d"); // IT'S 2 LAYER WITH ONLY SELECT OF CELL
		this.entities = document.getElementById("heroes_map_canvas_2").getContext("2d"); // IT'S 3 LAYER WITH ONLY soldierS AND BARRIERS
		this.layer4 = document.getElementById("heroes_map_canvas_4").getContext("2d"); // IT'S 4 LAYER NO ACTIVE
	},

	changeLayer : function(layer){
		this.old_ctx = map.ctx;
		map.ctx = layers[layer];
	},

	restoreLayer : function(){
		map.ctx = this.old_ctx;
	}
}