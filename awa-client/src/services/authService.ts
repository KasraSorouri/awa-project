
const authService = () => {
  let authorization: string = ''; 
  const token: string | null = window.localStorage.getItem('awa-token')
  if (token) {
    authorization = `Bearer ${token}`;
  }
  return authorization ;
};
export default authService;