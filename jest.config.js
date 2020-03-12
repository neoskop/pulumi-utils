module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    reporters: ['jest-spec-reporter'],
    moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx', 'node', 'd.ts'],
    testRunner: 'jest-circus/runner',
    testPathIgnorePatterns: [ 'node_modules', '.build', 'bundles', '/dist', 'src/grpc' ],
    coveragePathIgnorePatterns: [ 'node_modules', '.build', 'bundles', 'dist', 'src/grpc' ],
    modulePathIgnorePatterns: [ 'node_modules', '.build', 'bundles', 'dist', 'src/grpc' ],
    collectCoverage: true,
    coverageReporters: ["html", "json", "lcov", "text", "clover"]
};
