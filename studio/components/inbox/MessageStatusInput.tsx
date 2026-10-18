import {Badge, Button, Flex} from '@sanity/ui'
import {set, type BooleanInputProps} from 'sanity'

// "Nieuw" or "Gelezen", with a button to switch. A new message and a new reaction of the visitor
// make it "Nieuw" again; sending a reply marks it as read.
export function MessageStatusInput(props: BooleanInputProps) {
  const unread = props.value === true

  return (
    <Flex gap={3} align="center" wrap="wrap">
      <Badge tone={unread ? 'caution' : 'positive'} fontSize={1} padding={2}>
        {unread ? 'Nieuw' : 'Gelezen'}
      </Badge>
      <Button
        text={unread ? 'Markeer als gelezen' : 'Markeer als ongelezen'}
        mode="ghost"
        fontSize={1}
        disabled={props.readOnly}
        onClick={() => props.onChange(set(!unread))}
      />
    </Flex>
  )
}
