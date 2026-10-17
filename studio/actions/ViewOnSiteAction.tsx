import {LaunchIcon} from '@sanity/icons/Launch'
import type {DocumentActionComponent} from 'sanity'
import {SITE_SECTIONS, SITE_URL} from '../siteUrl'

// Opens the section of the site where this document is shown.
export const ViewOnSiteAction: DocumentActionComponent = ({type, published}) => {
  const section = SITE_SECTIONS[type]
  if (!section) return null

  return {
    label: 'Bekijk op de website',
    icon: LaunchIcon,
    disabled: !published,
    title: published ? undefined : 'Publiceer eerst; daarna staat het op de website.',
    onHandle: () => {
      window.open(`${SITE_URL}/#${section}`, '_blank', 'noopener')
    },
  }
}
