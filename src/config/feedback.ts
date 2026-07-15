export const feedbackRecipient = 'markellos.markides@gmail.com';
export const feedbackSubject = 'Animals Within Feedback';

interface FeedbackMailtoOptions {
  languageLabel: string;
  buildVersion: string;
}

export function createFeedbackMailto({ languageLabel, buildVersion }: FeedbackMailtoOptions) {
  const body = `Language: ${languageLabel}\nBuild: ${buildVersion}\n\nFeedback:\n`;
  return `mailto:${feedbackRecipient}?subject=${encodeURIComponent(feedbackSubject)}&body=${encodeURIComponent(body)}`;
}
