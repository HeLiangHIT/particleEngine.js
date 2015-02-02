(function(){
	// 二维矢量类
	var Vector2 = function(x,y){
		this.x = x;
		this.y = y;
	};
	Vector2.prototype = {
		copy: function(){
			return new Vector2(this.x,this.y);
		},
		length: function(){
			return Math.sqrt(this.x*this.x+this.y+this.y);
		},
		sqrLength: function(){
			return this.x*this.x+this.y*this.y;
		},
		normalize: function(){
			var inv = 1/this.length();
			return new Vector2(this.x*inv,this.y*inv);
		},
		negate: function(){
			return new Vector2(-this.x,-this.y);
		},
		add: function(v){
			return new Vector2(this.x+v.x,this.y+v.y);
		},
		subtract: function(v){
			return new Vector2(this.x-v.x,this.y-v.y);
		},
		multiply: function(f){
			return new Vector2(this.x*f,this.y*f);
		},
		divide: function(f){
			var invf = 1/f;
			return new Vector2(this.x*invf,this.y*invf);
		},
		dot: function(v){
			return new Vector2(this.x*v.x,this.y*v.y);
		},
	};
	Vector2.zero = new Vector2(0,0);

	// 三维矢量类
	var Vector3 = function(x,y,z){
		this.x = x;
		this.y = y;
		this.z = z;
	};
	Vector3.prototype = {
		copy: function(){
			return new Vector3(this.x,this.y,this.z);
		},
		length: function(){
			return Math.sqrt(this.x*this.x+this.y+this.y+this.z*this.z);
		},
		sqrLength: function(){
			return this.x*this.x+this.y*this.y+this.z*this.z;
		},
		normalize: function(){
			var inv = 1/this.length();
			return new Vector3(this.x*inv,this.y*inv,this.z*inv);
		},
		negate: function(){
			return new Vector3(-this.x,-this.y,-this.z);
		},
		add: function(v){
			return new Vector3(this.x+v.x,this.y+v.y,this.z+v.z);
		},
		subtract: function(v){
			return new Vector3(this.x-v.x,this.y-v.y,this.z-v.z);
		},
		multiply: function(f){
			return new Vector3(this.x*f,this.y*f,this.z*f);
		},
		divide: function(f){
			var invf = 1/f;
			return new Vector3(this.x*invf,this.y*invf,this.z*invf);
		},
		dot: function(v){
			return new Vector3(this.x*v.x,this.y*v.y,this.z*v.z);
		},
		cross: function(v){
			var X = this.y*v.z-this.z*v.y,
				Y = this.z*v.x-this.x*v.z,
				Z = this.x*v.y-this.y*v.x;
			return new Vector3(X,Y,Z);
		},
	};
	Vector3.zero = new Vector3(0,0,0);

})();