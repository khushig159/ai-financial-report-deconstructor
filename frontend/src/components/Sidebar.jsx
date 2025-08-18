import React, { useState, useEffect } from "react";
import { anticipate, motion, AnimatePresence } from "framer-motion";
import styles from "../module/app.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartSimple,
  faBars,
  faTimes,
  faBookOpen,
  faBuildingColumns,
  faLeaf,
  faClockRotateLeft,
  faHome,
  faArrowRightFromBracket,
  faTriangleExclamation,
  faFile,
  faMessage,
} from "@fortawesome/free-solid-svg-icons";
import { auth } from "../../src/firebase";
import { signOut } from "firebase/auth";

export default function Sidebar({ handleClick, active }) {
  const menuItems = [
    { icon: faHome, title: "Executive Summary" },
    { icon: faChartSimple, title: "Metrics Dashboard" },
    { icon: faTriangleExclamation, title: "Risk Viewer" },
    { icon: faFile, title: "Financial Statements" },
    { icon: faMessage, title: "Strategic & Legal Overview" },
    { icon: faBuildingColumns, title: "Competition & Governance" },
    { icon: faClockRotateLeft, title: "Risk & History" },
    { icon: faBookOpen, title: "Footnote Explorer" },
    { icon: faLeaf, title: "Sustainability & Debt" },
  ];
  const handleLogout = async () => {
      try {
        await signOut(auth);
      } catch (error) {
        console.error("Error signing out:", error);
      }
    };

  return (
    <motion.div
      style={{
        marginLeft: "1rem",
        minHeight: "93vh",
        display: "flex",
        position: "fixed",
        left: 0,
        top: 10,
        zIndex: 9999,
        padding: "1rem",
        flexDirection: "column",
        minWidth: "4rem",
        alignItems: "center",
        paddingTop: "1rem",
        width: "19vw",
        borderRadius: "1rem",
        backgroundColor: "#c2d1d8ff",
      }}
    >
      <div className={styles.uppersec}>
        <div>
          <h2>FinAnalyzer</h2>
          <p>Analyze your report in minutes</p>
        </div>

        <button
          style={{ border: "none", cursor: "pointer" }}
          className={styles.buttttton}
        >
          <FontAwesomeIcon icon={faChartSimple} />
        </button>
      </div>

      <div
        animate={{ x: 9 }}
        transition={{ delay: 0.5, duration: 0.5, ease: "anticipate" }}
        style={{
          width: "100%",
          marginBottom: "0.5rem",
          display: "flex",
          gap: "0.25rem",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <div className={styles.topcon}>
        <p
          className={styles.topic}
          //   animate={{ opacity: collapse ? 0 : 1 }}
          transition={{ delay: 0.5, duration: 0.2 }}
        >
          {"Analytics"}
        </p>
        <button onClick={handleLogout}>
        <FontAwesomeIcon className={styles.icon} icon={faArrowRightFromBracket}/>
      </button></div></div>

      {menuItems.map((item, i) => (
        <motion.button
          key={i}
          className={
            active === i
              ? `${styles.titlebutton} ${styles.active}`
              : styles.titlebutton
          }
          style={{
            width: "100%",
            height: "2.5rem",
            marginTop: "0.25rem",
            borderRadius: "0.3rem",
            marginBottom: "0.5rem",
            border: "none",
            cursor: "pointer",
            fontFamily: "DM sans",
            padding: "13px",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: "0.75rem",
            overflow: "hidden",
          }}
          onClick={() => handleClick(i)}
        >
          <FontAwesomeIcon icon={item.icon} />
          <span>{item.title}</span>
        </motion.button>
      ))}

      <div style={{ flexGrow: 1 }}></div>
    </motion.div>
  );
}
