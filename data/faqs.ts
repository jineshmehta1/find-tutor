export interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: "overview" | "parents" | "tutors";
  featuredOnHome?: boolean;
}

export const AACHARYA_FAQS: FAQItem[] = [
  {
    id: 1,
    question: "What is AACHARYA, and how does it help parents find tutors and coaches?",
    answer:
      "AACHARYA is an online tutor and coach discovery platform that connects parents and students with academic tutors, home tutors, online teachers, activity coaches and skill development trainers. Parents can explore educator profiles based on their learning requirements or post a specific requirement to connect with suitable educators. AACHARYA brings different learning opportunities together, making it easier to discover and connect with the right learning partner.",
    category: "overview",
    featuredOnHome: true,
  },
  {
    id: 2,
    question: "What makes AACHARYA different from other tutor-finding websites?",
    answer:
      "AACHARYA brings academic tutoring, extracurricular coaching and skill development opportunities together on one platform. Instead of limiting the search to conventional tuition classes, parents can discover subject teachers, home tutors, chess coaches, abacus trainers, robotics instructors and other learning professionals. Parents can either search available profiles directly or post their requirements to find suitable educators.",
    category: "overview",
    featuredOnHome: true,
  },
  {
    id: 3,
    question: "How can I find the best home tutors or private tutors near me?",
    answer:
      "Visit AACHARYA and select Find Tutors. Choose the student's class, required subject, location and preferred teaching mode. Browse the available tutor profiles and compare qualifications, experience, fees and other relevant details. You can contact a suitable tutor directly or post your tuition requirement to receive responses from interested educators.",
    category: "parents",
    featuredOnHome: true,
  },
  {
    id: 4,
    question: "Can I find tutors for CBSE, ICSE, State Board and other curricula?",
    answer:
      "Yes. AACHARYA helps parents discover tutors for different school curricula and educational levels, depending on educator availability. You can explore tutors for CBSE, ICSE, State Board and other curricula, along with subject-specific academic support. Check individual tutor profiles to understand their qualifications, subject expertise and curriculum experience.",
    category: "parents",
    featuredOnHome: false,
  },
  {
    id: 5,
    question: "Can I find both home tutors and online tutors through AACHARYA?",
    answer:
      "Yes. Parents can explore educators offering home tuition, online tutoring and other available teaching arrangements. You can use the preferred teaching mode and location to narrow down suitable options. Teaching schedules, fees and specific arrangements can be discussed directly with the selected tutor.",
    category: "parents",
    featuredOnHome: true,
  },
  {
    id: 6,
    question: "Can I find subject-wise tutors for all school classes and academic levels?",
    answer:
      "AACHARYA aims to help students find subject-wise academic support across different school classes and educational levels. Depending on available tutors, parents can search for teachers in Mathematics, Science, English, Social Studies, languages and other subjects, as well as intermediate and specialised academic programmes. Availability and expertise should be checked on individual profiles.",
    category: "parents",
    featuredOnHome: false,
  },
  {
    id: 7,
    question: "Can I find chess coaches, abacus trainers, robotics instructors and other activity coaches?",
    answer:
      "Yes. AACHARYA goes beyond traditional academic tuition. Parents can discover coaches and instructors for chess, abacus, robotics, coding, yoga, music, dance, art, languages and other extracurricular and skill development activities. You can explore available profiles and connect with instructors based on your child's interests and learning requirements.",
    category: "parents",
    featuredOnHome: false,
  },
  {
    id: 8,
    question: "Can I find extracurricular activity classes and trainers near my location?",
    answer:
      "Yes. AACHARYA is designed to help parents discover nearby activity coaches and skill development trainers. You can explore available instructors for activities such as chess, sports, yoga, music, dance, art, robotics and other interests. Search using your preferred locality and check the instructor's teaching mode, availability and programme details.",
    category: "parents",
    featuredOnHome: false,
  },
  {
    id: 9,
    question: "What should I do if I cannot find a suitable tutor or coach near me?",
    answer:
      "You can use AACHARYA's Post Your Requirement facility. Provide details such as the student's class, subject or activity, locality, preferred teaching mode, schedule and other expectations. Your requirement can be shared with relevant registered educators who may express interest in providing their services. This gives parents an additional way to discover suitable tutors and coaches.",
    category: "parents",
    featuredOnHome: false,
  },
  {
    id: 10,
    question: "How does the tutor matching process work after I post a requirement?",
    answer:
      "Once you submit a requirement, AACHARYA can identify relevant registered educators based on the information provided. Interested tutors or coaches may respond to your requirement. You can review their profiles, discuss the learning arrangement, consider a demonstration session where appropriate, and select the educator who best meets your needs. The final teaching arrangement is agreed between the parent and the selected educator.",
    category: "parents",
    featuredOnHome: false,
  },
  {
    id: 11,
    question: "How can I register as a home tutor, private teacher or academic tutor on AACHARYA?",
    answer:
      "Teachers and tutors can register through the Join as Tutor option on AACHARYA. During registration, they can provide their qualifications, teaching experience, subjects, classes, preferred locations, teaching mode, fees and availability. After completing the required registration and applicable verification process, their profiles can become eligible for discovery by parents and students.",
    category: "tutors",
    featuredOnHome: false,
  },
  {
    id: 12,
    question: "How can chess coaches, activity trainers and skill development professionals join AACHARYA?",
    answer:
      "Chess coaches, sports trainers, abacus instructors, robotics trainers, music teachers, dance instructors, yoga professionals and other skill development educators can register through the coach registration facility. They can showcase their expertise, experience, activities offered, service locations and teaching preferences through a professional profile, helping interested parents discover their services.",
    category: "tutors",
    featuredOnHome: false,
  },
  {
    id: 13,
    question: "Can coaching institutes and training centres register on AACHARYA?",
    answer:
      "Yes. AACHARYA aims to support coaching institutes, tuition centres, training academies and other organised learning providers alongside individual tutors and coaches. Institutes can showcase their courses, academic programmes, activities and training services to parents and students looking for suitable learning opportunities. Applicable registration and subscription options can be explored through the platform.",
    category: "tutors",
    featuredOnHome: false,
  },
  {
    id: 14,
    question: "Is AACHARYA free for parents to find tutors and coaches?",
    answer:
      "Yes! AACHARYA is completely free for parents and students to use. Parents can search and explore tutor and coach profiles, view available learning options, post their tuition or activity requirements, and connect with suitable educators without paying any platform charges. There are no registration fees or commission charges for parents. Any tuition or coaching fees are discussed directly with the selected tutor or coach.",
    category: "parents",
    featuredOnHome: true,
  },
  {
    id: 15,
    question: "How can I choose the right tutor or coach for my child's learning needs?",
    answer:
      "Choosing the right educator involves more than comparing fees. Consider qualifications, relevant teaching experience, subject or activity expertise, teaching approach, locality, availability and preferred learning mode. Discuss your child's learning goals and expectations before finalising. Where possible, arrange an introductory discussion or demonstration session and independently verify the educator's credentials and suitability.",
    category: "parents",
    featuredOnHome: false,
  },
];

export const HOME_FEATURED_FAQS = AACHARYA_FAQS.filter((faq) => faq.featuredOnHome);

