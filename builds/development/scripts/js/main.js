//*******************************************************************//
//*******************************************************************//
// Author : Jason R. Haddix
// Date : June / 2016 
// Liscence : 
/*
MIT License

Copyright (c) [year] [fullname]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/


//*******************************************************************//
//*******************************************************************//
// VARIABLES
//*******************************************************************//
//*******************************************************************//

// THREEJS //
var container;
var camera, scene, renderer;
var jsonLoader;
var meshPlane;
var controls;


// MODERNIZR // 
var supports_WebGL;


/*
var composer;
var chromaticAberrationPass;
WAGNER.vertexShadersPath = 'scripts/js/_lib/wagner/vertex-shaders';
WAGNER.fragmentShadersPath = 'scripts/js/_lib/wagner/fragment-shaders';
*/

//*******************************************************************//
//*******************************************************************//



function init()
{

	container = document.createElement( "div" );
	container.id = "webgl";

	modernizr_checkFeatures();
}





function modernizr_checkFeatures()
{
    Modernizr.on('webgl', function( result )
    {
        supports_WebGL = (result) ? true : false;
    });

    checkStatus_Features();
}





function checkStatus_Features ()
{
	if( supports_WebGL != undefined )
	{
	 	initWorld_ThreeJS();

	} else {
		
		setTimeout( function() {
			checkStatus_Features();
		}, 100 );

	}

}






function initWorld_ThreeJS()
{
	// Camera
	camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 1000 );
	
	camera.position.x = 60;
	camera.position.y = 40;
	camera.position.z = -90;

	fovAlgorithm = 2 * Math.atan( ( (window.innerWidth) / camera.aspect ) / ( 2 * 1175 ) ) * ( 180 / Math.PI );

	camera.fov = fovAlgorithm;
	camera.updateProjectionMatrix();


	// Scene
	scene = new THREE.Scene();


	// Renderer
	 renderer = new THREE.WebGLRenderer( { width:  window.innerWidth, height:  window.innerHeight, scale:1, antialias: true });
	//renderer = new THREE.WebGLRenderer({ alpha: true });
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.getElementById("threejs-container").appendChild( renderer.domElement );


	// Controls
	controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.enableDamping = true;
	controls.dampingFactor = 0.25;
	controls.enableZoom = false;


	// Lights
	// Ambient Light
	scene.add( new THREE.AmbientLight( 0xff0099 ) );
	
	// Point Light
	pointLight = new THREE.PointLight( 0x00CCFF, 6, 30 );
	scene.add( pointLight );
	
	// Point Light representation
	sphere = new THREE.SphereGeometry( 1, 16, 6);
	lightMesh = new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0x71E3FF, wireframe:true } ) );
	scene.add( lightMesh );

	loadJSONMesh();

	window.addEventListener( 'resize', onWindowResize, false );
	threeJS_Animate();

}





function loadJSONMesh()
{
	jsonLoader = new THREE.JSONLoader();
	
	jsonLoader.load("./site-assets/plane.json", function ( geometry )
	{
		/*
		var Mat = new THREE.MeshPhongMaterial({color: 0x6eb5df,  shininess: 100,vertexColors: THREE.FaceColors})
		
		meshPlane = new THREE.Mesh( geometry, Mat );
		*/

		meshPlane = THREE.SceneUtils.createMultiMaterialObject( geometry, [
        	new THREE.MeshPhongMaterial({ color: 0xffffff, wireframe: true,vertexColors: THREE.FaceColors, transparent : true, opacity : 1, shininess: 1000}),
        	new THREE.MeshPhongMaterial({color: 0x6eb5df,  shininess: 1000,vertexColors: THREE.FaceColors})
		]);

		meshPlane.rotation.y = Math.PI / 2;
		
		meshPlane.scale.set( 20, 20, 20 );
		meshPlane.position.set( -0.2, 0.15, 0 );

		// meshPlane.children[ 1 ].scale.multiplyScalar( 1.01 );
		scene.add( meshPlane );

		/*
		wireframe = new THREE.WireframeHelper( meshPlane, 0x333333 );
		threeJS_Scene.add(wireframe);
		*/
	});
}





function threeJS_Animate(time) {

	requestAnimationFrame( threeJS_Animate );
	threeJS_Render(time);
	
}



var r;

function threeJS_Render()
{
	//requestAnimationFrame( threeJS_Render );

	//controls.update();



	r = Date.now() * 0.001;
	pointLight.position.x = 10 * Math.cos( r );
	pointLight.position.y = 10 * Math.cos( r * 1.65 );
	pointLight.position.z = 10 * Math.sin( r );
	
	lightMesh.position.copy( pointLight.position );

	/*
	meshPlane.children[0].geometry.verticesNeedUpdate = true 
    meshPlane.children[0].geometry.computeFaceNormals();
	*/

	camera.lookAt( scene.position );
	
	renderer.render( scene, camera );

}





function onWindowResize()
{
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );

}