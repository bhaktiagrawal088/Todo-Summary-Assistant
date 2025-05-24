import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 shadow-sm mt-auto">
      <div className="container mx-auto px-4 py-3">
        <p className="text-sm text-center text-gray-500 dark:text-gray-400">
          Todo Summary Assistant © {new Date().getFullYear()} Bhakti Agrawal
        </p>
      </div>
    </footer>
  );
};

export default Footer;