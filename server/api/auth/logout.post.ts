import logout from "~/server/serverUtils/auth/logout";

export default defineEventHandler(async (event) => {
  console.log('/api/auth/logout POST called');

  logout(event);

  return new Response(null, { status: 200 });
})
