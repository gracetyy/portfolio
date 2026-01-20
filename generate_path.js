
const size = 400;
const segment = 10;
let d = 'M0,0';

// Top: x goes 0 -> 400
for(let x=segment; x<=size; x+=segment) {
    const noise = Math.random() * 6;
    d += ` L${x},${noise.toFixed(1)}`;
}

// Right: y goes 0 -> 400
for(let y=segment; y<=size; y+=segment) {
    const noise = Math.random() * 6;
    d += ` L${(size - noise).toFixed(1)},${y}`;
}

// Bottom: x goes 400 -> 0
for(let x=size-segment; x>=0; x-=segment) {
    const noise = Math.random() * 6;
    d += ` L${x},${(size - noise).toFixed(1)}`;
}

// Left: y goes 400 -> 0
for(let y=size-segment; y>=0; y-=segment) {
    const noise = Math.random() * 6;
    d += ` L${noise.toFixed(1)},${y}`;
}

d += ' Z';
console.log(d);
