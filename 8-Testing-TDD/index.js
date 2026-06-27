
function capitalize(str) {
    if (typeof str !== 'string' || str.length === 0) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function reverseString(str) {
    if (typeof str !== 'string') return str;
    return str.split('').reverse().join('');
}

const calculator = {
    add: (a, b) => {
        if (typeof a !== 'number' || typeof b !== 'number') throw new Error('Inputs must be numbers');
        return a + b;
    },
    subtract: (a, b) => {
        if (typeof a !== 'number' || typeof b !== 'number') throw new Error('Inputs must be numbers');
        return a - b;
    },
    divide: (a, b) => {
        if (typeof a !== 'number' || typeof b !== 'number') throw new Error('Inputs must be numbers');
        if (b === 0) throw new Error('Cannot divide by zero');
        return a / b;
    },
    multiply: (a, b) => {
        if (typeof a !== 'number' || typeof b !== 'number') throw new Error('Inputs must be numbers');
        return a * b;
    }
};

function caesarCipher(str, shift) {
    if (typeof str !== 'string') return str;
    if (typeof shift !== 'number') return str;
    
    const effectiveShift = ((shift % 26) + 26) % 26;
    
    return str.split('').map(char => {
        if (!/[a-zA-Z]/.test(char)) return char;
        
        const code = char.charCodeAt(0);
        const isUpperCase = code >= 65 && code <= 90;
        const base = isUpperCase ? 65 : 97;
        const shiftedCode = ((code - base + effectiveShift) % 26) + base;
        return String.fromCharCode(shiftedCode);
    }).join('');
}

function analyzeArray(arr) {
    if (!Array.isArray(arr) || arr.length === 0) {
        throw new Error('Input must be a non-empty array of numbers');
    }
    
    if (!arr.every(item => typeof item === 'number')) {
        throw new Error('All elements must be numbers');
    }
    
    const sum = arr.reduce((acc, val) => acc + val, 0);
    const average = sum / arr.length;
    const min = Math.min(...arr);
    const max = Math.max(...arr);
    const length = arr.length;
    
    return {
        average: Math.round(average * 100) / 100,
        min,
        max,
        length
    };
}

module.exports = {
    capitalize,
    reverseString,
    calculator,
    caesarCipher,
    analyzeArray
};