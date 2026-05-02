import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../api';
import { Clock, CheckCircle, Package, Utensils, Calendar, MapPin, XCircle, Search, Trash2 } from 'lucide-react';
import './History.css';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import useScrollOnUpdate from '../hooks/useScrollOnUpdate';

const History = () => {
    const { user, isChecking } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('orders');
    const [orders, setOrders] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [caterings, setCaterings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancellingId, setCancellingId] = useState(null);
    const [cancellingType, setCancellingType] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [pendingCancelId, setPendingCancelId] = useState(null);
    const [pendingCancelType, setPendingCancelType] = useState(null);
    useScrollOnUpdate(activeTab);

    useEffect(() => {
        if (isChecking) return;
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchHistory = async () => {
            setLoading(true);
            try {
                const [ordersRes, resRes, catRes] = await Promise.all([
                    fetchWithAuth('/api/orders').catch(() => ({ data: [] })),
                    fetchWithAuth('/api/reservations').catch(() => ({ data: [] })),
                    fetchWithAuth('/api/caterings').catch(() => ({ data: [] }))
                ]);
                
                // Sort by date descending
                const sortDesc = (a, b) => new Date(b.datetime) - new Date(a.datetime);
                
                setOrders((ordersRes.data || []).sort(sortDesc));
                setReservations((resRes.data || []).sort(sortDesc));
                setCaterings((catRes.data || []).sort(sortDesc));
            } catch (err) {
                console.error('Failed to fetch history', err);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [user, isChecking, navigate]);

    const openCancelConfirm = (id, type) => {
        setPendingCancelId(id);
        setPendingCancelType(type);
        setShowConfirmModal(true);
    };

    const closeCancelConfirm = () => {
        setShowConfirmModal(false);
        setPendingCancelId(null);
        setPendingCancelType(null);
    };

    const confirmCancellation = async () => {
        if (!pendingCancelId || !pendingCancelType) return;

        try {
            setCancellingId(pendingCancelId);
            setCancellingType(pendingCancelType);

            if (pendingCancelType === 'order') {
                await fetchWithAuth(`/api/orders/${pendingCancelId}`, {
                    method: 'DELETE'
                });
                setOrders(orders.filter(o => o.id !== pendingCancelId));
            } else if (pendingCancelType === 'reservation') {
                await fetchWithAuth(`/api/reservations/${pendingCancelId}`, {
                    method: 'DELETE'
                });
                setReservations(reservations.filter(r => r.id !== pendingCancelId));
            } else if (pendingCancelType === 'catering') {
                await fetchWithAuth(`/api/caterings/${pendingCancelId}`, {
                    method: 'DELETE'
                });
                setCaterings(caterings.filter(c => c.id !== pendingCancelId));
            }

            closeCancelConfirm();
        } catch (err) {
            alert('Failed to cancel: ' + err.message);
        } finally {
            setCancellingId(null);
            setCancellingType(null);
        }
    };

    const handleCancelOrder = (orderId) => {
        openCancelConfirm(orderId, 'order');
    };

    const handleCancelReservation = (reservationId) => {
        openCancelConfirm(reservationId, 'reservation');
    };

    const handleCancelEvent = (cateringId) => {
        openCancelConfirm(cateringId, 'catering');
    };

    if (isChecking || loading) {
        return (
            <div className="history-container loading">
                <div className="spinner"></div>
            </div>
        );
    }

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const renderStatusBadge = (status) => {
        let badgeClass = 'badge-pending';
        let Icon = Clock;

        if (['DELIVERED', 'APPROVED'].includes(status)) {
            badgeClass = 'badge-success';
            Icon = CheckCircle;
        } else if (['CANCELLED', 'REJECTED'].includes(status)) {
            badgeClass = 'badge-danger';
            Icon = XCircle;
        } else if (['OUT_FOR_DELIVERY', 'PREPARING'].includes(status)) {
            badgeClass = 'badge-progress';
            Icon = Package;
        }

        return (
            <div className={`status-badge ${badgeClass}`}>
                <Icon size={14} />
                <span>{status}</span>
            </div>
        );
    };

    return (
        <div className="history-container fade-in">
            <header className="history-hero-banner">
                <div className="container banner-content">
                    <h1 className="animate-fade-up">Your <span className="accent">History</span> & Tracking</h1>
                    <p className="animate-fade-up delay-1">Track your active orders and review past experiences.</p>
                </div>
            </header>

            <div className="container history-tabs-wrapper">
                <div className="history-tabs-bar glass-panel">
                    <button 
                        className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
                        onClick={() => setActiveTab('orders')}
                    >
                        <Package size={18} /> Orders
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'reservations' ? 'active' : ''}`}
                        onClick={() => setActiveTab('reservations')}
                    >
                        <Utensils size={18} /> Reservations
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'caterings' ? 'active' : ''}`}
                        onClick={() => setActiveTab('caterings')}
                    >
                        <Calendar size={18} /> Events
                    </button>
                </div>
            </div>

            <main className="container history-content-area" style={{ marginTop: '2rem' }}>
                {/* ORDERS TAB */}
                {activeTab === 'orders' && (
                    <div className="history-grid animate-fade-in">
                        {orders.length === 0 ? (
                            <div className="empty-state">No orders found.</div>
                        ) : (
                            orders.map(order => (
                                <div key={order.id} className="history-card glass-card">
                                    <div className="card-header">
                                        <div className="id-badge">Order #{order.id}</div>
                                        {renderStatusBadge(order.status)}
                                    </div>
                                    <div className="card-body">
                                        <div className="detail-row">
                                            <Calendar size={16} /> <span>{formatDate(order.datetime)}</span>
                                        </div>
                                        <div className="detail-row">
                                            <MapPin size={16} /> <span>{order.location}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span style={{opacity: 0.6}}>Type:</span> <span style={{textTransform:'capitalize'}}>{order.type.toLowerCase()}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span style={{opacity: 0.6}}>Payment:</span> <span style={{textTransform:'capitalize'}}>{order.paymentMethod.toLowerCase()}</span>
                                        </div>
                                    </div>
                                    <div className="card-footer">
                                        <span className="total-label">Total</span>
                                        <span className="total-amount">${order.total.toFixed(2)}</span>
                                    </div>
                                    {!['DELIVERED', 'CANCELLED'].includes(order.status) && (
                                        <button
                                            onClick={() => handleCancelOrder(order.id)}
                                            disabled={cancellingId === order.id}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                marginTop: '1rem',
                                                background: 'rgba(244, 67, 54, 0.2)',
                                                border: 'none',
                                                color: '#F44336',
                                                borderRadius: '8px',
                                                cursor: cancellingId === order.id ? 'not-allowed' : 'pointer',
                                                fontWeight: '600',
                                                fontSize: '0.875rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '0.5rem',
                                                transition: 'var(--transition)',
                                                opacity: cancellingId === order.id ? 0.5 : 1
                                            }}
                                        >
                                            <Trash2 size={16} />
                                            {cancellingId === order.id ? 'Cancelling...' : 'Cancel Order'}
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* RESERVATIONS TAB */}
                {activeTab === 'reservations' && (
                    <div className="history-grid animate-fade-in">
                        {reservations.length === 0 ? (
                            <div className="empty-state">No reservations found.</div>
                        ) : (
                            reservations.map(res => (
                                <div key={res.id} className="history-card glass-card">
                                    <div className="card-header">
                                        <div className="id-badge">Reservation #{res.id}</div>
                                        <div className={`status-badge badge-success`}><CheckCircle size={14}/><span>CONFIRMED</span></div>
                                    </div>
                                    <div className="card-body">
                                        <div className="detail-row">
                                            <Calendar size={16} /> <span>{formatDate(res.datetime)}</span>
                                        </div>
                                        <div className="detail-row">
                                            <Utensils size={16} /> <span>Table {res.table.id}</span>
                                        </div>
                                    </div>
                                    {res.total > 0 && (
                                        <div className="card-footer">
                                            <span className="total-label">Pre-Order Total</span>
                                            <span className="total-amount">${res.total.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <button
                                        onClick={() => handleCancelReservation(res.id)}
                                        disabled={cancellingId === res.id}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            marginTop: '1rem',
                                            background: 'rgba(244, 67, 54, 0.2)',
                                            border: 'none',
                                            color: '#F44336',
                                            borderRadius: '8px',
                                            cursor: cancellingId === res.id ? 'not-allowed' : 'pointer',
                                            fontWeight: '600',
                                            fontSize: '0.875rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem',
                                            transition: 'var(--transition)',
                                            opacity: cancellingId === res.id ? 0.5 : 1
                                        }}
                                    >
                                        <Trash2 size={16} />
                                        {cancellingId === res.id ? 'Cancelling...' : 'Cancel Reservation'}
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* EVENTS TAB */}
                {activeTab === 'caterings' && (
                    <div className="history-grid animate-fade-in">
                        {caterings.length === 0 ? (
                            <div className="empty-state">No event bookings found.</div>
                        ) : (
                            caterings.map(cat => (
                                <div key={cat.id} className="history-card glass-card">
                                    <div className="card-header">
                                        <div className="id-badge">Event #{cat.id}</div>
                                        {renderStatusBadge(cat.status)}
                                    </div>
                                    <div className="card-body">
                                        <h3 className="event-name">{cat.eventName}</h3>
                                        <div className="detail-row">
                                            <Calendar size={16} /> <span>{formatDate(cat.datetime)}</span>
                                        </div>
                                        <div className="detail-row">
                                            <MapPin size={16} /> <span>{cat.location}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span style={{opacity: 0.6}}>Guests:</span> <span>{cat.guestCount}</span>
                                        </div>
                                    </div>
                                    <div className="card-footer">
                                        <span className="total-label">Total</span>
                                        <span className="total-amount">${cat.total.toFixed(2)}</span>
                                    </div>
                                    {!['APPROVED', 'REJECTED'].includes(cat.status) && (
                                        <button
                                            onClick={() => handleCancelEvent(cat.id)}
                                            disabled={cancellingId === cat.id}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                marginTop: '1rem',
                                                background: 'rgba(244, 67, 54, 0.2)',
                                                border: 'none',
                                                color: '#F44336',
                                                borderRadius: '8px',
                                                cursor: cancellingId === cat.id ? 'not-allowed' : 'pointer',
                                                fontWeight: '600',
                                                fontSize: '0.875rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '0.5rem',
                                                transition: 'var(--transition)',
                                                opacity: cancellingId === cat.id ? 0.5 : 1
                                            }}
                                        >
                                            <Trash2 size={16} />
                                            {cancellingId === cat.id ? 'Cancelling...' : 'Cancel Event'}
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </main>

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'rgba(20, 20, 30, 0.95)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        padding: '2rem',
                        maxWidth: '400px',
                        width: '90%'
                    }}>
                        <h2 style={{ marginBottom: '1rem', marginTop: 0, color: 'var(--color-text)' }}>
                            Cancel {pendingCancelType === 'order' ? 'Order' : pendingCancelType === 'reservation' ? 'Reservation' : 'Event'}?
                        </h2>
                        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem', lineHeight: 1.6 }}>
                            Are you sure you want to cancel this {pendingCancelType === 'order' ? 'order' : pendingCancelType === 'reservation' ? 'reservation' : 'event'}? This action cannot be undone.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                onClick={closeCancelConfirm}
                                style={{
                                    flex: 1,
                                    padding: '0.75rem',
                                    background: 'rgba(255,255,255,0.1)',
                                    color: 'var(--color-text)',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'var(--transition)'
                                }}
                            >
                                Keep It
                            </button>
                            <button
                                onClick={confirmCancellation}
                                disabled={cancellingId === pendingCancelId}
                                style={{
                                    flex: 1,
                                    padding: '0.75rem',
                                    background: 'rgba(244, 67, 54, 0.3)',
                                    color: '#F44336',
                                    border: '1px solid rgba(244, 67, 54, 0.5)',
                                    borderRadius: '8px',
                                    fontWeight: '600',
                                    cursor: cancellingId === pendingCancelId ? 'not-allowed' : 'pointer',
                                    transition: 'var(--transition)',
                                    opacity: cancellingId === pendingCancelId ? 0.6 : 1
                                }}
                            >
                                {cancellingId === pendingCancelId ? 'Cancelling...' : 'Yes, Cancel'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default History;
