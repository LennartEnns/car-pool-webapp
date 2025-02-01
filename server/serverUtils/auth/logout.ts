import { type H3Event, type EventHandlerRequest } from 'h3';

export default (event: H3Event<EventHandlerRequest>) => {
  // Clear the access and refresh token on client side
  deleteCookie(event, 'jwt');
  deleteCookie(event, 'refresh');
  console.log('Deleted cookies (logout.ts)');
}
