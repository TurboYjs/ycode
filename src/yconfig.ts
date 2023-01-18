import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';
const {VITE_PUBLIC_WEBRTC_URL} = import.meta.env
interface YI {
    doc: Y.Doc;
    provider: WebrtcProvider;
    room: string;
    initiator: boolean;
    language: string|null;
}

const key = ':room:';

let initiator = true;
let room =
    sessionStorage.getItem(key) ||
    [
        Math.random().toString(32).slice(2),
        Math.random().toString(32).slice(2),
    ].join('~');

sessionStorage.setItem(key, room);
const language = new URLSearchParams(location.search).get('language')
const roomName = new URLSearchParams(location.search).get('room')
if (roomName) {
    initiator = false;
    room = roomName;
}
const doc = new Y.Doc();

const [name, password] = room.split('~');

// WebrtcProvider expects full Opts object, though it seems that Partial<Opts> works okay
const provider = new WebrtcProvider(name, doc, { password, signaling: [VITE_PUBLIC_WEBRTC_URL] });

const config: YI = { room, doc, provider, initiator, language };

export default config;
