export const environment = {
    production: true,
    openIDImplicitFlowConfiguration: {
        stsServer: 'https://payday-clearinghouse-identity-alternative.azurewebsites.net/',
        redirect_url: 'https://payday-clearinghouse-api-alternative.azurewebsites.net/',
        client_id: 'administration',
        response_type: 'id_token token',
        scope: 'openid profile admin_api',
        post_logout_redirect_uri: 'https://payday-clearinghouse-api-alternative.azurewebsites.net/',
        post_login_route: '/dashboard',
        forbidden_route: '/access-denied',
        trigger_authorization_result_event: true,
        auto_userinfo: false,
        log_console_warning_active: true,
        log_console_debug_active: false,
        max_id_token_iat_offset_allowed_in_seconds: 600
    },
    load_using_stsServer: 'https://payday-clearinghouse-identity-alternative.azurewebsites.net/'
};
