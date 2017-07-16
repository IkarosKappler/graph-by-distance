/**
 * A connected graph visualization.
 *
 * @author  Ikaros Kappler
 * @date    2017-07-12
 * @version 1.0.0
 **/


(function($) {

    var MAX_DIST  = 200;
    var MIN_SPEED = 10;
    var DEFAULT_CANVAS_WIDTH = 1024;
    var DEFAULT_CANVAS_HEIGHT = 768;
    
    $( document ).ready( function() {

	var config = {
	    pointCount  : 45,
	    drawPoints  : true,
	    drawEdges   : true,
	    clearCanvas : true,
	    fullSize    : false,
	    reset       : function() { reset(); } 
	};
	
	var $canvas          = $( 'canvas#my-canvas' );
	var ctx              = $canvas[0].getContext('2d');
	var activePointIndex = 1;
	
	var getFloat = function(selector) {
	    return parseFloat( $(selector).val() );
	};

	var canvasSize = { width : DEFAULT_CANVAS_WIDTH, height : DEFAULT_CANVAS_HEIGHT };

	// A very basic point class.
	var Point = function(x,y) {
	    this.x = x;
	    this.y = y;
	};
	
	
	// A list of point-velocity-pairs.
	var pointList  = [];

	// +---------------------------------------------------------------------------------
	// | Adds a random point to the point list. Needed for initialization.
	// +-------------------------------
	var addRandomPoint = function() {
	    pointList.push( randomPair() );
	};
	

	// +---------------------------------------------------------------------------------
	// | Removes a random point from the point list.
	// +-------------------------------
	var removeRandomPoint = function() {
	    if( pointList.length > 1 )
		pointList.pop();
	};

	// +---------------------------------------------------------------------------------
	// | A negative-numbers friendly max function (determines the absolute max and
	// | preserves the signum.
	// +-------------------------------
	var absMax = function(value,max) {
	    if( Math.abs(value) < max ) return Math.sign(value)*max;
	    return value;
	};

	// +---------------------------------------------------------------------------------
	// | Generates a random point-velocity pair { p:Point, v:Point }
	// +-------------------------------
	var randomPair = function() {
	    var p      = randomBorderPoint();
	    var target = randomPoint();
	    //console.log( p );
	    return { p : p,
		     v : new Point( absMax((target.x-p.x),MIN_SPEED)/800,
				    absMax((target.y-p.y),MIN_SPEED)/800
				  )
		   };
	};

	// +---------------------------------------------------------------------------------
	// | Generates a random point inside the canvas bounds.
	// +-------------------------------
	var randomPoint = function() {
	    return new Point( randomInt(canvasSize.width), randomInt(canvasSize.height) );
	};

	// +---------------------------------------------------------------------------------
	// | Generates a random point on the extended border (plus distance tolerance).
	// +-------------------------------
	var randomBorderPoint = function() {
	    // Determine one of the borders depending on canvas size
	    var rand = randomInt( canvasSize.width*2 + canvasSize.height*2 );
	    if( rand < canvasSize.width ) // left border
		return new Point( -MAX_DIST, randomInt(canvasSize.height) );
	    if( rand < canvasSize.width*2 ) // right border
		return new Point( canvasSize.width+MAX_DIST, randomInt(canvasSize.height) );
	    
	    if( rand < canvasSize.width*2+canvasSize.height ) // top border
		return new Point( randomInt(canvasSize.width), -MAX_DIST );
	    // else: bottom border
	        return new Point( randomInt(canvasSize.width), canvasSize.height+MAX_DIST );
	};

	// +---------------------------------------------------------------------------------
	// | Generates a random int value between 0 and max (both inclusive).
	// +-------------------------------
	var randomInt = function(max) {
	    return Math.round( Math.random()*max );
	};

	// +---------------------------------------------------------------------------------
	// | Check if the passed point if out of the canvas bounds
	// | (including the distance tolerance).
	// +-------------------------------
	var outOfBounds = function(p) {
	    return p.x < -MAX_DIST || p.x > canvasSize.width+MAX_DIST || p.y < -MAX_DIST || p.y > canvasSize.height+MAX_DIST;
	};

	// +---------------------------------------------------------------------------------
	// | Draw the given line (between the two points) with the specified color.
	// +-------------------------------
	var drawLine = function( zA, zB, color ) {
	    //console.log( 'draw complex point at ' + z ); 
	    var radius = 3;
	    ctx.beginPath();
	    ctx.moveTo( offset.x+zA.x, offset.y+zA.y );
	    ctx.lineTo( offset.x+zB.x, offset.y+zB.y );
	    ctx.strokeStyle = color;
	    ctx.lineWidth = 1;
	    ctx.stroke();
	}

	// +---------------------------------------------------------------------------------
	// | Draw the given point with the specified color.
	// +-------------------------------
	var drawPoint = function( p, color ) {
	    //console.log( 'draw complex point at ' + z ); 
	    var radius = 3;
	    ctx.beginPath();
	    ctx.arc( p.x, p.y, radius, 0, 2 * Math.PI, false );
	    ctx.fillStyle = color;
	    ctx.fill();
	}
	

	// +---------------------------------------------------------------------------------
	// | Redraw the scene with the current configuration.
	// +-------------------------------
	var redraw = function(forceClear) {
	    //console.log('draw');
	    if( config.clearCanvas || forceClear ) {
		ctx.fillStyle = 'black';
		ctx.fillRect(0,0,canvasSize.width,canvasSize.height);
	    }

	    if( config.drawEdges ) {
		//console.log('draw edges');
		for( var a in pointList ) {
		    var pA = pointList[a].p;
		    for( var b = a; b < pointList.length; b++ ) {
			var pB = pointList[b].p;
			var dist = Math.sqrt( Math.pow(pA.x-pB.x,2) + Math.pow(pA.y-pB.y,2) );

			//console.log('draw edges A');
			if( dist >= MAX_DIST )
			    continue;
			//console.log('draw edges B');

			var alpha = (MAX_DIST-dist)/MAX_DIST;
			
			ctx.strokeStyle = 'rgba(255,255,255,' + alpha + ')';
			ctx.beginPath();
			ctx.moveTo( pA.x, pA.y );
			ctx.lineTo( pB.x, pB.y );
			ctx.stroke();
			ctx.closePath();
			
		    }
		}
	    }

	    for( var i in pointList ) {
		if( config.drawPoints )
		    drawPoint( pointList[i].p, 'blue' );
		
		// Reset points that are out of visible bounds
		if( outOfBounds(pointList[i].p) )
		    pointList[i] = randomPair();
	    }
	};

	// +---------------------------------------------------------------------------------
	// | Initially draw the image (to fill the background).
	// +-------------------------------
	$( 'input' ).change( redraw );


	var init = function() {
	    var pointCount = config.pointCount; // getInt('point_count');
	    while( pointCount-- > 0 ) {
		//console.log( '[init] Adding point ...' );
		addRandomPoint();
	    }
	};
	init();
	
	// redraw();
	ctx.fillStyle = 'black';
	ctx.fillRect(0,0,canvasSize.width,canvasSize.height);
	
	var renderNext = function(forceClear) {
	    for( var i in pointList ) {
		var p = pointList[i].p;
		var v = pointList[i].v;
		p.x += v.x;
		p.y += v.y;
	    }
	    redraw(forceClear);
	    requestAnimationFrame( function() { renderNext(false); } );
	};

	// +---------------------------------------------------------------------------------
	// | Initially draw the image (to fill the background).
	// +-------------------------------
	renderNext(true);


	var updatePointCount = function() {
	    while( pointList.length > config.pointCount )
		removeRandomPoint();
	    while( pointList.length < config.pointCount )
		addRandomPoint();
	};
	
	var resizeCanvas = function() {
	    var _setSize = function(w,h) {
		console.log( 'setSize');
		ctx.canvas.width  = w;
		ctx.canvas.height = h;
		
		$canvas[0].width  = w;
		$canvas[0].height  = h;
		
		canvasSize.width = w;
		canvasSize.height = h;
	    };
	    if( config.fullSize ) _setSize( window.innerWidth, window.innerHeight );
	    else                  _setSize( DEFAULT_CANVAS_WIDTH, DEFAULT_CANVAS_HEIGHT );
	};
	$( window ).resize( resizeCanvas );


	var reset = function() {
	    console.log( 'reset' );
	    pointList = [];
	    redraw(true); // forceClear
	    init();
	};


	// +---------------------------------------------------------------------------------
	// | Initialize dat.gui
	// +-------------------------------	
	$(document).ready( function() { 
	    var gui = new dat.gui.GUI();
	    gui.remember(config);
	    gui.add(config, 'pointCount').min(1).max(100).onChange( updatePointCount );
	    gui.add(config, 'drawPoints');
	    gui.add(config, 'drawEdges');
	    gui.add(config, 'clearCanvas');
	    gui.add(config, 'fullSize').onChange( resizeCanvas );
	    gui.add(config, 'reset').onChange( reset );
	    //dat.gui.GUI.toggleHide();
	    gui.closed = true;
	} );
	
	
    } ); // END document.ready
    
})(jQuery);

var getInt = function( id ) {
    return parseInt( document.getElementById(id).value );
};



