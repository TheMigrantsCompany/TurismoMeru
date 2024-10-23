import ShoppingCartIcon from "@heroicons/react/24/outline/ShoppingCartIcon";
import React from "react";

export default function StickyNavbar() {
  return (
    <nav className="bg-white shadow dark:bg-gray-200 sticky top-0 z-50 opacity-50">
      <div className="container flex items-center justify-center p-1 mx-auto text-gray-900 capitalize dark:text-gray-300">
        <a href="#" className="text-gray-800 transition-colors duration-300 transform dark:text-gray-200 border-b-2 border-blue-500 mx-1.5 sm:mx-6">
          home
        </a>

        <a href="#" className="border-b-2 border-transparent hover:text-gray-800 transition-colors duration-300 transform dark:hover:text-gray-200 hover:border-blue-500 mx-1.5 sm:mx-6">
          features
        </a>

        <a href="#" className="border-b-2 border-transparent hover:text-gray-800 transition-colors duration-300 transform dark:hover:text-gray-200 hover:border-blue-500 mx-1.5 sm:mx-6">
          pricing
        </a>

        <a href="#" className="border-b-2 border-transparent hover:text-gray-800 transition-colors duration-300 transform dark:hover:text-gray-200 hover:border-blue-500 mx-1.5 sm:mx-6">
          blog
        </a>

        
        <a href="/user/shoppingcart" className="flex items-center border-b-2 border-transparent hover:text-gray-800 transition-colors duration-300 transform dark:hover:text-gray-200 hover:border-blue-500 mx-1.5 sm:mx-6">
          <ShoppingCartIcon className="w-6 h-6" />
        </a>

        <div className="relative inline-block text-left">
          <div>
            <button type="button" className="flex items-center text-gray-600 dark:text-gray-300 focus:outline-none">
              <svg className="w-2 h-1 fill-current" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0h24v24H0z" fill="none"/>
                <path d="M12 15.36l4.52 2.236-.865-5.044 3.664-3.682-5.047-.733L12 2l-1.748 5.184-5.048.733 3.664 3.682-.865 5.044L12 15.36z"/>
              </svg>
              <span className="ml-2">User</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}