import { createAppAuth } from "@octokit/auth-app";
import { Octokit } from "@octokit/rest";

export async function getGitHubAppOctokit() {
  const auth = createAppAuth({
    appId: process.env.GITHUB_APP_ID,
    privateKey: process.env.GITHUB_APP_PRIVATE_KEY,
    installationId: process.env.GITHUB_APP_INSTALLATION_ID,
  });

  const installationAuthentication = await auth({ type: "installation" });

  return new Octokit({
    auth: installationAuthentication.token,
  });
}