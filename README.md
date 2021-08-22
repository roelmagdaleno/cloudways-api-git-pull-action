# Cloudways API Git Pull Action

Cloudways allows you to deploy your WordPress project (plugin, theme or entire site) from Git using the [Cloudways API](https://developers.cloudways.com/).

This GitHub Action will deploy your last project changes from GitHub to your Cloudways server.

## Configuration

To use this GitHub Action you need:

1. Cloudways account.
2. Cloudways API Key.
3. Deployment Via Git already configured.
4. Cloudways' data stored in your GitHub repository secrets.

Cloudways provides you an easy way to [get it in its own platform](https://platform.cloudways.com/api) or [read this guide about how to generate it](https://support.cloudways.com/en/articles/5136065-how-to-use-the-cloudways-api).

Also, you can read this guide to know [how to set up your Deployment Via Git functionality in Cloudways](https://support.cloudways.com/en/articles/5124087-deploy-code-to-your-application-using-git).

## Secrets

You can specify the Cloudways' data right into your Workflow file but **that is not recommended for security reasons**.

Instead, you must use GitHub Secrets for your repository with the following names:

- `CLOUDWAYS_EMAIL`
- `CLOUDWAYS_API_KEY`
- `CLOUDWAYS_SERVER_ID`
- `CLOUDWAYS_APP_ID`
- `CLOUDWAYS_BRANCH_NAME`
- `CLOUDWAYS_DEPLOY_PATH`

Follow the exact secrets names in your Workflow file, so you can identify those quickly.

[GitHub Secrets are set in your repository settings](https://docs.github.com/es/actions/reference/encrypted-secrets).

## Required Inputs

You must provide all of these inputs in your Workflow file.

- `email`
- `api-key`
- `server-id`
- `app-id`
- `branch-name`
- `deploy-path`

### `deploy-path`

The `deploy-path` input is the path your deployment will paste the project last changes.

If you want to deploy inside the `public_html` then its value must be an empty string.

If you want to deploy, for example, to a plugin folder then the `deploy-path` value must be:

```yaml
deploy-path: 'wp-content/plugins/<plugin-name>/'
```

As you can see, we don't need to specify the `public_html` string to the path.

**It's important to finish the path with a slash.**

## Usage

To get started, you might want to copy the content of the next example into `.github/workflows/cloudways-deploy.yml` and push that file to your repository.
