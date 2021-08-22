const core = require('@actions/core');
const fetch = require('node-fetch');
const apiUri = 'https://api.cloudways.com/api/v1';

async function getOauthToken() {
    const body = {
        email: core.getInput('email'),
        api_key: core.getInput('api-key')
    };

    const options = {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    };

    return await fetch(`${ apiUri }/oauth/access_token`, options).then(res => res.json());
}

async function deployChanges(token) {
    const body = {
        server_id: core.getInput('server-id'),
        app_id: core.getInput('app-id'),
        branch_name: core.getInput('branch-name'),
        deploy_path: core.getInput('deploy-path'),
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

async function run() {
    try {
        const oauthToken = await getOauthToken();

        if (oauthToken.error) {
            core.error(oauthToken.error_description);
            return;
        }

        if (!oauthToken.access_token || oauthToken.access_token === '') {
            core.error('The access token does not exist.');
            return;
        }

        await deployChanges(oauthToken.access_token).then(response => {
            if (!response.ok) {
                core.error(response.body.error_description);
                return;
            }

            core.info(`Success. Operation ID: ${ response.body.operation_id }`);
            core.setOutput('operation', response.body.operation_id);
        });
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
