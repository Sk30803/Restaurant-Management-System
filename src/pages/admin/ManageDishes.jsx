import React, { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import { fetchWithAuth } from '../../api';
import { X, Trash2, Edit2, Plus } from 'lucide-react'; 

const ManageDishes = () => {
    const [dishes, setDishes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingDish, setEditingDish] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        cuisine: '',
        category: 'Main Course',
        imageUrl: ''
    });

    const categories = ['Starter', 'Main Course', 'Dessert', 'Drink', 'Appetizer', 'Salad', 'Soup'];

    const loadDishes = () => {
        setLoading(true);
        fetchWithAuth('/api/dishes')
            .then((res) => setDishes(res.data || []))
            .catch((err) => { 
                console.error(err); 
                setError('Failed to load dishes.');
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadDishes();
    }, []);

    const resetForm = () => {
        setFormData({
            name: '',
            price: '',
            cuisine: '',
            category: 'Main Course',
            imageUrl: ''
        });
        setEditingDish(null);
        setError(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'price' ? parseFloat(value) || '' : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        // Validation
        if (!formData.name.trim()) {
            setError('Dish name is required.');
            return;
        }
        if (!formData.price || formData.price <= 0) {
            setError('Price must be greater than 0.');
            return;
        }
        if (!formData.cuisine.trim()) {
            setError('Cuisine type is required.');
            return;
        }

        try {
            if (editingDish) {
                // Update existing dish
                await fetchWithAuth(`/api/dishes/${editingDish.id}`, {
                    method: 'PUT',
                    body: JSON.stringify(formData)
                });
                setSuccess('Dish updated successfully!');
            } else {
                // Create new dish
                await fetchWithAuth('/api/dishes', {
                    method: 'POST',
                    body: JSON.stringify(formData)
                });
                setSuccess('Dish created successfully!');
            }
            
            // Reload dishes
            await new Promise(resolve => setTimeout(resolve, 500));
            loadDishes();
            setShowForm(false);
            resetForm();
        } catch (err) {
            setError(err.message || 'Operation failed.');
        }
    };

    const handleEdit = (dish) => {
        setEditingDish(dish);
        setFormData({
            name: dish.name,
            price: dish.price,
            cuisine: dish.cuisine,
            category: dish.category,
            imageUrl: dish.imageUrl || ''
        });
        setShowForm(true);
        setError(null);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this dish? This action cannot be undone.')) {
            return;
        }

        try {
            await fetchWithAuth(`/api/dishes/${id}`, {
                method: 'DELETE'
            });
            setSuccess('Dish deleted successfully!');
            loadDishes();
        } catch (err) {
            setError('Failed to delete dish: ' + err.message);
        }
    };

    const handleCloseForm = () => {
        setShowForm(false);
        resetForm();
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Manage Dishes</h1>
                <button
                    onClick={() => setShowForm(true)}
                    style={{
                        background: 'var(--color-accent)',
                        color: 'black',
                        border: 'none',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'var(--transition)'
                    }}
                >
                    <Plus size={20} />
                    Add New Dish
                </button>
            </div>

            {/* Form Modal */}
            {showForm && (
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
                    <Card style={{ width: '90%', maxWidth: '500px', padding: '2rem', backgroundColor: 'rgba(20, 20, 30, 0.95)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2>{editingDish ? 'Edit Dish' : 'Create New Dish'}</h2>
                            <button
                                onClick={handleCloseForm}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--color-text-secondary)',
                                    cursor: 'pointer',
                                    padding: 0
                                }}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {error && (
                            <div style={{
                                background: 'rgba(244, 67, 54, 0.2)',
                                color: '#F44336',
                                padding: '1rem',
                                borderRadius: '8px',
                                marginBottom: '1rem',
                                fontSize: '0.875rem'
                            }}>
                                {error}
                            </div>
                        )}

                        {success && (
                            <div style={{
                                background: 'rgba(76, 175, 80, 0.2)',
                                color: '#4CAF50',
                                padding: '1rem',
                                borderRadius: '8px',
                                marginBottom: '1rem',
                                fontSize: '0.875rem'
                            }}>
                                {success}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                                    Dish Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Wagyu Gold Burger"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        backgroundColor: 'rgba(255,255,255,0.05)',
                                        color: 'var(--color-text)',
                                        fontFamily: 'inherit',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                                        Price ($) *
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '8px',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            backgroundColor: 'rgba(255,255,255,0.05)',
                                            color: 'var(--color-text)',
                                            fontFamily: 'inherit',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                                        Category *
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '8px',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            backgroundColor: 'rgba(255,255,255,0.05)',
                                            color: 'var(--color-text)',
                                            fontFamily: 'inherit',
                                            boxSizing: 'border-box'
                                        }}
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                                    Cuisine Type *
                                </label>
                                <input
                                    type="text"
                                    name="cuisine"
                                    value={formData.cuisine}
                                    onChange={handleInputChange}
                                    placeholder="e.g., French, Italian, Asian"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        backgroundColor: 'rgba(255,255,255,0.05)',
                                        color: 'var(--color-text)',
                                        fontFamily: 'inherit',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                                    Image URL (optional)
                                </label>
                                <input
                                    type="url"
                                    name="imageUrl"
                                    value={formData.imageUrl}
                                    onChange={handleInputChange}
                                    placeholder="https://example.com/image.jpg"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        backgroundColor: 'rgba(255,255,255,0.05)',
                                        color: 'var(--color-text)',
                                        fontFamily: 'inherit',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button
                                    type="submit"
                                    style={{
                                        flex: 1,
                                        padding: '0.75rem',
                                        background: 'var(--color-accent)',
                                        color: 'black',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'var(--transition)'
                                    }}
                                >
                                    {editingDish ? 'Update Dish' : 'Create Dish'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCloseForm}
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
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}

            {/* Dishes Table */}
            <Card className="glass-panel">
                {loading ? (
                    <p style={{ color: 'var(--color-text-secondary)', padding: '2rem' }}>Loading dishes...</p>
                ) : dishes.length === 0 ? (
                    <p style={{ color: 'var(--color-text-secondary)', padding: '2rem' }}>No dishes found. Create your first dish!</p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                    <th style={{ padding: '1rem', color: 'var(--color-accent)' }}>Name</th>
                                    <th style={{ padding: '1rem', color: 'var(--color-accent)' }}>Price</th>
                                    <th style={{ padding: '1rem', color: 'var(--color-accent)' }}>Category</th>
                                    <th style={{ padding: '1rem', color: 'var(--color-accent)' }}>Cuisine</th>
                                    <th style={{ padding: '1rem', color: 'var(--color-accent)' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dishes.map((dish) => (
                                    <tr key={dish.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '1rem' }}>{dish.name}</td>
                                        <td style={{ padding: '1rem' }}>${dish.price.toFixed(2)}</td>
                                        <td style={{ padding: '1rem' }}>{dish.category}</td>
                                        <td style={{ padding: '1rem' }}>{dish.cuisine}</td>
                                        <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                            <button 
                                                onClick={() => handleEdit(dish)}
                                                style={{
                                                    background: 'rgba(33, 150, 243, 0.2)',
                                                    border: 'none',
                                                    color: '#2196F3',
                                                    padding: '0.25rem 0.5rem',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    fontSize: '0.75rem',
                                                    transition: 'var(--transition)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.25rem'
                                                }}
                                            >
                                                <Edit2 size={14} />
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(dish.id)}
                                                style={{
                                                    background: 'rgba(244, 67, 54, 0.2)',
                                                    border: 'none',
                                                    color: '#F44336',
                                                    padding: '0.25rem 0.5rem',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    fontSize: '0.75rem',
                                                    transition: 'var(--transition)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.25rem'
                                                }}
                                            >
                                                <Trash2 size={14} />
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default ManageDishes;
