import '../../../styles/text.css';
import '../../../styles/toolbar.css';

import { Content, EditorProvider, JSONContent, useCurrentEditor } from '@tiptap/react'
import { Button, Popover, PopoverContent, Input, Tab, Tabs, Tooltip, PopoverTrigger } from '@heroui/react';
import { ClipboardIcon, BoldIcon, CodeBracketIcon, ItalicIcon, ListBulletIcon, StrikethroughIcon, NumberedListIcon, CodeBracketSquareIcon, MinusIcon, ArrowUturnLeftIcon, ArrowUturnRightIcon, Bars3BottomLeftIcon, Bars3CenterLeftIcon, Bars3BottomRightIcon, Bars3Icon, PhotoIcon, LinkIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { IconBlockquote } from '../../../icons/IconBlockquote';
import { IconSectionRemove } from '../../../icons/IconSectionRemove';
import { IconFormatClear } from '../../../icons/IconFormatClear';
import { IconPilcrow } from '../../../icons/IconPilcrow';
import { IconHeading1 } from '../../../icons/IconHeading1';
import { IconHeading3 } from '../../../icons/IconHeading3';
import { IconHeading2 } from '../../../icons/IconHeading2';
import { IconHighlight } from '../../../icons/IconHighlight';
import { ChangeEvent, useEffect, useRef } from 'react';
import { isValidHttpUrl } from '../../../utils/string';
import { ACCEPTED_IMAGE_MIME_TYPES, FILE_INPUT_ACCEPT_VALUE } from '../../../utils/image';
import { readAsDataURLAsync } from '../../../helpers/filereader';
import { IconYoutube } from '../../../icons/IconYoutube';
import { TiptapExtensions } from '../config/text';

interface URLInputProps {
    tiptapFor: "Image" | "Link" | "Youtube";
}

function URLInput(props: URLInputProps) {
    const urlInputRef = useRef<HTMLInputElement>(null);

    const { editor } = useCurrentEditor();

    async function handleImageUrlInputChange() {
        if (urlInputRef.current) {
            let text = await navigator.clipboard.readText();
            text = text.trim();
            const [status] = isValidHttpUrl(text);
            urlInputRef.current.value = text;
            if (editor && status) {
                editor.chain().focus().setImage({src: text}).run();
            }
        }
    }

    async function handleLinkUrlInputChange() {
        if (urlInputRef.current) {
            let text = await navigator.clipboard.readText();
            text = text.trim();
            const [status] = isValidHttpUrl(text);
            urlInputRef.current.value = text;
            if (editor && status) {
                editor.chain().focus().setLink({href: text}).run();
            }
        }
    }

    async function handleYoutubeUrlInputChange() {
        if (urlInputRef.current) {
            let text = await navigator.clipboard.readText();
            text = text.trim();
            const [status] = isValidHttpUrl(text, (url) => {
                // match regex for youtube video url
                const youtubeUrlRegex = /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/
                if (!youtubeUrlRegex.test(url)) {
                    return [false, 'Invalid YouTube video URL.'];
                }
                return [true, ''];
            });
            urlInputRef.current.value = text;
            if (editor && status) {
                editor.commands.setYoutubeVideo({
                    src: text,
                    width: 320,
                    height: 240
                });
            }
        }
    }

    useEffect(() => {
        if (props.tiptapFor === "Link") {
            if (editor && editor.isActive('link')) {
                const href = editor.getAttributes('link').href;
                if (urlInputRef.current) {
                    urlInputRef.current.value = href;
                }
            }
        }
    }, []);

    return (
        <div className='m-4'>
            <label htmlFor={props.tiptapFor}>URL</label>
            <div className='flex mt-2' >
                <Input ref={urlInputRef} readOnly className="[&_div]:rounded-e-none w-full" id={props.tiptapFor} name="url" placeholder='Paste your URL here' required/>
                <Tooltip content="Paste" placement="bottom">
                    <Button 
                        className={"rounded-s-none" + (props.tiptapFor === "Link" ? " rounded-e-none" : "")} 
                        color='secondary'
                        onPress={() => {
                            switch (props.tiptapFor) {
                                case "Image":
                                    handleImageUrlInputChange();
                                    break;
                                case "Link":
                                    handleLinkUrlInputChange();
                                    break;
                                case "Youtube":
                                    handleYoutubeUrlInputChange();
                                    break;
                            }
                        }}
                        >
                        <ClipboardIcon className='place-self-center inline size-4'/>
                    </Button>
                </Tooltip>
                {props.tiptapFor === "Link" && <Tooltip content="Clear" placement="bottom">
                    <Button 
                        className="rounded-s-none" 
                        color='danger'
                        onPress={() => {
                            if (editor) {
                                editor.chain().focus().unsetLink().run();
                            }
                            urlInputRef.current!.value = '';
                        }}
                        >
                            <XMarkIcon className='place-self-center inline size-4'/>
                    </Button>
                </Tooltip>}
            </div>
        </div>
    )
}

function MenuBar() {
    const { editor } = useCurrentEditor()

    async function handleImageFileInputChange(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            if (!ACCEPTED_IMAGE_MIME_TYPES.has(file?.type)) {
                e.target.value = '';
            } else {
                const base64 = await readAsDataURLAsync(file);
                if (base64 && typeof base64 === 'string' && editor) {
                    if (editor) {
                        editor.chain().focus().setImage({src: base64}).run();
                    }
                }
                else {
                    e.target.value = '';
                }
            }
        }
    }

    if (!editor) {
        return null
    }

    return (
        <div className="bg-forus-primary border-b rounded-t-lg overflow-hidden control-group">
            <div className="button-group">
                <div className='flex items-center border-e'>
                    <Tooltip content="Bold" placement="bottom">
                        <button type="button"
                            onClick={() => editor.chain().focus().toggleBold().run()}
                            disabled={
                                !editor.can()
                                .chain()
                                .focus()
                                .toggleBold()
                                .run()
                            }
                        >
                            <BoldIcon className={editor.isActive('bold') ? " text-forus-secondary" : ""}/>
                        </button>
                    </Tooltip>
                    <Tooltip content="Italic" placement="bottom">
                        <button type="button"
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                            disabled={
                                !editor.can()
                                .chain()
                                .focus()
                                .toggleItalic()
                                .run()
                            }
                        >
                            <ItalicIcon className={editor.isActive('italic') ? " text-forus-secondary" : ""}/>
                        </button>
                    </Tooltip>
                    <Tooltip content="Strikethrough" placement="bottom">
                        <button type="button"
                            onClick={() => editor.chain().focus().toggleStrike().run()}
                            disabled={
                                !editor.can()
                                .chain()
                                .focus()
                                .toggleStrike()
                                .run()
                            }
                        >
                            <StrikethroughIcon className={editor.isActive('strike') ? " text-forus-secondary" : ""}/>
                        </button>
                    </Tooltip>
                    <Tooltip content="Code" placement="bottom">
                        <button type="button"
                            onClick={() => editor.chain().focus().toggleCode().run()}
                            disabled={
                                !editor.can()
                                .chain()
                                .focus()
                                .toggleCode()
                                .run()
                            }
                        >
                            <CodeBracketIcon className={editor.isActive('code') ? " text-forus-secondary" : ""}/>
                        </button>
                    </Tooltip>
                    <Tooltip content="Highlight" placement="bottom">
                        <button type="button"
                            onClick={() => editor.chain().focus().toggleHighlight().run()}
                        >
                            <IconHighlight className={editor.isActive('highlight') ? ' text-forus-secondary' : ''}/>
                        </button>
                    </Tooltip>
                    <Popover
                        placement="bottom"
                    >
                        <PopoverTrigger>
                            <button type="button">
                                <Tooltip content="Link" placement="bottom">
                                    <LinkIcon className={editor.isActive('link') ? ' text-forus-secondary' : ''}/>
                                </Tooltip>
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="bg-forus-primary text-white">
                            <URLInput tiptapFor='Link'/>
                        </PopoverContent>
                    </Popover>
                </div>
                <div className='flex items-center border-e'>
                    <Tooltip content="Heading 1" placement="bottom">
                        <button type="button"
                            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        >
                            <IconHeading1 className={editor.isActive('heading', { level: 1 }) ? ' text-forus-secondary' : ''}/>
                        </button>
                    </Tooltip>
                    <Tooltip content="Heading 2" placement="bottom">
                        <button type="button"
                            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        >
                            <IconHeading2 className={editor.isActive('heading', { level: 2 }) ? ' text-forus-secondary' : ''}/>
                        </button>
                    </Tooltip>
                    <Tooltip content="Heading 3" placement="bottom">
                        <button type="button"
                            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        >
                            <IconHeading3 className={editor.isActive('heading', { level: 3 }) ? ' text-forus-secondary' : ''}/>
                        </button>
                    </Tooltip>
                    <Tooltip content="Paragraph" placement="bottom">
                        <button type="button"
                            onClick={() => editor.chain().focus().setParagraph().run()}
                        >
                            <IconPilcrow className={editor.isActive('paragraph') ? ' text-forus-secondary' : ''}/>
                        </button>
                    </Tooltip>
                    <Tooltip content="Align left" placement="bottom">
                        <button type="button" 
                            onClick={() => editor.chain().focus().setTextAlign('left').run()}
                        >
                            <Bars3BottomLeftIcon className={editor.isActive({ textAlign: 'left' }) ? ' text-forus-secondary' : ''}/>
                        </button>
                    </Tooltip>
                    <Tooltip content="Align center" placement="bottom">
                        <button type="button" 
                            onClick={() => editor.chain().focus().setTextAlign('center').run()}
                        >
                            <Bars3CenterLeftIcon className={editor.isActive({ textAlign: 'center' }) ? ' text-forus-secondary' : ''}/>
                        </button>
                    </Tooltip>
                    <Tooltip content="Align right" placement="bottom">
                        <button type="button" 
                            onClick={() => editor.chain().focus().setTextAlign('right').run()}
                        >
                            <Bars3BottomRightIcon className={editor.isActive({ textAlign: 'right' }) ? ' text-forus-secondary' : ''}/>
                        </button>
                    </Tooltip>
                    <Tooltip content="Align justify" placement="bottom">
                        <button type="button" 
                            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                        >
                            <Bars3Icon className={editor.isActive({ textAlign: 'justify' }) ? ' text-forus-secondary' : ''}/>
                        </button>
                    </Tooltip>
                </div>
                <div className='flex items-center border-e'>
                    <Tooltip content="Bullet list" placement="bottom">
                        <button type="button"
                            onClick={() => editor.chain().focus().toggleBulletList().run()}
                        >
                            <ListBulletIcon className={editor.isActive('bulletList') ? ' text-forus-secondary' : ''}/>
                        </button>
                    </Tooltip>
                    <Tooltip content="Ordered list" placement="bottom">
                        <button type="button"
                            onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        >
                            <NumberedListIcon className={editor.isActive('orderedList') ? ' text-forus-secondary' : ''}/>
                        </button>
                    </Tooltip>
                    <Tooltip content="Code block" placement="bottom">
                        <button type="button"
                            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                        >
                            <CodeBracketSquareIcon className={editor.isActive('codeBlock') ? ' text-forus-secondary' : ''}/>
                        </button>
                    </Tooltip>
                    <Tooltip content="Blockquote" placement="bottom">
                        <button type="button"
                            onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        >
                            <IconBlockquote className={editor.isActive('blockquote') ? ' text-forus-secondary' : ''}/>
                        </button>
                    </Tooltip>
                    <Tooltip content="Horizontal rule" placement="bottom">
                        <button type="button"
                            onClick={() => editor.chain().focus().setHorizontalRule().run()}
                        >
                            <MinusIcon/>
                        </button>
                    </Tooltip>
                    <Popover
                        placement="bottom"
                    >
                        <PopoverTrigger>
                        <button type="button">
                                <Tooltip content="Insert image" placement="bottom">
                                    <PhotoIcon />
                                </Tooltip>
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className='bg-forus-primary text-white'>
                            <Tabs aria-label="Add image tabs" variant="underlined" color='secondary'>
                                <Tab title="Upload file">
                                    <div className='p-4 min-w-72'>
                                        <label htmlFor="file-upload-helper-text">Upload file</label>
                                        <Input type='file' id="file-upload-helper-text" className='mt-2' accept={FILE_INPUT_ACCEPT_VALUE} onChange={handleImageFileInputChange} />
                                    </div>
                                </Tab>
                                <Tab title="URL">
                                    <div className='min-w-72'>
                                        <URLInput tiptapFor='Image'/>
                                    </div>
                                </Tab>
                            </Tabs>
                        </PopoverContent>
                    </Popover>
                    <Popover
                        placement="bottom" 
                    >
                        <PopoverTrigger>
                            <button type="button">
                                <Tooltip content="Insert Youtube video" placement="bottom">
                                    <IconYoutube />
                                </Tooltip>
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className='bg-forus-primary text-white'>
                            <URLInput tiptapFor='Youtube'/>
                        </PopoverContent>
                    </Popover>
                </div>
                <div className='flex items-center'>
                    <Tooltip content="Undo" placement="bottom">
                        <button type="button"
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
                        <button type="button"
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
                        <button type="button" onClick={() => editor.chain().focus().unsetAllMarks().run()}>
                            <IconFormatClear/>
                        </button>
                    </Tooltip>
                    <Tooltip content="Clear nodes" placement="bottom">
                        <button type="button" onClick={() => editor.chain().focus().clearNodes().run()}>
                            <IconSectionRemove/>
                        </button>
                    </Tooltip>
                </div>
            </div>
        </div>
    )
}

export type ContentEditorMode = "create" | "edit";

interface TextEditorProps {
    onChange: (content: JSONContent) => void;
    text?: Content;
}

export function TextEditor(props: TextEditorProps) {
    return (
        <EditorProvider slotBefore={<MenuBar />} extensions={TiptapExtensions} content={props.text} editorProps={{
            attributes: {
                class: 'bg-forus-primary p-4 rounded-b-lg',
            }
        }} onUpdate={({ editor }) => {
            props.onChange(editor.getJSON());
        }}></EditorProvider>
    )
}