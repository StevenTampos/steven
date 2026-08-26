# John Steven Tampos Portfolio

A responsive personal portfolio for John Steven Tampos, a BSIT student and full-stack developer based in Cebu, Philippines. The site presents selected projects, programming languages, experience, education, and contact links in a clean editorial layout.

## Highlights

- Warm light theme with a persistent dark-mode alternative
- Real-photo hero and avatar profile treatment
- Responsive desktop and mobile navigation
- CV-based programming language section with labeled icons
- Subtle scroll reveals, language-tile entrance animations, and focused hover states
- Project image previews with keyboard-accessible modal controls
- Reduced-motion support for visitors who prefer it

## Built With

- HTML5
- CSS3 with custom properties, Grid, Flexbox, and responsive media queries
- Vanilla JavaScript with the Intersection Observer API
- Google Fonts: Manrope
- Lucide icons and Devicon language icons

## Run Locally

No build step is required. Start a static server from the repository root:

```powershell
python -m http.server 8080
```

Then open `http://127.0.0.1:8080` in a browser.

## Project Structure

```text
Portfolio/
|-- img/             # Profile, project, and research imagery
|-- index.html       # Page content and structure
|-- styles.css       # Themes, layout, responsive styles, and motion
|-- script.js        # Navigation, theme toggle, reveals, and image modal
`-- README.md
```

## Customization

- Update project details, language icons, and contact links in `index.html`.
- Adjust light and dark color tokens at the top of `styles.css`.
- Theme preference is saved in the browser under `portfolio-theme`.

## Contact

- GitHub: [StevenTampos](https://github.com/StevenTampos)
- Email: johnsteventampos@gmail.com
