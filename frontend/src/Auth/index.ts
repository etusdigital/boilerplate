
import { createAuth0 } from '@auth0/auth0-vue';


export const auth0 = createAuth0({
    domain: import.meta.env.VITE_AUTH0_DOMAIN,
    clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
    authorizationParams: {
        redirect_uri: 'http://localhost:5173/callback'
    }
});