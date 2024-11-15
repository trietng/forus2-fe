import '../../../styles/text.css';
import '../../../styles/toolbar.css';

import TextStyle from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import { EditorProvider, useCurrentEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit';
import { Button, Dropdown, FileInput, Label, Tabs, TextInput, Tooltip } from 'flowbite-react';
import { BoldIcon, CodeBracketIcon, ItalicIcon, ListBulletIcon, StrikethroughIcon, NumberedListIcon, CodeBracketSquareIcon, MinusIcon, ArrowUturnLeftIcon, ArrowUturnRightIcon, Bars3BottomLeftIcon, Bars3CenterLeftIcon, Bars3BottomRightIcon, Bars3Icon, PhotoIcon, ArrowUpOnSquareIcon, LinkIcon} from '@heroicons/react/24/outline';
import { IconBlockquote } from '../../../icons/IconBlockquote';
import { IconSectionRemove } from '../../../icons/IconSectionRemove';
import { IconFormatClear } from '../../../icons/IconFormatClear';
import { IconPilcrow } from '../../../icons/IconPilcrow';
import { IconHeading1 } from '../../../icons/IconHeading1';
import { IconHeading3 } from '../../../icons/IconHeading3';
import { IconHeading2 } from '../../../icons/IconHeading2';
import { IconHighlight } from '../../../icons/IconHighlight';
import { ChangeEvent, FormEvent, useRef, useState } from 'react';
import { colorFromValidation } from '../../../helpers/flowbite/validation';
import { ValidationMessage } from '../../Validation/ValidationMessage';
import { FormValidationData } from '../../../models/form-validation-data';

interface ImageUrlFormData {
    url: string;
}

function MenuBar() {
    const imageUrlInputRef = useRef<HTMLInputElement>(null);
    const [imageUrlFormData, setImageUrlFormData] = useState<ImageUrlFormData>({url: " "});
    const [imageUrlFormValidation, setImageUrlFormValidation] = useState<Record<keyof ImageUrlFormData, FormValidationData>>({url: {status: true, message: ''}});

    const { editor } = useCurrentEditor()

    const handleImageUrlInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setImageUrlFormValidation({...imageUrlFormValidation, [e.target.name]: {status: e.target.validity.valid, message: e.target.validationMessage}});
        setImageUrlFormData({...imageUrlFormData, [e.target.name]: e.target.value})
        console.log(imageUrlFormData);
    }

    const handleImageUrlSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (editor) {
            if (!imageUrlFormValidation.url.status) {
                return;
            }
            editor.chain().focus().setImage({src: imageUrlFormData.url}).run();
        }
    }

    if (!editor) {
        return null
    }

    return (
        <div className="mt-4 bg-primary border-b rounded-t-lg overflow-hidden control-group">
            <div className="button-group">
                <div className='flex items-center'>
                    <Tooltip content="Bold" placement="bottom">
                        <button
                            onClick={() => editor.chain().focus().toggleBold().run()}
                            disabled={
                                !editor.can()
                                .chain()
                                .focus()
                                .toggleBold()
                                .run()
                            }
                        >
                            <BoldIcon className={editor.isActive('bold') ? " text-secondary" : ""}/>
                        </button>
                    </Tooltip>
                    <Tooltip content="Italic" placement="bottom">
                        <button
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                            disabled={
                                !editor.can()
                                .chain()
                                .focus()
                                .toggleItalic()
                                .run()
                            }
                        >
                            <ItalicIcon className={editor.isActive('italic') ? " text-secondary" : ""}/>
                        </button>
                    </Tooltip>
                    <Tooltip content="Strikethrough" placement="bottom">
                        <button
                            onClick={() => editor.chain().focus().toggleStrike().run()}
                            disabled={
                                !editor.can()
                                .chain()
                                .focus()
                                .toggleStrike()
                                .run()
                            }
                        >
                            <StrikethroughIcon className={editor.isActive('strike') ? " text-secondary" : ""}/>
                        </button>
                    </Tooltip>
                    <Tooltip content="Code" placement="bottom">
                        <button
                            onClick={() => editor.chain().focus().toggleCode().run()}
                            disabled={
                                !editor.can()
                                .chain()
                                .focus()
                                .toggleCode()
                                .run()
                            }
                        >
                            <CodeBracketIcon className={editor.isActive('code') ? " text-secondary" : ""}/>
                        </button>
                    </Tooltip>
                    <Tooltip content="Highlight" placement="bottom">
                        <button
                            onClick={() => editor.chain().focus().toggleHighlight().run()}
                        >
                            <IconHighlight className={editor.isActive('highlight') ? ' text-secondary' : ''}/>
                        </button>
                    </Tooltip>
                </div>
                <div className='flex items-center'>
                    <Tooltip content="Heading 1" placement="bottom">
                        <button
                            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        >
                            <IconHeading1 className={editor.isActive('heading', { level: 1 }) ? ' text-secondary' : ''}/>
                        </button>
                    </Tooltip>
                    <Tooltip content="Heading 2" placement="bottom">
                        <button
                            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        >
                            <IconHeading2 className={editor.isActive('heading', { level: 2 }) ? ' text-secondary' : ''}/>
                        </button>
                    </Tooltip>
                    <Tooltip content="Heading 3" placement="bottom">
                        <button
                            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        >
                            <IconHeading3 className={editor.isActive('heading', { level: 3 }) ? ' text-secondary' : ''}/>
                        </button>
                    </Tooltip>
                    <Tooltip content="Paragraph" placement="bottom">
                        <button
                            onClick={() => editor.chain().focus().setParagraph().run()}
                        >
                            <IconPilcrow className={editor.isActive('paragraph') ? ' text-secondary' : ''}/>
                        </button>
                    </Tooltip>
                    <Tooltip content="Align left" placement="bottom">
                        <button 
                            onClick={() => editor.chain().focus().setTextAlign('left').run()}
                        >
                            <Bars3BottomLeftIcon className={editor.isActive({ textAlign: 'left' }) ? ' text-secondary' : ''}/>
                        </button>
                    </Tooltip>
                    <Tooltip content="Align center" placement="bottom">
                        <button 
                            onClick={() => editor.chain().focus().setTextAlign('center').run()}
                        >
                            <Bars3CenterLeftIcon className={editor.isActive({ textAlign: 'center' }) ? ' text-secondary' : ''}/>
                        </button>
                    </Tooltip>
                    <Tooltip content="Align right" placement="bottom">
                        <button 
                            onClick={() => editor.chain().focus().setTextAlign('right').run()}
                        >
                            <Bars3BottomRightIcon className={editor.isActive({ textAlign: 'right' }) ? ' text-secondary' : ''}/>
                        </button>
                    </Tooltip>
                    <Tooltip content="Align justify" placement="bottom">
                        <button 
                            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                        >
                            <Bars3Icon className={editor.isActive({ textAlign: 'justify' }) ? ' text-secondary' : ''}/>
                        </button>
                    </Tooltip>
                </div>
                <div className='flex items-center'>
                    <Tooltip content="Bullet list" placement="bottom">
                        <button
                            onClick={() => editor.chain().focus().toggleBulletList().run()}
                        >
                            <ListBulletIcon className={editor.isActive('bulletList') ? ' text-secondary' : ''}/>
                        </button>
                    </Tooltip>
                    <Tooltip content="Ordered list" placement="bottom">
                        <button
                            onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        >
                            <NumberedListIcon className={editor.isActive('orderedList') ? ' text-secondary' : ''}/>
                        </button>
                    </Tooltip>
                    <Tooltip content="Code block" placement="bottom">
                        <button
                            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                        >
                            <CodeBracketSquareIcon className={editor.isActive('codeBlock') ? ' text-secondary' : ''}/>
                        </button>
                    </Tooltip>
                    <Dropdown
                        arrowIcon={false}
                        inline
                        placement="bottom-end"
                        renderTrigger={() =>
                            <button>
                                <Tooltip content="Insert image" placement="bottom">
                                    <PhotoIcon />
                                </Tooltip>
                            </button>
                        }
                        theme={
                            {
                                floating: {
                                    style: {
                                        auto: "border border-gray-200 bg-primary text-gray-900 dark:border-none dark:bg-gray-700 dark:text-white"
                                    }
                                }
                            }
                        }
                    >
                        <Tabs aria-label="Add image tabs" variant="underline" theme={{
                            tablist: {
                                variant: {
                                    underline: "border-b-0 gap-x-4 px-4 justify-center"
                                },
                                tabitem: {
                                    variant: {
                                        underline: {
                                            active: {
                                                off: "text-white hover:text-secondary rounded-t-none border-b-2 border-primary hover:border-secondary",
                                            }
                                        }
                                    }
                                }
                            },
                            tabpanel: "py-3 min-h-32 w-72"
                        }}>
                            <Tabs.Item active title="Upload file" icon={ArrowUpOnSquareIcon}>
                                <div className='mx-4'>
                                    <Label htmlFor="file-upload-helper-text" value="Upload file"/>
                                    <FileInput id="file-upload-helper-text" helperText="SVG, PNG, JPG or GIF (MAX. 800x400px)." className='mt-2'/>
                                </div>
                            </Tabs.Item>
                            <Tabs.Item title="URL" icon={LinkIcon}>
                                <form className='mx-4 z-[1000]'>
                                    <Label htmlFor="imageUrl" value="URL" />
                                    <TextInput ref={imageUrlInputRef} className="mt-1" id="imageUrl" name='imageUrl' onChange={handleImageUrlInputChange} placeholder='URL of an image' color={colorFromValidation(imageUrlFormValidation.url)} required/>
                                    <ValidationMessage formValidationData={imageUrlFormValidation.url}/>
                                    <Button type="submit" color="secondary" size="md" className="mt-2 mb-4 float-end hover:!bg-secondary">Insert</Button>
                                </form>
                            </Tabs.Item>
                        </Tabs>
                    </Dropdown>
                    <Tooltip content="Blockquote" placement="bottom">
                        <button
                            onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        >
                            <IconBlockquote className={editor.isActive('blockquote') ? ' text-secondary' : ''}/>
                        </button>
                    </Tooltip>
                    <Tooltip content="Horizontal rule" placement="bottom">
                        <button
                            onClick={() => editor.chain().focus().setHorizontalRule().run()}
                        >
                            <MinusIcon/>
                        </button>
                    </Tooltip>
                </div>
                <div className='flex items-center'>
                    <Tooltip content="Undo" placement="bottom">
                        <button
                            onClick={() => editor.chain().focus().undo().run()}
                            disabled={
                                !editor.can()
                                .chain()
                                .focus()
                                .undo()
                                .run()
                            }
                        >
                            <ArrowUturnLeftIcon/>
                        </button>
                    </Tooltip>
                    <Tooltip content="Redo" placement="bottom">
                        <button
                            onClick={() => editor.chain().focus().redo().run()}
                            disabled={
                                !editor.can()
                                .chain()
                                .focus()
                                .redo()
                                .run()
                            }
                        >
                            <ArrowUturnRightIcon />
                        </button>
                    </Tooltip>
                    <Tooltip content="Clear marks" placement="bottom">
                        <button onClick={() => editor.chain().focus().unsetAllMarks().run()}>
                            <IconFormatClear/>
                        </button>
                    </Tooltip>
                    <Tooltip content="Clear nodes" placement="bottom">
                        <button onClick={() => editor.chain().focus().clearNodes().run()}>
                            <IconSectionRemove/>
                        </button>
                    </Tooltip>
                </div>
            </div>
        </div>
    )
}

const extensions = [
    TextStyle,
    StarterKit,
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    Highlight,
    Image,
]

const content = `
<h2>
  Hi there,
</h2>
<p>
  this is a <em>basic</em> example of <strong>Tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
</p>
<ul>
  <li>
    That’s a bullet list with one …
  </li>
  <li>
    … or two list items.
  </li>
</ul>
<p>
  Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
</p>
<pre><code class="language-css">body {
  display: none;
}</code></pre>
<p>
  I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
</p>
<blockquote>
  Wow, that’s amazing. Good work, boy! 👏
  <br />
  — Mom
</blockquote>
`

export default () => {
    return (
        <EditorProvider slotBefore={<MenuBar />} extensions={extensions} content={content} editorProps={{
            attributes: {
                class: 'bg-primary p-4 rounded-b-lg',
            }
        }}></EditorProvider>
    )
}