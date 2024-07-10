
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const RenderOAuthPage = () => {
    const location = useLocation();
    const selectedRepo = location.state ? location.state.selectedRepo : null;

    useEffect(() => {
        // OAuth authorization with Render
        // Replace the placeholders with your actual Render OAuth credentials and desired scopes
        const token = 'rnd_bDs0CIECmU2nL8Cgkalpy51qoSRa';
        const redirectUri = 'http://localhost:1337/admin/plugins/strapi-gen/faq_section';
        // Construct the OAuth authorization URL
        const authUrl = 'https://dashboard.render.com/oauth/authorize?token=${token}&redirect_uri=${redirectUri}';

        // Redirect the user to Render's OAuth authorization page
        window.location.href = authUrl;
    }, []);

    return (
        <div>
            <h1>Authorize with Render</h1>
            {/* You can add loading indicators or other UI elements here */}
        </div>
    );
};

export default RenderOAuthPage;
