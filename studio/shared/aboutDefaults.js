// The texts of the About section, shared by the Studio and the site: a new "Tekst Over mij" document
// starts with them, and the site shows them until that document is published.

export const ABOUT_DOCUMENT_ID = 'aboutPage'

const paragraph = (key, text) => ({
  _type: 'block',
  _key: key,
  style: 'normal',
  markDefs: [],
  children: [{_type: 'span', _key: `${key}-text`, text, marks: []}],
})

export const ABOUT_DEFAULTS = {
  title: 'Get to know me',
  tagline: 'Frontend developer with broad development experience',
  heading: 'Dynamic web applications that are clear, fast and',
  highlight: 'easy to use.',
  body: [
    paragraph(
      'intro',
      'I specialize in PHP development, working daily on both frontend and backend development. In my current role, I primarily use PHP, Zend Framework 1, and Bootstrap 5 to build, maintain, and improve web applications.',
    ),
    paragraph(
      'clients',
      'Alongside my full time job, I develop websites for clients using modern technologies such as React, TypeScript, Laravel, and Tailwind CSS.',
    ),
    paragraph(
      'combination',
      'This combination gives me experience in both legacy systems and modern web development, allowing me to work across the entire development process, from responsive user interfaces to backend functionality, with a strong focus on clean code, reusable components, performance, and maintainability.',
    ),
  ],
}
