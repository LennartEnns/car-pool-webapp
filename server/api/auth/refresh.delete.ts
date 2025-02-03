// Endpoint for deleting the refresh cookie

export default defineEventHandler(async (event) => {
  console.log('/api/auth/refresh DELETE called');
  deleteCookie(event, 'refresh');
  return new Response(null, { status: 200 });
})
