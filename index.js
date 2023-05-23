import {
    getInput,
    info,
    setFailed,
    setOutput,
} from '@actions/core';

import fetch from 'node-fetch';

/**
 * The Cloudways API URI.
 * It'll be used to make the requests.
 *
 * @since 1.0.0
 *
 * @type {string}
 */
const apiUri = 'https://api.cloudways.com/api/v1';

/**
 * Get access token.
 *
 * We need the Cloudways API Key and the email address of the account.
 * The access token will be used to authenticate the request.
 *
 * @link https://developers.cloudways.com/docs/#!/AuthenticationApi#getOAuthAccessToken
 *
 * @since 1.0.0
 * @since 1.2.0 - Add error handling.
 *
 * @returns {Promise<unknown>}
 */
async function getOauthToken() {
    const body = {
        api_key: getInput('api-key'),
        email: getInput('email'),
    };

    const options = {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
    };

    /**
     * The API response.
     *
     * If the request is successful, the response will contain the access token.
     * Otherwise, it'll contain the error message.
     *
     * @since 1.0.0
     *
     * @type {{
     *    error: boolean,
     *    error_description: string,
     *    access_token: string,
     *    expires_in: number,
     *    token_type: string
     * }}
     */
    const response = await fetch(`${ apiUri }/oauth/access_token`, options).then(res => res.json());

    if (response.error) {
        throw new Error(response.error_description);
    }

    if (!response.access_token || response.access_token === '') {
        throw new Error('The access token does not exist.');
    }

    return response.access_token;
}

/**
 * Deploy changes.
 *
 * It'll pull the new changes from the repository and deploy them to the server.
 *
 * We need:
 *
 * - `server_id`. Numeric id of the server.
 * - `app_id`. Numeric id of the application.
 * - `branch_name`. Name of the branch to pull.
 * - `deploy_path`. Path to deploy the changes.
 *
 * @link https://developers.cloudways.com/docs/#!/GitApi#startGitPull
 *
 * @since 1.0.0
 *
 * @param {string} token The access token.
 * @returns {Promise<{code: *, ok: *, body: *}>}
 */
async function deployChanges(token) {
    const body = {
        app_id: getInput('app-id'),
        branch_name: getInput('branch-name'),
        deploy_path: getInput('deploy-path'),
        server_id: getInput('server-id'),
    };

    const options = {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ token }`
        }
    };

    return await fetch(`${ apiUri }/git/pull`, options).then(response => {
        return response.json().then(data => {
            return {
                ok: response.ok,
                code: response.status,
                body: data
            }
        });
    });
}

/**
 * Run the action.
 * It'll get the access token and deploy the changes.
 *
 * @since 1.0.0
 *
 * @returns {Promise<void>}
 */
async function run() {
    try {
        const access_token = await getOauthToken();

        await deployChanges(access_token).then(response => {
            if (!response.ok) {
                throw new Error(response.body.error_description);
            }

            info(`Success. Operation ID: ${ response.body.operation_id }`);
            setOutput('operation', response.body.operation_id);
        });
    } catch (error) {
        setFailed(error.message);
    }
}

run();
