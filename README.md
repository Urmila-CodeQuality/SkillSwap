# SkillSwap

SkillSwap is a mobile-first single-page web app designed for university students who need quick, budget-friendly academic support. It makes it easy to post either a tutoring request or an offer, then match with a peer who can help through free tutoring or a skill swap.

## Problem it solves

Many students need help understanding a difficult course, but private tutors are often too expensive. SkillSwap creates a peer-to-peer support network where students can help each other without paying cash.

## Target user

This app is built for students on a tight budget who are moving between classes and need a fast, simple way to find support from classmates using their phone.

## Features

- Mobile-first landing layout and clean card-based browsing
- Post form for requesting help or offering tutoring
- Required-field validation with friendly error messages
- Search by topic and chips for online / in person / swap / free help filters
- Smart match highlighting for relevant tutoring opportunities
- Request modal with copyable message and mailto link
- Local persistence using localStorage
- Delete button for posts created in the app
- Empty state messaging when no results match

## Run it locally

Because this project uses plain HTML, CSS, and vanilla JavaScript with no framework or build step, you can run it by opening index.html directly in a browser or by serving the folder locally.

Example:

```bash
cd "c:\Users\urmil\GUI Project"
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Files

- `index.html` – structure and layout
- `style.css` – responsive styling and mobile-first design
- `script.js` – app logic, state management, validation, filtering, and localStorage

## Notes

The app includes preloaded example posts so it feels realistic immediately, and user-created posts are stored in the browser for a simple local demo experience.
