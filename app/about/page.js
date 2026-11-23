import LegalPage from '@/components/LegalPage';

export const metadata = {
  title: 'About',
  description: 'BoloPadho is a voice-first AI study tutor for Hindi, English and Hinglish speakers. Apne Tarike Se Padho.',
};

export default function AboutPage() {
  return (
    <LegalPage
      current="/about"
      title="About BoloPadho"
      showUpdated={false}
      intro="BoloPadho is a voice-first AI study tutor. Many students can say their doubt in five seconds but need minutes to type it, especially in Hindi. So with BoloPadho you just speak: in Hindi, English or Hinglish, about any study subject, and it explains step by step in your own language. Apne Tarike Se Padho."
      sections={[
        {
          heading: 'What makes it different',
          body: [
            'Voice first: tap the mic and speak. Numbers you say are repeated back ("Aapne 8 aur 5 bola, sahi?") before it solves, so a mishearing never becomes a wrong answer.',
            'Answers are read aloud with the spoken word highlighted, and you can say "phir se batao", "aur simple karo", "ek example do" or "aage batao".',
            'Say "samajh gaya" and it asks one quick check question. Topics you get wrong go to Need Practice for a 2-minute revision.',
            'It learns how you learn (confidence, patience, learning style) and changes its tone and depth to match.',
            'Teach, Simple, Hint, Solve, Quiz, Revise and more: pick the answer style you want, or let it choose.',
            'Only for studies: school subjects, board and competitive exams, coding, languages and career skills.',
          ],
        },
        {
          heading: 'How it works',
          body: [
            'Create a free account. New accounts get welcome AU tokens.',
            'Ask by voice, by typing or with a photo of your question. Each answer uses a small number of AU tokens; replaying an answer aloud is free.',
            'Listen, ask follow-ups, then check yourself. The more you learn, the more personal your tutor becomes.',
          ],
        },
        {
          heading: 'AU tokens',
          body: 'AU is the credit used for AI answers. You can see your balance and every spend in Wallet and History. To recharge, contact our support team by email or WhatsApp.',
        },
        {
          heading: 'Our promise',
          body: 'Your chats are private to your account. We use them only to run and improve your tutor, we never sell them, and you can contact us any time to have your data removed.',
        },
      ]}
    />
  );
}
