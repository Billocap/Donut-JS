const {atan2,sin,cos,sqrt,abs,PI} = Math;

const HALF = PI / 2;

function Circle(angle, radius) {
    return [
        radius * cos(angle),
        radius * sin(angle)
    ];
}

function Torus(alfa, theta, w, R) {
    const [cx, cy] = Circle(theta, w / 2);
    const a = cx + R;

    return [
        a * cos(alfa),
        a * sin(alfa),
        cy
    ];
};

/*

*/

function Project(point, cam, fov) {
    const [x, y, z] = point;
    const [cx, cy, cz] = cam;

    const Dx = (cx - x);

    return [
        (y * fov) / Dx,
        ((cz - z) * fov) / Dx
    ];
}

function Distance(point_from, point_to) {
    const [x_from, y_from, z_from] = point_from;
    const [x_to, y_to, z_to] = point_to;

    const a = x_to - x_from;
    const b = y_to - y_from;
    const c = z_to - z_from;

    return sqrt(
        a * a + 
        b * b +
        c * c
    );
}

function applyMatrix(vector, matrix) {
    const [x, y, z] = vector;

    const [
        [a, b, c],
        [d, e, f],
        [g, h, i]
    ] = matrix;

    return [
        x * a + y * b + z * c,
        x * d + y * e + z * f,
        x * g + y * h + z * i
    ];
}

function rotateX(angle) {
    return [
        [1,0,0],
        [0,cos(angle),sin(angle)],
        [0,cos(angle + HALF),sin(angle + HALF)]
    ];
}

/*
let X=a=>[[1,0,0],[0,C(a),S(a)],[0,C(a+H),S(a+H)]],
Y=a=>[[C(a),0,S(a)],[0,1,0],[C(a+H),0,S(a+H)]],
Z=a=>[[C(a),S(a),0],[C(a+H),S(a+H),0],[0,0,1]],
B=(v,m)=>{let [x,y,z]=v,[[a,b,c],[d,e,f],[g,h,i]]=m;return[x*a+y*b+z*c,x*d+y*e+z*f,x*g+y*h+z*i]},
A=(a,b,c,d)=>B(B(B(a,X(b)),Y(c)),Z(d))
*/ //288

/*
[
    x,
    y*cos(angle_x) + z*sin(angle_x),
    y*cos(angle_x+HALF) + z*sin(angle_x+HALF)
]
*/

function rotateY(angle) {
    return [
        [cos(angle),0,sin(angle)],
        [0,1,0],
        [cos(angle + HALF),0,sin(angle + HALF)]
    ];
}

/*
[
    x*cos(angle_y)+sin(angle_y)*(y*cos(angle_x+HALF)+z*sin(angle_x+HALF)),
    y*cos(angle_x)+z*sin(angle_x),
    x*cos(angle_y+HALF)+sin(angle_y+HALF)*(y*cos(angle_x+HALF)+z*sin(angle_x+HALF))
]
*/

function rotateZ(angle) {
    return [
        [cos(angle),sin(angle),0],
        [cos(angle+HALF),sin(angle+HALF),0],
        [0,0,1]
    ]
}

/*
[
    cos(Z)*(x*cos(angle_y)+sin(angle_y)*(y*cos(angle_x+HALF)+z*sin(angle_x+HALF)))+sin(angle_z)*(y*cos(angle_x)+z*sin(angle_x)),
    cos(angle_z+HALF)*(x*cos(angle_y)+sin(angle_y)*(y*cos(angle_x+HALF)+z*sin(angle_x+HALF)))+sin(angle_z+HALF)*(y*cos(angle_x)+z*sin(angle_x)),
    x*cos(angle_y+HALF)+sin(angle_y+HALF)*(y*cos(angle_x+HALF)+z*sin(angle_x+HALF))
]

const S = sin, C = cos, H = HALF;

function rotate(vector, A, B, Z) {
    const [x,y,z] = vector;
    
    return [
        C(Z)*(x*C(B)+S(B)*(y*C(A+H)+z*S(A+H)))+S(Z)*(y*C(A)+z*S(A)),
        C(Z+H)*(x*C(B)+S(B)*(y*C(A+H)+z*S(A+H)))+S(Z+H)*(y*C(A)+z*S(A)),
        x*C(B+H)+S(B+H)*(y*C(A+H)+z*S(A+H))
    ];
}*/

function rotate(vector, X, Y, Z) {
    return applyMatrix(
        applyMatrix(
            applyMatrix(
                vector,
                rotateX(X)
            ),
            rotateY(Y)
        ),
        rotateZ(Z)
    );
}

/*
let A(a,b,c,d)=>B(B(B(a,X(b)),Y(c)),Z(d))
*/