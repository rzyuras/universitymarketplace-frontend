export default {
    get: jest.fn(() => Promise.resolve({ data: {} })), // Simula una respuesta vacía por defecto
    post: jest.fn(() => Promise.resolve({ data: {} })),
    put: jest.fn(() => Promise.resolve({ data: {} })),
    delete: jest.fn(() => Promise.resolve({ data: {} })),
  };
  