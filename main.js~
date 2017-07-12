/**
 * A simple complex math demo. 
 *
 * @author  Ikaros Kappler
 * @date    2017-05-03
 * @version 1.0.0
 **/


(function($) {

    $( document ).ready( function() {
	
	var $canvas          = $( 'canvas#my-canvas' );
	var ctx              = $canvas[0].getContext('2d');
	var activePointIndex = 1;

	var getFloat = function(selector) {
	    return parseFloat( $(selector).val() );
	};
	var getZ = function(i) {
	    return new Complex( getFloat('input#z'+i+'-re'),   //  parseFloat($('input#z'+i+'-re').val()),
				getFloat('input#z'+i+'-im') ); //  parseFloat($('input#z'+i+'-im').val()) );
	};
	var getScale = function() {
	    return { x : getFloat('#scale-x'), y : getFloat('#scale-y') };
	};


	var canvasSize = { w : 600, h : 600 };
	var offset = { x : 200, y : 200 };
	var scale  = getScale(); // { x : 10, y : 10 };

	
	var drawGrid = function() {
	    ctx.strokeStyle = '#282828';
	    ctx.lineWidth   = 1;
	    ctx.beginPath();
	    for( var i = 0; i < canvasSize.w; i++ ) {
		ctx.moveTo( offset.x + i*scale.x, 0 );
		ctx.lineTo( offset.x + i*scale.x, canvasSize.h );
		ctx.moveTo( offset.x - i*scale.x, 0 );
		ctx.lineTo( offset.x - i*scale.x, canvasSize.h );
		
	    }
	    for( var i = 0; i < canvasSize.h; i++ ) {
		ctx.moveTo( 0,            offset.y + i*scale.y );
		ctx.lineTo( canvasSize.w, offset.y + i*scale.y );
		ctx.moveTo( 0,            offset.x - i*scale.y );
		ctx.lineTo( canvasSize.w, offset.x - i*scale.y );
		
	    }
	    ctx.closePath();
	    ctx.stroke();
	};
	
	var drawZ = function( z, color ) {
	    //console.log( 'draw complex point at ' + z ); 
	    var radius = 3;
	    ctx.beginPath();
	    ctx.arc( offset.x+z.re()*scale.x, offset.y+z.im()*scale.y, radius, 0, 2 * Math.PI, false );
	    ctx.fillStyle = color;
	    ctx.fill();
	}

	var drawLine = function( zA, zB, color ) {
	    //console.log( 'draw complex point at ' + z ); 
	    var radius = 3;
	    ctx.beginPath();
	    ctx.moveTo( offset.x+zA.re()*scale.x, offset.y+zA.im()*scale.y );
	    ctx.lineTo( offset.x+zB.re()*scale.x, offset.y+zB.im()*scale.y );
	    ctx.strokeStyle = color;
	    ctx.lineWidth = 1;
	    ctx.stroke();
	}
	
	
	var redraw = function() {
	    ctx.fillStyle = 'black';
	    ctx.fillRect(0,0,600,600);

	    scale = getScale();
	    
	    var z0 = getZ(0);
	    var z1 = getZ(1);

	    drawGrid();
	    drawZ( z0, '#ff8800' );
	    drawZ( z1, '#0068ff' );

	    drawZ( z0.clone().add(z1), 'white' );
	    
	    // Iterate z0 :)
	    var zI = z1.clone();
	    var zI_old = z1;
	    for( var i = 0; i < 50; i++ ) {
		drawZ( zI.mul(z1), '#0068ff' );
		drawLine( zI, zI_old, '#ff8800' );
		zI_old = zI.clone();
	    }
	    
	};


	$( 'input' ).change( redraw );

	var canvasPosition2Complex = function(event) {
	    var rect = $canvas[0].getBoundingClientRect();
            var x = event.clientX - rect.left,
		y = event.clientY - rect.top;
           
	    //return new Complex( x/scale.x - offset.x, y/scale.y - offset.y );
	    return new Complex( (x-offset.x)/scale.x, (y-offset.y)/scale.y );
	};

	var mouseDown = false;
	$canvas.mousedown( function(event) {
	    mouseDown = true;
	    var z = canvasPosition2Complex(event);
	    $( 'input#z'+activePointIndex+'-re' ).val( z.re() );
	    $( 'input#z'+activePointIndex+'-im' ).val( z.im() );
	    redraw();
	} );
	$canvas.mouseup( function(event) {
	    mouseDown = false;
	} );
	$canvas.mousemove( function(event) {
	    if( !mouseDown )
		return;
	    var z = canvasPosition2Complex(event);
	    $( 'input#z'+activePointIndex+'-re' ).val( z.re() );
	    $( 'input#z'+activePointIndex+'-im' ).val( z.im() );
	    redraw();
	} );
	
	
	redraw();
	
    } ); // END document.ready
    
})(jQuery);
