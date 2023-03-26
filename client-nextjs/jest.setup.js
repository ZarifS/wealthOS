import '@testing-library/jest-dom';

// Mock next/router for all tests
jest.mock('next/router', () => require('next-router-mock'));
