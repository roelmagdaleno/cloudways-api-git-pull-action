const core = require('@actions/core');
const github = require('@actions/github');
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

async function run() {
    try {
        const oauthToken = getOauthToken();
        const serverId = core.getInput('server-id');
        const appId = core.getInput('app-id');
        const branchName = core.getInput('branch-name');
        const deployPath = core.getInput('deploy-path');
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
