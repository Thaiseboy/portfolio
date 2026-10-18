import {useEffect, useState} from 'react'
import {AddIcon} from '@sanity/icons/Add'
import {DocumentPdfIcon} from '@sanity/icons/DocumentPdf'
import {HomeIcon} from '@sanity/icons/Home'
import {InboxIcon} from '@sanity/icons/Inbox'
import {ImagesIcon} from '@sanity/icons/Images'
import {LaunchIcon} from '@sanity/icons/Launch'
import {Box, Button, Card, Container, Flex, Grid, Heading, Stack, Text} from '@sanity/ui'
import {useClient, type Tool} from 'sanity'
import {useRouter} from 'sanity/router'
import {apiVersion, SITE_URL} from '../siteUrl'

type Counts = {projects: number; skills: number; photos: number; unread: number; hasCv: boolean}

const COUNTS_QUERY = `{
  "projects": count(*[_type == "project" && !(_id in path("drafts.**"))]),
  "skills": count(*[_type == "skill" && !(_id in path("drafts.**"))]),
  "photos": count(*[_type == "aboutMePhotos" && !(_id in path("drafts.**"))]),
  "unread": count(*[_type == "contactMessage" && unread == true]),
  "hasCv": count(*[_type == "cv" && defined(cvFile.asset)]) > 0
}`

// The first screen of the Studio: large buttons for the common tasks.
function StartScreen() {
  const client = useClient({apiVersion})
  const router = useRouter()
  const [counts, setCounts] = useState<Counts | null>(null)

  useEffect(() => {
    let active = true
    client
      .fetch<Counts>(COUNTS_QUERY)
      .then((result) => active && setCounts(result))
      .catch(() => active && setCounts(null))
    return () => {
      active = false
    }
  }, [client])

  const open = (path: string) => router.navigateUrl({path: `/studio/structure/${path}`})
  const create = (type: string) => router.navigateIntent('create', {type})

  const stats = [
    {label: 'Projecten', value: counts?.projects, path: 'projects'},
    {label: 'Skills', value: counts?.skills, path: 'skills;skills-all'},
    {label: "Foto's", value: counts?.photos, path: 'photos'},
    {
      label: 'Ongelezen e-mails',
      value: counts?.unread,
      path: 'inbox;inbox-unread',
      highlight: Boolean(counts?.unread),
    },
  ]

  return (
    <Container width={2} padding={5}>
      <Stack gap={5}>
        <Stack gap={3}>
          <Heading as="h1" size={3}>
            Welkom, Get
          </Heading>
          <Text size={2} muted>
            Wat wil je doen?
          </Text>
        </Stack>

        <Button
          icon={InboxIcon}
          text={counts?.unread ? `Inbox (${counts.unread} ongelezen)` : 'Inbox'}
          tone={counts?.unread ? 'caution' : 'primary'}
          fontSize={3}
          padding={5}
          onClick={() => open('inbox;inbox-all')}
        />

        <Grid gridTemplateColumns={[1, 1, 2]} gap={4}>
          <Button
            icon={AddIcon}
            text="Nieuw project"
            tone="primary"
            fontSize={3}
            padding={5}
            onClick={() => create('project')}
          />
          <Button
            icon={AddIcon}
            text="Nieuwe skill"
            tone="primary"
            fontSize={3}
            padding={5}
            onClick={() => create('skill')}
          />
          <Button
            icon={ImagesIcon}
            text="Foto toevoegen"
            mode="ghost"
            fontSize={3}
            padding={5}
            onClick={() => create('aboutMePhotos')}
          />
          <Button
            icon={DocumentPdfIcon}
            text={counts && !counts.hasCv ? 'CV uploaden (ontbreekt)' : 'CV bijwerken'}
            tone={counts && !counts.hasCv ? 'caution' : 'default'}
            mode={counts && !counts.hasCv ? 'default' : 'ghost'}
            fontSize={3}
            padding={5}
            onClick={() => open('cv')}
          />
          <Button
            icon={LaunchIcon}
            text="Website bekijken"
            mode="ghost"
            fontSize={3}
            padding={5}
            as="a"
            href={SITE_URL}
            target="_blank"
            rel="noopener"
          />
        </Grid>

        <Grid gridTemplateColumns={[2, 2, 4]} gap={3}>
          {stats.map((stat) => (
            <Card
              key={stat.label}
              as="button"
              padding={4}
              radius={3}
              shadow={1}
              tone={stat.highlight ? 'caution' : 'default'}
              onClick={() => open(stat.path)}
              style={{cursor: 'pointer', textAlign: 'left'}}
            >
              <Stack gap={3}>
                <Text size={4} weight="bold">
                  {stat.value ?? '–'}
                </Text>
                <Text size={1} muted>
                  {stat.label}
                </Text>
              </Stack>
            </Card>
          ))}
        </Grid>

        <Card padding={4} radius={3} tone="primary">
          <Stack gap={3}>
            <Text size={1} weight="semibold">
              Tips voor projectteksten
            </Text>
            <Text size={1}>
              Enter = nieuwe alinea · Shift + Enter = nieuwe regel binnen een alinea.
            </Text>
            <Text size={1}>
              Kopjes, lijstjes, vet, links en codeblokken vind je in de balk boven het tekstvak.
            </Text>
            <Text size={1}>
              Bij &quot;Volgorde&quot; bepaal je welk project bovenaan staat (laagste nummer eerst).
            </Text>
          </Stack>
        </Card>

        <Flex gap={3} wrap="wrap">
          <Button
            text="Alle projecten"
            mode="bleed"
            fontSize={2}
            onClick={() => open('projects')}
          />
          <Button
            text="Alle skills"
            mode="bleed"
            fontSize={2}
            onClick={() => open('skills;skills-all')}
          />
          <Button text="Foto's Over mij" mode="bleed" fontSize={2} onClick={() => open('photos')} />
        </Flex>

        <Box>
          <Text size={1} muted>
            Na &quot;Publiceren&quot; staat een wijziging binnen een minuut op de site.
          </Text>
        </Box>
      </Stack>
    </Container>
  )
}

export const startTool: Tool = {
  name: 'start',
  title: 'Start',
  icon: HomeIcon,
  component: StartScreen,
}
