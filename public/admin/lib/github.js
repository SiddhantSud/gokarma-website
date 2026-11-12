// ============================================================
// Talks to GitHub, where the website's files live.
//
// Reading: fetches the current files from the master branch.
// Publishing: bundles every change into one commit on a new
// branch, opens a pull request and merges it straight away.
// (master only accepts changes through pull requests.) Merging
// starts the site rebuild, which takes about 2-3 minutes.
// ============================================================

export const REPO = 'SiddhantSud/gokarma-website';
export const BRANCH = 'master';
const API = 'https://api.github.com';

export class GitHub {
  constructor(token) {
    this.token = token;
  }

  async request(path, options = {}) {
    const response = await fetch(`${API}${path}`, {
      ...options,
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${this.token}`,
        'X-GitHub-Api-Version': '2022-11-28',
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      },
    });
    if (!response.ok) {
      const detail = await response.json().catch(() => ({}));
      const error = new Error(detail.message || `GitHub returned ${response.status}`);
      error.status = response.status;
      throw error;
    }
    return response.status === 204 ? null : response.json();
  }

  /** Checks the token works and can write to the repo. */
  async checkAccess() {
    const repo = await this.request(`/repos/${REPO}`);
    if (!repo.permissions?.push) {
      throw new Error('This token can read the website but not change it.');
    }
    return repo;
  }

  /** Text of a file on master. */
  async readText(path) {
    const file = await this.request(`/repos/${REPO}/contents/${encodeURI(path)}?ref=${BRANCH}`);
    const bytes = Uint8Array.from(atob(file.content.replace(/\n/g, '')), (c) => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  }

  /** Files in a folder on master: [{ name, path }]. */
  async list(path) {
    const items = await this.request(`/repos/${REPO}/contents/${encodeURI(path)}?ref=${BRANCH}`);
    return items.filter((item) => item.type === 'file');
  }

  /**
   * Publishes changes as one pull request and merges it.
   * changes: [{ path, text }] | [{ path, base64 }] | [{ path, delete: true }]
   */
  async publish(changes, message, onStep = () => {}) {
    onStep('Preparing changes…');
    const ref = await this.request(`/repos/${REPO}/git/ref/heads/${BRANCH}`);
    const baseSha = ref.object.sha;
    const baseCommit = await this.request(`/repos/${REPO}/git/commits/${baseSha}`);

    const tree = [];
    for (const change of changes) {
      if (change.delete) {
        tree.push({ path: change.path, mode: '100644', type: 'blob', sha: null });
        continue;
      }
      onStep(`Uploading ${change.path.split('/').pop()}…`);
      const blob = await this.request(`/repos/${REPO}/git/blobs`, {
        method: 'POST',
        body: JSON.stringify(
          change.base64 !== undefined
            ? { content: change.base64, encoding: 'base64' }
            : { content: change.text, encoding: 'utf-8' },
        ),
      });
      tree.push({ path: change.path, mode: '100644', type: 'blob', sha: blob.sha });
    }

    onStep('Saving…');
    const newTree = await this.request(`/repos/${REPO}/git/trees`, {
      method: 'POST',
      body: JSON.stringify({ base_tree: baseCommit.tree.sha, tree }),
    });
    const commit = await this.request(`/repos/${REPO}/git/commits`, {
      method: 'POST',
      body: JSON.stringify({ message, tree: newTree.sha, parents: [baseSha] }),
    });

    const branch = `admin/${new Date().toISOString().replace(/[:.]/g, '-')}`;
    await this.request(`/repos/${REPO}/git/refs`, {
      method: 'POST',
      body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: commit.sha }),
    });

    onStep('Publishing…');
    const pull = await this.request(`/repos/${REPO}/pulls`, {
      method: 'POST',
      body: JSON.stringify({
        title: message,
        head: branch,
        base: BRANCH,
        body: 'Published from the website admin page.',
      }),
    });
    await this.request(`/repos/${REPO}/pulls/${pull.number}/merge`, {
      method: 'PUT',
      body: JSON.stringify({ merge_method: 'squash' }),
    });
    await this.request(`/repos/${REPO}/git/refs/heads/${branch}`, { method: 'DELETE' }).catch(
      () => {},
    );
    return pull;
  }
}

/** Where to show a photo stored in the repo, e.g. "images/rooms/x.jpg". */
export function photoPreviewUrl(value) {
  if (!value) return '';
  const path = value.replace(/^\/+/, '').replace(/^images\//, '');
  return `https://raw.githubusercontent.com/${REPO}/${BRANCH}/src/assets/images/${path}`;
}
