// SymptomChecker — The AI chat assistant + symptom diagnostic tool
// Left pane:  Chat with the AI doctor about your symptoms
// Right pane: Select symptoms from chips, then run analysis to see condition probabilities
// Props:
//   - apiService: the API service object for backend calls
//   - selectedSpecialty: doctor specialty filter (updated based on analysis result)
//   - onSpecialtyChange: callback to update specialty filter in parent
//   - onNavigateToDoctors: navigation callback for the "Find doctors" button
import React, { useState } from 'react';
import {
  Activity,
  User,
  BriefcaseMedical,
  CheckCircle2,
  Trash2,
  Plus,
  Stethoscope,
  Heart,
  AlertTriangle,
  FileText,
} from 'lucide-react';

export default function SymptomChecker({
  apiService,
  selectedSpecialty,
  onSpecialtyChange,
  onNavigateToDoctors,
}) {
  // --- State for the AI Chat ---
  // Chat message history starts with a greeting from the AI doctor
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'model',
      text: 'Hello! I am your MediCare AI Assistant. How can I help you today? Please describe what physical symptoms you are experiencing so I can assist you.',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatSending, setChatSending] = useState(false);

  // --- State for Symptom Selection ---
  // User can click preset symptom chips OR type their own custom symptom
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [customSymptom, setCustomSymptom] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  // List of common symptoms offered as selectable chips
  const commonSymptomsList = [
    'Fever',
    'Cough',
    'Chest Pain',
    'Shortness of breath',
    'Headache',
    'Sore throat',
    'Fatigue',
    'Runny nose',
    'Joint pain',
    'Nausea',
    'Vomiting',
  ];

  // --- Symptom chip toggle ---
  // If symptom already selected, remove it; otherwise add it
  const toggleSymptomTag = (symptom) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  // Add a custom typed symptom to the list
  const handleAddCustomSymptom = (e) => {
    e.preventDefault();
    const trimmed = customSymptom.trim();
    if (trimmed && !selectedSymptoms.includes(trimmed)) {
      setSelectedSymptoms([...selectedSymptoms, trimmed]);
      setCustomSymptom('');
    }
  };

  // --- Send message to AI Chat ---
  // Runs when user presses Enter or clicks Send in the chat input
  const handleSendChatMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || chatSending) return;

    const userMessage = chatInput.trim();
    setChatInput('');

    // Add user message to history and show loading state
    const updatedHistory = [...chatMessages, { role: 'user', text: userMessage }];
    setChatMessages(updatedHistory);
    setChatSending(true);

    try {
      // Call the backend chat endpoint (with client-side fallback in api.js)
      const reply = await apiService.chat(updatedHistory, userMessage);
      setChatMessages([...updatedHistory, { role: 'model', text: reply }]);

      // Auto-extract symptoms from user message and add them to the profile
      const symptomsFound = [];
      const msgLower = userMessage.toLowerCase();
      commonSymptomsList.forEach((s) => {
        if (msgLower.includes(s.toLowerCase())) {
          symptomsFound.push(s);
        }
      });
      if (symptomsFound.length > 0) {
        setSelectedSymptoms((prev) => {
          const joined = [...new Set([...prev, ...symptomsFound])];
          return joined;
        });
      }
    } catch (err) {
      console.error('Chat error:', err);
      setChatMessages([
        ...updatedHistory,
        { role: 'model', text: "Chat session encountered an issue. Let's try again." },
      ]);
    } finally {
      setChatSending(false);
    }
  };

  // --- Run symptom analysis ---
  // Calls the API to classify conditions based on selected symptoms
  const runSymptomAnalysis = async () => {
    if (selectedSymptoms.length === 0) return;
    setAnalyzing(true);
    setAnalysisResult(null);
    try {
      const result = await apiService.checkSymptoms(selectedSymptoms);
      setAnalysisResult(result);

      // Auto-suggest a doctor specialty based on risk level
      if (result.riskLevel === 'High') {
        onSpecialtyChange('Cardiologist');
      } else if (
        result.conditions &&
        result.conditions.some(
          (c) => c.toLowerCase().includes('influenza') || c.toLowerCase().includes('cold')
        )
      ) {
        onSpecialtyChange('General Physician');
      }
    } catch (err) {
      console.error('Analysis failed:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="tab-content fade-in-entry">
      <div className="welcome-banner glass-panel">
        <div>
          <h2>AI Medical Assistant &amp; Diagnostics</h2>
          <p>
            Consult with our virtual AI Doctor in real-time and review diagnostic
            reports on your symptom profile.
          </p>
        </div>
      </div>

      <div className="checker-layout-grid">
        {/* ===== Left Pane: AI Doctor Chat ===== */}
        <div className="checker-input-card checker-chat-card glass-panel">
          <div className="chat-header">
            <Activity className="chat-status-icon pulse" size={16} />
            <h3>Consult Virtual Physician</h3>
          </div>

          {/* Scrollable area showing all chat messages */}
          <div className="chat-messages-container">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`chat-bubble-row ${msg.role === 'user' ? 'bubble-user' : 'bubble-model'}`}
              >
                <div className="chat-avatar">
                  {msg.role === 'user' ? <User size={16} /> : <BriefcaseMedical size={16} />}
                </div>
                <div className="chat-bubble-text">
                  <p>{msg.text}</p>
                </div>
              </div>
            ))}
            {/* Show typing animation while waiting for AI response */}
            {chatSending && (
              <div className="chat-bubble-row bubble-model">
                <div className="chat-avatar">
                  <BriefcaseMedical size={16} className="animated-pulse" />
                </div>
                <div className="chat-bubble-text chat-loading">
                  <span className="dot-pulse-1">.</span>
                  <span className="dot-pulse-2">.</span>
                  <span className="dot-pulse-3">.</span>
                </div>
              </div>
            )}
          </div>

          {/* Chat input at the bottom */}
          <form onSubmit={handleSendChatMessage} className="chat-input-form">
            <input
              type="text"
              className="form-input chat-input-field"
              placeholder="Describe your symptom discomfort..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              disabled={chatSending}
            />
            <button
              type="submit"
              className="btn-primary chat-send-btn"
              disabled={chatSending || !chatInput.trim()}
            >
              Send Message
            </button>
          </form>
        </div>

        {/* ===== Right Pane: Diagnostic Profile ===== */}
        <div className="checker-results-card">
          <div className="glass-panel diagnostic-extraction-panel">
            <div className="extractor-header">
              <Stethoscope size={18} className="text-secondary" />
              <h3>Diagnostic Profile Summary</h3>
            </div>

            <div className="extractor-body">
              <p className="section-instruction">
                Select symptoms to build your profile, then click the evaluation button to
                view medical insights.
              </p>

              {/* Clickable symptom chips */}
              <div className="symptom-tag-container">
                {commonSymptomsList.map((sym) => (
                  <button
                    key={sym}
                    type="button"
                    className={`symptom-tag-btn ${selectedSymptoms.includes(sym) ? 'tag-selected' : ''}`}
                    onClick={() => toggleSymptomTag(sym)}
                  >
                    {selectedSymptoms.includes(sym) ? <CheckCircle2 size={14} /> : <Plus size={14} />}
                    {sym}
                  </button>
                ))}
              </div>

              {/* Area to add custom symptom */}
              <form onSubmit={handleAddCustomSymptom} className="custom-symptom-form">
                <input
                  type="text"
                  className="form-input"
                  placeholder="Type a custom symptom and press Enter..."
                  value={customSymptom}
                  onChange={(e) => setCustomSymptom(e.target.value)}
                />
              </form>

              {/* List of currently selected symptoms with remove buttons */}
              <div className="selected-symptoms-list">
                <h4>Extracted Symptoms from Consult:</h4>
                {selectedSymptoms.length === 0 ? (
                  <p className="empty-symptom-text">
                    Chat with the AI Doctor above or select chips to extract symptoms.
                  </p>
                ) : (
                  <div className="tags-flex">
                    {selectedSymptoms.map((sym) => (
                      <span key={sym} className="symptom-chip">
                        {sym}
                        <Trash2
                          size={12}
                          className="delete-chip-icon"
                          onClick={() => toggleSymptomTag(sym)}
                        />
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Button to run the analysis */}
              <button
                onClick={runSymptomAnalysis}
                className="btn-primary analyze-btn"
                disabled={selectedSymptoms.length === 0 || analyzing}
              >
                {analyzing ? 'Evaluating Clinical Diagnostic Profile...' : 'Run Diagnostics Analysis'}
              </button>
            </div>
          </div>

          {/* Area that shows analysis results */}
          <div className="diagnostic-details-wrapper" style={{ marginTop: '20px' }}>
            {analyzing ? (
              <div className="glass-panel result-loader">
                <div className="pulse-medical-ring">
                  <BriefcaseMedical size={36} className="text-primary animated-pulse" />
                </div>
                <h4>Computing Risk Profile...</h4>
                <p>Generating condition correlations and clinical recommendations.</p>
              </div>
            ) : analysisResult ? (
              <div className="result-container fade-in-entry">
                {/* Risk level indicator */}
                <div
                  className={`glass-panel risk-indicator-panel risk-${analysisResult.riskLevel.toLowerCase()}`}
                >
                  <div className="risk-header">
                    <span>Urgency Risk level</span>
                    <span className="risk-level-badge">{analysisResult.riskLevel} Risk</span>
                  </div>
                  <p className="risk-guidance-text">{analysisResult.guidance}</p>
                </div>

                {/* Condition probabilities */}
                <div className="glass-panel result-details-panel">
                  <h3>Correlated Conditions</h3>
                  <div className="conditions-list">
                    {analysisResult.conditions.map((cond, idx) => (
                      <div key={idx} className="condition-card">
                        <Heart size={16} className="text-secondary" />
                        <span>{cond}</span>
                      </div>
                    ))}
                  </div>

                  <div className="recommendation-cta">
                    <p>
                      Based on symptoms, we recommend booking a consult with a{' '}
                      <strong>{selectedSpecialty || 'General Practitioner'}</strong>.
                    </p>
                    <button className="btn-primary" onClick={onNavigateToDoctors}>
                      Find recommended doctors
                    </button>
                  </div>
                </div>

                {/* Medical disclaimer */}
                <div className="disclaimer-panel glass-panel">
                  <AlertTriangle className="disclaimer-icon" size={24} />
                  <div>
                    <h4>Medical Disclaimer</h4>
                    <p>{analysisResult.disclaimer}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="glass-panel results-placeholder">
                <FileText size={40} className="text-muted" style={{ marginBottom: '15px' }} />
                <h4>Evaluate Diagnostic Profile</h4>
                <p>
                  Build your symptom checklist on the top panel and run analysis to view
                  condition probabilities and medical disclaimer information.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
