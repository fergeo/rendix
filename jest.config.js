// jest.config.js
export default {
    testEnvironment: 'node',
    setupFilesAfterEnv: ['./jest.setup.js'],
    transformIgnorePatterns: [
        '/node_modules/(?!uuid|supertest)/' // transforma uuid y supertest que usan ESM
    ]
};
