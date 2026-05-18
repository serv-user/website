const app = document.getElementById("app");

/* LOAD SECTION */
async function loadSection(name) {
  try {
    const res = await fetch(`./sections/${name}.html`);
    
    if (!res.ok) {
      throw new Error(`Failed to load ${name}: ${res.status}`);
    }
    
    const html = await res.text();
    app.innerHTML = html;
    window.scrollTo(0, 0);

    console.log(`Loaded section: ${name}`);


  } catch (error) {
    console.error(error);
    app.innerHTML = `
      <section class="section">
        <h2>Oops! Something went wrong</h2>
        <p>We couldn't load that page. Please try again.</p>
        <button class="btn-primary" data-load="home">Return to home</button>
      </section>
    `;
  }
}

/* NAVIGATION */
document.addEventListener("click", e => {
  const link = e.target.closest("[data-load]");
  if (!link) return;

  e.preventDefault();
  loadSection(link.dataset.load);

  const navLinks = document.querySelector(".nav-links");
  navLinks?.classList.remove("open");
  
  // Restore scroll when closing menu
  document.body.style.overflow = "";
});

/* BURGER MENU */
const burger = document.querySelector(".burger");
const navLinks = document.querySelector(".nav-links");

burger.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  burger.setAttribute("aria-expanded", open);
  
  // Prevent scroll when menu is open on mobile
  if (open) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
});

/* INITIAL LOAD */
loadSection("home");


/* THEME TOGGLE */

function initTheme() {
  const btn = document.createElement("button");
  btn.className = "theme-fab";
  btn.setAttribute("aria-label", "Toggle theme");
  document.body.appendChild(btn);

  const phases = ["🌑", "🌒", "🌓", "🌔", "🌕"];

  let dark = localStorage.getItem("theme") === "dark";
  document.body.classList.toggle("dark", dark);
  btn.textContent = dark ? "🌑" : "🌕";

  btn.addEventListener("click", () => {
    btn.classList.add("animate");
    setTimeout(() => btn.classList.remove("animate"), 150);

    animatePhase(dark ? phases : [...phases].reverse());

    dark = !dark;
    document.body.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  });

  function animatePhase(sequence) {
    sequence.forEach((emoji, i) => {
      setTimeout(() => {
        btn.textContent = emoji;
      }, i * 40);
    });
  }
}

/* INIT */
initTheme();

/* CONTACT FORM FUNCTIONS */
function showContactForm(type) {
  const choices = document.getElementById('contactChoices');
  const jobsForm = document.getElementById('jobsForm');
  const helpForm = document.getElementById('helpForm');
  
  if (!choices || !jobsForm || !helpForm) return;
  
  choices.style.display = 'none';
  if (type === 'jobs') {
    jobsForm.style.display = 'block';
  } else if (type === 'help') {
    helpForm.style.display = 'block';
  }
}

function showContactChoices() {
  const choices = document.getElementById('contactChoices');
  const jobsForm = document.getElementById('jobsForm');
  const helpForm = document.getElementById('helpForm');
  
  if (!choices || !jobsForm || !helpForm) return;
  
  choices.style.display = 'grid';
  jobsForm.style.display = 'none';
  helpForm.style.display = 'none';
}

function handleJobsSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');
  const originalText = btn.textContent;
  
  btn.disabled = true;
  btn.textContent = '⏳ Sending...';
  
  // Submit to Formspree
  fetch('https://formspree.io/f/mbjkydbq', {
    method: 'POST',
    body: new FormData(form),
    headers: {
      'Accept': 'application/json'
    }
  })
  .then(response => {
    if (response.ok) {
      btn.textContent = '✓ CV Sent!';
      btn.style.background = '#10b981';
      setTimeout(() => {
        showContactChoices();
        form.reset();
        btn.textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
      }, 2000);
    } else {
      throw new Error('Form submission failed');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    btn.textContent = '✗ Failed';
    btn.style.background = '#ef4444';
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
      btn.disabled = false;
    }, 2000);
  });
}

function handleHelpSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');
  const originalText = btn.textContent;
  
  btn.disabled = true;
  btn.textContent = '⏳ Sending...';
  
  // Submit to Formspree
  fetch('https://formspree.io/f/mbjkydbq', {
    method: 'POST',
    body: new FormData(form),
    headers: {
      'Accept': 'application/json'
    }
  })
  .then(response => {
    if (response.ok) {
      btn.textContent = '✓ Request Sent!';
      btn.style.background = '#10b981';
      setTimeout(() => {
        showContactChoices();
        form.reset();
        btn.textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
      }, 2000);
    } else {
      throw new Error('Form submission failed');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    btn.textContent = '✗ Failed';
    btn.style.background = '#ef4444';
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
      btn.disabled = false;
    }, 2000);
  });
}
