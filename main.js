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
  const name = form.querySelector('[name="name"]').value;
  const email = form.querySelector('[name="email"]').value;
  const phone = form.querySelector('[name="phone"]').value || 'Not provided';
  const cvFile = form.querySelector('[name="cv"]').files[0]?.name || 'CV attached';
  
  const subject = encodeURIComponent('Job Application from ' + name);
  const body = encodeURIComponent(
    `Hello,\n\nI am interested in working with Radu Total Service.\n\n` +
    `Name: ${name}\n` +
    `Email: ${email}\n` +
    `Phone: ${phone}\n` +
    `CV: ${cvFile}\n\n` +
    `Best regards,\n${name}`
  );
  
  const mailtoLink = `mailto:info@raduservices.dk?subject=${subject}&body=${body}`;
  
  const btn = form.querySelector('button[type="submit"]');
  const originalText = btn.textContent;
  btn.disabled = true;
  btn.textContent = '✓ Opening email...';
  
  setTimeout(() => {
    window.location.href = mailtoLink;
    setTimeout(() => {
      showContactChoices();
      form.reset();
      btn.textContent = originalText;
      btn.disabled = false;
    }, 500);
  }, 500);
}

function handleHelpSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const company = form.querySelector('[name="company"]').value;
  const email = form.querySelector('[name="email"]').value;
  const message = form.querySelector('[name="message"]').value;
  
  const subject = encodeURIComponent('Support Request from ' + company);
  const body = encodeURIComponent(
    `Hello,\n\nI need support from Radu Total Service.\n\n` +
    `Company: ${company}\n` +
    `Email: ${email}\n\n` +
    `Request:\n${message}\n\n` +
    `Best regards,\n${company}`
  );
  
  const mailtoLink = `mailto:info@raduservices.dk?subject=${subject}&body=${body}`;
  
  const btn = form.querySelector('button[type="submit"]');
  const originalText = btn.textContent;
  btn.disabled = true;
  btn.textContent = '✓ Opening email...';
  
  setTimeout(() => {
    window.location.href = mailtoLink;
    setTimeout(() => {
      showContactChoices();
      form.reset();
      btn.textContent = originalText;
      btn.disabled = false;
    }, 500);
  }, 500);
}
