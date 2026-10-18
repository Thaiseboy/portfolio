import {at, defineMigration, set} from 'sanity/migrate'

// Project descriptions used to be plain text. Every line becomes its own paragraph,
// and lines starting with "•", "-" or "*" become a bulleted list.
const BULLET = /^[•\-*]\s*/

const randomKey = () => Math.random().toString(36).slice(2, 12)

function toBlocks(text: string) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const isBullet = BULLET.test(line)
      return {
        _type: 'block',
        _key: randomKey(),
        style: 'normal',
        markDefs: [],
        ...(isBullet ? {listItem: 'bullet', level: 1} : {}),
        children: [
          {
            _type: 'span',
            _key: randomKey(),
            text: isBullet ? line.replace(BULLET, '') : line,
            marks: [],
          },
        ],
      }
    })
}

export default defineMigration({
  title: 'Project descriptions from plain text to rich text',
  documentTypes: ['project'],
  migrate: {
    document(doc) {
      if (typeof doc.description !== 'string') return undefined
      return at('description', set(toBlocks(doc.description)))
    },
  },
})
