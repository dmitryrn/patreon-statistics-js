module.exports = {
    transform: {
        '.ts': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'js'],

    // https://typescript-tdd.github.io/ts-auto-mock/installation
    globals: {
        'ts-jest': {
            compiler: 'ttypescript'
        }
    },
    setupFiles: [
        '<rootDir>config.ts'
    ]
}
