import { useState } from 'react';
import { motion } from 'framer-motion';
import styles from '@/styles/EducationPage.module.css';

interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  duration: string;
  description: string;
  achievements?: string[];
  logo?: string;
}

export default function EducationPage() {
  const education: EducationItem[] = [
    {
      id: 'bachelor-degree',
      institution: 'Institute of Technology',
      degree: 'Bachelor of Technology (B.Tech)',
      field: 'Computer Science & Engineering',
      duration: '2021 - 2025',
      description:
        'Currently pursuing Bachelor of Technology in Computer Science with focus on web development, data structures, and software engineering.',
      achievements: [
        'CGPA: 8.2/10',
        'Active member of coding club',
        'Participated in Smart India Hackathon 2025 - Grand Finalist',
        'Led 5+ web development projects',
        'Completed advanced coursework in DBMS, OS, and Networks',
      ],
      logo: '/education/btech.jpg',
    },
    {
      id: 'senior-secondary',
      institution: 'National Public School',
      degree: 'Senior Secondary Education (XII)',
      field: 'Science with Computer Science',
      duration: '2019 - 2021',
      description:
        'Completed higher secondary education with specialization in Physics, Chemistry, Mathematics, and Computer Science.',
      achievements: [
        'Percentage: 92%',
        'School Academic Excellence Award',
        'Proficient in C++ programming',
        'Science project recognition',
      ],
      logo: '/education/senior-secondary.jpg',
    },
    {
      id: 'secondary',
      institution: 'National Public School',
      degree: 'Secondary Education (X)',
      field: 'General',
      duration: '2017 - 2019',
      description:
        'Completed secondary education with strong academic performance and active participation in school activities.',
      achievements: [
        'Percentage: 90%',
        'School Merit Certificate',
        'Science Olympiad Participant',
        'Student Council Member',
      ],
      logo: '/education/secondary.jpg',
    },
  ];

  const courses: EducationItem[] = [
    {
      id: 'mern-stack',
      institution: 'Online Learning Platform',
      degree: 'MERN Stack Development',
      field: 'Web Development',
      duration: '2024',
      description:
        'Comprehensive course covering MongoDB, Express.js, React.js, and Node.js. Built 10+ full-stack projects.',
      achievements: [
        'Certification completed',
        'Grade: Distinction',
        'Built e-commerce platform',
        'REST API development',
      ],
    },
    {
      id: 'linux-admin',
      institution: 'Linux Academy',
      degree: 'Linux System Administration',
      field: 'DevOps & System Administration',
      duration: '2023',
      description:
        'Professional certification in Linux system administration, shell scripting, and server management.',
      achievements: [
        'Certified Linux Administrator',
        'Shell script expertise',
        'Server security hardening',
        'System performance optimization',
      ],
    },
    {
      id: 'web-design',
      institution: 'UX/UI Design Institute',
      degree: 'Advanced Web Design',
      field: 'Frontend Development',
      duration: '2023',
      description:
        'Professional course in responsive web design, CSS frameworks (Bootstrap, TailwindCSS), and modern design practices.',
      achievements: [
        'Responsive design certification',
        'CSS mastery',
        'UI/UX principles',
        'Design system creation',
      ],
    },
  ];

  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className={styles.educationPage}>
      <div className={styles.header}>
        <h1>Education & Learning Journey</h1>
        <p>
          Continuous learner passionate about mastering web development, system design, and cutting-edge
          technologies
        </p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Formal Education</h2>
        <div className={styles.educationGrid}>
          {education.map((item) => (
            <div
              key={item.id}
              className={`${styles.educationCard} ${
                expandedId === item.id ? styles.expanded : ''
              }`}
              onClick={() =>
                setExpandedId(expandedId === item.id ? null : item.id)
              }
            >
              {item.logo && (
                <div className={styles.logoContainer}>
                  <img
                    src={item.logo}
                    alt={item.institution}
                    className={styles.logo}
                  />
                </div>
              )}
              <div className={styles.content}>
                <h3 className={styles.institution}>{item.institution}</h3>
                <div className={styles.meta}>
                  <span className={styles.degree}>{item.degree}</span>
                  <span className={styles.duration}>{item.duration}</span>
                </div>
                <p className={styles.field}>{item.field}</p>
                <p className={styles.description}>{item.description}</p>

                {expandedId === item.id && item.achievements && (
                  <ul className={styles.achievements}>
                    {item.achievements.map((achievement, idx) => (
                      <li key={idx}>{achievement}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Certifications & Courses</h2>
        <div className={styles.coursesGrid}>
          {courses.map((course) => (
            <div
              key={course.id}
              className={`${styles.courseCard} ${
                expandedId === course.id ? styles.expanded : ''
              }`}
              onClick={() =>
                setExpandedId(expandedId === course.id ? null : course.id)
              }
            >
              <div className={styles.courseContent}>
                <h3 className={styles.courseTitle}>{course.degree}</h3>
                <p className={styles.coursePlatform}>{course.institution}</p>
                <p className={styles.courseField}>{course.field}</p>
                <span className={styles.courseDate}>{course.duration}</span>

                {expandedId === course.id && (
                  <div className={styles.courseDetails}>
                    <p>{course.description}</p>
                    {course.achievements && (
                      <ul className={styles.courseAchievements}>
                        {course.achievements.map((achievement, idx) => (
                          <li key={idx}>{achievement}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.learningPhilosophy}>
        <h2>Learning Philosophy</h2>
        <p>
          I believe in continuous learning and staying updated with the latest technologies. My educational
          journey combines formal academic knowledge with practical industry experience. I focus on
          understanding core concepts deeply while building real-world applications.
        </p>
      </div>
    </div>
  );
}

export async function getStaticProps() {
  return {
    props: { title: 'Education' },
  };
}
