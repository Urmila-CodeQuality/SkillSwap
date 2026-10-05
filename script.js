const STORAGE_KEY = 'skillswap-posts-v1';
const SEARCH_INPUT = document.getElementById('searchInput');
const POST_FORM = document.getElementById('postForm');
const POST_LIST = document.getElementById('postList');
const EMPTY_STATE = document.getElementById('emptyState');
const MODAL = document.getElementById('requestModal');
const MODAL_MESSAGE = document.getElementById('requestMessage');
const MAILTO_LINK = document.getElementById('mailtoLink');
const CLOSE_MODAL = document.getElementById('closeModal');
const COPY_MESSAGE = document.getElementById('copyMessage');

const SAMPLE_POSTS = [
  {
    id: 'sample-1',
    name: 'Maya',
    type: 'can-tutor',
    topic: 'Statistics',
    teachInReturn: 'Python basics',
    format: 'online',
    availability: 'Tue & Thu 7-9pm',
    contact: 'maya@campusmail.edu',
    owner: false,
  },
  {
    id: 'sample-2',
    name: 'Leo',
    type: 'need-help',
    topic: 'Calculus II',
    teachInReturn: 'Spanish conversation',
    format: 'in-person',
    availability: 'Wednesday afternoons',
    contact: 'leoj@discord',
    owner: false,
  },
  {
    id: 'sample-3',
    name: 'Priya',
    type: 'can-tutor',
    topic: 'Accounting',
    teachInReturn: '',
    format: 'online',
    availability: 'Weekends only',
    contact: 'priya@campusmail.edu',
    owner: false,
  },
  {
    id: 'sample-4',
    name: 'Daniel',
    type: 'need-help',
    topic: 'Organic Chemistry',
    teachInReturn: 'Intro to R',
    format: 'in-person',
    availability: 'Mon 5-7pm',
    contact: 'daniel#2341',
    owner: false,
  },
  {
    id: 'sample-5',
    name: 'Sofia',
    type: 'can-tutor',
    topic: 'Spanish',
    teachInReturn: 'Statistics help',
    format: 'online',
    availability: 'Sun evenings',
    contact: 'sofia@campusmail.edu',
    owner: false,
  },
  {
    id: 'sample-6',
    name: 'Hassan',
    type: 'need-help',
    topic: 'Physics',
    teachInReturn: '',
    format: 'in-person',
    availability: 'After 6pm weekdays',
    contact: 'hassan@campusmail.edu',
    owner: false,
  },
  {
    id: 'sample-7',
    name: 'Elena',
    type: 'can-tutor',
    topic: 'Python',
    teachInReturn: 'Essay editing',
    format: 'online',
    availability: 'Thu 4-8pm',
    contact: 'elena@campusmail.edu',
    owner: false,
  },
  {
    id: 'sample-8',
    name: 'Noah',
    type: 'need-help',
    topic: 'Biology',
    teachInReturn: 'Graphic design basics',
    format: 'in-person',
    availability: 'Fridays 10am-2pm',
    contact: 'noah#9932',
    owner: false,
  },
];

const state = {
  search: '',
  formatFilter: 'all',
  offerFilter: 'all',
  highlightedIds: [],
};

let posts = loadPosts();

function normalizeText(value) {
  return String(value || '').trim().toLowerCase();
}

function buildMailtoLink(contact, topic) {
  const safeTopic = encodeURIComponent(topic || 'SkillSwap request');

  if (contact && contact.includes('@')) {
    return `mailto:${contact}?subject=${safeTopic}&body=${encodeURIComponent('Hi, I saw your SkillSwap post and would like to connect about this topic.')}`;
  }

  return `mailto:hello@skillswap.app?subject=${safeTopic}&body=${encodeURIComponent(`Hi, I saw your SkillSwap post and would like to connect about ${topic || 'this topic'}.`)}`;
}

function hasSwap(post) {
  return Boolean(normalizeText(post.teachInReturn));
}

function getOfferLabel(post) {
  return hasSwap(post) ? 'Swap' : 'Free help';
}

function getOfferType(post) {
  return hasSwap(post) ? 'swap' : 'free-help';
}

function getTypeLabel(post) {
  return post.type === 'need-help' ? 'I need help' : 'I can tutor';
}

function getRequestAction(post) {
  return hasSwap(post) ? 'Request swap' : 'Request help';
}

function getEffectiveContact(post) {
  return post.contact?.trim() || 'No contact provided';
}

function savePosts() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

function loadPosts() {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_POSTS));
    return [...SAMPLE_POSTS];
  }

  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) && parsed.length ? parsed : [...SAMPLE_POSTS];
  } catch (error) {
    console.warn('Unable to parse saved posts:', error);
    return [...SAMPLE_POSTS];
  }
}

function setFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(`${fieldId}Error`);

  if (field) {
    field.classList.toggle('invalid', Boolean(message));
  }

  if (error) {
    error.textContent = message || '';
  }
}

function validateForm() {
  const formData = new FormData(POST_FORM);
  const values = {
    name: String(formData.get('name') || '').trim(),
    type: String(formData.get('type') || '').trim(),
    topic: String(formData.get('topic') || '').trim(),
    teachInReturn: String(formData.get('teachInReturn') || '').trim(),
    format: String(formData.get('format') || '').trim(),
    availability: String(formData.get('availability') || '').trim(),
    contact: String(formData.get('contact') || '').trim(),
  };

  let isValid = true;

  if (!values.name) {
    setFieldError('name', 'Please enter your name.');
    isValid = false;
  } else {
    setFieldError('name', '');
  }

  if (!values.type) {
    setFieldError('type', 'Please choose a post type.');
    isValid = false;
  } else {
    setFieldError('type', '');
  }

  if (!values.topic) {
    setFieldError('topic', 'Please tell us the course or topic.');
    isValid = false;
  } else {
    setFieldError('topic', '');
  }

  if (!values.format) {
    setFieldError('format', 'Please choose a preferred format.');
    isValid = false;
  } else {
    setFieldError('format', '');
  }

  if (!values.availability) {
    setFieldError('availability', 'Please share when you are available.');
    isValid = false;
  } else {
    setFieldError('availability', '');
  }

  if (!values.contact) {
    setFieldError('contact', 'Please add your email or Discord handle.');
    isValid = false;
  } else {
    setFieldError('contact', '');
  }

  return { isValid, values };
}

function buildPost(values) {
  return {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `post-${Date.now()}-${Math.random()}`,
    name: values.name,
    type: values.type,
    topic: values.topic,
    teachInReturn: values.teachInReturn,
    format: values.format,
    availability: values.availability,
    contact: values.contact,
    owner: true,
  };
}

function findMatches(newPost, previousPosts) {
  const newTopic = normalizeText(newPost.topic);
  const newSwapTopic = normalizeText(newPost.teachInReturn);

  return previousPosts
    .filter((post) => post.id !== newPost.id)
    .filter((post) => {
      const topic = normalizeText(post.topic);
      const swapTopic = normalizeText(post.teachInReturn);

      const sameTopic = Boolean(newTopic && topic && newTopic === topic);
      const matchesSwapToTopic = Boolean(newTopic && swapTopic && newTopic === swapTopic);
      const matchesTopicToSwap = Boolean(newSwapTopic && topic && newSwapTopic === topic);
      const sameSwap = Boolean(newSwapTopic && swapTopic && newSwapTopic === swapTopic);

      return sameTopic || matchesSwapToTopic || matchesTopicToSwap || sameSwap;
    })
    .map((post) => post.id);
}

function renderPosts() {
  const query = normalizeText(state.search);

  const filteredPosts = posts.filter((post) => {
    const topicMatch = !query || `${post.topic} ${post.teachInReturn}`.toLowerCase().includes(query);
    const formatMatch = state.formatFilter === 'all' || post.format === state.formatFilter;
    const offerMatch = state.offerFilter === 'all' || getOfferType(post) === state.offerFilter;

    return topicMatch && formatMatch && offerMatch;
  });

  POST_LIST.innerHTML = '';

  if (!filteredPosts.length) {
    EMPTY_STATE.classList.remove('hidden');
    return;
  }

  EMPTY_STATE.classList.add('hidden');

  filteredPosts.forEach((post) => {
    const card = document.createElement('article');
    const isPerfectMatch = state.highlightedIds.includes(post.id);
    card.className = `post-card ${isPerfectMatch ? 'perfect-match' : ''}`;

    const badgeMarkup = `
      <div class="badge-group">
        <span class="badge ${getOfferType(post) === 'swap' ? 'swap' : 'free-help'}">${getOfferLabel(post)}</span>
        ${isPerfectMatch ? '<span class="badge match">Perfect match</span>' : ''}
      </div>
    `;

    const teachMarkup = post.teachInReturn
      ? `<span class="teach-tag">Can teach in return: ${post.teachInReturn}</span>`
      : '';

    const deleteButton = post.owner
      ? `<button class="delete-button" type="button" data-delete-id="${post.id}" aria-label="Delete ${post.name}'s post">Delete</button>`
      : '';

    card.innerHTML = `
      <div class="post-header">
        <div class="user-meta">
          <h3>${post.name}</h3>
          <span class="badge informational">${getTypeLabel(post)}</span>
        </div>
        ${badgeMarkup}
      </div>

      <span class="topic-tag">${post.topic}</span>
      ${teachMarkup}

      <dl class="post-meta">
        <div class="meta-row">
          <dt>Format</dt>
          <dd>${post.format === 'online' ? 'Online' : 'In person'}</dd>
        </div>
        <div class="meta-row">
          <dt>Availability</dt>
          <dd>${post.availability}</dd>
        </div>
      </dl>

      <div class="card-actions">
        <button class="request-button" type="button" data-request-id="${post.id}" aria-label="Request a connection with ${post.name}">
          ${getRequestAction(post)}
        </button>
        ${deleteButton}
      </div>
    `;

    POST_LIST.appendChild(card);
  });
}

function openRequestModal(postId) {
  const selectedPost = posts.find((post) => post.id === postId);

  if (!selectedPost) {
    return;
  }

  const generatedMessage = `Hi ${selectedPost.name},\n\nI found your SkillSwap post for ${selectedPost.topic} and would love to connect. I am available ${selectedPost.availability}. Would you be open to talking more?\n\nThanks!`;

  MODAL_MESSAGE.value = generatedMessage;
  MAILTO_LINK.href = buildMailtoLink(selectedPost.contact, selectedPost.topic);
  MAILTO_LINK.textContent = selectedPost.contact && selectedPost.contact.includes('@') ? 'Email contact' : 'Email contact';
  MODAL.classList.remove('hidden');
  MODAL.setAttribute('aria-hidden', 'false');
}

function closeRequestModal() {
  MODAL.classList.add('hidden');
  MODAL.setAttribute('aria-hidden', 'true');
}

async function copyPreparedMessage() {
  try {
    await navigator.clipboard.writeText(MODAL_MESSAGE.value);
    COPY_MESSAGE.textContent = 'Copied!';
    setTimeout(() => {
      COPY_MESSAGE.textContent = 'Copy message';
    }, 1200);
  } catch (error) {
    console.warn('Clipboard copy failed:', error);
    MODAL_MESSAGE.focus();
    MODAL_MESSAGE.select();
  }
}

POST_FORM.addEventListener('submit', (event) => {
  event.preventDefault();

  const { isValid, values } = validateForm();
  if (!isValid) {
    return;
  }

  const newPost = buildPost(values);
  const previousPosts = [...posts];

  posts = [newPost, ...posts];
  savePosts();

  state.highlightedIds = findMatches(newPost, previousPosts);
  renderPosts();
  POST_FORM.reset();
});

SEARCH_INPUT.addEventListener('input', (event) => {
  state.search = event.target.value;
  renderPosts();
});

document.querySelectorAll('.filter-chip').forEach((chip) => {
  chip.addEventListener('click', () => {
    const group = chip.dataset.filterGroup;
    const value = chip.dataset.filterValue;

    if (group === 'all') {
      state.formatFilter = 'all';
      state.offerFilter = 'all';
    } else if (group === 'format') {
      state.formatFilter = value;
    } else {
      state.offerFilter = value;
    }

    document.querySelectorAll('.filter-chip').forEach((button) => {
      const active = button.dataset.filterGroup === group && button.dataset.filterValue === value;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });

    if (group === 'format') {
      const allChip = document.querySelector('[data-filter-group="all"]');
      allChip.classList.remove('active');
      allChip.setAttribute('aria-pressed', 'false');
    }

    if (group === 'offer') {
      const allChip = document.querySelector('[data-filter-group="all"]');
      allChip.classList.remove('active');
      allChip.setAttribute('aria-pressed', 'false');
    }

    if (group === 'all') {
      document.querySelectorAll('.filter-chip[data-filter-group="format"]').forEach((button) => {
        button.classList.remove('active');
        button.setAttribute('aria-pressed', 'false');
      });
      document.querySelectorAll('.filter-chip[data-filter-group="offer"]').forEach((button) => {
        button.classList.remove('active');
        button.setAttribute('aria-pressed', 'false');
      });
    }

    renderPosts();
  });
});

POST_LIST.addEventListener('click', (event) => {
  const requestButton = event.target.closest('[data-request-id]');
  if (requestButton) {
    openRequestModal(requestButton.dataset.requestId);
  }

  const deleteButton = event.target.closest('[data-delete-id]');
  if (deleteButton) {
    const targetId = deleteButton.dataset.deleteId;
    posts = posts.filter((post) => post.id !== targetId);
    savePosts();
    renderPosts();
  }
});

CLOSE_MODAL.addEventListener('click', closeRequestModal);
MODAL.addEventListener('click', (event) => {
  if (event.target.dataset.close === 'modal') {
    closeRequestModal();
  }
});

COPY_MESSAGE.addEventListener('click', copyPreparedMessage);
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !MODAL.classList.contains('hidden')) {
    closeRequestModal();
  }
});

renderPosts();
