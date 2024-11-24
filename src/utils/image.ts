export const ACCEPTED_IMAGE_MIME_TYPES = new Set<string>(['image/svg', 'image/png', 'image/jpeg', 'image/gif', 'image/avif', 'image/webp']);

export const FILE_INPUT_ACCEPT_VALUE = Array.from(ACCEPTED_IMAGE_MIME_TYPES).join(',');