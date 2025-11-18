import React from 'react';
import styles from './PersonalWebsite.module.css';


const PersonalWebsite = () => {
  return (
    <div className="container">
      <div className="content">
        <h1 className="title">Rohit Bommisetti</h1>
        <p className="subtitle">in pursuit of intentionality</p>
      
        <section className="section">
          <p>I'm currently working on transforming America's essential service industries with AI at <a href="http://renovuscapital.com" style={{color: '#000000'}}>Renovus Capital</a>.</p>
        </section>
        
        <section className="section">
          <p>I previously worked on improving oncology readmissions at CMU, building the first student entrepreneurship community, and teaching AI with a team from Stanford. I studied economics at the University of Pittsburgh.</p>
        </section>
        
        <section className="section">
          <p>I love to read biographies, write about interesting ideas, and spend time in the ocean.</p>
        </section>
      </div>
      
      <footer className="footer">
        <a href="mailto:rohitbommisetti@pitt.edu" className="link">Email</a>
        <a href="https://twitter.com/rohitbommisetti" className="link">Twitter</a>
        <a href="https://www.linkedin.com/in/rohitbommisetti" className="link">LinkedIn</a>
        <a href="https://bommisetti.substack.com" className="link">Substack</a>
      </footer>
    </div>
  );
};

export default PersonalWebsite;
