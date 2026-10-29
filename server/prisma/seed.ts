import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding SwapSkill database...');

  // Clean existing data
  await prisma.review.deleteMany();
  await prisma.chatMessage.deleteMany();
  await prisma.practiceTask.deleteMany();
  await prisma.disputeReport.deleteMany();
  await prisma.workshopEnrollment.deleteMany();
  await prisma.workshop.deleteMany();
  await prisma.circleMember.deleteMany();
  await prisma.learningCircle.deleteMany();
  await prisma.sessionBooking.deleteMany();
  await prisma.creditTransaction.deleteMany();
  await prisma.portfolioItem.deleteMany();
  await prisma.userSkill.deleteMany();
  await prisma.skillCategory.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Skill Categories
  const categories = [
    {
      name: 'Programming',
      description: 'Web development, mobile apps, algorithms, systems engineering',
      iconName: 'Code',
      popularTags: 'React, TypeScript, Python, Node.js, SQL, Rust',
    },
    {
      name: 'Languages',
      description: 'Spoken languages, conversational fluency, pronunciation',
      iconName: 'Languages',
      popularTags: 'French, Spanish, Japanese, German, Mandarin',
    },
    {
      name: 'Design',
      description: 'UI/UX design, design systems, Figma, typography',
      iconName: 'Palette',
      popularTags: 'Figma, UI/UX, Design Systems, Wireframing, 3D',
    },
    {
      name: 'Music',
      description: 'Instruments, music theory, audio production, songwriting',
      iconName: 'Music',
      popularTags: 'Guitar, Piano, Music Theory, Ableton, Vocals',
    },
    {
      name: 'Business & Career',
      description: 'Public speaking, interview prep, product management, resume review',
      iconName: 'Briefcase',
      popularTags: 'Public Speaking, Interview Prep, Resume Review, Pitching',
    },
    {
      name: 'Academics',
      description: 'Mathematics, physics, statistics, data analytics',
      iconName: 'GraduationCap',
      popularTags: 'Calculus, Linear Algebra, Statistics, Data Analysis',
    },
  ];

  for (const cat of categories) {
    await prisma.skillCategory.create({ data: cat });
  }

  // 2. Users
  // Alex Rivera (Teaches React/TypeScript, Wants to learn French)
  const alex = await prisma.user.create({
    data: {
      name: 'Alex Rivera',
      email: 'alex@example.com',
      passwordHash,
      role: 'USER',
      headline: 'Frontend Engineer & Open Source Contributor',
      bio: '5+ years building modern web apps with React, Vite, and TypeScript. Excited to swap code reviews and frontend coaching for conversational French!',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      credits: 3,
      languages: 'English (Fluent)',
      availability: 'Weekday evenings (6pm - 9pm UTC), Saturday mornings',
      skills: {
        create: [
          { skillName: 'React & TypeScript', category: 'Programming', type: 'TEACH', proficiencyLevel: 'EXPERT', yearsExperience: 5 },
          { skillName: 'Next.js & Tailwind CSS', category: 'Programming', type: 'TEACH', proficiencyLevel: 'ADVANCED', yearsExperience: 4 },
          { skillName: 'French (Conversational)', category: 'Languages', type: 'LEARN', proficiencyLevel: 'BEGINNER', yearsExperience: 0 },
        ],
      },
      portfolio: {
        create: [
          {
            title: 'Design System Component Library',
            description: 'Accessible, dark-mode ready UI library built with TypeScript and Tailwind.',
            projectUrl: 'https://github.com/example/ui-components',
          },
        ],
      },
      creditLedger: {
        create: [
          { amount: 2, type: 'STARTER_BONUS', description: 'Welcome starter bonus: 2 credits' },
          { amount: 1, type: 'ESCROW_RELEASE', description: 'Earned 1 credit teaching React fundamentals' },
        ],
      },
    },
  });

  // Chloe Martin (Teaches French, Wants to learn React) -> Perfect Match with Alex!
  const chloe = await prisma.user.create({
    data: {
      name: 'Chloe Martin',
      email: 'chloe@example.com',
      passwordHash,
      role: 'USER',
      headline: 'Bilingual French Teacher & Junior Dev Explorer',
      bio: 'Native French speaker from Lyon. Certified language teacher passionate about breaking into web development. Looking for someone to guide me through React!',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      credits: 2,
      languages: 'French (Native), English (C2)',
      availability: 'Monday - Thursday after 5pm, Weekends anytime',
      skills: {
        create: [
          { skillName: 'French (Conversational)', category: 'Languages', type: 'TEACH', proficiencyLevel: 'EXPERT', yearsExperience: 6 },
          { skillName: 'French Grammar & Accent', category: 'Languages', type: 'TEACH', proficiencyLevel: 'EXPERT', yearsExperience: 6 },
          { skillName: 'React & TypeScript', category: 'Programming', type: 'LEARN', proficiencyLevel: 'BEGINNER', yearsExperience: 0 },
        ],
      },
      portfolio: {
        create: [
          {
            title: 'French Immersion Podcast & Audio Samples',
            description: 'Custom pronunciation drills and conversation cheat sheets used by 50+ students.',
            projectUrl: 'https://example.com/french-drills',
          },
        ],
      },
      creditLedger: {
        create: [
          { amount: 2, type: 'STARTER_BONUS', description: 'Welcome starter bonus: 2 credits' },
        ],
      },
    },
  });

  // David Kim (Teaches Python/Machine Learning, Wants to learn Figma UI/UX)
  const david = await prisma.user.create({
    data: {
      name: 'David Kim',
      email: 'david@example.com',
      passwordHash,
      role: 'USER',
      headline: 'Data Scientist & ML Practitioner',
      bio: 'Machine learning practitioner working on predictive models. I can teach Python, pandas, and data visualization in exchange for hands-on Figma mentoring.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      credits: 4,
      languages: 'English (Fluent), Korean (Native)',
      availability: 'Tuesdays & Thursdays 7pm - 10pm, Sundays',
      skills: {
        create: [
          { skillName: 'Python & Data Science', category: 'Programming', type: 'TEACH', proficiencyLevel: 'EXPERT', yearsExperience: 4 },
          { skillName: 'Machine Learning Basics', category: 'Programming', type: 'TEACH', proficiencyLevel: 'ADVANCED', yearsExperience: 3 },
          { skillName: 'Figma & UI/UX Design', category: 'Design', type: 'LEARN', proficiencyLevel: 'BEGINNER', yearsExperience: 0 },
        ],
      },
      portfolio: {
        create: [
          {
            title: 'Interactive Kaggle Data Insights Notebook',
            description: 'Comprehensive analysis pipeline using pandas, seaborn, and scikit-learn.',
            projectUrl: 'https://github.com/example/ml-insights',
          },
        ],
      },
      creditLedger: {
        create: [
          { amount: 2, type: 'STARTER_BONUS', description: 'Welcome starter bonus: 2 credits' },
          { amount: 2, type: 'ESCROW_RELEASE', description: 'Earned 2 credits teaching Python scripts' },
        ],
      },
    },
  });

  // Priya Patel (Teaches Figma & UI/UX, Wants to learn Python) -> Perfect match with David!
  const priya = await prisma.user.create({
    data: {
      name: 'Priya Patel',
      email: 'priya@example.com',
      passwordHash,
      role: 'USER',
      headline: 'Product Designer at Tech Startup',
      bio: 'Lead product designer passionate about clean interfaces and design systems. Wanting to learn Python so I can automate design tokens and work with data.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      credits: 2,
      languages: 'English (Fluent), Hindi (Fluent)',
      availability: 'Wednesdays and Fridays after 6pm',
      skills: {
        create: [
          { skillName: 'Figma & UI/UX Design', category: 'Design', type: 'TEACH', proficiencyLevel: 'EXPERT', yearsExperience: 5 },
          { skillName: 'Design Systems & Wireframing', category: 'Design', type: 'TEACH', proficiencyLevel: 'ADVANCED', yearsExperience: 4 },
          { skillName: 'Python & Data Science', category: 'Programming', type: 'LEARN', proficiencyLevel: 'BEGINNER', yearsExperience: 0 },
        ],
      },
      portfolio: {
        create: [
          {
            title: 'Mobile Banking App Redesign (Figma Community)',
            description: 'Featured Figma Community file with 2,000+ duplicate saves.',
            projectUrl: 'https://figma.com/@priyapatel',
          },
        ],
      },
      creditLedger: {
        create: [
          { amount: 2, type: 'STARTER_BONUS', description: 'Welcome starter bonus: 2 credits' },
        ],
      },
    },
  });

  // Marcus Chen (Teaches Guitar & Music Theory, Wants to learn Public Speaking)
  const marcus = await prisma.user.create({
    data: {
      name: 'Marcus Chen',
      email: 'marcus@example.com',
      passwordHash,
      role: 'USER',
      headline: 'Guitarist & Audio Producer',
      bio: '10 years playing guitar and teaching music theory. Happy to teach chords, fingerstyle, or ear training in exchange for public speaking or presentation skills.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      credits: 3,
      languages: 'English (Fluent)',
      availability: 'Flexible weekends, weekday mornings',
      skills: {
        create: [
          { skillName: 'Acoustic Guitar & Fingerstyle', category: 'Music', type: 'TEACH', proficiencyLevel: 'EXPERT', yearsExperience: 10 },
          { skillName: 'Music Theory', category: 'Music', type: 'TEACH', proficiencyLevel: 'ADVANCED', yearsExperience: 7 },
          { skillName: 'Public Speaking & Presentations', category: 'Business & Career', type: 'LEARN', proficiencyLevel: 'BEGINNER', yearsExperience: 0 },
        ],
      },
      creditLedger: {
        create: [
          { amount: 2, type: 'STARTER_BONUS', description: 'Welcome starter bonus: 2 credits' },
          { amount: 1, type: 'ESCROW_RELEASE', description: 'Earned 1 credit teaching guitar chords' },
        ],
      },
    },
  });

  // Admin User
  const admin = await prisma.user.create({
    data: {
      name: 'SwapSkill Admin',
      email: 'admin@swapskill.com',
      passwordHash,
      role: 'ADMIN',
      headline: 'Platform Safety & Community Manager',
      bio: 'Official SwapSkill administration and support account.',
      credits: 10,
      languages: 'English, French, Spanish',
    },
  });

  // 3. Sample Completed Session (Alex taught React to Chloe)
  const pastSession = await prisma.sessionBooking.create({
    data: {
      learnerId: chloe.id,
      teacherId: alex.id,
      skillName: 'React & TypeScript',
      scheduledAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      durationMinutes: 30,
      status: 'COMPLETED',
      escrowCreditLocked: false,
      learnerConfirmed: true,
      teacherConfirmed: true,
      meetingLink: 'https://meet.jit.si/SwapSkill-ReactIntro-491',
      goalDescription: 'Learn useState and props fundamentals with hands-on counter app.',
    },
  });

  // Review for the completed session
  await prisma.review.create({
    data: {
      sessionId: pastSession.id,
      reviewerId: chloe.id,
      revieweeId: alex.id,
      rating: 5,
      comment: 'Alex was incredibly patient and broke down TypeScript generics with visual diagrams! Best 30 minutes of learning.',
      skillQualityRating: 5,
      punctualityRating: 5,
    },
  });

  // 4. Sample Pending & Accepted Bookings
  // Booking where Chloe will teach French to Alex (status: ACCEPTED with 1 credit locked in escrow)
  await prisma.sessionBooking.create({
    data: {
      learnerId: alex.id,
      teacherId: chloe.id,
      skillName: 'French (Conversational)',
      scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days in future
      durationMinutes: 30,
      status: 'ACCEPTED',
      escrowCreditLocked: true,
      meetingLink: 'https://meet.jit.si/SwapSkill-FrenchConv-821',
      goalDescription: 'Order coffee and practice everyday restaurant dialogue in French.',
    },
  });

  // Booking request: David requested Priya for Figma Design (PENDING)
  await prisma.sessionBooking.create({
    data: {
      learnerId: david.id,
      teacherId: priya.id,
      skillName: 'Figma & UI/UX Design',
      scheduledAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      durationMinutes: 30,
      status: 'PENDING',
      escrowCreditLocked: false,
      meetingLink: 'https://meet.jit.si/SwapSkill-FigmaIntro-102',
      goalDescription: 'Master auto-layout and components in Figma for web dashboard designs.',
    },
  });

  // 5. Sample Messages in Chat
  await prisma.chatMessage.create({
    data: {
      senderId: alex.id,
      receiverId: chloe.id,
      sessionId: pastSession.id,
      content: 'Bonjour Chloe! Here is the summary cheat sheet for useState we discussed during our session.',
      attachmentUrl: 'https://react.dev/reference/react/useState',
      fileName: 'React-State-CheatSheet.pdf',
    },
  });

  await prisma.chatMessage.create({
    data: {
      senderId: chloe.id,
      receiverId: alex.id,
      sessionId: pastSession.id,
      content: 'Merci beaucoup Alex! Looking forward to our French session on Thursday.',
    },
  });

  // 6. Sample Small Group Workshops
  const gitWorkshop = await prisma.workshop.create({
    data: {
      hostId: alex.id,
      title: 'Git & GitHub Collaboration Masterclass',
      description: 'Hands-on live workshop covering branching strategies, resolving merge conflicts, and crafting professional Pull Requests.',
      category: 'Programming',
      scheduledAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      durationMinutes: 45,
      maxParticipants: 6,
      creditCost: 1,
      meetingLink: 'https://meet.jit.si/SwapSkill-GitWorkshop',
    },
  });

  await prisma.workshopEnrollment.create({
    data: {
      workshopId: gitWorkshop.id,
      userId: david.id,
    },
  });

  await prisma.workshop.create({
    data: {
      hostId: chloe.id,
      title: 'French Travel Survival Crash Course',
      description: 'Learn the top 50 essential French phrases and polite etiquette for Paris traveling and ordering food.',
      category: 'Languages',
      scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      durationMinutes: 45,
      maxParticipants: 8,
      creditCost: 1,
    },
  });

  // 7. Sample Learning Circles
  const leetcodeCircle = await prisma.learningCircle.create({
    data: {
      creatorId: david.id,
      title: 'Algorithm & Data Structure Sprint',
      topic: 'Weekly LeetCode medium problem breakdowns & mock whiteboard practice.',
      category: 'Programming',
      goalDescription: 'Help peers crack tech interviews by practicing 2 problems every weekend together.',
      meetingSchedule: 'Every Saturday 10:00 AM UTC',
      members: {
        create: [
          { userId: david.id },
          { userId: alex.id },
        ],
      },
    },
  });

  await prisma.learningCircle.create({
    data: {
      creatorId: priya.id,
      title: 'Design Critique & Portfolio Review Circle',
      topic: 'Friendly constructive peer feedback on case studies, wireframes, and prototypes.',
      category: 'Design',
      goalDescription: 'Polish your portfolio with feedback from fellow designers before job applications.',
      meetingSchedule: 'Every Tuesday 6:30 PM UTC',
      members: {
        create: [
          { userId: priya.id },
        ],
      },
    },
  });

  // 8. Sample Practice Task
  await prisma.practiceTask.create({
    data: {
      teacherId: alex.id,
      learnerId: chloe.id,
      sessionId: pastSession.id,
      title: 'Build a Simple Dynamic Counter Component',
      instructions: 'Create a component with an increment, decrement, and reset button. Bonus: disable decrement if value hits 0.',
      submissionText: 'I completed the component and tested it in CodeSandbox: https://codesandbox.io/s/counter-chloe',
      feedback: 'Excellent job Chloe! Clean code and your boundary check for 0 was spot on. Next time try adding a step multiplier!',
      status: 'REVIEWED',
    },
  });

  console.log('✅ SwapSkill database seeded successfully!');
  console.log('Demo accounts created (password: password123):');
  console.log(' - alex@example.com (React Expert / French Learner)');
  console.log(' - chloe@example.com (French Expert / React Learner)');
  console.log(' - david@example.com (Python ML / Figma Learner)');
  console.log(' - priya@example.com (UI/UX Designer / Python Learner)');
  console.log(' - marcus@example.com (Guitar / Speaking Learner)');
  console.log(' - admin@swapskill.com (Admin)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
