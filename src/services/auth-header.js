export default function authHeader() {
  const { accessToken } = JSON.parse(localStorage.getItem('user'));
  if (accessToken) {
    return { Authorization: `Bearer ${accessToken}` };
  } else {
    return {};
  }
}
