/* ------------------------------------------------------------------
   All the content on the site lives here. Edit this file to update
   your portfolio — no need to touch index.html or main.js.
------------------------------------------------------------------- */
window.PORTFOLIO = {
  name: "Mandeep Yadav",
  email: "05mandeepyadav@gmail.com",
  github: "https://github.com/MandeepYadav26",

  roles: [
    "B.Tech student, AI & ML",
    "Python developer",
    "Building things that learn",
    "Hackathon participant",
  ],

  profile:
    "Proficient in programming and machine learning. I apply AI algorithms to real-world problems through academic projects and coursework, and I'm eager to bring technical expertise and innovative thinking to cutting-edge AI initiatives.",

  stats: [
    { value: 8, label: "Projects built" },
    { value: 4, label: "Hackathons & contests" },
    { value: 2, label: "Certifications" },
  ],

  // `repo` links go to the project's GitHub page. Projects without a
  // repo link fall back to your GitHub profile.
  projects: [
    {
      title: "GLA-Care",
      blurb:
        "Health management platform with basic predictive features, built to help track and monitor patient health data.",
      tags: ["Python", "Flask", "SQLite", "HTML"],
      repo: "https://github.com/MandeepYadav26/GLA-Care",
    },
    {
      title: "Travel Saathi",
      blurb:
        "AI-powered travel planner and diary for India. Search a destination, get instant itineraries with places, images and expense estimates, log your trips and earn rewards for sharing descriptions.",
      tags: ["JavaScript", "AI", "Web App"],
      repo: "https://github.com/MandeepYadav26/Travel_Saathi",
    },
    {
      title: "AI Resume Shortlister",
      blurb:
        "Web app that reads PDF resumes and compares them to a job description. Every resume gets a score based on matching skills, so candidates can be screened quickly.",
      tags: ["Python", "PDF parsing", "NLP"],
      repo: "https://github.com/MandeepYadav26/Ai-Resume",
    },
    {
      title: "Traffic Sign Recognition",
      blurb:
        "Deep learning project that recognises traffic signs from images.",
      tags: ["Deep Learning", "Computer Vision"],
      repo: "https://github.com/MandeepYadav26/Traffic-Sign-Recognition",
    },
    {
      title: "Hybrid Chatbot",
      blurb:
        "AI-powered voice assistant using natural language processing, in the spirit of Alexa and Siri. It recognises user preferences, executes commands, and works both online and offline.",
      tags: ["NLP", "Voice", "Python"],
    },
    {
      title: "Data ETL Pipeline",
      blurb:
        "ETL pipeline that extracts, transforms and loads a COVID-19 dataset into a clean, analysis-ready form.",
      tags: ["ETL", "Data Engineering", "pandas"],
    },
    {
      title: "Auction Biding",
      blurb: "University semester project: an auction and bidding system.",
      tags: ["Python", "University project"],
      repo: "https://github.com/MandeepYadav26/Auction_Biding",
    },
    {
      title: "Store Score",
      blurb:
        "Performance tracking system that stores and compares scores in a file, making it easy to monitor progress over time.",
      tags: ["File handling", "Python"],
    },
  ],

  skills: [
    { group: "Languages & web", items: ["Python", "MySQL", "HTML", "CSS", "JavaScript"] },
    { group: "Data & AI", items: ["pandas", "Power BI", "Effective AI usage"] },
    { group: "Design", items: ["Figma"] },
    { group: "Soft skills", items: ["Teamwork", "Critical thinking", "Adaptability"] },
    { group: "Languages spoken", items: ["Hindi", "English"] },
  ],

  education: {
    school: "GLA University",
    years: "2024 – 2028",
    degree:
      "B.Tech in Computer Science, specialising in Artificial Intelligence and Machine Learning",
  },

  certifications: [
    "Microsoft Azure AZ-900 certificate course",
    "AI-900",
  ],

  hackathons: [
    "Internal Smart India Hackathon",
    "TechRhythm'25 at ITM University, Gwalior",
    "TechNavya at GLA University, Mathura",
    "IIT Madras online coding test",
  ],
};
