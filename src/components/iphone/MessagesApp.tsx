import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { assetUrl } from '../../utils/assetUrl';

interface MessagesAppProps {
  active: boolean;
  hasSound: boolean;
  playSoundFn: (src: string) => void;
}

type Message = { id: number; text: string; from: 'them' | 'me'; time: string; sound?: string };

const INITIAL_MESSAGES: Message[] = [
  { id: 0, text: 'Hallo! Wie geht es dir?', from: 'them', time: '10:41' },
  { id: 1, text: 'Mir geht es gut, danke! Und dir?', from: 'me', time: '10:42' },
  { id: 2, text: 'Auch gut 😊 Was machst du gerade?', from: 'them', time: '10:43' },
];

const INCOMING_SEQUENCE: { delay: number; text: string; sound: string }[] = [
  { delay: 3000,  text: 'Hey, kannst du kurz anrufen?', sound: assetUrl('/Notification_iPhone.mp3') },
  { delay: 10000, text: 'Ich warte noch 😊',            sound: assetUrl('/Notification_iPhone_2.mp3') },
];

const OUTGOING_SEQUENCE: { delay: number; text: string }[] = [
  { delay: 6500, text: 'Ja, gleich!' },
];

function nowTime(): string {
  return new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
}

export function MessagesApp({ active, hasSound, playSoundFn }: MessagesAppProps) {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [showTyping, setShowTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const nextId = useRef(INITIAL_MESSAGES.length);
  const prevMsgCountRef = useRef(INITIAL_MESSAGES.length);

  useEffect(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setMessages(INITIAL_MESSAGES);
    setShowTyping(false);
    nextId.current = INITIAL_MESSAGES.length;
    prevMsgCountRef.current = INITIAL_MESSAGES.length;

    if (!active) return;

    // Show typing indicator 1.2s before each incoming message
    INCOMING_SEQUENCE.forEach(({ delay, text, sound }) => {
      const typingStart = setTimeout(() => setShowTyping(true), delay - 1200);
      const msgTimer = setTimeout(() => {
        setShowTyping(false);
        setMessages(prev => [...prev, { id: nextId.current++, text, from: 'them', time: nowTime(), sound }]);
      }, delay);
      timersRef.current.push(typingStart, msgTimer);
    });

    OUTGOING_SEQUENCE.forEach(({ delay, text }) => {
      const t = setTimeout(() => {
        setMessages(prev => [...prev, { id: nextId.current++, text, from: 'me', time: nowTime() }]);
      }, delay);
      timersRef.current.push(t);
    });

    return () => timersRef.current.forEach(clearTimeout);
  }, [active]);

  // Play sound after React has committed the new message to the DOM
  // (i.e. after the slide-in animation has started, not before)
  useEffect(() => {
    const count = messages.length;
    if (!hasSound || count <= prevMsgCountRef.current) return;
    for (let i = prevMsgCountRef.current; i < count; i++) {
      const msg = messages[i];
      if (msg.from === 'them' && msg.sound) playSoundFn(msg.sound);
    }
    prevMsgCountRef.current = count;
  }, [messages]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, showTyping]);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: '#fff',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
      overflow: 'hidden',
    }}>
      {/* Navigation bar */}
      <div style={{
        background: 'rgba(249,249,249,0.95)',
        borderBottom: '0.5px solid rgba(0,0,0,0.18)',
        padding: '10px 16px 10px',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 17, color: '#007aff', fontWeight: 400 }}>{'< Nachrichten'}</span>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{
            width: 34,
            height: 34,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #007aff, #34aadc)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 600,
            fontSize: 14,
            marginBottom: 2,
          }}>MM</div>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#000' }}>Max Mustermann</span>
        </div>
        {/* Video call icon */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="#007aff">
          <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
        </svg>
      </div>

      {/* Messages area */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '8px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        <AnimatePresence initial={false}>
          {messages.map(msg => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: msg.from === 'me' ? 'flex-end' : 'flex-start',
              }}
            >
              <div style={{
                maxWidth: '78%',
                padding: '8px 12px',
                borderRadius: msg.from === 'me'
                  ? '18px 18px 4px 18px'
                  : '18px 18px 18px 4px',
                background: msg.from === 'me' ? '#007aff' : '#e9e9eb',
                color: msg.from === 'me' ? '#fff' : '#000',
                fontSize: 16,
                lineHeight: 1.4,
              }}>
                {msg.text}
              </div>
              <span style={{ fontSize: 11, color: '#8e8e93', marginTop: 2, marginLeft: 4, marginRight: 4 }}>
                {msg.time}
              </span>
            </motion.div>
          ))}

          {/* Typing indicator */}
          {showTyping && (
            <motion.div
              key="typing"
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'flex', alignItems: 'flex-start' }}
            >
              <div style={{
                padding: '10px 14px',
                borderRadius: '18px 18px 18px 4px',
                background: '#e9e9eb',
                display: 'flex',
                gap: 4,
                alignItems: 'center',
              }}>
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      background: '#8e8e93',
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input bar (decorative) */}
      <div style={{
        padding: '8px 12px',
        borderTop: '0.5px solid rgba(0,0,0,0.18)',
        background: 'rgba(249,249,249,0.95)',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        flexShrink: 0,
      }}>
        <div style={{
          flex: 1,
          height: 34,
          borderRadius: 17,
          border: '1px solid #c7c7cc',
          background: '#fff',
          padding: '0 12px',
          display: 'flex',
          alignItems: 'center',
        }}>
          <span style={{ fontSize: 16, color: '#c7c7cc' }}>iMessage</span>
        </div>
        {/* Send button (inactive) */}
        <div style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: '#c7c7cc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </div>
      </div>
    </div>
  );
}
