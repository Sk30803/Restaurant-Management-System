import React, { useState } from 'react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { Mail, Phone, Calendar, ArrowRight, ShieldCheck, MapPin, Check, Plus, Minus, ChevronLeft } from 'lucide-react';
import HeroImage from '../assets/images/hero_restaurant_ambience_1769975900791.png';
import CateringImage from '../assets/images/truffle_risotto_closeup_1769976236482.png';

// Menu items for events catering
import BurgerImage from '../assets/images/gourmet_burger_plate_1769975915068.png';
import SalmonImage from '../assets/images/salmon_dish_fine_dining_1769975929501.png';
import RisottoImage from '../assets/images/truffle_risotto_closeup_1769976236482.png';
import CaesarImage from '../assets/images/caesar_salad_fresh_1769976250655.png';
import CakeImage from '../assets/images/chocolate_lava_cake_dessert_1769976265084.png';

const MENU_DATA = [
    { id: 1, name: 'Wagyu Gold Burger', price: 28, image: BurgerImage },
    { id: 2, name: 'Atlantic Glazed Salmon', price: 32, image: SalmonImage },
    { id: 3, name: 'Black Truffle Risotto', price: 24, image: RisottoImage },
    { id: 4, name: 'Architectural Caesar', price: 16, image: CaesarImage },
    { id: 5, name: 'Molten Obsidian Cake', price: 14, image: CakeImage },
    { id: 7, name: 'Signature Mojito', price: 14, image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80" },
    { id: 8, name: 'Velvet Espresso Martini', price: 16, image: "https://images.unsplash.com/photo-1545438102-799c3991ffb2?auto=format&fit=crop&w=800&q=80" },
    { id: 9, name: 'Mango Lassi Silk', price: 9, image: "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=800&q=80" },
];

const Events = () => {
    const [step, setStep] = useState(1);
    const [eventData, setEventData] = useState({
        fullName: '',
        email: '',
        date: '',
        guests: 5,
        eventType: '',
        description: '',
        selectedDishes: {}, // { itemId: true/false }
    });

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    const toggleDishSelection = (itemId) => {
        setEventData(prev => ({
            ...prev,
            selectedDishes: {
                ...prev.selectedDishes,
                [itemId]: !prev.selectedDishes[itemId]
            }
        }));
    };

    const handleFormChange = (field, value) => {
        setEventData(prev => ({ ...prev, [field]: value }));
    };

    const isStep1Valid = eventData.fullName && eventData.email && eventData.date && eventData.guests && eventData.eventType && eventData.description;
    const isStep2Valid = Object.values(eventData.selectedDishes).some(v => v);

    const getQuantityPerPerson = (numPeople) => {
        // For catering: suggest 2-3 items per person
        if (numPeople <= 10) return 3;
        if (numPeople <= 25) return 2.5;
        if (numPeople <= 50) return 2;
        return 1.5;
    };

    const getMenuSummaryWithQuantities = () => {
        const items = [];
        const quantityPerPerson = getQuantityPerPerson(eventData.guests);
        
        Object.entries(eventData.selectedDishes).forEach(([dishId, selected]) => {
            if (selected) {
                const dish = MENU_DATA.find(d => d.id === parseInt(dishId));
                if (dish) {
                    const baseQty = Math.ceil(eventData.guests * quantityPerPerson / Object.values(eventData.selectedDishes).filter(v => v).length);
                    items.push({
                        ...dish,
                        quantity: baseQty
                    });
                }
            }
        });
        return items;
    };

    const handleSubmit = () => {
        alert(`Event Curated! Your ${eventData.eventType} for ${eventData.guests} guests has been submitted to our culinary team.`);
        // Reset form and go to step 1
        setStep(1);
        setEventData({
            fullName: '',
            email: '',
            date: '',
            guests: 5,
            eventType: '',
            description: '',
            selectedDishes: {},
        });
    };

    return (
        <div style={{ paddingTop: '8rem', paddingBottom: '6rem' }}>
            {step === 1 && (
                <>
                    <div className="container animate-fade-up" style={{ textAlign: 'center', marginBottom: '5rem' }}>
                        <span style={{ color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.4em', fontSize: '0.75rem', fontWeight: 800 }}>Immersive Experiences</span>
                        <h1 style={{ fontSize: '4.5rem', marginTop: '1rem', marginBottom: '1.5rem', fontFamily: 'Playfair Display, serif' }}>Curated <span className="accent" style={{ color: 'var(--color-accent)', fontStyle: 'italic' }}>Private Events</span></h1>
                        <p style={{ color: 'var(--color-text-secondary)', maxWidth: '750px', margin: '0 auto', fontSize: '1.15rem', lineHeight: '1.8' }}>
                            From high-profile corporate summits to intimate candlelit celebrations, our sanctuary transforms to mirror your architectural vision.
                        </p>
                    </div>

                    <div className="container" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 0.8fr)', gap: '6rem', alignItems: 'start' }}>
                        <div className="animate-fade-up delay-1">
                            <h2 style={{ marginBottom: '2.5rem', fontSize: '2rem', fontFamily: 'Playfair Display' }}>Submit a Proposal</h2>
                            <Card className="glass-panel" style={{ padding: '3.5rem', borderRadius: '24px' }}>
                                <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                        <div className="input-field-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                            <label style={{ fontSize: '0.7rem', opacity: 0.5, letterSpacing: '0.2em', fontWeight: 700 }}>FULL NAME</label>
                                            <input 
                                                type="text" 
                                                className="refined-input" 
                                                placeholder="e.g. Alexander Pierce" 
                                                value={eventData.fullName}
                                                onChange={(e) => handleFormChange('fullName', e.target.value)}
                                                required 
                                            />
                                        </div>
                                        <div className="input-field-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                            <label style={{ fontSize: '0.7rem', opacity: 0.5, letterSpacing: '0.2em', fontWeight: 700 }}>EMAIL ADDRESS</label>
                                            <input 
                                                type="email" 
                                                className="refined-input" 
                                                placeholder="contact@domain.com"
                                                value={eventData.email}
                                                onChange={(e) => handleFormChange('email', e.target.value)}
                                                required 
                                            />
                                        </div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                        <div className="input-field-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                            <label style={{ fontSize: '0.7rem', opacity: 0.5, letterSpacing: '0.2em', fontWeight: 700 }}>TARGET DATE</label>
                                            <input 
                                                type="date" 
                                                className="refined-input"
                                                value={eventData.date}
                                                onChange={(e) => handleFormChange('date', e.target.value)}
                                                required 
                                            />
                                        </div>
                                        <div className="input-field-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                            <label style={{ fontSize: '0.7rem', opacity: 0.5, letterSpacing: '0.2em', fontWeight: 700 }}>EXPECTED GUESTS</label>
                                            <input 
                                                type="number" 
                                                className="refined-input" 
                                                min="5" 
                                                placeholder="Minimum 5"
                                                value={eventData.guests}
                                                onChange={(e) => handleFormChange('guests', parseInt(e.target.value))}
                                                required 
                                            />
                                        </div>
                                    </div>
                                    <div className="input-field-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        <label style={{ fontSize: '0.7rem', opacity: 0.5, letterSpacing: '0.2em', fontWeight: 700 }}>EVENT ARCHITECTURE</label>
                                        <select 
                                            className="refined-input select-dark"
                                            value={eventData.eventType}
                                            onChange={(e) => handleFormChange('eventType', e.target.value)}
                                            required
                                        >
                                            <option value="" disabled>Select event type...</option>
                                            <option>Corporate Gala & Summit</option>
                                            <option>Private Birthday Celebration</option>
                                            <option>Wedding Reception & Vows</option>
                                            <option>Bespoke Culinary Dinner</option>
                                        </select>
                                    </div>
                                    <div className="input-field-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        <label style={{ fontSize: '0.7rem', opacity: 0.5, letterSpacing: '0.2em', fontWeight: 700 }}>VISUAL VISION & DETAILS</label>
                                        <textarea
                                            className="refined-input"
                                            rows="5"
                                            placeholder="Describe your desired atmosphere, theme, and requirements..."
                                            value={eventData.description}
                                            onChange={(e) => handleFormChange('description', e.target.value)}
                                            style={{ resize: 'none' }}
                                            required
                                        ></textarea>
                                    </div>
                                    <button 
                                        type="submit" 
                                        className="refined-submit-btn"
                                        disabled={!isStep1Valid}
                                    >
                                        SELECT MENU <ArrowRight size={18} />
                                    </button>
                                </form>
                            </Card>
                        </div>

                        <div className="animate-fade-up delay-2" style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
                            <div>
                                <h3 style={{ marginBottom: '2rem', color: 'var(--color-accent)', fontSize: '1.25rem', letterSpacing: '0.15em', fontWeight: 800 }}>DIRECT COORDINATION</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <p style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem' }}>
                                        <Phone size={22} style={{ color: 'var(--color-accent)' }} /> +1 (555) 123-4567
                                    </p>
                                    <p style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem' }}>
                                        <Mail size={22} style={{ color: 'var(--color-accent)' }} /> concierge@gourmetflow.com
                                    </p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                                <div className="event-visual-card">
                                    <div className="img-container">
                                        <img src={HeroImage} alt="Venue" />
                                        <div className="card-overlay"></div>
                                    </div>
                                    <div className="card-lbl">
                                        <h4>Main Sanctuary</h4>
                                        <span><MapPin size={12} /> Capacity: 120 Guests</span>
                                    </div>
                                </div>
                                <div className="event-visual-card">
                                    <div className="img-container">
                                        <img src={CateringImage} alt="Catering" />
                                        <div className="card-overlay"></div>
                                    </div>
                                    <div className="card-lbl">
                                        <h4>Gourmet Catering</h4>
                                        <span><ShieldCheck size={12} /> Custom Bespoke Menus</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {step === 2 && (
                <div className="container animate-fade-in">
                    <div className="section-header">
                        <button className="back-link" onClick={handleBack}><ChevronLeft size={16} /> Previous Step</button>
                        <h1>Select Your Culinary Vision</h1>
                        <p>Choose dishes for your {eventData.guests}-guest event. Quantities will be calculated automatically.</p>
                    </div>
                    <div className="menu-selection-grid">
                        {MENU_DATA.map(item => (
                            <div
                                key={item.id}
                                className={`menu-card glass-card ${eventData.selectedDishes[item.id] ? 'active' : ''}`}
                                onClick={() => toggleDishSelection(item.id)}
                            >
                                <div className="card-image" style={{ backgroundImage: `url(${item.image})` }}>
                                    {eventData.selectedDishes[item.id] && <div className="check-overlay"><Check /></div>}
                                </div>
                                <div className="card-info">
                                    <h3>{item.name}</h3>
                                    <span className="price">${item.price}</span>
                                    <button 
                                        className={`select-dish-btn ${eventData.selectedDishes[item.id] ? 'selected' : ''}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleDishSelection(item.id);
                                        }}
                                    >
                                        {eventData.selectedDishes[item.id] ? '✓ Selected' : 'Select Dish'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="action-row" style={{ marginTop: '4rem' }}>
                        <button className="refined-submit-btn" style={{ opacity: 0.7 }} onClick={handleBack}>Back</button>
                        <button 
                            className="refined-submit-btn" 
                            onClick={handleNext}
                            disabled={!isStep2Valid}
                        >
                            Review Menu Summary <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="container animate-fade-in">
                    <div className="section-header">
                        <button className="back-link" onClick={handleBack}><ChevronLeft size={16} /> Previous Step</button>
                        <h1>Finalize Your Catering</h1>
                        <p>Adjust quantities for your {eventData.guests} guests. Base quantities have been calculated.</p>
                    </div>
                    <div className="catering-summary glass-card">
                        <div className="summary-header">
                            <h2>Menu Summary</h2>
                            <span className="guest-count">For {eventData.guests} Guests</span>
                        </div>
                        <div className="summary-items">
                            {getMenuSummaryWithQuantities().map(item => (
                                <div key={item.id} className="summary-item">
                                    <div className="item-details">
                                        <h4>{item.name}</h4>
                                        <p className="price">${item.price} per unit</p>
                                    </div>
                                    <div className="item-quantity">
                                        <span className="qty-label">Total:</span>
                                        <div className="qty-editor">
                                            <button onClick={() => {
                                                const menu = getMenuSummaryWithQuantities();
                                                const itemIdx = menu.findIndex(m => m.id === item.id);
                                                if (menu[itemIdx].quantity > 0) {
                                                    // Update quantity in state
                                                    // This is simplified - you may want to add a separate state for quantities
                                                }
                                            }}>−</button>
                                            <span className="quantity">{item.quantity}</span>
                                            <button onClick={() => {
                                                // Update quantity in state
                                            }}>+</button>
                                        </div>
                                        <span className="item-total">${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="summary-footer">
                            <div className="total-section">
                                <span>Estimated Catering Total:</span>
                                <span className="total-amount">
                                    ${getMenuSummaryWithQuantities().reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="action-row" style={{ marginTop: '4rem' }}>
                        <button className="refined-submit-btn" style={{ opacity: 0.7 }} onClick={handleBack}>Back</button>
                        <button 
                            className="refined-submit-btn"
                            onClick={handleNext}
                            style={{ background: 'var(--color-accent)' }}
                        >
                            Confirm Event <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            )}

            {step === 4 && (
                <div className="container animate-fade-in">
                    <div className="section-header">
                        <h1>Event Confirmed</h1>
                        <p>Your bespoke culinary experience is being prepared.</p>
                    </div>
                    <div className="confirmation-card glass-card">
                        <div className="confirmation-grid">
                            <div className="confirm-section">
                                <h3>Event Details</h3>
                                <p><strong>Host:</strong> {eventData.fullName}</p>
                                <p><strong>Email:</strong> {eventData.email}</p>
                                <p><strong>Date:</strong> {eventData.date}</p>
                                <p><strong>Guests:</strong> {eventData.guests}</p>
                                <p><strong>Type:</strong> {eventData.eventType}</p>
                            </div>
                            <div className="confirm-section">
                                <h3>Culinary Selection</h3>
                                <ul className="menu-list">
                                    {getMenuSummaryWithQuantities().map(item => (
                                        <li key={item.id}>
                                            <span>{item.name} × {item.quantity}</span>
                                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                                        </li>
                                    ))}
                                    <li className="total-row">
                                        <span>Total</span>
                                        <span>${getMenuSummaryWithQuantities().reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <button 
                        className="refined-submit-btn"
                        onClick={handleSubmit}
                        style={{ margin: '3rem auto', display: 'flex', width: 'fit-content' }}
                    >
                        FINALIZE BOOKING <ArrowRight size={18} />
                    </button>
                </div>
            )}

            <style>{`
                .section-header {
                    text-align: center;
                    margin-bottom: 4rem;
                }

                .section-header h1 {
                    font-size: 3rem;
                    margin-bottom: 1rem;
                }

                .section-header p {
                    color: var(--color-text-secondary);
                    font-size: 1.1rem;
                }

                .back-link {
                    background: none;
                    border: none;
                    color: var(--color-text-secondary);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin: 0 auto 1.5rem;
                    font-size: 0.8rem;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                }

                .back-link:hover {
                    color: #fff;
                }

                .menu-selection-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 2rem;
                    margin-bottom: 4rem;
                }

                .menu-card {
                    padding: 0 !important;
                    overflow: hidden;
                    cursor: pointer;
                    transition: var(--transition);
                }

                .menu-card:hover {
                    transform: translateY(-8px);
                }

                .menu-card.active {
                    border-color: var(--color-accent);
                    box-shadow: 0 0 30px rgba(212, 175, 55, 0.3);
                }

                .card-image {
                    height: 180px;
                    background-size: cover;
                    background-position: center;
                    position: relative;
                    filter: brightness(0.7);
                    transition: var(--transition);
                }

                .menu-card:hover .card-image {
                    filter: brightness(1);
                }

                .check-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(212, 175, 55, 0.4);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #fff;
                    backdrop-filter: blur(2px);
                }

                .card-info {
                    padding: 1.5rem;
                }

                .card-info h3 {
                    font-size: 1.2rem;
                    margin-bottom: 0.5rem;
                    color: #fff;
                }

                .card-info .price {
                    color: var(--color-accent);
                    font-weight: 700;
                    margin-bottom: 1.5rem;
                    display: block;
                }

                .select-dish-btn {
                    width: 100%;
                    background: none;
                    border: 1px solid var(--glass-border);
                    color: #fff;
                    padding: 0.75rem;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: var(--transition);
                }

                .select-dish-btn:hover {
                    border-color: var(--color-accent);
                    color: var(--color-accent);
                }

                .select-dish-btn.selected {
                    background: var(--color-accent);
                    border-color: var(--color-accent);
                    color: #000;
                }

                .action-row {
                    display: flex;
                    gap: 2rem;
                    justify-content: center;
                }

                .refined-input {
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.08);
                    padding: 1.25rem;
                    border-radius: 12px;
                    color: #fff;
                    font-family: 'Outfit', sans-serif;
                    font-size: 0.95rem;
                    outline: none;
                    transition: var(--transition);
                }

                .refined-input:focus {
                    border-color: var(--color-accent);
                    background: rgba(255,255,255,0.05);
                }

                .select-dark option {
                    background: #111;
                    color: #fff;
                    padding: 1rem;
                }

                .refined-submit-btn {
                    margin-top: 1.5rem;
                    background: var(--color-accent);
                    border: none;
                    padding: 1.5rem;
                    border-radius: 14px;
                    color: #000;
                    font-weight: 800;
                    font-family: 'Outfit', sans-serif;
                    font-size: 1rem;
                    letter-spacing: 0.15em;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 1rem;
                    transition: var(--transition);
                }

                .refined-submit-btn:hover:not(:disabled) {
                    background: #fff;
                    transform: translateY(-5px);
                }

                .refined-submit-btn:disabled {
                    opacity: 0.3;
                    cursor: not-allowed;
                }

                .event-visual-card {
                    background: var(--glass-bg);
                    border: 1px solid var(--glass-border);
                    border-radius: 20px;
                    overflow: hidden;
                    position: relative;
                }

                .img-container {
                    height: 260px;
                    overflow: hidden;
                    position: relative;
                }

                .img-container img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                    transition: transform 0.6s var(--ease-out-expo);
                }

                .event-visual-card:hover .img-container img {
                    transform: scale(1.1);
                }

                .card-overlay {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%);
                }

                .card-lbl {
                    position: absolute;
                    bottom: 1.5rem;
                    left: 2rem;
                }

                .card-lbl h4 {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.4rem;
                    color: #fff;
                    margin-bottom: 0.4rem;
                }

                .card-lbl span {
                    color: var(--color-accent);
                    font-size: 0.8rem;
                    text-transform: uppercase;
                    letter-spacing: 0.15em;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .catering-summary {
                    padding: 3rem !important;
                    margin: 2rem 0;
                }

                .summary-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                    padding-bottom: 2rem;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }

                .summary-header h2 {
                    font-size: 1.8rem;
                    color: #fff;
                }

                .guest-count {
                    color: var(--color-accent);
                    font-weight: 700;
                    font-size: 0.9rem;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                }

                .summary-items {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                }

                .summary-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.5rem;
                    background: rgba(255, 255, 255, 0.02);
                    border-radius: 12px;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }

                .item-details {
                    flex: 1;
                }

                .item-details h4 {
                    font-size: 1.1rem;
                    margin-bottom: 0.5rem;
                    color: #fff;
                }

                .item-details .price {
                    color: var(--color-text-secondary);
                    font-size: 0.9rem;
                }

                .item-quantity {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                }

                .qty-label {
                    color: var(--color-text-secondary);
                    font-size: 0.9rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .qty-editor {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    background: rgba(255, 255, 255, 0.05);
                    padding: 0.5rem;
                    border-radius: 8px;
                }

                .qty-editor button {
                    background: none;
                    border: none;
                    color: var(--color-accent);
                    cursor: pointer;
                    font-weight: 700;
                    font-size: 1.2rem;
                    transition: var(--transition);
                }

                .qty-editor button:hover {
                    color: #fff;
                }

                .quantity {
                    min-width: 30px;
                    text-align: center;
                    color: #fff;
                    font-weight: 700;
                }

                .item-total {
                    color: var(--color-accent);
                    font-weight: 700;
                    min-width: 80px;
                    text-align: right;
                }

                .summary-footer {
                    padding-top: 2rem;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                }

                .total-section {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 1.25rem;
                    font-weight: 700;
                }

                .total-amount {
                    color: var(--color-accent);
                    font-size: 1.5rem;
                }

                .confirmation-card {
                    padding: 3rem !important;
                }

                .confirmation-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 3rem;
                    margin-bottom: 2rem;
                }

                .confirm-section {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .confirm-section h3 {
                    font-size: 1.25rem;
                    color: var(--color-accent);
                    margin-bottom: 1rem;
                }

                .confirm-section p {
                    color: var(--color-text-secondary);
                    line-height: 1.8;
                }

                .confirm-section p strong {
                    color: #fff;
                }

                .menu-list {
                    list-style: none;
                    padding: 0;
                }

                .menu-list li {
                    display: flex;
                    justify-content: space-between;
                    padding: 0.75rem 0;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                    color: var(--color-text-secondary);
                }

                .menu-list li.total-row {
                    font-weight: 700;
                    padding-top: 1rem;
                    color: var(--color-accent);
                }

                @media (max-width: 768px) {
                    .menu-selection-grid {
                        grid-template-columns: 1fr;
                    }

                    .confirmation-grid {
                        grid-template-columns: 1fr;
                    }

                    .action-row {
                        flex-direction: column;
                    }

                    .refined-submit-btn {
                        width: 100%;
                    }
                }
            `}</style>
        </div>
    );
};

export default Events;
