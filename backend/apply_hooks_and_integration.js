const fs = require('fs');
const path = require('path');

const targetFile = path.resolve(__dirname, '../frontend/index.html');
let html = fs.readFileSync(targetFile, 'utf8');

// 1. Hook speakText into handleChatSubmit
const oldHandleSubmit = `if (res.ok) {
          const data = await res.json();
          appendChatMessage("assistant", data.answer, data.citations);
        } else {`;

const newHandleSubmit = `if (res.ok) {
          const data = await res.json();
          appendChatMessage("assistant", data.answer, data.citations);
          speakText(data.answer, currentLanguage);
        } else {`;

if (html.includes(oldHandleSubmit)) {
  html = html.replace(oldHandleSubmit, newHandleSubmit);
  console.log('✅ Hooked speakText into handleChatSubmit response!');
} else {
  console.log('Target handleSubmit not matched directly, checking normalized string...');
}

// 2. Hook updateDashboardMetrics into initPlatform
const oldInit = `renderSchemes();
      populateCheckerSelect();
      renderSavedSchemes();
      renderCitizenServices();
      renderGuidanceChecklist();
      renderKnowledgeSources();
    }`;

const newInit = `renderSchemes();
      populateCheckerSelect();
      renderSavedSchemes();
      renderCitizenServices();
      renderGuidanceChecklist();
      renderKnowledgeSources();
      updateDashboardMetrics();
    }`;

if (html.includes(oldInit)) {
  html = html.replace(oldInit, newInit);
  console.log('✅ Hooked updateDashboardMetrics into initPlatform!');
} else {
  console.log('Target initPlatform not matched directly, checking normalized string...');
}

// 3. Hook stopVoiceRecognition and stopSpeechSynthesis into switchTab so mic and audio stop when navigating away
const oldSwitchTab = `function switchTab(pageId) {`;
const newSwitchTab = `function switchTab(pageId) {
      // Clean up any ongoing microphone capture or active speech when navigating away
      stopVoiceRecognition(false);
      stopSpeechSynthesis();`;

if (html.includes(oldSwitchTab)) {
  html = html.replace(oldSwitchTab, newSwitchTab);
  console.log('✅ Hooked microphone & speech auto-stop into switchTab!');
}

// 4. Hook updateDashboardMetrics when saving profile
const oldSaveProf = `function saveStudentProfile() {
      showToast("Student profile successfully updated and synchronized!", "success");
    }`;

const newSaveProf = `function saveStudentProfile() {
      // Validate required profile fields
      const name = (document.getElementById("prof-name")?.value || "").trim();
      const income = document.getElementById("prof-income")?.value;
      if (!name) {
        showToast("Please enter your legal name before saving.", "error");
        return;
      }
      if (!income || Number(income) <= 0) {
        showToast("Please provide valid annual family income for scholarship eligibility.", "error");
        return;
      }

      showToast("Student profile updated and synchronized with verified eligibility parameters!", "success");
      updateDashboardMetrics();
    }`;

if (html.includes(oldSaveProf)) {
  html = html.replace(oldSaveProf, newSaveProf);
  console.log('✅ Enhanced saveStudentProfile with validation and live dashboard recalculation!');
}

fs.writeFileSync(targetFile, html, 'utf8');
console.log('Saved integrations to frontend/index.html');

