/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// Dynamic imports to avoid SSR issues - any types are needed for external library imports
let EditorJS: any
let Header: any
let List: any
let Paragraph: any
let Image: any
let LinkTool: any
let Quote: any
let Marker: any
let CodeTool: any
let InlineCode: any
let Delimiter: any
let Table: any

interface WysiwygEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  height?: number
}

export function WysiwygEditor({ 
  value, 
  onChange, 
  placeholder = "Write your content here...", 
  height = 500 
}: WysiwygEditorProps) {
  const editorRef = useRef<any>(null)
  const editorInstance = useRef<any>(null)
  const [isReady, setIsReady] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializeEditor = async () => {
      try {
        // Dynamic imports
        const [
          EditorJSModule,
          HeaderModule,
          ListModule,
          ParagraphModule,
          ImageModule,
          LinkModule,
          QuoteModule,
          MarkerModule,
          CodeModule,
          InlineCodeModule,
          DelimiterModule,
          TableModule
        ] = await Promise.all([
          import('@editorjs/editorjs'),
          import('@editorjs/header'),
          import('@editorjs/list'),
          import('@editorjs/paragraph'),
          import('@editorjs/image'),
          import('@editorjs/link'),
          import('@editorjs/quote'),
          import('@editorjs/marker'),
          import('@editorjs/code'),
          import('@editorjs/inline-code'),
          import('@editorjs/delimiter'),
          import('@editorjs/table')
        ])

        EditorJS = EditorJSModule.default
        Header = HeaderModule.default
        List = ListModule.default
        Paragraph = ParagraphModule.default
        Image = ImageModule.default
        LinkTool = LinkModule.default
        Quote = QuoteModule.default
        Marker = MarkerModule.default
        CodeTool = CodeModule.default
        InlineCode = InlineCodeModule.default
        Delimiter = DelimiterModule.default
        Table = TableModule.default

        // Parse existing value
        let initialData
        try {
          initialData = value ? JSON.parse(value) : {
            time: Date.now(),
            blocks: [
              {
                type: 'paragraph',
                data: {
                  text: ''
                }
              }
            ]
          }
        } catch {
          // If value is HTML or plain text, convert to EditorJS format
          initialData = {
            time: Date.now(),
            blocks: [
              {
                type: 'paragraph',
                data: {
                  text: value || ''
                }
              }
            ]
          }
        }

        // Initialize Editor.js
        editorInstance.current = new EditorJS({
          holder: editorRef.current,
          placeholder: placeholder,
          data: initialData,
          tools: {
            header: {
              class: Header,
              config: {
                placeholder: 'Enter a header',
                levels: [1, 2, 3, 4, 5, 6],
                defaultLevel: 2
              }
            },
            paragraph: {
              class: Paragraph,
              inlineToolbar: true
            },
            list: {
              class: List,
              inlineToolbar: true,
              config: {
                defaultStyle: 'unordered'
              }
            },
            image: {
              class: Image,
              config: {
                endpoints: {
                  byFile: '/api/upload-image', // You'll need to implement this
                  byUrl: '/api/upload-image-by-url' // You'll need to implement this
                },
                field: 'image',
                types: 'image/*',
                additionalRequestData: {},
                additionalRequestHeaders: {},
                captionPlaceholder: 'Caption (optional)',
                buttonContent: 'Select an Image',
                uploader: {
                  uploadByFile: async (file: File) => {
                    // For now, convert to data URL for demo purposes
                    return new Promise((resolve) => {
                      const reader = new FileReader()
                      reader.onload = (e) => {
                        resolve({
                          success: 1,
                          file: {
                            url: e.target?.result as string
                          }
                        })
                      }
                      reader.readAsDataURL(file)
                    })
                  },
                  uploadByUrl: async (url: string) => {
                    return {
                      success: 1,
                      file: {
                        url: url
                      }
                    }
                  }
                }
              }
            },
            linkTool: {
              class: LinkTool,
              config: {
                endpoint: '/api/fetch-url' // You'll need to implement this for link previews
              }
            },
            quote: {
              class: Quote,
              inlineToolbar: true,
              config: {
                quotePlaceholder: 'Enter a quote',
                captionPlaceholder: 'Quote&apos;s author'
              }
            },
            marker: {
              class: Marker
            },
            code: {
              class: CodeTool,
              config: {
                placeholder: 'Enter code here...'
              }
            },
            inlineCode: {
              class: InlineCode
            },
            delimiter: Delimiter,
            table: {
              class: Table,
              inlineToolbar: true,
              config: {
                rows: 2,
                cols: 3
              }
            }
          },
          onChange: async () => {
            try {
              const outputData = await editorInstance.current.save()
              onChange(JSON.stringify(outputData))
            } catch (error) {
              console.error('Saving failed:', error)
            }
          },
          onReady: () => {
            setIsReady(true)
            setIsLoading(false)
          }
        })

      } catch (error) {
        console.error('Failed to initialize Editor.js:', error)
        setIsLoading(false)
      }
    }

    if (editorRef.current && !editorInstance.current) {
      initializeEditor()
    }

    // Cleanup
    return () => {
      if (editorInstance.current && editorInstance.current.destroy) {
        editorInstance.current.destroy()
      }
    }
  }, [])

  // Update editor content when value changes externally
  useEffect(() => {
    if (isReady && editorInstance.current && value) {
      try {
        const data = JSON.parse(value)
        editorInstance.current.render(data)
      } catch {
        // Handle non-JSON content
      }
    }
  }, [value, isReady])

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Rich Text Editor</CardTitle>
        <CardDescription>
          Create beautiful, formatted content with our modern block-style editor powered by Editor.js.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-600">Loading editor...</p>
            </div>
          </div>
        )}
        
        <div 
          className={`${isLoading ? 'hidden' : 'block'} border rounded-lg p-4 bg-white`}
          style={{ minHeight: height }}
        >
          <div 
            ref={editorRef}
            id="editorjs-container"
            className="prose prose-sm max-w-none"
          />
        </div>

        <div className="text-xs text-gray-500 flex justify-between items-center mt-4">
          <span>Modern block-style editor with clean JSON output</span>
          <span className="text-green-600">✓ Auto-save enabled</span>
        </div>
      </CardContent>
    </Card>
  )
}