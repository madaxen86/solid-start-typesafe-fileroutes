import { createMiddleware } from '@solidjs/start/middleware';

export default createMiddleware({
  onBeforeResponse: ({ response }) => {
    console.log('onBeforeResponse', 'caching every response for 10 seconds');
    //cache response for 10 seconds
    response.headers.set('Cache-Control', 'max-age=10');
  },
});
