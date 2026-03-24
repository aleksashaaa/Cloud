import { useState, useEffect, useRef } from 'react';
import { calculateCosts } from './utils/calculator';
import { chatWithAI } from './utils/openai';
import PRICING from './utils/pricing';
import './App.css';

function formatPrice(n, currency) {
  if (currency === 'KZT') return n.toLocaleString('ru-KZ') + ' ₸';
  return '$' + n.toFixed(2);
}

const PLATFORM_ICONS = {
  aws: '🟠', azure: '🔵', gcp: '🔴', pscloud: '🇰🇿', qaztelecom: '🇰🇿'
};

export default function App() {
  const [messages, setMessages] = useState([]);
  const [mode, setMode] = useState('menu');
  const [step, setStep] = useState(null);
  const [input, setInput] = useState('');
  const [userInputs, setUserInputs] = useState({});
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const pricing = PRICING;

  useEffect(() => {
    addBot("Hello! I'm **CFO Bot** — your Cloud Cost Estimator 💰\n\nWhat would you like to do?", [
      { label: '📊 Calculate Cloud Costs', action: 'calc' },
      { label: '💬 Chat with AI Assistant', action: 'chat' }
    ]);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function addBot(text, buttons) {
    setMessages(prev => [...prev, { role: 'bot', text, buttons: buttons || null, id: Date.now() + Math.random() }]);
  }

  function addUser(text) {
    setMessages(prev => {
      const updated = prev.map(m => ({ ...m, buttons: null }));
      return [...updated, { role: 'user', text, id: Date.now() + Math.random() }];
    });
  }

  function handleAction(action) {
    if (action === 'calc') {
      addUser('📊 Calculate Cloud Costs');
      setMode('calculator');
      const platforms = pricing.platforms;
      const btns = Object.entries(platforms).map(([key, p]) => ({
        label: `${PLATFORM_ICONS[key]} ${p.name}`,
        action: `platform_${key}`
      }));
      setStep('platform');
      setTimeout(() => addBot("Choose a **cloud platform**:", btns), 100);
      return;
    }

    if (action === 'chat') {
      addUser('💬 Chat with AI Assistant');
      setMode('chat');
      setStep('chat');
      setTimeout(() => addBot("I'm ready to chat! Ask me anything about cloud computing, pricing, or infrastructure.\n\nTo go back, type **menu**."), 100);
      return;
    }

    if (action === 'menu') {
      addUser('🏠 Main Menu');
      setMode('menu');
      setTimeout(() => addBot("Hello! I'm **CFO Bot** — your Cloud Cost Estimator 💰\n\nWhat would you like to do?", [
        { label: '📊 Calculate Cloud Costs', action: 'calc' },
        { label: '💬 Chat with AI Assistant', action: 'chat' }
      ]), 100);
      return;
    }

    if (action.startsWith('platform_')) {
      const key = action.replace('platform_', '');
      const p = pricing.platforms[key];
      setSelectedPlatform(key);
      addUser(`${PLATFORM_ICONS[key]} ${p.name}`);
      setUserInputs({});
      const cur = p.currency === 'KZT' ? '₸' : '$';
      setStep('usage_choice');
      setTimeout(() => addBot(
        `**${p.name}** pricing:\n` +
        `💻 Compute: ${cur}${p.compute_per_hour}/hr\n` +
        `💾 Storage: ${cur}${p.storage_per_gb}/GB\n` +
        `🌐 Bandwidth: ${cur}${p.bandwidth_per_gb}/GB\n\n` +
        `Select your **usage** profile:`,
        [
          { label: '🚀 Startup', action: 'preset_startup' },
          { label: '📈 Growth', action: 'preset_growth' },
          { label: '🏢 Enterprise', action: 'preset_enterprise' },
          { label: '✏️ Custom Input', action: 'custom' }
        ]
      ), 100);
      return;
    }

    if (action === 'preset_startup') {
      addUser('🚀 Startup');
      setTimeout(() => computeResult({ compute: 100, storage: 50, bandwidth: 20, database: 'basic' }), 100);
      return;
    }
    if (action === 'preset_growth') {
      addUser('📈 Growth');
      setTimeout(() => computeResult({ compute: 500, storage: 1000, bandwidth: 500, database: 'standart' }), 100);
      return;
    }
    if (action === 'preset_enterprise') {
      addUser('🏢 Enterprise');
      setTimeout(() => computeResult({ compute: 730, storage: 5000, bandwidth: 10000, database: 'premium' }), 100);
      return;
    }

    if (action === 'custom') {
      addUser('✏️ Custom Input');
      setStep('compute');
      setTimeout(() => addBot("Enter **Compute hours** per month:", [
        { label: '100 hrs', action: 'val_100' },
        { label: '300 hrs', action: 'val_300' },
        { label: '500 hrs', action: 'val_500' },
        { label: '730 hrs (24/7)', action: 'val_730' },
        { label: 'Skip', action: 'val_skip' }
      ]), 100);
      return;
    }

    if (action.startsWith('val_') || action.startsWith('db_')) {
      const val = action.replace('val_', '').replace('db_', '');
      handleCustomValue(val);
      return;
    }

    if (action === 'new' || action === 'compare') {
      addUser(action === 'new' ? '🔄 New Estimate' : '📊 Compare Platform');
      const platforms = pricing.platforms;
      const btns = Object.entries(platforms).map(([key, p]) => ({
        label: `${PLATFORM_ICONS[key]} ${p.name}`,
        action: `platform_${key}`
      }));
      setStep('platform');
      setTimeout(() => addBot("Choose a **cloud platform**:", btns), 100);
      return;
    }

    if (action === 'ask_ai') {
      addUser('💬 Ask AI');
      setMode('chat');
      setStep('chat');
      setTimeout(() => addBot("Ask me anything about cloud costs, architecture, or providers! Type **menu** to go back."), 100);
      return;
    }
  }

  function handleCustomValue(val) {
    if (step === 'compute') {
      if (val === 'skip') {
        addUser('Skip');
      } else {
        const num = Number(val);
        if (!validateNum(num, val, 'Compute hours')) return;
        addUser(`${val} hours`);
        setUserInputs(prev => ({ ...prev, compute: num }));
      }
      setStep('storage');
      setTimeout(() => addBot("Enter **Storage (GB)** per month:", [
        { label: '50 GB', action: 'val_50' },
        { label: '500 GB', action: 'val_500' },
        { label: '1 TB', action: 'val_1000' },
        { label: '5 TB', action: 'val_5000' },
        { label: 'Skip', action: 'val_skip' }
      ]), 100);
    } else if (step === 'storage') {
      if (val === 'skip') {
        addUser('Skip');
      } else {
        const num = Number(val);
        if (!validateNum(num, val, 'Storage')) return;
        addUser(`${val} GB`);
        setUserInputs(prev => ({ ...prev, storage: num }));
      }
      setStep('bandwidth');
      setTimeout(() => addBot("Enter **Bandwidth (GB)** — data transfer per month:", [
        { label: '20 GB', action: 'val_20' },
        { label: '100 GB', action: 'val_100' },
        { label: '500 GB', action: 'val_500' },
        { label: '10 TB', action: 'val_10000' },
        { label: 'Skip', action: 'val_skip' }
      ]), 100);
    } else if (step === 'bandwidth') {
      if (val === 'skip') {
        addUser('Skip');
      } else {
        const num = Number(val);
        if (!validateNum(num, val, 'Bandwidth')) return;
        addUser(`${val} GB`);
        setUserInputs(prev => ({ ...prev, bandwidth: num }));
      }
      setStep('database');
      const p = pricing.platforms[selectedPlatform];
      const cur = p.currency === 'KZT' ? '₸' : '$';
      const db = p.database;
      setTimeout(() => addBot("Choose a **Database tier**:", [
        { label: `Basic — ${cur}${db.basic}/mo`, action: 'db_basic' },
        { label: `Standart — ${cur}${db.standart}/mo`, action: 'db_standart' },
        { label: `Premium — ${cur}${db.premium}/mo`, action: 'db_premium' },
        { label: '❌ No database', action: 'db_none' }
      ]), 100);
    } else if (step === 'database') {
      const dbVal = val === 'none' ? null : val;
      addUser(dbVal ? dbVal.charAt(0).toUpperCase() + dbVal.slice(1) : 'No database');
      const finalInputs = { ...userInputs };
      if (dbVal) finalInputs.database = dbVal;
      setTimeout(() => computeResult(finalInputs), 100);
    }
  }

  function validateNum(num, raw, field) {
    if (isNaN(num) || raw === '') {
      addBot(`⚠️ Invalid input: ${field} must be a valid number. Try again.`);
      return false;
    }
    if (!Number.isInteger(num)) {
      addBot(`⚠️ Invalid input: ${field} must be an integer. Try again.`);
      return false;
    }
    if (num < 0) {
      addBot(`⚠️ Invalid input: ${field} must be a positive number. Try again.`);
      return false;
    }
    return true;
  }

  function computeResult(inputs) {
    const p = pricing.platforms[selectedPlatform];
    const result = calculateCosts(inputs, p);

    if (!result.success) {
      addBot('⚠️ ' + result.errors.join('\n'));
      return;
    }

    const b = result.breakdown;
    const cur = p.currency || 'USD';
    const fmt = (n) => formatPrice(n, cur);
    const tierLabel = result.inputs.database === 'none' ? 'None' :
      result.inputs.database.charAt(0).toUpperCase() + result.inputs.database.slice(1);

    const msg =
      `📊 **${p.name} — Monthly Cost Breakdown**\n\n` +
      `💻 Compute (${result.inputs.compute} hrs): **${fmt(b.compute)}**\n` +
      `💾 Storage (${result.inputs.storage} GB): **${fmt(b.storage)}**\n` +
      `🌐 Bandwidth (${result.inputs.bandwidth} GB): **${fmt(b.bandwidth)}**\n` +
      `🗄️ Database (${tierLabel}): **${fmt(b.database)}**\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `💰 **Total Monthly Cost: ${fmt(result.total)}**`;

    addBot(msg, [
      { label: '🔄 New Estimate', action: 'new' },
      { label: '📊 Compare Platform', action: 'compare' },
      { label: '💬 Ask AI', action: 'ask_ai' },
      { label: '🏠 Main Menu', action: 'menu' }
    ]);
    setStep('after_result');
  }

  async function handleChatMessage(text) {
    if (text.toLowerCase() === 'menu') {
      addUser('menu');
      setMode('menu');
      setTimeout(() => addBot("Hello! I'm **CFO Bot** — your Cloud Cost Estimator 💰\n\nWhat would you like to do?", [
        { label: '📊 Calculate Cloud Costs', action: 'calc' },
        { label: '💬 Chat with AI Assistant', action: 'chat' }
      ]), 100);
      return;
    }

    addUser(text);
    setLoading(true);

    const newHistory = [...chatHistory, { role: 'user', content: text }];
    const reply = await chatWithAI(text, chatHistory);
    newHistory.push({ role: 'assistant', content: reply });
    setChatHistory(newHistory);

    setLoading(false);
    addBot(reply);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const val = input.trim();
    if (!val) return;
    setInput('');

    if (mode === 'chat') {
      handleChatMessage(val);
    } else if (['compute', 'storage', 'bandwidth'].includes(step)) {
      handleCustomValue(val);
    }
  }

  function renderMessage(msg, i) {
    const isBot = msg.role === 'bot';
    return (
      <div key={msg.id || i} className={`message ${isBot ? 'bot' : 'user'}`}>
        <div className="message-avatar">{isBot ? '🤖' : '👤'}</div>
        <div className="message-content">
          <div className="message-bubble">
            {msg.text.split('\n').map((line, j) => {
              if (line.trim() === '') return <br key={j} />;
              const parts = line.split(/\*\*(.*?)\*\*/g);
              return (
                <p key={j}>
                  {parts.map((part, k) =>
                    k % 2 === 1 ? <strong key={k}>{part}</strong> : part
                  )}
                </p>
              );
            })}
          </div>
          {msg.buttons && msg.buttons.length > 0 && (
            <div className="buttons-row">
              {msg.buttons.map((btn, j) => (
                <button key={j} className="choice-btn" onClick={() => handleAction(btn.action)}>
                  {btn.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  const showTextInput = mode === 'chat' || ['compute', 'storage', 'bandwidth'].includes(step);

  return (
    <div className="app">
      <header className="header">
        <h1>💰 CFO Bot</h1>
        <p>Cloud Cost Estimator • Multi-Platform</p>
      </header>

      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((msg, i) => renderMessage(msg, i))}
          {loading && (
            <div className="message bot">
              <div className="message-avatar">🤖</div>
              <div className="message-bubble typing">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {showTextInput && (
          <div className="chat-input-area">
            <form onSubmit={handleSubmit} className="input-form">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={mode === 'chat' ? 'Ask me anything...' : 'Or type a number...'}
                autoFocus
                disabled={loading}
              />
              <button type="submit" className="send-btn" disabled={loading}>Send</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
