// Endpoint for clearing server-side session state

export default defineEventHandler(async (event) => {
  console.log('/api/auth/logout POST called');
  deleteCookie(event, 'jwt');
  return new Response(null, { status: 200 });
})
