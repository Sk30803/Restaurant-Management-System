import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, User, Menu, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import './Navbar.css';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { openCart, cartCount } = useCart();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Reservations', path: '/reservations' },
        { name: 'Menu', path: '/order' },
        { name: 'Events', path: '/events' },
    ];

    return (
        <nav className={`navbar-standard ${isScrolled ? 'scrolled' : ''}`}>
            <div className="container nav-content">
                <Link to="/" className="nav-logo">
                    Gourmet<span className="accent">Flow</span>
                </Link>

                <div className="nav-links-desktop">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                <div className="nav-actions">
                    <button className="icon-badge-btn" onClick={openCart} title="Your Cart">
                        <ShoppingBag size={22} />
                        {cartCount > 0 && <span className="badge">{cartCount}</span>}
                    </button>

                    <Link to="/login" className="login-trigger">
                        <User size={22} />
                        <span className="desktop-only">Sign In</span>
                    </Link>

                    <button className="mobile-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'open' : ''}`}>
                <div className="mobile-menu-content">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>Account</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
