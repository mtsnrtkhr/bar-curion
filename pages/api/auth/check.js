import { getGitHubAppOctokit } from '../../../lib/github-app-auth';

export default async function handler(req, res) {
  try {
    const octokit = await getGitHubAppOctokit();
    const { data: user } = await octokit.users.getAuthenticated();

    const adminUsernames = process.env.ADMIN_USERNAMES ? process.env.ADMIN_USERNAMES.split(',') : [];
    const adminOrg = process.env.ADMIN_ORGANIZATION || '';

    const isAdminUser = adminUsernames.includes(user.login);
    let isAdminOrg = false;

    if (adminOrg) {
      try {
        await octokit.orgs.checkMembershipForUser({
          org: adminOrg,
          username: user.login
        });
        isAdminOrg = true;
      } catch (error) {
        // ユーザーが組織のメンバーでない場合、エラーが発生します
        console.log('User is not a member of the admin organization');
      }
    }

    if (isAdminUser || isAdminOrg) {
      res.status(200).json({ authorized: true });
    } else {
      res.status(403).json({ authorized: false });
    }
  } catch (error) {
    console.error('Authorization check failed:', error);
    res.status(500).json({ error: 'Authorization check failed' });
  }
}