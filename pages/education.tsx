import { useState } from 'react';
import Image from 'next/image';
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
      institution: 'M.J.P.R.U. Bareilly',
      degree: 'Bachelor of Computer Applications',
      field: 'Computer Science & Engineering',
      duration: '2024 - 2026',
      description:
        'Currently pursuing Bachelor of Computer Applications in Computer Science with focus on web development, data structures, and software engineering.',
      achievements: [
        'SGPA last semester: 8.2/10',
        'Active member of coding club',
        'Participated in Smart India Hackathon 2025 - Grand Finalist',
        'Led 15+ web development projects',
        'Completed advanced coursework in DBMS, OS, and Networks',
      ],
      logo: 'https://th.bing.com/th/id/ODF.LtWotuFRbmp0oF3w-zrqxQ?w=32&h=32&qlt=90&pcl=fffffa&o=6&cb=ucfimg1&pid=1.2&ucfimg=1',
    },
    {
      id: 'senior-secondary',
      institution: 'UP Board Of Intermedieat Education',
      degree: 'Senior Secondary Education (XII)',
      field: 'Science with 1st Honors',
      duration: '2022 - 2024',
      description:
        'Completed higher secondary education with specialization in Physics, Chemistry, Mathematics, and Computer Science.',
      achievements: [
        'Percentage: 83.7%',
        'Physics and Chemistry Topper ',
        'Keen Intrest in Science and Technology',
        
      ],
      logo: 'https://th.bing.com/th/id/ODF.Vj2VMO4XAAVKd_C8R4M9JQ?w=32&h=32&qlt=90&pcl=fffffc&o=6&cb=ucfimg1&pid=1.2&ucfimg=1',
    },
    {
      id: 'secondary',
      institution: 'UP Board of intermediate Education',
      degree: 'Secondary Education (X)',
      field: 'General',
      duration: '2021 - 2022',
      description:
        'Completed secondary education with strong academic performance and active participation in school activities.',
      achievements: [
        
        'School Merit Certificate',
        'Science Olympiad Participant',
        'Student Council Member',
      ],
      logo: 'https://th.bing.com/th/id/ODF.Vj2VMO4XAAVKd_C8R4M9JQ?w=32&h=32&qlt=90&pcl=fffffc&o=6&cb=ucfimg1&pid=1.2&ucfimg=1',
    },
  ];

  const courses: EducationItem[] = [
    {
      id: 'Networking-Basics',
      institution: 'Swayam Platform',
      degree: 'Networking Basics',
      field: 'Computer Science',
      duration: '2024',
      description:
        'Comprehensive course covering fundamentals of computer networking, protocols, and network security.',
      achievements: [
        'Certification completed',
        'Grade: Distinction',
        'Hands-on labs on network setup',
        'Understanding of TCP/IP, DNS, HTTP',
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
      institution: 'Simple Learn',
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
                  <Image
                    src={item.logo}
                    alt={item.institution}
                    className={styles.logo}
                    width={50}
                    height={50}
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
