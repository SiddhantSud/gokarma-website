// ============================================================
// The Aangan admin page.
//
// 1. Asks for the password and unlocks the GitHub token stored
//    (encrypted) in key.json. See lib/crypto.js.
// 2. Loads every editable file from GitHub (list in lib/content.js)
//    and shows it as forms, with photo thumbnails.
// 3. Keeps track of what changed. "Publish" sends all changes to
//    GitHub in one go (lib/github.js) and the site rebuilds.
//
// Everything on screen is built with textContent / DOM methods,
// never innerHTML, so content from files can't run as code.
// ============================================================
import { unlockToken } from './lib/crypto.js';
import { GitHub, REPO, photoPreviewUrl } from './lib/github.js';
import {
  ARTICLES_FOLDER,
  ARTICLE_FIELDS,
  SECTIONS,
  articleFileName,
  parseArticle,
  serialiseArticle,
} from './lib/content.js';

const TOKEN_KEY = 'aangan-admin-token';
const $ = (id) => document.getElementById(id);

const state = {
  github: null,
  files: {}, // path -> { original, data }
  articles: [], // { id, path, original, data, body, isNew, deleted }
  uploads: {}, // repo path -> { base64, previewUrl }
  section: SECTIONS[0].id,
  openArticle: null,
};

// ---- Small DOM helper ----
function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value === undefined || value === null || value === false) continue;
    if (key.startsWith('on')) node.addEventListener(key.slice(2), value);
    else if (key === 'text') node.textContent = value;
    else if (value === true) node.setAttribute(key, '');
    else node.setAttribute(key, value);
  }
  for (const child of children.flat()) {
    if (child === null || child === undefined || child === false) continue;
    node.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
  return node;
}

function showStatus(text, kind = 'info') {
  const status = $('status');
  status.hidden = !text;
  status.textContent = text || '';
  status.className = `status ${kind}`;
}

// ============================================================
// Unlocking
// ============================================================
async function start() {
  const saved = sessionStorage.getItem(TOKEN_KEY);
  if (saved) {
    try {
      await openEditor(saved);
      return;
    } catch {
      sessionStorage.removeItem(TOKEN_KEY);
    }
  }
  $('login').hidden = false;
}

$('loginForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const message = $('loginMessage');
  const password = event.currentTarget.elements.password.value;
  message.textContent = 'Opening…';
  try {
    const response = await fetch('key.json', { cache: 'no-store' });
    if (!response.ok) {
      message.textContent = 'The admin page is not set up yet. Open setup.html first.';
      return;
    }
    let token;
    try {
      token = await unlockToken(await response.json(), password);
    } catch {
      message.textContent = 'Wrong password.';
      return;
    }
    await openEditor(token);
    sessionStorage.setItem(TOKEN_KEY, token);
    $('login').hidden = true;
  } catch (error) {
    message.textContent = `Couldn't open: ${error.message}`;
  }
});

$('lockButton').addEventListener('click', () => {
  if (changeCount() > 0 && !confirm('You have unpublished changes. Lock anyway and lose them?')) {
    return;
  }
  sessionStorage.removeItem(TOKEN_KEY);
  location.reload();
});

window.addEventListener('beforeunload', (event) => {
  if (changeCount() > 0) event.preventDefault();
});

async function openEditor(token) {
  state.github = new GitHub(token);
  await state.github.checkAccess();
  $('login').hidden = true;
  $('app').hidden = false;
  await loadEverything();
}

// ============================================================
// Loading content
// ============================================================
async function loadEverything() {
  showStatus('Loading the website content…');
  state.files = {};
  state.uploads = {};
  for (const section of SECTIONS) {
    if (!section.file) continue;
    const text = await state.github.readText(section.file);
    state.files[section.file] = { original: text, data: JSON.parse(text) };
  }
  const entries = await state.github.list(ARTICLES_FOLDER);
  state.articles = [];
  for (const entry of entries.filter((e) => e.name.endsWith('.md'))) {
    const text = await state.github.readText(entry.path);
    const { data, body } = parseArticle(text);
    state.articles.push({
      id: entry.name.replace(/\.md$/, ''),
      path: entry.path,
      original: text,
      data,
      body,
    });
  }
  sortArticles();
  showStatus('');
  render();
}

function sortArticles() {
  state.articles.sort((a, b) => (a.data.order ?? 100) - (b.data.order ?? 100));
}

// ============================================================
// Tracking changes
// ============================================================
function changedFiles() {
  const changes = [];
  for (const [path, file] of Object.entries(state.files)) {
    const text = `${JSON.stringify(file.data, null, 2)}\n`;
    if (text !== file.original) changes.push({ path, text });
  }
  for (const article of state.articles) {
    if (article.deleted) {
      if (!article.isNew) changes.push({ path: article.path, delete: true });
      continue;
    }
    const text = serialiseArticle(article.data, article.body);
    if (article.isNew || text !== article.original) changes.push({ path: article.path, text });
  }
  for (const [path, upload] of Object.entries(state.uploads)) {
    if (isPhotoStillUsed(path)) changes.push({ path, base64: upload.base64 });
  }
  return changes;
}

function isPhotoStillUsed(repoPath) {
  const value = repoPath.replace('src/assets/', '');
  const all =
    JSON.stringify(Object.values(state.files).map((f) => f.data)) +
    JSON.stringify(state.articles.filter((a) => !a.deleted).map((a) => a.data));
  return all.includes(value);
}

function changeCount() {
  return state.github ? changedFiles().filter((c) => !c.base64).length : 0;
}

function refreshChangeCount() {
  const count = changeCount();
  $('changeCount').textContent = count
    ? `${count} unpublished change${count === 1 ? '' : 's'}`
    : 'Everything is published';
  $('publishButton').disabled = count === 0;
}

// ============================================================
// Publishing
// ============================================================
$('publishButton').addEventListener('click', async () => {
  const changes = changedFiles();
  if (!changes.length) return;
  const problem = findMissingRequired();
  if (problem) {
    showStatus(problem, 'error');
    return;
  }
  const button = $('publishButton');
  button.disabled = true;
  try {
    await state.github.publish(changes, 'Update website content from the admin page', (step) =>
      showStatus(step),
    );
    showStatus(
      'Published! The website updates in about 2–3 minutes. Photo previews here may take a minute to refresh.',
      'success',
    );
    const message = $('status').textContent;
    await loadEverything();
    showStatus(message, 'success');
  } catch (error) {
    showStatus(`Couldn't publish: ${error.message}. Nothing was changed on the website.`, 'error');
    refreshChangeCount();
  }
});

function findMissingRequired() {
  const missing = (fields, obj, where) => {
    for (const field of fields) {
      if (field.optional || field.type === 'checkbox' || field.type === 'object') continue;
      const value = obj[field.key];
      const empty =
        value === undefined ||
        value === null ||
        value === '' ||
        (Array.isArray(value) && !value.length);
      if (empty) return `Please fill in "${field.label}" (${where}) before publishing.`;
    }
    return null;
  };
  for (const section of SECTIONS) {
    if (!section.file) continue;
    const data = state.files[section.file].data;
    if (section.listKey) {
      for (const [i, item] of data[section.listKey].entries()) {
        const issue = missing(
          section.fields,
          item,
          `${section.label}, ${section.itemLabel} ${i + 1}`,
        );
        if (issue) return issue;
      }
    } else {
      const issue = missing(section.fields, data, section.label);
      if (issue) return issue;
    }
  }
  for (const article of state.articles.filter((a) => !a.deleted)) {
    const issue = missing(
      ARTICLE_FIELDS,
      article.data,
      `article "${article.data.title || 'untitled'}"`,
    );
    if (issue) return issue;
    if (!article.body.trim()) return `The article "${article.data.title}" has no text yet.`;
  }
  return null;
}

// ============================================================
// Screens
// ============================================================
function render() {
  renderNav();
  const panel = $('panel');
  panel.replaceChildren();
  const section = SECTIONS.find((s) => s.id === state.section);
  if (section.articles) {
    if (state.openArticle) renderArticleEditor(panel);
    else renderArticleList(panel);
  } else if (section.listKey) {
    renderListSection(panel, section);
  } else {
    renderFormSection(panel, section);
  }
  refreshChangeCount();
}

function renderNav() {
  const nav = $('nav');
  nav.replaceChildren(
    ...SECTIONS.map((section) =>
      el('button', {
        class: section.id === state.section ? 'active' : '',
        text: section.label,
        onclick: () => {
          state.section = section.id;
          state.openArticle = null;
          render();
        },
      }),
    ),
    el('a', {
      href: 'https://siddhantsud.github.io/gokarma-website/',
      target: '_blank',
      rel: 'noopener',
      class: 'nav-link',
      text: 'Open the website ↗',
    }),
  );
}

function renderFormSection(panel, section) {
  const data = state.files[section.file].data;
  panel.append(
    el('h2', { text: section.label }),
    section.note ? el('p', { class: 'note', text: section.note }) : null,
    renderFields(section.fields, data),
  );
}

function renderListSection(panel, section) {
  const list = state.files[section.file].data[section.listKey];
  const items = list.map((item, index) =>
    el(
      'details',
      { class: 'item' },
      el(
        'summary',
        {},
        thumbnail(item.image),
        el('span', {
          class: 'item-title',
          text: section.title(item) || `New ${section.itemLabel}`,
        }),
        el(
          'span',
          { class: 'item-actions' },
          el('button', {
            type: 'button',
            title: 'Move up',
            text: '↑',
            disabled: index === 0,
            onclick: (e) => moveItem(e, list, index, -1),
          }),
          el('button', {
            type: 'button',
            title: 'Move down',
            text: '↓',
            disabled: index === list.length - 1,
            onclick: (e) => moveItem(e, list, index, 1),
          }),
          el('button', {
            type: 'button',
            title: 'Remove',
            class: 'danger',
            text: '✕',
            onclick: (e) => {
              e.preventDefault();
              if (confirm(`Remove this ${section.itemLabel}?`)) {
                list.splice(index, 1);
                render();
              }
            },
          }),
        ),
      ),
      renderFields(section.fields, item, () => {
        const title = items[index]?.querySelector('.item-title');
        if (title) title.textContent = section.title(item) || `New ${section.itemLabel}`;
      }),
    ),
  );
  panel.append(
    el('h2', { text: section.label }),
    section.note ? el('p', { class: 'note', text: section.note }) : null,
    el('p', { class: 'note', text: `${list.length} ${section.itemLabel}s. Click one to edit it.` }),
    ...items,
    el('button', {
      class: 'add',
      text: `+ Add a ${section.itemLabel}`,
      onclick: () => {
        list.push(emptyItem(section.fields));
        render();
        panel.querySelector('details.item:last-of-type')?.setAttribute('open', '');
      },
    }),
  );
}

function moveItem(event, list, index, step) {
  event.preventDefault();
  const [item] = list.splice(index, 1);
  list.splice(index + step, 0, item);
  render();
}

function emptyItem(fields) {
  const item = {};
  for (const field of fields) {
    if (field.type === 'list') item[field.key] = [];
    else if (field.type === 'select') item[field.key] = field.options[0];
    else if (field.type === 'object' || field.optional) continue;
    else item[field.key] = '';
  }
  return item;
}

// ---- Articles ----
function renderArticleList(panel) {
  const live = state.articles.filter((a) => !a.deleted);
  panel.append(
    el('h2', { text: 'Gokarna Guide articles' }),
    el('p', {
      class: 'note',
      text: 'Guest stories go here too: create a new article and put their name in "Author".',
    }),
    ...live.map((article) =>
      el(
        'button',
        {
          class: 'article-row',
          onclick: () => {
            state.openArticle = article;
            render();
          },
        },
        thumbnail(article.data.image),
        el(
          'span',
          { class: 'article-row-text' },
          el('strong', { text: article.data.title || 'Untitled' }),
          el('span', {
            class: 'note',
            text: [
              article.data.tag,
              article.data.author && `by ${article.data.author}`,
              article.data.draft && 'Draft (hidden)',
            ]
              .filter(Boolean)
              .join(' · '),
          }),
        ),
      ),
    ),
    el('button', {
      class: 'add',
      text: '+ New article',
      onclick: () => {
        const title = prompt('Title of the new article?');
        if (!title) return;
        let id = articleFileName(title);
        while (state.articles.some((a) => a.id === id && !a.deleted)) id += '-2';
        const article = {
          id,
          path: `${ARTICLES_FOLDER}/${id}.md`,
          original: '',
          isNew: true,
          body: '',
          data: {
            title,
            tag: '',
            excerpt: '',
            description: '',
            image: '',
            imageAlt: '',
            date: new Date().toISOString().slice(0, 10),
            order: 100,
            draft: true,
          },
        };
        state.articles.push(article);
        state.openArticle = article;
        render();
      },
    }),
  );
}

function renderArticleEditor(panel) {
  const article = state.openArticle;
  const body = el('textarea', { class: 'article-body', rows: 22 });
  body.value = article.body;
  body.addEventListener('input', () => {
    article.body = body.value;
    refreshChangeCount();
  });
  panel.append(
    el('button', {
      class: 'back',
      text: '← All articles',
      onclick: () => {
        state.openArticle = null;
        sortArticles();
        render();
      },
    }),
    el('h2', { text: article.data.title || 'Untitled article' }),
    el('p', {
      class: 'note',
      text: `Page address: ${article.id}.html${article.isNew ? ' (new)' : ''}`,
    }),
    renderFields(ARTICLE_FIELDS, article.data),
    el(
      'label',
      { class: 'field' },
      el('span', { text: 'Article text' }),
      el('small', {
        text: 'Start a line with ## for a heading, - for a bullet point. Wrap words in **double stars** for bold.',
      }),
      body,
    ),
    el('button', {
      class: 'danger wide',
      text: 'Delete this article',
      onclick: () => {
        if (
          !confirm(
            `Delete "${article.data.title}"? It disappears from the website when you publish.`,
          )
        ) {
          return;
        }
        article.deleted = true;
        state.openArticle = null;
        render();
      },
    }),
  );
}

// ============================================================
// Form fields
// ============================================================
function renderFields(fields, obj, onAnyChange = () => {}) {
  const wrapper = el('div', { class: 'fields' });
  const changed = () => {
    onAnyChange();
    refreshChangeCount();
  };
  for (const field of fields) wrapper.append(renderField(field, obj, changed));
  return wrapper;
}

function renderField(field, obj, changed) {
  const label = el('span', { text: field.label + (field.optional ? ' (optional)' : '') });
  const hint = field.hint ? el('small', { text: field.hint }) : null;
  const set = (value) => {
    if ((value === '' || value === null) && field.optional) delete obj[field.key];
    else obj[field.key] = value;
    if (field.key === 'submissionsEmail' && value === '') obj[field.key] = null;
    changed();
  };

  switch (field.type) {
    case 'longtext': {
      const input = el('textarea', { rows: 4 });
      input.value = obj[field.key] ?? '';
      input.addEventListener('input', () => set(input.value));
      return el('label', { class: 'field' }, label, hint, input);
    }
    case 'number': {
      const input = el('input', { type: 'number' });
      input.value = obj[field.key] ?? '';
      input.addEventListener('input', () => set(input.value === '' ? '' : Number(input.value)));
      return el('label', { class: 'field' }, label, hint, input);
    }
    case 'date': {
      const input = el('input', { type: 'date' });
      input.value = String(obj[field.key] ?? '').slice(0, 10);
      input.addEventListener('input', () => set(input.value));
      return el('label', { class: 'field' }, label, hint, input);
    }
    case 'checkbox': {
      const input = el('input', { type: 'checkbox' });
      input.checked = Boolean(obj[field.key]);
      input.addEventListener('change', () => {
        obj[field.key] = input.checked;
        changed();
      });
      return el('label', { class: 'field checkbox' }, input, label);
    }
    case 'select': {
      const input = el(
        'select',
        {},
        field.options.map((option) => el('option', { value: option, text: option })),
      );
      input.value = obj[field.key] ?? field.options[0];
      input.addEventListener('change', () => set(input.value));
      return el('label', { class: 'field' }, label, hint, input);
    }
    case 'list': {
      const input = el('textarea', { rows: 4 });
      input.value = (obj[field.key] ?? []).join('\n');
      input.addEventListener('input', () =>
        set(
          input.value
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean),
        ),
      );
      return el('label', { class: 'field' }, label, hint, input);
    }
    case 'object': {
      const inner = obj[field.key] ?? {};
      const group = el('fieldset', { class: 'group' }, el('legend', { text: field.label }));
      for (const sub of field.fields) {
        group.append(
          renderField({ ...sub, optional: true }, inner, () => {
            const hasValue = Object.values(inner).some((v) => v);
            if (hasValue) obj[field.key] = inner;
            else delete obj[field.key];
            changed();
          }),
        );
      }
      return group;
    }
    case 'photo':
      return renderPhotoField(field, obj, label, hint, set);
    default: {
      const input = el('input', { type: 'text' });
      input.value = obj[field.key] ?? '';
      input.addEventListener('input', () => set(input.value));
      return el('label', { class: 'field' }, label, hint, input);
    }
  }
}

function renderPhotoField(field, obj, label, hint, set) {
  const preview = el('img', { class: 'photo-preview', alt: '' });
  const showPreview = () => {
    const value = obj[field.key];
    const upload = value && state.uploads[`src/assets/${value}`];
    preview.src = upload ? upload.previewUrl : photoPreviewUrl(value);
    preview.hidden = !value;
  };
  showPreview();

  const fileInput = el('input', { type: 'file', accept: 'image/jpeg,image/png,image/webp' });
  fileInput.addEventListener('change', async () => {
    const file = fileInput.files[0];
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) {
      alert('That photo is over 20 MB. Please pick a smaller one.');
      return;
    }
    const safeName = file.name
      .toLowerCase()
      .replace(/\.[a-z]+$/, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const extension = (file.name.match(/\.(jpe?g|png|webp)$/i)?.[1] || 'jpg').toLowerCase();
    const value = `images/uploads/${Date.now()}-${safeName || 'photo'}.${extension}`;
    state.uploads[`src/assets/${value}`] = {
      base64: await fileToBase64(file),
      previewUrl: URL.createObjectURL(file),
    };
    set(value);
    showPreview();
  });

  const buttons = el(
    'span',
    { class: 'photo-buttons' },
    el('label', { class: 'button-like' }, 'Choose a new photo', fileInput),
    field.optional
      ? el('button', {
          type: 'button',
          text: 'No photo',
          onclick: () => {
            set('');
            showPreview();
          },
        })
      : null,
  );
  return el('div', { class: 'field' }, label, hint, preview, buttons);
}

function thumbnail(value) {
  if (!value) return el('span', { class: 'thumb empty' });
  const upload = state.uploads[`src/assets/${value}`];
  return el('img', {
    class: 'thumb',
    alt: '',
    loading: 'lazy',
    src: upload ? upload.previewUrl : photoPreviewUrl(value),
  });
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

console.info(`Aangan admin for ${REPO}`);
start();
