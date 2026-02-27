# nextchapter-travel-site

This repository contains a multi‑site architecture for **Next Chapter Travel**.

## Structure

- **Root (/)**
  - The root directory contains a cinematic travel website with video backgrounds. Pages include:
    - `index.html` – Home page with a full‑screen video hero, introducing journeys of unforgettable luxury.
    - `trips.html` – Destinations page with slow‑motion montage.
    - `about.html` – About page with lifestyle footage.
    - `testimonials.html` – Testimonials page with soft atmospheric video.
    - `contact.html` – Contact page with elegant video and a call to action.
  - The `css/style.css` file defines reusable styles for the video hero sections, typography, buttons, and responsive breakpoints.
  - The `videos/` directory contains placeholders for your MP4 files. Replace the `.gitkeep` file with your compressed videos (8–15 seconds, 3–6 MB each) and match the file names referenced in the HTML.
  - The `images/` directory holds fallback images for mobile devices; add your own high‑quality JPGs here.

- **nextchapter/**  
  - This folder contains a separate static site built for a “Next Chapter Travel” Disney‑themed offering.  
  - Pages include:
    - `index.html` – Landing page with an animated starfield hero and trust bar.
    - `wdw.html` – Walt Disney World page.
    - `cruise.html` – Disney Cruise Line page.
    - `aulani.html` – Aulani Resort page.
    - `adventures.html` – Adventures by Disney page.
    - `international.html` – International Parks page.
    - `contact.html` – Contact page with a starfield hero and form.
  - The `css/next-style.css` file contains custom CSS for the starfield effect, navigation, and responsive design.

## How to Use

1. **Clone or download** this repository.
2. Replace the placeholder videos in `videos/` with your own optimized MP4 files and adjust the `<source src>` attributes in the HTML accordingly.
3. Update the copy, logos, and color palette to match your brand.
4. Deploy each site separately:
   - The root site can be deployed to a domain like `example.com`.
   - The `nextchapter` site can be deployed to a subdirectory or its own domain (`/nextchapter`), or configured as a separate Netlify deployment pointing at the `nextchapter` folder.
5. Use a CDN to serve videos and images for optimal performance.

## Licensing

Specify any licensing or attribution requirements for the videos, images, or fonts used in your final production site.
