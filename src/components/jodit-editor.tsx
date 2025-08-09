'use client'

import { useRef, useMemo } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import JoditEditor to avoid SSR issues
const JoditEditor = dynamic(() => import('jodit-react'), {
  ssr: false,
  loading: () => <div className="min-h-[400px] bg-muted animate-pulse rounded-md" />
})

interface JoditWysiwygEditorProps {
  value: string
  onChange: (content: string) => void
  placeholder?: string
}

export function JoditWysiwygEditor({ value, onChange, placeholder = "Start writing your content..." }: JoditWysiwygEditorProps) {
  const editor = useRef(null)

  const config = useMemo(() => ({
    readonly: false,
    placeholder: placeholder,
    height: 400,
    toolbar: true,
    spellcheck: true,
    language: 'en',
    theme: 'default',
    enableDragAndDropFileToEditor: true,
    buttons: [
      'source', '|',
      'bold', 'italic', 'underline', 'strikethrough', '|',
      'superscript', 'subscript', '|',
      'ul', 'ol', '|',
      'outdent', 'indent', '|',
      'font', 'fontsize', 'brush', 'paragraph', '|',
      'image', 'link', 'table', '|',
      'align', 'undo', 'redo', '|',
      'hr', 'eraser', 'copyformat', '|',
      'fullsize', 'selectall', 'print'
    ],
    removeButtons: ['about'],
    showXPathInStatusbar: false,
    showCharsCounter: true,
    showWordsCounter: true,
    maxHeight: 600,
    minHeight: 300,
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false
  }), [placeholder])

  return (
    <div className="w-full">
      <JoditEditor
        ref={editor}
        value={value}
        config={config}
        onBlur={(newContent) => onChange(newContent)}
        onChange={() => {}} // We use onBlur instead for better performance
      />
    </div>
  )
}
