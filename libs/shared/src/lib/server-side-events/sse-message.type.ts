export const SseMessageTypes = {
    INVALIDATE_CACHE: 'invalidate-cache',
} as const;

export type SseMessageType = (typeof SseMessageTypes)[keyof typeof SseMessageTypes];
