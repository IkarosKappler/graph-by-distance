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
    
    $( document ).ready( function() {
	
	var $canvas          = $( 'canvas#my-canvas' );
	var ctx              = $canvas[0].getContext('2d');
	var activePointIndex = 1;
	
	var getFloat = function(selector) {
	    return parseFloat( $(selector).val() );
	};

	var canvasSize = { width : 1024, height : 768 };

	
	var Point = function(x,y) {
	    this.x = x;
	    this.y = y;
	};
	
	
	// A list of point-velocity-pairs.
	var pointList  = [];
	var graph      = new Graph( pointList, { unidirected : true } );
	
	var addRandomPoint = function() {
	    pointList.push( randomPair() );
	};
	var absMax = function(value,max) {
	    if( Math.abs(value) < max ) return Math.sign(value)*max;
	    return value;
	};
	var randomPair = function() {
	    var p      = randomBorderPoint();
	    var target = randomPoint();
	    //console.log( p );
	    return { p : p,
		     v : new Point( absMax((target.x-p.x),MIN_SPEED)/400,
				    absMax((target.y-p.y),MIN_SPEED)/400
				  )
		   };
	};
	var randomPoint = function() {
	    return new Point( randomInt(canvasSize.width), randomInt(canvasSize.height) );
	};
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
	var randomInt = function(max) {
	    return Math.round( Math.random()*max );
	};

	var outOfBounds = function(p) {
	    return p.x < -MAX_DIST || p.x > canvasSize.width+MAX_DIST || p.y < -MAX_DIST || p.y > canvasSize.height+MAX_DIST;
	};

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

	var drawPoint = function( p, color ) {
	    //console.log( 'draw complex point at ' + z ); 
	    var radius = 3;
	    ctx.beginPath();
	    ctx.arc( p.x, p.y, radius, 0, 2 * Math.PI, false );
	    ctx.fillStyle = color;
	    ctx.fill();
	}
	
	
	var redraw = function() {
	    ctx.fillStyle = 'black';
	    ctx.fillRect(0,0,canvasSize.width,canvasSize.height);
	    
	    for( var a in pointList ) {
		var pA = pointList[a].p;
		for( var b = a; b < pointList.length; b++ ) {
		    var pB = pointList[b].p;
		    var dist = Math.sqrt( Math.pow(pA.x-pB.x,2) + Math.pow(pA.y-pB.y,2) );
		    
		    if( dist >= MAX_DIST )
			continue;

		    var alpha = (MAX_DIST-dist)/MAX_DIST;
		    
		    ctx.strokeStyle = 'rgba(255,255,255,' + alpha + ')';
		    ctx.beginPath();
		    ctx.moveTo( pA.x, pA.y );
		    ctx.lineTo( pB.x, pB.y );
		    ctx.stroke();
		    ctx.closePath();
		    
		}
	    }
	    
	    for( var i in pointList ) {
		//console.log( 'Draw point ' + i );
		drawPoint( pointList[i].p, 'blue' );
		
		// Reset points that are out of visible bounds
		if( outOfBounds(pointList[i].p) )
		    pointList[i] = randomPair();
	    }
	};

	// +--------------------------------------------------------
	// | Updates the graph by write the point distances into
	// | the connections.
	// +-------------------------------
	var updateGraph = function() {
	    for( var a in pointList ) {
		var pA = pointList[a].p;
		for( var b in pointList ) {
		    var pB   = pointList[b].p;
		    var dist = Math.sqrt( Math.pow(pA.x-pB.y,2) + Math.pow(pA.y-pB.y,2) );
		    graph.connect(a,b,dist);
		}
	    }
	};

	$( 'input' ).change( redraw );


	var init = function() {
	    var pointCount = getInt('point_count');
	    while( pointCount-- > 0 ) {
		//console.log( '[init] Adding point ...' );
		addRandomPoint();
	    }
	    // Destroy myself
	    init = null;
	};
	init();
	
	// redraw();

	var renderNext = function() {
	    for( var i in pointList ) {
		var p = pointList[i].p;
		var v = pointList[i].v;
		p.x += v.x;
		p.y += v.y;
	    }
	    //updateGraph();
	    //console.log( 'redraw' );
	    redraw();
	    requestAnimationFrame( renderNext );
	};

	renderNext();
	
    } ); // END document.ready
    
})(jQuery);

var getInt = function( id ) {
    return parseInt( document.getElementById(id).value );
};
