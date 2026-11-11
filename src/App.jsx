import { useRef, useState } from 'react';
import Ozlo from './ozlo/Ozlo.jsx';
import { FORMS, matchForm } from './ozlo/forms.js';
import './App.css';

const MOODS = ['idle', 'excited', 'curious', 'thinking', 'focused'];

export default function App() {
  const [mood, setMood] = useState('idle');
  const [talking, setTalking] = useState(false);
  const [look, setLook] = useState('center');
  const [blinkSignal, setBlinkSignal] = useState(0);
  const [form, setForm] = useState('core');
  const [message, setMessage] = useState('');
  const [log, setLog] = useState([]);
  const timers = useRef([]);

  const preview = matchForm(message);

  // Fakes the chat flow: think, then "reply" (talk), then back to idle.
  const send = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    timers.current.forEach(clearTimeout);
    const cued = matchForm(message);
    setLog((l) => [
      `“${message}” → ${cued ? `cue ${FORMS[cued].label}${FORMS[cued].ready ? '' : ' (frames not made yet)'}` : 'no form, stays Ozlo'}`,
      ...l,
    ].slice(0, 6));
    setMessage('');
    setTalking(false);
    // Ready forms morph straight away; anything else (or no keyword) brings him back to Ozlo.
    setForm(cued && FORMS[cued].ready ? cued : 'core');
    setMood('thinking');
    setLook('up');
    timers.current = [
      setTimeout(() => {
        setMood('idle');
        setLook('center');
        setTalking(true);
      }, 1500),
      setTimeout(() => setTalking(false), 4000),
    ];
  };

  return (
    <main className="sandbox">
      <section className="sandbox__panel">
        <h1>Ozlo sandbox</h1>
        <p className="sandbox__hint">The big Ozlo is for checking detail; the one in the corner is real size.</p>

        <h2>Mood</h2>
        <div className="sandbox__row">
          {MOODS.map((m) => (
            <button key={m} type="button" aria-pressed={mood === m} onClick={() => setMood(m)}>
              {m}
            </button>
          ))}
        </div>

        <h2>Face</h2>
        <div className="sandbox__row">
          <button type="button" aria-pressed={talking} onClick={() => setTalking((t) => !t)}>
            talking
          </button>
          <button type="button" aria-pressed={look === 'up'} onClick={() => setLook((l) => (l === 'up' ? 'center' : 'up'))}>
            look up
          </button>
          <button type="button" onClick={() => setBlinkSignal((n) => n + 1)}>
            blink now
          </button>
        </div>

        <h2>Form</h2>
        <div className="sandbox__row">
          {Object.entries(FORMS)
            .filter(([, info]) => info.ready)
            .map(([key, info]) => (
              <button key={key} type="button" aria-pressed={form === key} onClick={() => setForm(key)}>
                {info.label}
              </button>
            ))}
        </div>

        <h2>Keyword test</h2>
        <form className="sandbox__chat" onSubmit={send}>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="e.g. how much for a truck wrap?"
            aria-label="Visitor message"
          />
          <button type="submit">Send</button>
        </form>
        <p className="sandbox__match">
          {message ? (preview ? `Would cue: ${FORMS[preview].label}` : 'No form keyword yet') : 'Type a message to see which form it cues.'}
        </p>
        <ul className="sandbox__log">
          {log.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </section>

      <section className="sandbox__big">
        <Ozlo size={380} mood={mood} talking={talking} look={look} blinkSignal={blinkSignal} form={form} />
      </section>

      <div className="sandbox__corner">
        <Ozlo size={150} mood={mood} talking={talking} look={look} blinkSignal={blinkSignal} form={form} />
      </div>
    </main>
  );
}
