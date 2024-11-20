import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Youtube from "@tiptap/extension-youtube";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Highlight from "@tiptap/extension-highlight";

export const TiptapExtensions = [
    TextStyle,
    StarterKit,
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    Highlight,
    Image,
    Link,
    Youtube
]