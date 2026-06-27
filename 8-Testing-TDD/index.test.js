const {
    capitalize,
    reverseString,
    calculator,
    caesarCipher,
    analyzeArray
} = require('./index');

describe('capitalize', () => {
    test('capitalizes first character of a string', () => {
        expect(capitalize('hello')).toBe('Hello');
    });

    test('capitalizes first character of a single character string', () => {
        expect(capitalize('a')).toBe('A');
    });

    test('leaves already capitalized string unchanged', () => {
        expect(capitalize('Hello')).toBe('Hello');
    });

    test('handles empty string', () => {
        expect(capitalize('')).toBe('');
    });

    test('handles non-string input', () => {
        expect(capitalize(123)).toBe(123);
        expect(capitalize(null)).toBe(null);
        expect(capitalize(undefined)).toBe(undefined);
    });
});

describe('reverseString', () => {
    test('reverses a string', () => {
        expect(reverseString('hello')).toBe('olleh');
    });

    test('reverses a string with spaces', () => {
        expect(reverseString('hello world')).toBe('dlrow olleh');
    });

    test('reverses a single character', () => {
        expect(reverseString('a')).toBe('a');
    });

    test('handles empty string', () => {
        expect(reverseString('')).toBe('');
    });

    test('handles non-string input', () => {
        expect(reverseString(123)).toBe(123);
        expect(reverseString(null)).toBe(null);
    });
});

describe('calculator', () => {
    describe('add', () => {
        test('adds two positive numbers', () => {
            expect(calculator.add(2, 3)).toBe(5);
        });

        test('adds positive and negative numbers', () => {
            expect(calculator.add(5, -3)).toBe(2);
        });

        test('adds two negative numbers', () => {
            expect(calculator.add(-2, -3)).toBe(-5);
        });

        test('adds zero', () => {
            expect(calculator.add(5, 0)).toBe(5);
        });

        test('throws error for non-number inputs', () => {
            expect(() => calculator.add('a', 2)).toThrow('Inputs must be numbers');
        });
    });

    describe('subtract', () => {
        test('subtracts two positive numbers', () => {
            expect(calculator.subtract(5, 3)).toBe(2);
        });

        test('subtracts negative numbers', () => {
            expect(calculator.subtract(5, -3)).toBe(8);
        });

        test('subtracts zero', () => {
            expect(calculator.subtract(5, 0)).toBe(5);
        });
    });

    describe('divide', () => {
        test('divides two numbers', () => {
            expect(calculator.divide(6, 3)).toBe(2);
        });

        test('divides to get decimal', () => {
            expect(calculator.divide(7, 2)).toBe(3.5);
        });

        test('divides negative numbers', () => {
            expect(calculator.divide(-6, 3)).toBe(-2);
        });

        test('throws error when dividing by zero', () => {
            expect(() => calculator.divide(5, 0)).toThrow('Cannot divide by zero');
        });
    });

    describe('multiply', () => {
        test('multiplies two numbers', () => {
            expect(calculator.multiply(2, 3)).toBe(6);
        });

        test('multiplies by zero', () => {
            expect(calculator.multiply(5, 0)).toBe(0);
        });

        test('multiplies negative numbers', () => {
            expect(calculator.multiply(-2, 3)).toBe(-6);
            expect(calculator.multiply(-2, -3)).toBe(6);
        });
    });
});

describe('caesarCipher', () => {
    test('shifts lowercase letters correctly', () => {
        expect(caesarCipher('abc', 1)).toBe('bcd');
        expect(caesarCipher('xyz', 3)).toBe('abc');
    });

    test('shifts uppercase letters correctly', () => {
        expect(caesarCipher('ABC', 1)).toBe('BCD');
        expect(caesarCipher('XYZ', 3)).toBe('ABC');
    });

    test('preserves case correctly', () => {
        expect(caesarCipher('HeLLo', 3)).toBe('KhOOr');
        expect(caesarCipher('Hello', 3)).toBe('Khoor');
    });

    test('handles punctuation and spaces correctly', () => {
        expect(caesarCipher('Hello, World!', 3)).toBe('Khoor, Zruog!');
        expect(caesarCipher('Hello, World!', 0)).toBe('Hello, World!');
    });

    test('handles negative shifts', () => {
        expect(caesarCipher('abc', -1)).toBe('zab');
        expect(caesarCipher('ABC', -1)).toBe('ZAB');
    });

    test('handles large shifts (wrapping)', () => {
        expect(caesarCipher('abc', 26)).toBe('abc');
        expect(caesarCipher('abc', 27)).toBe('bcd');
        expect(caesarCipher('abc', 52)).toBe('abc');
    });

    test('handles non-string inputs', () => {
        expect(caesarCipher(123, 3)).toBe(123);
        expect(caesarCipher(null, 3)).toBe(null);
        expect(caesarCipher('abc', 'a')).toBe('abc');
    });

    test('handles empty string', () => {
        expect(caesarCipher('', 5)).toBe('');
    });

    test('handles mixed case and punctuation', () => {
        expect(caesarCipher('Hello, World!', 5)).toBe('Mjqqt, Btwqi!');
        expect(caesarCipher('Zzz', 1)).toBe('Aaa');
    });
});

describe('analyzeArray', () => {
    test('returns correct object for array of numbers', () => {
        const result = analyzeArray([1, 8, 3, 4, 2, 6]);
        expect(result).toEqual({
            average: 4,
            min: 1,
            max: 8,
            length: 6
        });
    });

    test('handles array with negative numbers', () => {
        const result = analyzeArray([-1, -5, 0, 3, 10]);
        expect(result).toEqual({
            average: 1.4,
            min: -5,
            max: 10,
            length: 5
        });
    });

    test('handles array with single number', () => {
        const result = analyzeArray([5]);
        expect(result).toEqual({
            average: 5,
            min: 5,
            max: 5,
            length: 1
        });
    });

    test('handles array with decimal numbers', () => {
        const result = analyzeArray([1.5, 2.5, 3.5]);
        expect(result).toEqual({
            average: 2.5,
            min: 1.5,
            max: 3.5,
            length: 3
        });
    });

    test('throws error for empty array', () => {
        expect(() => analyzeArray([])).toThrow('Input must be a non-empty array of numbers');
    });

    test('throws error for non-array input', () => {
        expect(() => analyzeArray('not an array')).toThrow('Input must be a non-empty array of numbers');
        expect(() => analyzeArray(null)).toThrow('Input must be a non-empty array of numbers');
    });

    test('throws error for array with non-number elements', () => {
        expect(() => analyzeArray([1, 2, 'a', 4])).toThrow('All elements must be numbers');
        expect(() => analyzeArray([1, 2, null, 4])).toThrow('All elements must be numbers');
    });
});