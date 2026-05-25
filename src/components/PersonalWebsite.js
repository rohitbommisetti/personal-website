import React from 'react';
import styles from './PersonalWebsite.module.css';

const PersonalWebsite = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Rohit Bommisetti</h1>
        <p className={styles.subtitle}>📍PHL/NYC</p>
      
        <section className={styles.section}>
          <p>I'm currently working on transforming businesses with AI at <a href="http://renovuscapital.com" style={{color: '#e5e5e5'}}>Renovus Capital</a>. I believe the next chapter of American dynamism will be written in how we apply AI to real economy. </p>
        </section>
        
        <section className={styles.section}>
          <p>I previously worked on reducing oncology readmissions at CMU, building a student entrepreneurship community, and teaching AI with a team from Stanford. I studied economics at the University of Pittsburgh.</p>
        </section>
        
        <section className={styles.section}>
          <p>I love to read biographies, write about interesting ideas, and spend time in the ocean.</p>
        </section>
        
       </div>
      
      <footer className={styles.footer}>
  <a href="mailto:rohitbommisetti@pitt.edu" className={styles.link}>Email</a>
  <a href="https://twitter.com/rohitbommisetti" className={styles.link}>X</a>
  <a href="https://www.linkedin.com/in/rohitbommisetti" className={styles.link}>LinkedIn</a>
  <a href="https://rohit.posthaven.com" className={styles.link}>Writing</a>
</footer>
    </div>
  );
};

export default PersonalWebsite;
