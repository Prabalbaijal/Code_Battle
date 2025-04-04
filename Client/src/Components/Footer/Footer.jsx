import React from "react";

const Footer = () => {
  return (
    <footer className="p-6 text-gray-400 bg-gray-900 border-t border-gray-700">
      <div className="flex flex-col flex-wrap items-center justify-between max-w-6xl mx-auto text-center sm:flex-row sm:text-left">

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
        <div className="flex flex-col space-y-2 text-sm sm:flex-row sm:space-y-0 sm:space-x-6">
          <a className="cursor-pointer hover:text-white">About Us</a>
          <a className="cursor-pointer hover:text-white">Contact</a>
          <a className="cursor-pointer hover:text-white">Privacy Policy</a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
