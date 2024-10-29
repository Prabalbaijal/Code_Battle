// Footer.js (Footer Section)
import React from 'react';

const Footer = () => {
  return (
    <footer className="footer bg-gray-900 text-gray-400 p-10">
      <aside>
        <svg width="50" height="50" viewBox="0 0 24 24" className="fill-current text-white">
          <path d="M22.672 15.226l-2.432.811.841 2.515..."></path>
        </svg>
        <p>ACME Industries Ltd.<br />Providing reliable tech since 1992</p>
      </aside>
      <nav>
        <h6 className="footer-title text-white">Services</h6>
        <a className="link link-hover text-gray-400">Branding</a>
        <a className="link link-hover text-gray-400">Design</a>
        <a className="link link-hover text-gray-400">Marketing</a>
        <a className="link link-hover text-gray-400">Advertisement</a>
      </nav>
      <nav>
        <h6 className="footer-title text-white">Company</h6>
        <a className="link link-hover text-gray-400">About us</a>
        <a className="link link-hover text-gray-400">Contact</a>
        <a className="link link-hover text-gray-400">Jobs</a>
        <a className="link link-hover text-gray-400">Press kit</a>
      </nav>
      <nav>
        <h6 className="footer-title text-white">Legal</h6>
        <a className="link link-hover text-gray-400">Terms of use</a>
        <a className="link link-hover text-gray-400">Privacy policy</a>
        <a className="link link-hover text-gray-400">Cookie policy</a>
      </nav>
    </footer>
  );
};

export default Footer;
