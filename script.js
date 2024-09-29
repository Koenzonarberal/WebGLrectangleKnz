// Wait for the page to load
window.onload = function() {
    // Get the canvas element
    const canvas = document.getElementById('glCanvas');
    // Initialize the GL context
    const gl = canvas.getContext('webgl');

    // Only continue if WebGL is available and working
    if (!gl) {
        alert('Unable to initialize WebGL. Your browser may not support it.');
        return;
    }

    // Vertex shader program
    const vsSource = `
        attribute vec4 aVertexPosition;
        void main() {
            gl_Position = aVertexPosition;
        }
    `;

    // Fragment shader program
    const fsSource = `
        precision mediump float;
        uniform vec4 uColor;
        void main() {
            gl_FragColor = uColor;
        }
    `;

    // Initialize a shader program
    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

    // Get the attribute location
    const vertexPosition = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
    const colorUniformLocation = gl.getUniformLocation(shaderProgram, 'uColor');

    // Create a buffer for the triangle's positions.
    const positionBuffer = gl.createBuffer();

    // Select the positionBuffer as the one to apply buffer operations to from here out
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Create an array of positions for the triangle.
    const positions = [
        0.0,  0.5,
       -0.5, -0.5,
        0.5, -0.5,
    ];

    // Pass the list of positions into WebGL to build the shape
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // Tell WebGL how to pull out the positions from the position buffer into the vertexPosition attribute
    gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexPosition);

    // Set initial color (red)
    let currentColor = [1.0, 0.0, 0.0, 1.0];
    
    // Function to draw the triangle
    function drawTriangle() {
        // Clear the canvas before we start drawing on it.
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Tell WebGL to use our program when drawing
        gl.useProgram(shaderProgram);

        // Set the color
        gl.uniform4fv(colorUniformLocation, currentColor);

        // Draw the triangle
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    // Initial draw
    drawTriangle();

    // Add event listeners for buttons
    document.getElementById('redBtn').addEventListener('click', function() {
        currentColor = [1.0, 0.0, 0.0, 1.0];
        drawTriangle();
    });

    document.getElementById('greenBtn').addEventListener('click', function() {
        currentColor = [0.0, 1.0, 0.0, 1.0];
        drawTriangle();
    });

    document.getElementById('blueBtn').addEventListener('click', function() {
        currentColor = [0.0, 0.0, 1.0, 1.0];
        drawTriangle();
    });
};

// Initialize a shader program, so WebGL knows how to draw our data
function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    // Create the shader program
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // If creating the shader program failed, alert
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }

    return shaderProgram;
}

// Creates a shader of the given type, uploads the source and compiles it.
function loadShader(gl, type, source) {
    const shader = gl.createShader(type);

    // Send the source to the shader object
    gl.shaderSource(shader, source);

    // Compile the shader program
    gl.compileShader(shader);

    // See if it compiled successfully
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}