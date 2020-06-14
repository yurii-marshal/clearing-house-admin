// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.qa.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.


export const environment = {
    VERSION: "2.1.0",
    production: false,
    openIDImplicitFlowConfiguration: {
        
        stsServer: 'https://rapid-clearinghouse-identity.azurewebsites.net/',
        redirect_url: 'http://localhost:4200/',
        client_id: 'dev_administration',
        response_type: 'id_token token',
        scope: 'openid profile admin_api',
        post_logout_redirect_uri: 'http://localhost:4200/',
        post_login_route: '/dashboard',
        forbidden_route: '/access-denied',
        trigger_authorization_result_event: true,
        auto_userinfo: true,
        log_console_warning_active: true,
        log_console_debug_active: false,
        max_id_token_iat_offset_allowed_in_seconds: 600
    },
    load_using_stsServer: 'https://rapid-clearinghouse-identity.azurewebsites.net/'
};
