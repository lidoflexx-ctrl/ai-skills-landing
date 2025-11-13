// pages/success.js
import { useEffect, useState } from 'react';
export default function Success() {
  const [msg, setMsg] = useState('Processing your order...');
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('session_id');
    if (id) setMsg('Payment complete — check your email for access. Thank you!');
    else setMsg('Thank you! Check your email for next steps.');
  }, []);
  return (
    <div style={{ padding: 40, fontFamily: 'Inter, system-ui' }}>
      <h1>Payment complete</h1>
      <p>{msg}</p>
      <p>Need support? Message: <a href="https://wa.me/27633701093">WhatsApp</a></p>
    </div>
  );
}
