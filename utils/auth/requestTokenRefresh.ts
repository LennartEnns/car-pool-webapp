let refreshPromise: Promise<{ status: number }> | null = null;

export default async (): Promise<{ status: number }> => {
  if (refreshPromise) return refreshPromise;

  console.log("Refresh lock: Initiating new request");
  refreshPromise = new Promise((resolve, reject) => {
    $fetch('/api/auth/refresh', { method: 'POST' })
    .then(response => {
      resolve({ status: response?.status || 200 });
    })
    .catch(err => {
      resolve({ status: err.data?.statusCode || 500 });
    })
    .finally(() => {
      refreshPromise = null;
    });
  });

  return refreshPromise;
}
