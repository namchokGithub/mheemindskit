import { AlignLeft, Bold, Combine, Eraser, SplitSquareHorizontal } from 'lucide-react'

import { TextTransformPage } from '@/components/tool/text-transform-page'
import { decorateText, joinText, removeSpaces, splitText, textOperations } from '@/features/text-tools/text'

export function RemoveSpacesPage() {
  return <TextTransformPage title="Remove Spaces" description="Remove whitespace or clean up extra spaces in your text." actionLabel="Remove Spaces" actionIcon={Eraser} storageKey="remove-spaces" inputPlaceholder="Paste text here…" sample={'  MindsKit   keeps   your\ntext tidy.  '} process={removeSpaces} operations={textOperations.removeSpaces} />
}

export function MakeOneLinePage() {
  return <TextTransformPage title="Make One Line" description="Join multi-line text using a space, no separator, or your own separator." actionLabel="Make One Line" actionIcon={AlignLeft} storageKey="make-one-line" inputPlaceholder="Paste multi-line text here…" sample={'MindsKit\nturns text\ninto one line.'} process={joinText} delimiter={{ label: 'Separator', placeholder: 'Space, blank, or custom text', defaultValue: ' ' }} />
}

export function TextDecorationPage() {
  return <TextTransformPage title="Text Decoration" description="Change the letter case or naming style of your text." actionLabel="Transform" actionIcon={Bold} storageKey="text-decoration" inputPlaceholder="Paste text here…" sample="make this text easier to read" process={decorateText} operations={textOperations.decoration} />
}

export function SplitTextPage() {
  return <TextTransformPage title="Split Text" description="Split text at a delimiter and put each part on its own line." actionLabel="Split Text" actionIcon={SplitSquareHorizontal} storageKey="split-text" inputPlaceholder="Paste text to split…" sample="red,green,blue" process={splitText} delimiter={{ label: 'Delimiter', placeholder: 'Comma', defaultValue: ',' }} />
}

export function JoinTextPage() {
  return <TextTransformPage title="Join Text" description="Join every line of text using a separator of your choice." actionLabel="Join Text" actionIcon={Combine} storageKey="join-text" inputPlaceholder="Paste one item per line…" sample={'red\ngreen\nblue'} process={joinText} delimiter={{ label: 'Separator', placeholder: 'Comma', defaultValue: ',' }} />
}
