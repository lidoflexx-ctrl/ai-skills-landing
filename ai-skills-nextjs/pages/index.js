
import {useState, useEffect} from "react";

export default function Home() {
  const [formProvider, setFormProvider] = useState("google");
  const [formID, setFormID] = useState("");
  const [serverEndpoint, setServerEndpoint] = useState("/api/check-form");
  const [apiKey, setApiKey] = useState("");
  const [testing, setTesting] = useState(false);
  const [testStatus, setTestStatus] = useState(null);

  const whatsappNumber = "27633701093";

  const getFormAction = () => {
    if (!formID) return "#";
    switch(formProvider) {
      case "convertkit": return `https://app.convertkit.com/forms/${formID}/subscriptions`;
      case "mailerlite": return `https://assets.mailerlite.com/jsonp/${formID}/subscribe`;
      default: return `https://docs.google.com/forms/d/e/${formID}/formResponse`;
    }
  };

  const handleOpenForm = () => {
    const url = getFormAction();
    if (url === "#") return;
    window.open(url, "_blank");
  };

  const handleTestServer = async () => {
    const url = getFormAction();
    if (!formID || url === "#") {
      setTestStatus("Please enter a form ID first.");
      return;
    }
    if (!serverEndpoint) {
      setTestStatus("Please enter your serverless endpoint.");
      return;
    }
    setTesting(true); setTestStatus(null);
    try {
      const res = await fetch(serverEndpoint, {
        method: "POST",
        headers: {
          "Content-Type":"application/json",
          ...(apiKey ? { "x-api-key": apiKey } : {})
        },
        body: JSON.stringify({ url })
      });
      const json = await res.json();
      if (!res.ok) {
        setTestStatus(`Server check failed: ${json.error || res.statusText} (HTTP ${res.status})`);
      } else if (json.ok) {
        setTestStatus(`Form endpoint reachable — HTTP ${json.status} ${json.statusText || ''}`);
      } else {
        setTestStatus(`Server returned: ${JSON.stringify(json)}`);
      }
    } catch(err) {
      setTestStatus("Error contacting server endpoint: " + String(err));
    } finally { setTesting(false); }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const utm_source = params.get('utm_source') || localStorage.getItem('utm_source') || '';
    const utm_medium = params.get('utm_medium') || localStorage.getItem('utm_medium') || '';
    const utm_campaign = params.get('utm_campaign') || localStorage.getItem('utm_campaign') || '';
    const gclid = params.get('gclid') || localStorage.getItem('gclid') || '';
    if (params.get('utm_source')) localStorage.setItem('utm_source', params.get('utm_source'));
    if (params.get('utm_medium')) localStorage.setItem('utm_medium', params.get('utm_medium'));
    if (params.get('utm_campaign')) localStorage.setItem('utm_campaign', params.get('utm_campaign'));
    if (params.get('gclid')) localStorage.setItem('gclid', params.get('gclid'));
    (window).__aiSkillsUtm = { utm_source, utm_medium, utm_campaign, gclid };
    // populate hidden fields if form is present
    const f = document.getElementById('signup-form');
    if (f) {
      const s = (window).__aiSkillsUtm || {};
      ['utm_source','utm_medium','utm_campaign','gclid'].forEach(k => {
        const el = document.getElementById(k);
        if (el) el.value = s[k] || '';
      });
    }
  }, []);

  return (
    <div className="container">
      <header style={{textAlign:'center', marginBottom:24}}>
        <h1 style={{fontSize:28, margin:0}}>Work Smarter, Not Harder — Master AI Tools That Save You 10+ Hours a Week</h1>
        <p className="small">A 7-day online course for freelancers and small business owners using ChatGPT, Canva AI, and Notion.</p>
        <div style={{marginTop:12}}>
          <button className="cta" style={{marginRight:8}}>Join Beta — R400</button>
          <a href={"https://wa.me/" + whatsappNumber + "?text=Hi%2C%20I%27m%20interested%20in%20the%20AI%20Skills%20course"} target="_blank" rel="noreferrer">
            <button className="whatsapp">Chat on WhatsApp</button>
          </a>
        </div>
      </header>

      <section className="card" style={{marginBottom:16}}>
        <h3>Configure Signup Form</h3>
        <div style={{display:'flex', gap:8, flexWrap:'wrap', marginTop:8}}>
          <select value={formProvider} onChange={e=>setFormProvider(e.target.value)} className="input">
            <option value="google">Google Forms</option>
            <option value="convertkit">ConvertKit</option>
            <option value="mailerlite">MailerLite</option>
          </select>
          <input className="input" placeholder="Form ID" value={formID} onChange={e=>setFormID(e.target.value)} />
        </div>
        <p className="small">The form action below will auto-update to the selected provider & ID.</p>

        <div style={{marginTop:12}}>
          <div style={{marginBottom:8}}><strong>Serverless check settings</strong></div>
          <input className="input" placeholder="/api/check-form or https://your-site/.netlify/functions/check-form" value={serverEndpoint} onChange={e=>setServerEndpoint(e.target.value)} />
          <input className="input" placeholder="Optional API key for serverless function" value={apiKey} onChange={e=>setApiKey(e.target.value)} />
        </div>
      </section>

      <section className="card" style={{marginBottom:16}}>
        <h3>Signup (preview)</h3>
        <form id="signup-form" action={getFormAction()} method="POST" target="_blank" style={{display:'flex', gap:8, alignItems:'center'}}>
          <input className="input" name="emailAddress" type="email" placeholder="you@youremail.com" required style={{flex:1}} />
          <input type="hidden" name="utm_source" id="utm_source" />
          <input type="hidden" name="utm_medium" id="utm_medium" />
          <input type="hidden" name="utm_campaign" id="utm_campaign" />
          <input type="hidden" name="gclid" id="gclid" />
          <button className="cta" type="submit">Get Prompt Pack</button>
        </form>

        <div style={{marginTop:12}}>
          <button onClick={handleOpenForm} className="input" style={{marginRight:8}}>Open form in new tab</button>
          <button onClick={handleTestServer} className="input" disabled={testing}>{testing ? 'Testing...' : 'Test (server)'}</button>
        </div>
        {testStatus && <p className="small" style={{marginTop:8}}>{testStatus}</p>}
      </section>

      <section className="card" style={{marginBottom:16}}>
        <h3>Course Curriculum (preview)</h3>
        <table className="table">
          <thead><tr><th>Day</th><th>Topic</th><th>Outcome</th></tr></thead>
          <tbody>
            <tr><td>1</td><td>What AI can do for you</td><td>Identify 5 tasks to automate</td></tr>
            <tr><td>2</td><td>ChatGPT Prompting</td><td>Write content 3x faster</td></tr>
            <tr><td>3</td><td>Canva + Notion AI</td><td>Create content & reports automatically</td></tr>
            <tr><td>4</td><td>Automating Repetitive Work</td><td>Integrate AI into daily tasks</td></tr>
            <tr><td>5</td><td>AI-Enhanced Offer</td><td>Create a paid service</td></tr>
            <tr><td>6-7</td><td>Q&A + Final Project</td><td>Finish first AI-assisted workflow</td></tr>
          </tbody>
        </table>
      </section>

      <footer style={{textAlign:'center', marginTop:24, color:'#6b7280'}} className="small">
        © AI Skills — Built for freelancers. UTM & server-check ready.
      </footer>
    </div>
  );
}
