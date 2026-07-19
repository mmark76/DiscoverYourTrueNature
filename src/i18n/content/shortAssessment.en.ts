import type {
  ShortAssessmentOptionId,
  ShortAssessmentQuestionId,
} from '../../features/assessment/data/shortQuestions';

export const englishShortAssessmentQuestions = {
  'short-q01-social-setting':
    'At a gathering where you know only a few people, what do you usually do?',
  'short-q02-group-conversation':
    'When several people are talking together, how do you take part in the conversation?',
  'short-q03-new-people':
    'When you meet new people, how do you usually begin?',
  'short-q04-noticing-feelings':
    'When you want to understand how someone feels, what do you notice more?',
  'short-q05-supporting-someone':
    'Someone close to you is upset. How do you usually support them?',
  'short-q06-handling-tension':
    'There is tension between two people. What do you do first to help?',
  'short-q07-imagining-possibilities':
    'When you imagine new possibilities for something familiar, what comes more naturally?',
  'short-q08-creative-start':
    'When you begin something creative, which starting point do you prefer?',
  'short-q09-story-ideas':
    'When you think of an idea for a story, what appeals to you more?',
  'short-q10-solving-problem':
    'When you face a practical problem, how do you begin?',
  'short-q11-making-plan':
    'When you plan a busy day, what helps you more?',
  'short-q12-checking-work':
    'When you check whether your work is correct, what do you prefer?',
  'short-separator-sociability-quiet-group':
    'You are in a small group and the conversation pauses. What do you usually do?',
  'short-separator-sociability-shared-idea':
    'You have an idea while working with other people. How do you usually share it?',
  'short-separator-emotional-upset-friend':
    'A friend seems upset but has not said why. How do you offer support?',
  'short-separator-emotional-fair-choice':
    'Two people want different things, and both feel unheard. What do you do first to help?',
  'short-separator-creativity-unfamiliar-object':
    'You are given an ordinary object for a creative activity. What do you imagine first?',
  'short-separator-creativity-new-route':
    'You need a fresh way to present a familiar topic. What do you try first?',
  'short-separator-practicality-busy-day':
    'Several useful tasks need attention on the same day. How do you decide where to begin?',
  'short-separator-practicality-unclear-task':
    'You receive a task without clear instructions. How do you work out what to do?',
} satisfies Record<ShortAssessmentQuestionId, string>;

export const englishShortAssessmentOptions = {
  'short-q01-social-setting-a':
    'Start conversations with several different people.',
  'short-q01-social-setting-b':
    'Spend more time talking with one or two people you already know.',
  'short-q02-group-conversation-a':
    'Listen to how the conversation develops and speak at the right moment.',
  'short-q02-group-conversation-b':
    'Share a thought early and make it clearer through the conversation.',
  'short-q03-new-people-a':
    'Ask questions and share something about yourself.',
  'short-q03-new-people-b':
    'Notice the mood first and gradually join the conversation.',
  'short-q04-noticing-feelings-a':
    'Tone of voice, facial expressions, and behaviour.',
  'short-q04-noticing-feelings-b':
    'The words they use and their answers to calm, direct questions.',
  'short-q05-supporting-someone-a':
    'Ask gentle questions to help them name what they are feeling and what they need.',
  'short-q05-supporting-someone-b':
    'Listen carefully and give them time to express their feelings in their own way.',
  'short-q06-handling-tension-a':
    'Try to understand what each person feels and needs.',
  'short-q06-handling-tension-b':
    'Help both people slow down and take turns speaking, so each feels heard.',
  'short-q07-imagining-possibilities-a':
    'Think of many unexpected ideas.',
  'short-q07-imagining-possibilities-b':
    'Develop one promising idea in rich detail.',
  'short-q08-creative-start-a':
    'Begin with a real example or familiar material and reshape it.',
  'short-q08-creative-start-b':
    'Begin with an image or a feeling and see where it leads.',
  'short-q09-story-ideas-a':
    'Invent a world or event unlike anything you have seen.',
  'short-q09-story-ideas-b':
    'Turn something you have noticed or experienced into something new.',
  'short-q10-solving-problem-a':
    'Gather the facts and compare likely causes before acting.',
  'short-q10-solving-problem-b':
    'Try a reasonable solution quickly and adjust it after seeing the result.',
  'short-q11-making-plan-a':
    'Set the main goal and priorities, then change the order when needed.',
  'short-q11-making-plan-b':
    'Put all the tasks in a specific order beforehand.',
  'short-q12-checking-work-a':
    'Use a list and check each part one by one.',
  'short-q12-checking-work-b':
    'Test the whole result in a real situation and fix what does not work.',

  'short-separator-sociability-quiet-group-a':
    'Open a new topic and invite everyone to join in.',
  'short-separator-sociability-quiet-group-b':
    'Use the pause to notice the group and continue when there is a natural moment.',
  'short-separator-sociability-shared-idea-a':
    'Think it through first, then explain it clearly to the group.',
  'short-separator-sociability-shared-idea-b':
    'Share it near the start and develop it together through discussion.',
  'short-separator-emotional-upset-friend-a':
    'Gently invite them to talk and listen without rushing them.',
  'short-separator-emotional-upset-friend-b':
    'Stay close or do something calm together until they are ready to talk.',
  'short-separator-emotional-fair-choice-a':
    'Listen to each person separately so both can explain how the situation feels to them.',
  'short-separator-emotional-fair-choice-b':
    'Help them talk together and notice what the other person feels and needs.',
  'short-separator-creativity-unfamiliar-object-a':
    'Many completely different ways the object could be used.',
  'short-separator-creativity-unfamiliar-object-b':
    'One imaginative role for the object, developed with vivid details.',
  'short-separator-creativity-new-route-a':
    'Combine familiar examples in a surprising new way.',
  'short-separator-creativity-new-route-b':
    'Use an unexpected story or image to show the main idea.',
  'short-separator-practicality-busy-day-a':
    'Compare importance and available time, then set an order for the tasks.',
  'short-separator-practicality-busy-day-b':
    'Start with the task that can help most now, then review what comes next.',
  'short-separator-practicality-unclear-task-a':
    'Make a quick trial version and use the result to choose the next step.',
  'short-separator-practicality-unclear-task-b':
    'Break it into small steps and check each step as you go.',
} satisfies Record<ShortAssessmentOptionId, string>;
