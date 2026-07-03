#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { execSync } from 'child_process';

const [,, outputPath, inputPath, customTitle] = process.argv;

if (!outputPath) {
  console.error('Usage: node generate-docs.js <output-path> [json-input] [custom-title]');
  process.exit(1);
}

// Load session data (from file or stdin)
let sessionData = {};
if (inputPath && existsSync(resolve(inputPath))) {
  sessionData = JSON.parse(readFileSync(resolve(inputPath), 'utf-8'));
}

const projectName = sessionData.projectName || customTitle || 'Project Documentation';
const date = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function buildSections(data) {
  const reqs = data.requests || [];
  const files = data.filesChanged || [];
  const issues = data.issuesFixed || [];
  const steps = data.technicalSteps || [];
  const tests = data.testing || [];
  const commands = data.commands || [];
  const decisions = data.decisions || [];
  const pending = data.pendingItems || [];
  const changelog = data.changelog || [];

  return `
    <div class="page-break"></div>
    <h1>1. Executive Summary</h1>
    <p>${escapeHtml(data.executiveSummary || 'Not available in the provided conversation.')}</p>

    <div class="page-break"></div>
    <h1>2. User Request Summary</h1>
    <table>
      <tr><th>Request No.</th><th>User Request</th><th>Status</th><th>Notes</th></tr>
      ${reqs.length ? reqs.map((r, i) => `<tr><td>${i + 1}</td><td>${escapeHtml(r.request)}</td><td>${escapeHtml(r.status)}</td><td>${escapeHtml(r.notes)}</td></tr>`).join('') : '<tr><td colspan="4">Not available in the provided conversation.</td></tr>'}
    </table>

    <div class="page-break"></div>
    <h1>3. Requirements Identified</h1>
    ${renderRequirements(data.requirements || {})}

    <div class="page-break"></div>
    <h1>4. Project Navigation and Investigation</h1>
    <p>${escapeHtml(data.projectNavigation || 'Not available in the provided conversation.')}</p>

    <div class="page-break"></div>
    <h1>5. Files and Areas Changed</h1>
    <table>
      <tr><th>File / Area</th><th>Type of Change</th><th>Reason</th><th>Status</th></tr>
      ${files.length ? files.map(f => `<tr><td>${escapeHtml(f.file)}</td><td>${escapeHtml(f.type)}</td><td>${escapeHtml(f.reason)}</td><td>${escapeHtml(f.status)}</td></tr>`).join('') : '<tr><td colspan="4">Not available in the provided conversation.</td></tr>'}
    </table>

    <div class="page-break"></div>
    <h1>6. Technical Steps Performed</h1>
    ${steps.length ? steps.map((s, i) => `
      <h2>Step ${i + 1}: ${escapeHtml(s.title)}</h2>
      <p><strong>What was done:</strong> ${escapeHtml(s.what)}</p>
      <p><strong>Why it was done:</strong> ${escapeHtml(s.why)}</p>
      <p><strong>Files involved:</strong> ${escapeHtml(s.files)}</p>
      <p><strong>Result:</strong> ${escapeHtml(s.result)}</p>
    `).join('') : '<p>Not available in the provided conversation.</p>'}

    <div class="page-break"></div>
    <h1>7. Issues Found and Fixes Applied</h1>
    ${issues.length ? issues.map((issue, i) => `
      <h2>Issue ${i + 1}: ${escapeHtml(issue.name)}</h2>
      <h3>Problem</h3>
      <p>${escapeHtml(issue.problem)}</p>
      <h3>Cause</h3>
      <p>${escapeHtml(issue.cause)}</p>
      <h3>Investigation</h3>
      <p>${escapeHtml(issue.investigation)}</p>
      <h3>Fix Applied</h3>
      <p>${escapeHtml(issue.fix)}</p>
      <h3>Files Changed</h3>
      <ul>${(issue.filesChanged || []).map(f => `<li>${escapeHtml(f)}</li>`).join('')}</ul>
      <h3>Verification</h3>
      <p>${escapeHtml(issue.verification)}</p>
      <h3>Result</h3>
      <p>${escapeHtml(issue.result)}</p>
    `).join('') : '<p>Not available in the provided conversation.</p>'}

    <div class="page-break"></div>
    <h1>8. Requirement-to-Implementation Mapping</h1>
    <table>
      <tr><th>Requirement</th><th>Implementation</th><th>Files / Areas</th><th>Status</th></tr>
      ${(data.requirementMapping || []).length ? data.requirementMapping.map(m => `<tr><td>${escapeHtml(m.requirement)}</td><td>${escapeHtml(m.implementation)}</td><td>${escapeHtml(m.files)}</td><td>${escapeHtml(m.status)}</td></tr>`).join('') : '<tr><td colspan="4">Not available in the provided conversation.</td></tr>'}
    </table>

    <div class="page-break"></div>
    <h1>9. Code and Logic Changes Summary</h1>
    <p>${escapeHtml(data.codeSummary || 'Not available in the provided conversation.')}</p>

    <div class="page-break"></div>
    <h1>10. Testing and Validation</h1>
    <table>
      <tr><th>Test</th><th>Expected Result</th><th>Actual Result</th><th>Status</th></tr>
      ${tests.length ? tests.map(t => `<tr><td>${escapeHtml(t.test)}</td><td>${escapeHtml(t.expected)}</td><td>${escapeHtml(t.actual)}</td><td>${escapeHtml(t.status)}</td></tr>`).join('') : '<tr><td colspan="4">Testing was not confirmed in the provided conversation.</td></tr>'}
    </table>

    <div class="page-break"></div>
    <h1>11. Commands, Tools, and Technical Operations Used</h1>
    <table>
      <tr><th>Operation</th><th>Purpose</th><th>Result</th></tr>
      ${commands.length ? commands.map(c => `<tr><td><code>${escapeHtml(c.operation)}</code></td><td>${escapeHtml(c.purpose)}</td><td>${escapeHtml(c.result)}</td></tr>`).join('') : '<tr><td colspan="3">No command-line operations were available in the provided conversation.</td></tr>'}
    </table>

    <div class="page-break"></div>
    <h1>12. Before and After Summary</h1>
    <table>
      <tr><th>Area</th><th>Before</th><th>After</th></tr>
      ${(data.beforeAfter || []).length ? data.beforeAfter.map(b => `<tr><td>${escapeHtml(b.area)}</td><td>${escapeHtml(b.before)}</td><td>${escapeHtml(b.after)}</td></tr>`).join('') : '<tr><td colspan="3">Not available in the provided conversation.</td></tr>'}
    </table>

    <div class="page-break"></div>
    <h1>13. Major Decisions Made</h1>
    <table>
      <tr><th>Decision</th><th>Reason</th><th>Impact</th></tr>
      ${decisions.length ? decisions.map(d => `<tr><td>${escapeHtml(d.decision)}</td><td>${escapeHtml(d.reason)}</td><td>${escapeHtml(d.impact)}</td></tr>`).join('') : '<tr><td colspan="3">Not available in the provided conversation.</td></tr>'}
    </table>

    <div class="page-break"></div>
    <h1>14. Pending Items and Recommendations</h1>
    ${pending.length ? `<ul>${pending.map(p => `<li>${escapeHtml(p)}</li>`).join('')}</ul>` : '<p>No pending items were identified from the provided conversation.</p>'}

    <div class="page-break"></div>
    <h1>15. Final Change Log</h1>
    <table>
      <tr><th>Change No.</th><th>Change Description</th><th>Category</th><th>Status</th></tr>
      ${changelog.length ? changelog.map((c, i) => `<tr><td>${i + 1}</td><td>${escapeHtml(c.description)}</td><td>${escapeHtml(c.category)}</td><td>${escapeHtml(c.status)}</td></tr>`).join('') : '<tr><td colspan="4">Not available in the provided conversation.</td></tr>'}
    </table>

    <div class="page-break"></div>
    <h1>16. Final Summary</h1>
    <p>${escapeHtml(data.finalSummary || 'The project changes were completed according to the requirements discussed in the conversation.')}</p>
    <p><strong>PDF saved to:</strong> ${escapeHtml(resolve(outputPath))}</p>
  `;
}

function renderRequirements(reqs) {
  const sections = [];
  if (reqs.functional && reqs.functional.length) {
    sections.push(`<h3>Functional Requirements</h3><ul>${reqs.functional.map(r => `<li>${escapeHtml(r)}</li>`).join('')}</ul>`);
  }
  if (reqs.technical && reqs.technical.length) {
    sections.push(`<h3>Technical Requirements</h3><ul>${reqs.technical.map(r => `<li>${escapeHtml(r)}</li>`).join('')}</ul>`);
  }
  if (reqs.nonFunctional && reqs.nonFunctional.length) {
    sections.push(`<h3>Non-Functional Requirements</h3><ul>${reqs.nonFunctional.map(r => `<li>${escapeHtml(r)}</li>`).join('')}</ul>`);
  }
  return sections.length ? sections.join('') : '<p>Not available in the provided conversation.</p>';
}

async function main() {
  // Check Playwright
  try {
    execSync('npx playwright --version', { stdio: 'ignore' });
  } catch {
    console.log('Installing Playwright...');
    execSync('npx playwright install chromium', { stdio: 'inherit' });
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${escapeHtml(projectName)} - ${date}</title>
<style>
  @page { margin: 2cm; size: A4; }
  body { font-family: 'Segoe UI', Helvetica, Arial, sans-serif; font-size: 11pt; line-height: 1.6; color: #1a1a1a; }
  .cover-page { text-align: center; padding-top: 40%; }
  .cover-page h1 { font-size: 24pt; margin-bottom: 10px; }
  .cover-page .date { font-size: 14pt; color: #666; }
  .page-break { page-break-before: always; }
  h1 { font-size: 18pt; color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 5px; margin-top: 30px; }
  h2 { font-size: 14pt; color: #34495e; margin-top: 20px; }
  h3 { font-size: 12pt; color: #555; margin-top: 15px; }
  table { width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 10pt; }
  th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
  th { background: #3498db; color: white; }
  tr:nth-child(even) { background: #f9f9f9; }
  code { background: #f0f0f0; padding: 2px 5px; border-radius: 3px; font-size: 10pt; }
  ul { margin: 5px 0; padding-left: 20px; }
  li { margin: 3px 0; }
  .toc { margin: 20px 0; }
  .toc a { color: #2c3e50; text-decoration: none; }
  .toc li { margin: 5px 0; }
  .footer { text-align: center; font-size: 9pt; color: #999; margin-top: 40px; border-top: 1px solid #ddd; padding-top: 10px; }
</style>
</head>
<body>
<div class="cover-page">
  <h1>${escapeHtml(projectName)}</h1>
  <p class="date">${date}</p>
  <hr style="width: 50%; margin: 20px auto;">
  <p style="font-size: 12pt; color: #555;">Change and Technical Implementation Documentation</p>
</div>

<div class="page-break"></div>
<h1>Table of Contents</h1>
<ol class="toc">
  <li>Executive Summary</li>
  <li>User Request Summary</li>
  <li>Requirements Identified</li>
  <li>Project Navigation and Investigation</li>
  <li>Files and Areas Changed</li>
  <li>Technical Steps Performed</li>
  <li>Issues Found and Fixes Applied</li>
  <li>Requirement-to-Implementation Mapping</li>
  <li>Code and Logic Changes Summary</li>
  <li>Testing and Validation</li>
  <li>Commands, Tools, and Technical Operations Used</li>
  <li>Before and After Summary</li>
  <li>Major Decisions Made</li>
  <li>Pending Items and Recommendations</li>
  <li>Final Change Log</li>
  <li>Final Summary</li>
</ol>

${buildSections(sessionData)}

<div class="footer">
  Generated by Logbook — ${date}
</div>
</body>
</html>`;

  // Write temp HTML
  const tmpHtml = resolve(outputPath).replace('.pdf', '.html');
  writeFileSync(tmpHtml, html, 'utf-8');

  // Generate PDF via Playwright
  const script = `
const { chromium } = await import('playwright');
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('file:///${tmpHtml.replace(/\\/g, '/')}');
await page.pdf({ path: '${resolve(outputPath).replace(/\\/g, '/')}', format: 'A4', printBackground: true });
await browser.close();
console.log('PDF generated successfully');
`;

  const tmpScript = resolve(outputPath).replace('.pdf', '_render.mjs');
  writeFileSync(tmpScript, script, 'utf-8');

  try {
    execSync(`node "${tmpScript}"`, { stdio: 'inherit' });
    console.log(`\nPDF saved to: ${resolve(outputPath)}`);
  } finally {
    // Cleanup temp files
    try {
      const { unlinkSync } = await import('fs');
      unlinkSync(tmpHtml);
      unlinkSync(tmpScript);
    } catch {}
  }
}

main().catch(err => {
  console.error('Failed to generate PDF:', err.message);
  process.exit(1);
});
