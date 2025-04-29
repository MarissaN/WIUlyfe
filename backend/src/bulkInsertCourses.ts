import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Define the Master of Computer Science course and its related subjects
const course = {
  name: "Master of Computer Science",
  description: "Comprehensive study of computer science topics.",
  credits: 0, 
  instructor: "Various",
  videoUrl: "", 
};

const subjects = [
  {
    name: "Advanced Algorithms",
    description: "Study of complex algorithms and optimization techniques.",
    credits: 3,
    instructor: "Dr. Donald Knuth",
    videoUrl: "https://www.youtube.com/watch?v=ad79nYk2keg", 
  },
  {
    name: "Distributed Systems",
    description: "Principles of distributed computing and systems design.",
    credits: 3,
    instructor: "Dr. Leslie Lamport",
    videoUrl: "https://www.youtube.com/watch?v=duIZs7ElbLo", 
  },
  {
    name: "Operating Systems",
    description: "In-depth study of OS concepts including concurrency and memory management.",
    credits: 3,
    instructor: "Dr. Andrew Tanenbaum",
    videoUrl: "https://www.youtube.com/watch?v=26pZLYyN9Bw", 
  },
  {
    name: "Computer Networks",
    description: "Protocols, architectures, and applications of computer networks.",
    credits: 3,
    instructor: "Dr. Vinton Cerf",
    videoUrl: "https://www.youtube.com/watch?v=QATFkZgISZc", 
  },
  {
    name: "Database Systems",
    description: "Design, implementation, and management of relational databases.",
    credits: 3,
    instructor: "Dr. Michael Stonebraker",
    videoUrl: "https://www.youtube.com/watch?v=SwRZJxH8fM8", 
  },
  {
    name: "Software Engineering",
    description: "Systematic approach to software development and project management.",
    credits: 3,
    instructor: "Dr. Ian Sommerville",
    videoUrl: "https://www.youtube.com/watch?v=G0Xh06pNj_o", 
  },
  {
    name: "Cybersecurity Fundamentals",
    description: "Concepts and techniques for securing computer systems.",
    credits: 3,
    instructor: "Dr. Gene Spafford",
    videoUrl: "https://www.youtube.com/watch?v=5p9vFQYlBOg", 
  },
  {
    name: "Mobile Application Development",
    description: "Design and develop applications for mobile platforms.",
    credits: 3,
    instructor: "Dr. Josh Marinacci",
    videoUrl: "https://www.youtube.com/watch?v=tnR_6m5vPpI", 
  },
  {
    name: "Human-Computer Interaction",
    description: "Designing user-centered computer interfaces and systems.",
    credits: 3,
    instructor: "Dr. Ben Shneiderman",
    videoUrl: "https://www.youtube.com/watch?v=mrZFi3_yGR0", 
  },
  {
    name: "Computer Graphics",
    description: "Techniques and applications of generating images with computers.",
    credits: 3,
    instructor: "Dr. Jim Blinn",
    videoUrl: "https://www.youtube.com/watch?v=IAn5yTh5gX8", 
  },
  {
    name: "Data Structures and Analysis",
    description: "Efficient data organization for problem-solving.",
    credits: 3,
    instructor: "Dr. Robert Sedgewick",
    videoUrl: "https://www.youtube.com/watch?v=BpK0cIYXAmQ", 
  },
];

async function main() {
  try {
   
    const courseData = await prisma.course.create({
      data: {
        name: course.name,
        description: course.description,
        credits: course.credits,
        instructor: course.instructor,
        videoUrl: course.videoUrl, 
      },
    });
    console.log(`✅ Successfully inserted course: ${course.name}`);

    // Insert subjects related to the course
    const subjectData = subjects.map((subject) => ({
      name: subject.name,
      description: subject.description,
      credits: subject.credits,
      instructor: subject.instructor,
      videoUrl: subject.videoUrl, 
      courseId: courseData.id,
      createdAt: new Date(), 
    }));

    const insertedSubjects = await prisma.subject.createMany({
      data: subjectData,
      skipDuplicates: true, 
    });

    console.log(`✅ Successfully inserted ${insertedSubjects.count} subjects for course: ${course.name}`);
  } catch (error) {
    console.error("❌ Error inserting course and subjects:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
