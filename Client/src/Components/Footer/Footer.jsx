import React from "react";
import logo from "../../assets/logo.png"; // ✅ Importing your logo

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 p-6 border-t border-gray-700">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between sm:flex-row flex-col text-center sm:text-left">

      <div
  className="flex items-center space-x-4 sm:ml-[-88px] mb-4 sm:mb-0 cursor-pointer"
  onClick={() => window.location.reload()}
>
  <img
    src={logo}
    alt="Logo"
    className="w-36 sm:w-80 h-22"
  />
</div>




        {/* Links Section - Stacks on Mobile, Horizontal on Larger Screens */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6 text-sm">
          <a className="hover:text-white cursor-pointer">About Us</a>
          <a className="hover:text-white cursor-pointer">Contact</a>
          <a className="hover:text-white cursor-pointer">Privacy Policy</a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
