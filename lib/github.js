import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";
import { v4 as uuidv4 } from 'uuid';

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

export async function fetchRecipesData() {
  const response = await fetch('/data/recipes.json');
  if (!response.ok) {
    throw new Error('Failed to fetch recipes data');
  }
  return response.json();
}

export async function fetchGraphData() {
  const response = await fetch('/data/graph-data.json');
  if (!response.ok) {
    throw new Error('Failed to fetch graph data');
  }
  return response.json();
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

export async function uploadImage(imageBuffer, metadata, oldImagePath = null) {
  const octokit = await getOctokit();
  const imageName = `${uuidv4()}.jpg`;
  const path = `public/images/recipes/${imageName}`;

  // 新しい画像をアップロード
  await octokit.repos.createOrUpdateFileContents({
    owner: process.env.GITHUB_OWNER,
    repo: process.env.GITHUB_REPO,
    path: path,
    message: `Upload image: ${metadata.title}`,
    content: imageBuffer.toString('base64'),
  });

  // メタデータの更新
  const imageMetadata = await getImageMetadata();
  const newImageData = {
    id: uuidv4(),
    path: `/${path.replace('public/', '')}`,
    filename: imageName,
    ...metadata
  };

  // 古い画像のメタデータを削除
  if (oldImagePath) {
    imageMetadata.images = imageMetadata.images.filter(img => img.path !== oldImagePath);
  }

  imageMetadata.images.push(newImageData);
  await updateImageMetadata(imageMetadata);

  // 古い画像ファイルを削除
  if (oldImagePath) {
    await deleteImage(oldImagePath);
  }

  return newImageData;
}

export async function deleteImage(imagePath) {
  const octokit = await getOctokit();
  const fullPath = `public${imagePath}`;

  const { data: file } = await octokit.repos.getContent({
    owner: process.env.GITHUB_OWNER,
    repo: process.env.GITHUB_REPO,
    path: fullPath,
  });

  await octokit.repos.deleteFile({
    owner: process.env.GITHUB_OWNER,
    repo: process.env.GITHUB_REPO,
    path: fullPath,
    message: `Delete image: ${file.name}`,
    sha: file.sha,
  });
}