import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";

const appId = process.env.GITHUB_APP_ID;
const privateKey = process.env.GITHUB_PRIVATE_KEY;
const installationId = process.env.GITHUB_INSTALLATION_ID;

async function getOctokit() {
  const auth = createAppAuth({
    appId: appId,
    privateKey: privateKey,
    installationId: installationId,
  });

  const installationAuthentication = await auth({ type: "installation" });
  return new Octokit({ auth: installationAuthentication.token });
}

export async function getRecipes() {
  const octokit = await getOctokit();
  const { data } = await octokit.repos.getContent({
    owner: process.env.GITHUB_OWNER,
    repo: process.env.GITHUB_REPO,
    path: "data/recipes.json",
  });
  const content = Buffer.from(data.content, 'base64').toString();
  return JSON.parse(content);
}

export async function updateRecipes(recipes) {
  const octokit = await getOctokit();
  const { data: currentFile } = await octokit.repos.getContent({
    owner: process.env.GITHUB_OWNER,
    repo: process.env.GITHUB_REPO,
    path: "data/recipes.json",
  });

  await octokit.repos.createOrUpdateFileContents({
    owner: process.env.GITHUB_OWNER,
    repo: process.env.GITHUB_REPO,
    path: "data/recipes.json",
    message: "Update recipes",
    content: Buffer.from(JSON.stringify(recipes, null, 2)).toString('base64'),
    sha: currentFile.sha,
  });
}

export async function uploadImage(imageName, imageBuffer) {
  const octokit = await getOctokit();
  await octokit.repos.createOrUpdateFileContents({
    owner: process.env.GITHUB_OWNER,
    repo: process.env.GITHUB_REPO,
    path: `public/images/recipes/${imageName}`,
    message: `Upload image: ${imageName}`,
    content: imageBuffer.toString('base64'),
  });
}