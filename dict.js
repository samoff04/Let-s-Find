// Elements
const searchBtn = document.getElementById('searchWordBtn');
const leaveBtn = document.getElementById('leaveBtn');

const wordPopup = document.getElementById('wordInputPopup');
const meaningPopup = document.getElementById('meaningPopup');
const leavePopup = document.getElementById('leavePopup');
const thanksPopup = document.getElementById('thanksPopup');

const wordInput = document.getElementById('wordInput');
const submitWordBtn = document.getElementById('submitWord');
const meaningText = document.getElementById('meaningText');
const closeMeaningBtn = document.getElementById('closeMeaning');

const confirmLeaveBtn = document.getElementById('confirmLeave');
const cancelLeaveBtn = document.getElementById('cancelLeave');

const appContainer = document.querySelector('.app-container');

// Helper: open popup
function openPopup(popup) {
  popup.setAttribute('aria-hidden', 'false');
  popup.style.display = 'flex';
  const focusable = popup.querySelector('input, button, [tabindex]:not([tabindex="-1"])');
  if (focusable) focusable.focus();
  document.body.style.overflow = 'hidden'; // prevent background scroll
}

// Helper: close popup
function closePopup(popup) {
  popup.setAttribute('aria-hidden', 'true');
  popup.style.display = 'none';
  document.body.style.overflow = ''; // restore scroll
}

// Close all popups except thanks popup
function closeAllPopups() {
  [wordPopup, meaningPopup, leavePopup].forEach(p => closePopup(p));
}

// Fetch meaning from API
async function fetchMeaning(word) {
  meaningText.textContent = 'Loading...';
  openPopup(meaningPopup);
  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
    if (!res.ok) throw new Error('Word not found');
    const data = await res.json();
    // Show first definition
    const meaning = data[0]?.meanings[0]?.definitions[0]?.definition;
    if (meaning) {
      meaningText.textContent = meaning;
    } else {
      meaningText.textContent = 'No definition found.';
    }
  } catch (err) {
    meaningText.textContent = 'No definition found.';
  }
}

// Event: open word input popup
searchBtn.addEventListener('click', () => {
  wordInput.value = '';
  closeAllPopups();
  openPopup(wordPopup);
});

// Event: submit word
submitWordBtn.addEventListener('click', () => {
  const word = wordInput.value.trim();
  if (!word) {
    alert('Please enter a word!');
    wordInput.focus();
    return;
  }
  closePopup(wordPopup);
  fetchMeaning(word);
});

// Close meaning popup
closeMeaningBtn.addEventListener('click', () => {
  closePopup(meaningPopup);
});

// Leave app confirmation
leaveBtn.addEventListener('click', () => {
  closeAllPopups();
  openPopup(leavePopup);
});

// Confirm leave
confirmLeaveBtn.addEventListener('click', () => {
  closePopup(leavePopup);
  closeAllPopups();
  appContainer.style.filter = 'blur(4px) grayscale(0.4)';
  appContainer.style.pointerEvents = 'none';
  openPopup(thanksPopup);
});

// Cancel leave
cancelLeaveBtn.addEventListener('click', () => {
  closePopup(leavePopup);
  appContainer.style.filter = '';
  appContainer.style.pointerEvents = '';
});

// Close popups if click outside popup-content
[wordPopup, meaningPopup, leavePopup].forEach(popup => {
  popup.addEventListener('click', e => {
    if (e.target === popup) closePopup(popup);
  });
});

// Accessibility: Close popup on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (wordPopup.getAttribute('aria-hidden') === 'false') {
      closePopup(wordPopup);
      searchBtn.focus();
    } else if (meaningPopup.getAttribute('aria-hidden') === 'false') {
      closePopup(meaningPopup);
      searchBtn.focus();
    } else if (leavePopup.getAttribute('aria-hidden') === 'false') {
      closePopup(leavePopup);
      leaveBtn.focus();
    }
  }
});
