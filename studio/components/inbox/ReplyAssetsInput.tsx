import {useEffect, useRef, useState, type DragEvent} from 'react'
import {TrashIcon} from '@sanity/icons/Trash'
import {UploadIcon} from '@sanity/icons/Upload'
import {Box, Button, Card, Flex, Stack, Text} from '@sanity/ui'
import {
  insert,
  setIfMissing,
  unset,
  useClient,
  useFormValue,
  type ArrayOfObjectsInputProps,
} from 'sanity'
import {
  ASSET_SOURCE,
  MAX_REPLY_FILES,
  MAX_REPLY_FILES_BYTES,
  MAX_REPLY_PHOTO_BYTES,
  MAX_REPLY_PHOTOS,
  REPLY_FILE_TYPES,
  REPLY_PHOTO_TYPES,
} from '../../shared/replyRules.js'
import {apiVersion} from '../../siteUrl'
import {heicToJpeg, isHeicFile, MAX_HEIC_BYTES} from './heicToJpeg'

// Attachments and photos of a reply concept: drop or choose files, HEIC becomes JPEG first.
// The website checks type and size again before sending.

type Kind = 'file' | 'image'
type Item = {_key: string; asset?: {_ref?: string} | null}
type Upload = {
  _id: string
  originalFilename: string | null
  size: number | null
  url: string | null
}

const MB = 1024 * 1024

function sizeText(bytes: number | null): string {
  return bytes === null
    ? ''
    : bytes >= MB
      ? `${(bytes / MB).toFixed(1).replace('.', ',')} MB`
      : `${Math.max(1, Math.round(bytes / 1024))} kB`
}

/** A Dutch message, or null when the selection may be uploaded. */
function refusal(kind: Kind, files: File[], count: number, bytes: number): string | null {
  const types = kind === 'image' ? REPLY_PHOTO_TYPES : REPLY_FILE_TYPES
  const max = kind === 'image' ? MAX_REPLY_PHOTOS : MAX_REPLY_FILES

  if (count + files.length > max) {
    return kind === 'image'
      ? `Hoogstens ${max} foto's per mail.`
      : `Hoogstens ${max} bijlagen per mail.`
  }
  if (files.some((file) => !types.includes(file.type))) {
    return kind === 'image' ? "Alleen JPG- of PNG-foto's." : 'Alleen PDF-, JPG- of PNG-bestanden.'
  }
  if (kind === 'image' && files.some((file) => file.size > MAX_REPLY_PHOTO_BYTES)) {
    return `Een foto mag hoogstens ${MAX_REPLY_PHOTO_BYTES / MB} MB zijn.`
  }
  if (
    kind === 'file' &&
    bytes + files.reduce((total, file) => total + file.size, 0) > MAX_REPLY_FILES_BYTES
  ) {
    return `De bijlagen mogen samen hoogstens ${MAX_REPLY_FILES_BYTES / MB} MB zijn.`
  }
  return null
}

function ReplyAssetsInput({props, kind}: {props: ArrayOfObjectsInputProps; kind: Kind}) {
  const client = useClient({apiVersion})
  const messageId = useFormValue(['_id'])
  const input = useRef<HTMLInputElement>(null)
  const items = (props.value ?? []) as Item[]
  const ids = items.flatMap((item) => (item.asset?._ref ? [item.asset._ref] : []))
  const idList = ids.join(',')
  const [uploads, setUploads] = useState<Record<string, Upload>>({})
  const [busy, setBusy] = useState<'converting' | 'uploading' | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    const wanted = idList ? idList.split(',') : []

    if (wanted.length > 0) {
      client
        .fetch<Upload[]>(
          `*[_id in $ids && _type in ["sanity.fileAsset", "sanity.imageAsset"]]{ _id, originalFilename, size, url }`,
          {ids: wanted},
        )
        .then(
          (result) =>
            active && setUploads(Object.fromEntries(result.map((upload) => [upload._id, upload]))),
        )
        .catch(() => undefined)
    }

    return () => {
      active = false
    }
  }, [client, idList])

  async function convertHeic(selection: File[]): Promise<File[] | null> {
    if (selection.some((file) => isHeicFile(file) && file.size > MAX_HEIC_BYTES)) {
      setError(`Een HEIC-foto mag hoogstens ${MAX_HEIC_BYTES / MB} MB zijn.`)
      return null
    }
    if (!selection.some(isHeicFile)) return selection

    setBusy('converting')
    try {
      const converted = []
      // One at a time: decoding a photo takes a lot of memory.
      for (const file of selection) converted.push(isHeicFile(file) ? await heicToJpeg(file) : file)
      return converted
    } catch {
      setError('Deze HEIC-foto kon niet worden omgezet. Bewaar hem als JPG en probeer het opnieuw.')
      return null
    } finally {
      setBusy(null)
    }
  }

  function resetInput() {
    if (input.current) input.current.value = ''
  }

  async function add(chosen: File[]) {
    setError(null)
    const selection = await convertHeic(chosen)
    if (!selection) return resetInput()

    const bytes = ids.reduce((total, id) => total + (uploads[id]?.size ?? 0), 0)
    const problem = refusal(kind, selection, items.length, bytes)
    setError(problem)
    if (problem || selection.length === 0) return resetInput()

    setBusy('uploading')
    try {
      const added = []
      for (const file of selection) {
        const asset = await client.assets.upload(kind === 'image' ? 'image' : 'file', file, {
          filename: file.name,
          source: {name: ASSET_SOURCE, id: typeof messageId === 'string' ? messageId : 'message'},
        })
        added.push({
          _key: crypto.randomUUID().slice(0, 12),
          _type: kind,
          asset: {_type: 'reference', _ref: asset._id},
        })
      }
      props.onChange([setIfMissing([]), insert(added, 'after', [-1])])
    } catch {
      setError('Uploaden is mislukt. Probeer het opnieuw.')
    } finally {
      setBusy(null)
      resetInput()
    }
  }

  function drop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    if (busy === null && !props.readOnly) void add([...event.dataTransfer.files])
  }

  const types = kind === 'image' ? REPLY_PHOTO_TYPES : REPLY_FILE_TYPES

  return (
    <Stack gap={3}>
      {items.map((item) => {
        const upload = item.asset?._ref ? uploads[item.asset._ref] : undefined
        return (
          <Card key={item._key} padding={2} radius={2} border>
            <Flex gap={3} align="center">
              {kind === 'image' && upload?.url && (
                <img
                  src={`${upload.url}?w=96&h=96&fit=crop`}
                  alt=""
                  width={48}
                  height={48}
                  style={{display: 'block', borderRadius: 4}}
                />
              )}
              <Box flex={1}>
                <Text size={1} textOverflow="ellipsis">
                  {upload?.originalFilename ?? (kind === 'image' ? 'Foto' : 'Bijlage')}
                </Text>
                <Text size={1} muted>
                  {sizeText(upload?.size ?? null)}
                </Text>
              </Box>
              <Button
                icon={TrashIcon}
                mode="bleed"
                tone="critical"
                aria-label="Verwijderen"
                disabled={busy !== null || props.readOnly}
                onClick={() => props.onChange(unset([{_key: item._key}]))}
              />
            </Flex>
          </Card>
        )
      })}
      <Card
        padding={3}
        radius={2}
        border
        style={{borderStyle: 'dashed'}}
        onDragOver={(event) => event.preventDefault()}
        onDrop={drop}
      >
        <Flex gap={3} align="center" wrap="wrap">
          <Button
            icon={UploadIcon}
            text={
              busy === 'converting'
                ? 'HEIC wordt omgezet naar JPG…'
                : busy === 'uploading'
                  ? 'Bezig met uploaden…'
                  : kind === 'image'
                    ? 'Foto toevoegen'
                    : 'Bijlage toevoegen'
            }
            mode="ghost"
            disabled={busy !== null || props.readOnly}
            onClick={() => input.current?.click()}
          />
          <Text size={1} muted>
            of sleep {kind === 'image' ? "foto's" : 'bestanden'} hierheen
          </Text>
        </Flex>
        <input
          ref={input}
          type="file"
          multiple
          hidden
          accept={[...types, 'image/heic', 'image/heif', '.heic', '.heif'].join(',')}
          onChange={(event) => void add([...(event.target.files ?? [])])}
        />
      </Card>
      {error && (
        <Card tone="critical" padding={3} radius={2} role="alert">
          <Text size={1}>{error}</Text>
        </Card>
      )}
    </Stack>
  )
}

export function ReplyFilesInput(props: ArrayOfObjectsInputProps) {
  return <ReplyAssetsInput props={props} kind="file" />
}

export function ReplyPhotosInput(props: ArrayOfObjectsInputProps) {
  return <ReplyAssetsInput props={props} kind="image" />
}
