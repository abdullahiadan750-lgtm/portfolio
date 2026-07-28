document.addEventListener('DOMContentLoaded', () => {

  /* =========================================================
     Mobile nav toggle
  ========================================================= */
  const navToggle = document.getElementById('navToggle');
  const navTabs = document.getElementById('navTabs');

  navToggle.addEventListener('click', () => {
    const isOpen = navTabs.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  navTabs.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      navTabs.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* =========================================================
     Active tab highlight based on scroll position
  ========================================================= */
  const sections = document.querySelectorAll('main section[id]');
  const tabs = document.querySelectorAll('.tab');

  const highlightActiveTab = () => {
    let currentId = sections[0] ? sections[0].id : '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      if (scrollPos >= section.offsetTop) {
        currentId = section.id;
      }
    });

    tabs.forEach(tab => {
      const targetId = tab.getAttribute('href').replace('#', '');
      tab.classList.toggle('is-active', targetId === currentId);
    });
  };

  window.addEventListener('scroll', highlightActiveTab, { passive: true });
  highlightActiveTab();

  /* =========================================================
     Terminal typing effect
  ========================================================= */
  const typedCmdEl = document.getElementById('typedCmd');
  const typeCursor = document.getElementById('typeCursor');
  const terminalOutput = document.getElementById('terminalOutput');
  const command = 'whoami';
  let charIndex = 0;

  const typeCommand = () => {
    if (charIndex <= command.length) {
      typedCmdEl.textContent = command.slice(0, charIndex);
      charIndex++;
      setTimeout(typeCommand, 130);
    } else {
      setTimeout(() => {
        terminalOutput.hidden = false;
        typeCursor.style.display = 'none';
      }, 350);
    }
  };
  setTimeout(typeCommand, 600);

  /* =========================================================
     Scroll reveal animations
  ========================================================= */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* =========================================================
     Skill progress bars — animate fill when scrolled into view
  ========================================================= */
  const skillBars = document.querySelectorAll('.skill-bar');

  if ('IntersectionObserver' in window) {
    const skillObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const percent = entry.target.getAttribute('data-percent') || '0';
          const fill = entry.target.querySelector('.skill-bar__fill');
          fill.style.width = percent + '%';
          skillObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    skillBars.forEach(bar => skillObserver.observe(bar));
  } else {
    skillBars.forEach(bar => {
      const percent = bar.getAttribute('data-percent') || '0';
      bar.querySelector('.skill-bar__fill').style.width = percent + '%';
    });
  }

  /* =========================================================
     Back to top
  ========================================================= */
  document.getElementById('toTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* =========================================================
     Footer year
  ========================================================= */
  document.getElementById('footerYear').textContent = new Date().getFullYear();

  /* =========================================================
     Contact form validation + mailto handoff
  ========================================================= */
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const submitLabel = document.getElementById('submitLabel');
  const formStatus = document.getElementById('formStatus');

  const fields = {
    name: { el: document.getElementById('name'), error: document.getElementById('nameError') },
    email: { el: document.getElementById('email'), error: document.getElementById('emailError') },
    subject: { el: document.getElementById('subject'), error: document.getElementById('subjectError') },
    message: { el: document.getElementById('message'), error: document.getElementById('messageError') },
  };

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const setError = (field, message) => {
    field.el.closest('.form-field').classList.toggle('has-error', Boolean(message));
    field.error.textContent = message || '';
  };

  const validateField = (key) => {
    const field = fields[key];
    const value = field.el.value.trim();

    if (!value) {
      setError(field, 'This field is required.');
      return false;
    }
    if (key === 'email' && !emailPattern.test(value)) {
      setError(field, 'Enter a valid email address.');
      return false;
    }
    if (key === 'message' && value.length < 10) {
      setError(field, 'Message should be at least 10 characters.');
      return false;
    }
    setError(field, '');
    return true;
  };

  Object.keys(fields).forEach(key => {
    fields[key].el.addEventListener('blur', () => validateField(key));
    fields[key].el.addEventListener('input', () => {
      if (fields[key].el.closest('.form-field').classList.contains('has-error')) {
        validateField(key);
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const results = Object.keys(fields).map(key => validateField(key));
    const isValid = results.every(Boolean);

    formStatus.classList.remove('is-error');

    if (!isValid) {
      formStatus.textContent = 'Please fix the highlighted fields.';
      formStatus.classList.add('is-error');
      return;
    }

    const name = fields.name.el.value.trim();
    const email = fields.email.el.value.trim();
    const subject = fields.subject.el.value.trim();
    const message = fields.message.el.value.trim();

    submitBtn.disabled = true;
    submitLabel.textContent = 'Sending…';

    // Simulate submission, then open the user's email client with the
    // message pre-filled. Replace this with a real backend or a service
    // like Formspree if you want the form to send without opening email.
    setTimeout(() => {
      const mailBody = `From: ${name} (${email})%0D%0A%0D%0A${encodeURIComponent(message)}`;
      const mailtoLink = `mailto:abdullahikaazi39@gmail.com?subject=${encodeURIComponent(subject)}&body=${mailBody}`;
      window.location.href = mailtoLink;

      submitBtn.disabled = false;
      submitLabel.textContent = 'Send message';
      formStatus.textContent = 'Opening your email app to send the message…';
      form.reset();
    }, 700);
  });

});