import '../../../styles/text.css';
import '../../../styles/toolbar.css';

import { EditorProvider, JSONContent, useCurrentEditor } from '@tiptap/react'
import { Button, Dropdown, FileInput, Label, Tabs, TextInput, Tooltip, CustomFlowbiteTheme } from 'flowbite-react';
import { ClipboardIcon, BoldIcon, CodeBracketIcon, ItalicIcon, ListBulletIcon, StrikethroughIcon, NumberedListIcon, CodeBracketSquareIcon, MinusIcon, ArrowUturnLeftIcon, ArrowUturnRightIcon, Bars3BottomLeftIcon, Bars3CenterLeftIcon, Bars3BottomRightIcon, Bars3Icon, PhotoIcon, ArrowUpOnSquareIcon, LinkIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { IconBlockquote } from '../../../icons/IconBlockquote';
import { IconSectionRemove } from '../../../icons/IconSectionRemove';
import { IconFormatClear } from '../../../icons/IconFormatClear';
import { IconPilcrow } from '../../../icons/IconPilcrow';
import { IconHeading1 } from '../../../icons/IconHeading1';
import { IconHeading3 } from '../../../icons/IconHeading3';
import { IconHeading2 } from '../../../icons/IconHeading2';
import { IconHighlight } from '../../../icons/IconHighlight';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { colorFromValidation } from '../../../helpers/flowbite/validation';
import { ValidationMessage } from '../../Validation/ValidationMessage';
import { FormValidationData } from '../../../models/form-validation-data';
import { isValidHttpUrl } from '../../../utils/string';
import { ACCEPTED_IMAGE_MIME_TYPES, FILE_INPUT_ACCEPT_VALUE } from '../../../utils/image';
import { readAsDataURLAsync } from '../../../helpers/filereader';
import { atom } from 'nanostores';
import { useStore } from '@nanostores/react';
import { IconYoutube } from '../../../icons/IconYoutube';
import { TiptapExtensions } from '../config/text';

interface URLInputProps {
    tiptapFor: "Image" | "Link" | "Youtube";
}

const customDropdownTheme: CustomFlowbiteTheme["dropdown"] = {
    floating: {
        style: {
            auto: "border border-gray-200 bg-primary text-gray-900 dark:border-none dark:bg-gray-700 dark:text-white"
        }
    }
};

const customTabsTheme: CustomFlowbiteTheme["tabs"] = {
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
}

function URLInput(props: URLInputProps) {
    const urlInputRef = useRef<HTMLInputElement>(null);
    const [urlValidation, setUrlValidation] = useState<{ url: FormValidationData; }>({url: {status: true, message: ''}});

    const { editor } = useCurrentEditor();

    async function handleImageUrlInputChange() {
        if (urlInputRef.current) {
            let text = await navigator.clipboard.readText();
            text = text.trim();
            const [status, message] = isValidHttpUrl(text);
            urlInputRef.current.value = text;
            setUrlValidation({url: {status, message}});
            if (editor && status) {
                editor.chain().focus().setImage({src: text}).run();
            }
        }
    }

    async function handleLinkUrlInputChange() {
        if (urlInputRef.current) {
            let text = await navigator.clipboard.readText();
            text = text.trim();
            const [status, message] = isValidHttpUrl(text);
            urlInputRef.current.value = text;
            setUrlValidation({url: {status, message}});
            if (editor && status) {
                editor.chain().focus().setLink({href: text}).run();
            }
        }
    }

    async function handleYoutubeUrlInputChange() {
        if (urlInputRef.current) {
            let text = await navigator.clipboard.readText();
            text = text.trim();
            const [status, message] = isValidHttpUrl(text, (url) => {
                // match regex for youtube video url
                const youtubeUrlRegex = /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/
                if (!youtubeUrlRegex.test(url)) {
                    return [false, 'Invalid YouTube video URL.'];
                }
                return [true, ''];
            });
            urlInputRef.current.value = text;
            setUrlValidation({url: {status, message}});
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
        <div className='mx-4'>
            <Label htmlFor={props.tiptapFor} value="URL" />
            <div className='flex mt-2' >
                <TextInput ref={urlInputRef} readOnly className="[&_input]:rounded-e-none w-full" id={props.tiptapFor} name="url" placeholder='Paste your URL here' color={colorFromValidation(urlValidation.url)} required/>
                <Tooltip content="Paste" placement="bottom" className=''>
                    <Button 
                        className={"h-full !p-0 hover:!bg-secondary rounded-s-none" + (props.tiptapFor === "Link" ? " rounded-e-none" : "")} 
                        color='secondary'
                        onClick={() => {
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
                        className="h-full !p-0 hover:!bg-inherit rounded-s-none" 
                        color='failure'
                        onClick={() => {
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
            <ValidationMessage formValidationData={urlValidation.url} className='mt-2'/>
        </div>
    )
}

function MenuBar() {
    const [imageFileValidation, setImageFileValidation] = useState<{ file: FormValidationData; }>({file: {status: true, message: ''}});

    const { editor } = useCurrentEditor()

    async function handleImageFileInputChange(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            if (!ACCEPTED_IMAGE_MIME_TYPES.has(file?.type)) {
                setImageFileValidation({file: {status: false, message: 'Invalid file type. Please upload an image file.'}});
                e.target.value = '';
            } else {
                const base64 = await readAsDataURLAsync(file);
                if (base64 && typeof base64 === 'string' && editor) {
                    setImageFileValidation({file: {status: true, message: ''}});
                    if (editor) {
                        editor.chain().focus().setImage({src: base64}).run();
                    }
                }
                else {
                    setImageFileValidation({file: {status: false, message: 'Unable to read file.'}});
                    e.target.value = '';
                }
            }
        }
    }

    if (!editor) {
        return null
    }

    return (
        <div className="mt-4 bg-primary border-b rounded-t-lg overflow-hidden control-group">
            <div className="button-group">
                <div className='flex items-center border-e'>
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
                    <Dropdown
                        arrowIcon={false}
                        inline
                        placement="bottom-end"
                        renderTrigger={() =>
                            <button>
                                <Tooltip content="Link" placement="bottom">
                                    <LinkIcon className={editor.isActive('link') ? ' text-secondary' : ''}/>
                                </Tooltip>
                            </button>
                        }
                        theme={customDropdownTheme}
                    >
                        <URLInput tiptapFor='Link'/>
                    </Dropdown>
                </div>
                <div className='flex items-center border-e'>
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
                <div className='flex items-center border-e'>
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
                        theme={customDropdownTheme}
                    >
                        <Tabs aria-label="Add image tabs" variant="underline" theme={customTabsTheme}>
                            <Tabs.Item active title="Upload file" icon={ArrowUpOnSquareIcon}>
                                <div className='mx-4'>
                                    <Label htmlFor="file-upload-helper-text" value="Upload file"/>
                                    <FileInput id="file-upload-helper-text" helperText="SVG, PNG, JPG, GIF, AVIF or WEBP." className='mt-2' accept={FILE_INPUT_ACCEPT_VALUE} onChange={handleImageFileInputChange} />
                                    <ValidationMessage formValidationData={imageFileValidation.file} className='mt-2'/>
                                </div>
                            </Tabs.Item>
                            <Tabs.Item title="URL" icon={LinkIcon}>
                                <URLInput tiptapFor='Image'/>
                            </Tabs.Item>
                        </Tabs>
                    </Dropdown>
                    <Dropdown
                        arrowIcon={false}
                        inline
                        placement="bottom-end"
                        renderTrigger={() =>
                            <button>
                                <Tooltip content="Insert Youtube video" placement="bottom">
                                    <IconYoutube />
                                </Tooltip>
                            </button>
                        }
                        theme={customDropdownTheme}
                    >
                        <URLInput tiptapFor='Youtube'/>
                    </Dropdown>
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

export type ContentEditorMode = "create" | "edit";

export const $content = atom<JSONContent | undefined>();

export function TextEditor() {
    const content = useStore($content);

    return (
        <EditorProvider slotBefore={<MenuBar />} extensions={TiptapExtensions} content={content} editorProps={{
            attributes: {
                class: 'bg-primary p-4 rounded-b-lg',
            }
        }} onUpdate={({ editor }) => {
            $content.set(editor.getJSON());
        }}></EditorProvider>
    )
}