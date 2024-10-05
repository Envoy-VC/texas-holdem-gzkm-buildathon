export const generateKey = async () => {
  return fetch('/api/hello', {
    method: 'GET',
  }).then((res) => res.json() as unknown);
};
