
const useToken = () => {
  let authorization: string | null = null; 
  const token: string | null = window.localStorage.getItem('awa-token')
  if (token) {
    authorization = `Bearer ${token}`;
  }
  return {token, authorization};
};
export { useToken };