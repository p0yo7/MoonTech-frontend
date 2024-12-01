'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { FaHome, FaInfoCircle, FaEnvelope, FaBars, FaBuilding } from 'react-icons/fa'
import './styles.css'
import { CreateCompanyForm } from './create-company'

const Navbar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  const toggleNavbar = () => {
    setIsExpanded(!isExpanded)
  }

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen)
  }

  return (
    <nav className={`navbar ${isExpanded ? 'expanded' : ''}`}>
      <button className="navbar-toggle" onClick={toggleNavbar}>
        <FaBars />
      </button>
      <ul className="navbar-menu">
        <li><Link href="/dashboard"><FaHome /></Link></li>
        <li><Link href="/about"><FaInfoCircle /></Link></li>
        <li><Link href="/contact"><FaEnvelope /></Link></li>
        <li>
          <button onClick={togglePopup}>
            <FaBuilding className="text-white" />
          </button>
        </li>
      </ul>
      {isPopupOpen && (
        <CreateCompanyForm onClose={togglePopup} />
      )}
    </nav>
  )
}

export default Navbar