export function isTokenExpired(token: string | null) {
    if (!token) return true;

    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) return true;

    const payload = JSON.parse(atob(tokenParts[1]));

    const currentTime = Math.floor(Date.now() / 1000);

    return payload.exp && payload.exp < currentTime;
}