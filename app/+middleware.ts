import { MiddlewareFunction } from '@expo/server';

const middleware: MiddlewareFunction = (request) => {
  console.log(`${request.method} ${request.url}`);
};

export default middleware;
