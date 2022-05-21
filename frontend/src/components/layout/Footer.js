import React from "react";

//Import css
import styles from './Footer.module.css'

const Footer = () => {
  return(
    <footer className={styles.footer}>
      <p>
        <span className="bold">Get A Pet</span> &copy; 2022
      </p>
    </footer>
  )
}

export default Footer