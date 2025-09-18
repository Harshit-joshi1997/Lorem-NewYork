import React, { useState } from 'react';
import { Facebook, Instagram, Linkedin, Youtube, Twitter } from "lucide-react";
import { subscribeToNewsletter } from '../api/CRUD';

const Footer = () => {
    const [email, setEmail] = useState('');
    const [subscriptionStatus, setSubscriptionStatus] = useState(null);
    
   
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await subscribeToNewsletter(email);
            if (result) {
                setSubscriptionStatus('success');
                setEmail('');
            } else {
                setSubscriptionStatus('error');
            }
        } catch (error) {
            setSubscriptionStatus('error');
            console.error('Subscription error:', error);
        }
    };

    return (
        <footer className="bg-gray-800 py-12 border-t border-gray-700 text-gray-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">

                {/* About */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-2">About New York Lore</h3>
                    <p className="text-sm text-gray-400">
                        Discover and share the hidden stories of NYC.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Quick Links</h3>
                    <ul className="space-y-1 text-sm">
                        <li><a href="/" className="hover:text-emerald-400 transition">Home</a></li>
                        <li><a href="/stories" className="hover:text-emerald-400 transition">Stories</a></li>
                        <li><a href="/submit" className="hover:text-emerald-400 transition">Submit</a></li>
                        <li><a href="mailto:contact@newyorklore.example.com" className="hover:text-emerald-400 transition">Contact by Mail</a></li>
                    </ul>
                </div>

                {/* Resources */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Resources</h3>
                    <ul className="space-y-1 text-sm">
                        <li><a href="#" className="hover:text-emerald-400 transition">FAQ</a></li>
                        <li><a href="#" className="hover:text-emerald-400 transition">Privacy</a></li>
                        <li><a href="#" className="hover:text-emerald-400 transition">Terms</a></li>
                    </ul>
                </div>

        {/* Social section */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Follow Us</h3>
          <div className="flex space-x-4 mb-20">
            <a href="https://www.linkedin.com/youpage" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition">
              <Linkedin size={20} />
              
            </a>
            <a href="https://www.Facebook.com/youpage" className="hover:text-emerald-400 transition">
              <Facebook size={20} />
            </a>
            <a href="https://www.Instagram.com/youpage" className="hover:text-emerald-400 transition">
              <Instagram size={20} />
            </a>
            {/* Placeholders */}
            <a href="https://www.twitter.com/youpage"  className="hover:text-emerald-400 transition">
              <Twitter size={20} /> {/* Placeholder for X */}
            </a>
            <a href="https://www.Youtube.com/youpage" className="hover:text-emerald-400 transition">
              <Youtube size={20} />
            </a>
            <a href="https://www.Tiktok.com/youpage" className="hover:text-emerald-400 transition">
              <span className="text-xs font-bold">TikTok</span> {/* placeholder text */}
            </a>
          </div>


                {/* Newsletter */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Newsletter</h3>
                    <form onSubmit={handleSubmit} className="space-y-2">
                        <input 
                            type="email" 
                            placeholder="Your email" 
                            value={email}
                            onChange={(e) =>( setEmail(e.target.value) , setSubscriptionStatus(null))}
                            required
                            className="w-full px-3 py-2 border border-gray-600 bg-gray-900 text-white placeholder-gray-400 rounded"
                        />
                        <button 
                            type="submit" 
                            className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 transition"
                        >
                            Subscribe
                        </button>
                        {subscriptionStatus === 'success' && (
                            <p className="text-emerald-400 text-sm">Thank you for subscribing!</p>
                        )}
                        {subscriptionStatus === 'error' && (
                            <p className="text-red-400 text-sm">Subscription failed. Please try again.</p>
                        )}
                    </form>
                </div>
            </div>
            </div>
        </footer>
    );
};

export default Footer;
