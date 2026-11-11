import { useRef, useState } from 'react';
import { ArrowRight, BriefcaseBusiness, Check, CheckCircle2, ChevronRight, CircleAlert, CloudUpload, FileText, Lightbulb, LoaderCircle, RotateCcw, ShieldCheck, Sparkles, Target, WandSparkles, X } from 'lucide-react';

const sampleJD = `We are hiring a Software Development Engineer with experience in JavaScript, React, Node.js, Express, MongoDB, SQL, Git, REST API and Data Structures. The candidate should be comfortable building scalable web applications, debugging issues, collaborating with teams and communicating technical decisions.`;

function App() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const fileInput = useRef(null);

  function acceptFile(next) {
    if (!next) return;
    if (!/\.(pdf|docx|txt)$/i.test(next.name)) return setError('Upload a PDF, DOCX or TXT file.');
    if (next.size > 5 * 1024 * 1024) return setError('File size must be 5 MB or less.');
    setFile(next); setError(''); setResult(null);
  }

  async function analyze(event) {
    event.preventDefault();
    if (!file) return setError('Please upload your resume first.');
    if (jobDescription.trim().length < 40) return setError('Please paste at least 40 characters of a job description.');
    setLoading(true); setError(''); setResult(null);
    const data = new FormData();
    data.append('resume', file);
    data.append('jobDescription', jobDescription);
    try {
      const response = await fetch('/api/analyze', { method: 'POST', body: data });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || 'Analysis failed.');
      setResult(json);
      setTimeout(() => document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    } catch (err) { setError(err.message || 'Network error. Is the backend running?'); }
    finally { setLoading(false); }
  }

  function reset() { setFile(null); setJobDescription(''); setResult(null); setError(''); if (fileInput.current) fileInput.current.value = ''; window.scrollTo({ top: 0, behavior: 'smooth' }); }

  return <div className="app">
    <header className="nav wrap"><a className="brand" href="#home"><span className="brand-icon"><Sparkles size={20}/></span> Hire<span>Lens</span><small>AI</small></a><span className="nav-status"><span className="live-dot"/> Resume intelligence platform</span><a className="nav-link" href="#analyzer">Start analyzing <ArrowRight size={15}/></a></header>
    <main id="home">
      <section className="hero wrap"><div className="hero-copy"><div className="eyebrow"><Sparkles size={14}/> SMARTER APPLICATIONS START HERE</div><h1>Your resume.<br/><span>Stronger opportunities.</span></h1><p>See how well your resume fits a job, spot missing skills, and get practical suggestions to stand out.</p><a className="primary hero-cta" href="#analyzer">Analyze my resume <ArrowRight size={18}/></a><div className="trust"><ShieldCheck size={17}/> Your file is processed for this analysis and is not saved by this app.</div></div><div className="hero-graphic"><div className="graphic-grid"/><div className="floating glow-a"><CheckCircle2 size={18}/> Skills aligned</div><div className="resume-card"><div className="resume-top"><div className="resume-avatar">JD</div><div><div className="line wide"/><div className="line short"/></div><span className="mini-pill">RESUME</span></div><div className="resume-divider"/><div className="resume-label">PROFESSIONAL SUMMARY</div><div className="line large"/><div className="line large"/><div className="line medium"/><div className="resume-label spaced">SKILLS MATCH</div><div className="match-row"><span>React</span><Check size={14}/></div><div className="match-row"><span>Node.js</span><Check size={14}/></div><div className="match-row"><span>MongoDB</span><Check size={14}/></div><div className="mock-progress"><div/></div></div><div className="floating glow-b"><Target size={20}/><div><b>Better fit</b><small>Clear, actionable feedback</small></div></div></div></section>
      <section className="features wrap"><div><span className="feature-icon purple"><Target size={21}/></span><b>Match insights</b><p>Compare resume skills with the job requirements.</p></div><div><span className="feature-icon pink"><Lightbulb size={21}/></span><b>Smart feedback</b><p>Find strengths, gaps and areas to improve.</p></div><div><span className="feature-icon blue"><WandSparkles size={21}/></span><b>Better bullet points</b><p>Get a starting point for clearer resume impact.</p></div></section>
      <section className="analyzer-section" id="analyzer"><div className="wrap"><div className="section-title"><span className="section-kicker">THE RESUME LAB</span><h2>Let's make your next application count.</h2><p>Two quick steps to get your personalized resume analysis.</p></div><form className="form-grid" onSubmit={analyze}><div className="input-panel"><div className="panel-heading"><span className="number">01</span><div><h3>Upload your resume</h3><p>Let us understand your experience</p></div></div><input ref={fileInput} type="file" accept=".pdf,.docx,.txt" hidden onChange={e => acceptFile(e.target.files?.[0])}/><div className={`dropzone ${dragging ? 'dragging' : ''} ${file ? 'has-file' : ''}`} onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={e => { e.preventDefault(); setDragging(false); acceptFile(e.dataTransfer.files?.[0]); }} onClick={() => fileInput.current?.click()} role="button" tabIndex={0} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInput.current?.click(); } }}>
        {file ? <><div className="upload-icon success"><FileText size={27}/></div><b className="file-name">{file.name}</b><span>{(file.size / 1024).toFixed(0)} KB · Click to replace</span><div className="uploaded"><CheckCircle2 size={14}/> Ready for analysis</div></> : <><div className="upload-icon"><CloudUpload size={29}/></div><b>Drag & drop your resume</b><span>or <em>browse files</em> from your computer</span><small>PDF, DOCX or TXT · Maximum 5 MB</small></>}
      </div></div><div className="input-panel"><div className="panel-heading"><span className="number">02</span><div><h3>Paste the job description</h3><p>Tell us what role you're targeting</p></div></div><textarea value={jobDescription} onChange={e => { setJobDescription(e.target.value); setResult(null); }} placeholder="Paste the job requirements, responsibilities, and qualifications here..." maxLength={12000}/><div className="textarea-footer"><button className="sample-button" type="button" onClick={() => { setJobDescription(sampleJD); setResult(null); }}>Use sample job description <ChevronRight size={14}/></button><span>{jobDescription.length.toLocaleString()} / 12,000</span></div></div><div className="submit-area">{error && <div className="error"><CircleAlert size={17}/>{error}</div>}<button className="primary submit-button" disabled={loading} type="submit">{loading ? <><LoaderCircle className="spin" size={19}/> Analyzing your resume...</> : <><Sparkles size={19}/> Analyze resume <ArrowRight size={19}/></>}</button><p><ShieldCheck size={14}/> Secure upload · Results are estimates, not guarantees</p></div></form>
      {result && <section className="results" id="results"><div className="result-head"><div><span className="section-kicker">YOUR ANALYSIS REPORT</span><h2>Here's how you're looking.</h2></div><button onClick={reset} className="reset-button"><RotateCcw size={16}/> Start over</button></div>{result.mode === 'demo' && <div className="demo-alert"><CircleAlert size={17}/><div><b>Demo mode:</b> This is keyword-based feedback. Add a Gemini API key to enable AI-powered analysis.</div></div>}<div className="result-grid"><div className="score-card"><span>RESUME–JOB MATCH ESTIMATE</span><div className="score-ring" style={{ '--score': `${result.score}%` }}><div><strong>{result.score}%</strong><small>Estimated match</small></div></div><p>{result.summary}</p></div><div className="skills-card"><h3><CheckCircle2 size={19}/> Matched skills</h3><div className="tags">{result.matchedSkills.length ? result.matchedSkills.map((skill, i) => <span className="tag matched" key={i}>{skill}</span>) : <p>No matching listed keywords detected.</p>}</div><div className="subline"/><h3 className="missing"><CircleAlert size={19}/> Skills to review</h3><div className="tags">{result.missingSkills.length ? result.missingSkills.map((skill, i) => <span className="tag missing-tag" key={i}>{skill}</span>) : <p>No missing listed keywords detected.</p>}</div></div></div><div className="feedback-grid"><article className="feedback-card"><h3><CheckCircle2 size={20}/> What's working</h3><ul>{result.strengths.map((point, i) => <li key={i}>{point}</li>)}</ul></article><article className="feedback-card"><h3><Lightbulb size={20}/> How to improve</h3><ul>{result.suggestions.map((point, i) => <li key={i}>{point}</li>)}</ul></article></div><div className="bullet-card"><div className="bullet-icon"><WandSparkles size={21}/></div><div><h3>Example improved resume bullet</h3><p>{result.improvedBullet}</p><small>Only use claims and numbers you can verify.</small></div></div></section>}
      </div></section>
    </main><footer><div className="wrap footer-inner"><div className="brand footer-brand"><span className="brand-icon"><Sparkles size={17}/></span> Hire<span>Lens</span></div><span>Built to make your next move a little easier.</span><span>© {new Date().getFullYear()} HireLens</span></div></footer>
  </div>;
}

export default App;
