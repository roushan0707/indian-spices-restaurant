import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI, bookingAPI, menuAPI } from '../api';
import { FIXED_MENU_ITEMS, FIXED_CATEGORIES } from '../menuData';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import {
  LogOut, ShoppingBag, Calendar, Menu as MenuIcon,
  DollarSign, Plus, Pencil, Trash2, X, AlertCircle
} from 'lucide-react';

// ── Parse FastAPI errors (handles array detail, string detail, plain objects) ─
const parseError = (error) => {
  const data = error?.response?.data;
  if (!data) return error?.message || 'Unknown error';
  if (Array.isArray(data.detail)) {
    return data.detail
      .map(e => `${Array.isArray(e.loc) ? e.loc.join(' → ') + ': ' : ''}${e.msg}`)
      .join(' | ');
  }
  if (typeof data.detail === 'string') return data.detail;
  if (typeof data.message === 'string') return data.message;
  if (typeof data === 'string') return data;
  try { return JSON.stringify(data); } catch { return 'Unknown error'; }
};

// ── Modal ─────────────────────────────────────────────────────────────────────
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// ── Add Category Form ─────────────────────────────────────────────────────────
// MenuCategory model: { name: str, description: str, items: [] }
const AddCategoryForm = ({ onSubmit, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) { toast.error('Category name is required'); return; }
    if (!description.trim()) { toast.error('Description is required'); return; }
    setSubmitting(true);
    try { await onSubmit({ name: name.trim(), description: description.trim(), items: [] }); }
    finally { setSubmitting(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category Name <span className="text-red-500">*</span>
        </label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Starters, Main Course, Desserts..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          autoFocus
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description <span className="text-red-500">*</span>
        </label>
        <input
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="e.g. Delicious appetizers to start your meal"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>
      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={submitting} className="flex-1 bg-orange-600 hover:bg-orange-700 text-white">
          {submitting ? 'Adding...' : 'Add Category'}
        </Button>
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
      </div>
    </form>
  );
};

// ── Menu Item Form ─────────────────────────────────────────────────────────────
const MenuItemForm = ({ initialData = {}, categories = [], onSubmit, onClose, isEdit }) => {
  const initId = initialData.category_id
    ? String(initialData.category_id)
    : categories.length > 0 ? String(categories[0].id) : '';

  const [form, setForm] = useState({
    name: initialData.name || '',
    description: initialData.description || '',
    price: initialData.price !== undefined ? String(initialData.price) : '',
    category_id: initId,
    category: '',   // resolved by useEffect
    available: initialData.available !== undefined ? initialData.available : true,
    is_vegetarian: initialData.is_vegetarian || false,
    is_spicy: initialData.is_spicy || false,
    image: initialData.image || '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Resolve category NAME from category_id every time categories loads or id changes
  useEffect(() => {
    if (!categories.length) return;
    const activeId = form.category_id || String(categories[0].id);
    const matched = categories.find(c => String(c.id) === activeId);
    const resolvedName = matched?.name || initialData.category || '';
    setForm(prev => ({
      ...prev,
      category_id: activeId,
      category: resolvedName,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories]);

  // User picks a different category from dropdown
  const handleCategoryChange = (e) => {
    const selectedId = e.target.value;
    const selectedCat = categories.find(c => String(c.id) === selectedId);
    setError('');
    setForm(prev => ({
      ...prev,
      category_id: selectedId,
      category: selectedCat?.name || '',
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setError('');
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate all required fields matching Pydantic model
    if (!form.name.trim()) { setError('Item name is required.'); return; }
    if (!form.description.trim()) { setError('Description is required.'); return; }
    if (!form.price || isNaN(parseFloat(form.price)) || parseFloat(form.price) <= 0) {
      setError('Enter a valid price greater than 0.'); return;
    }
    if (!form.category_id) { setError('Please select a category.'); return; }
    if (!form.category) { setError('Category name could not be resolved. Try reselecting.'); return; }

    setSubmitting(true);
    try {
      // Build body matching MenuItem Pydantic model exactly
      const body = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: parseFloat(form.price),
        category: form.category,          // NAME string (required by model)
        available: form.available,
        is_vegetarian: form.is_vegetarian,
        is_spicy: form.is_spicy,
        spicy: form.is_spicy ? 'Yes' : 'None',
        image: form.image.trim() || null,
      };

      console.log('[MenuItemForm] Submitting body:', body, '| category_id param:', form.category_id);
      await onSubmit(body, form.category_id);
    } finally {
      setSubmitting(false);
    }
  };

  if (categories.length === 0) {
    return (
      <div className="text-center py-6">
        <AlertCircle className="h-10 w-10 text-orange-400 mx-auto mb-3" />
        <p className="text-gray-700 font-medium mb-1">No categories found</p>
        <p className="text-sm text-gray-500 mb-4">Create a category first, then add items to it.</p>
        <Button onClick={onClose} className="bg-orange-600 hover:bg-orange-700 text-white">
          Close &amp; Add Category First
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2 text-sm">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Category select — value = MongoDB _id, display = name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category <span className="text-red-500">*</span>
        </label>
        <select
          value={form.category_id}
          onChange={handleCategoryChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
        >
          <option value="" disabled>— Select a category —</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Item Name <span className="text-red-500">*</span>
        </label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="e.g. Butter Chicken"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      {/* Description — REQUIRED by Pydantic model (no default) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={2}
          placeholder="e.g. Tender chicken in rich buttery tomato sauce"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
        />
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Price (₹) <span className="text-red-500">*</span>
        </label>
        <input
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          placeholder="e.g. 350"
          min="1"
          step="0.01"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      {/* Image URL (optional) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Image URL <span className="text-gray-400 text-xs">(optional)</span>
        </label>
        <input
          name="image"
          value={form.image}
          onChange={handleChange}
          placeholder="https://..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      {/* Checkboxes */}
      <div className="flex gap-5">
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input type="checkbox" name="available" checked={form.available} onChange={handleChange} className="accent-orange-500 w-4 h-4" />
          Available
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input type="checkbox" name="is_vegetarian" checked={form.is_vegetarian} onChange={handleChange} className="accent-green-500 w-4 h-4" />
          Vegetarian
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input type="checkbox" name="is_spicy" checked={form.is_spicy} onChange={handleChange} className="accent-red-500 w-4 h-4" />
          Spicy
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={submitting} className="flex-1 bg-orange-600 hover:bg-orange-700 text-white">
          {submitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Item'}
        </Button>
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
      </div>
    </form>
  );
};

// ── Confirm Delete ────────────────────────────────────────────────────────────
const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, itemName, loading }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Delete Menu Item">
    <p className="text-gray-600 mb-6">
      Are you sure you want to delete <strong>"{itemName}"</strong>?
      This removes it from your website immediately.
    </p>
    <div className="flex gap-3">
      <Button onClick={onConfirm} disabled={loading} className="flex-1 bg-red-600 hover:bg-red-700 text-white">
        <Trash2 className="h-4 w-4 mr-2" />
        {loading ? 'Deleting...' : 'Yes, Delete'}
      </Button>
      <Button variant="outline" onClick={onClose} className="flex-1" disabled={loading}>Cancel</Button>
    </div>
  </Modal>
);

// ── Status colour helper ──────────────────────────────────────────────────────
const getStatusColor = (status) => ({
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  preparing: 'bg-purple-100 text-purple-800',
  ready: 'bg-green-100 text-green-800',
  delivered: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
  completed: 'bg-green-100 text-green-800',
  received: 'bg-orange-100 text-orange-800',
}[status] || 'bg-gray-100 text-gray-800');


// ── Fixed Menu Manager Component ─────────────────────────────────────────────
// Shows all fixed menu items — admin can ONLY edit price and availability
const FixedMenuManager = ({ menuCategories, onRefresh }) => {
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);

  // Build lookup: name → backend item (price, available, id)
  const backendLookup = {};
  menuCategories.forEach(cat => {
    (cat.items || []).forEach(item => {
      backendLookup[item.name.toLowerCase().trim()] = {
        price: item.price,
        available: item.available,
        id: item.id,
        category_id: cat.id,
        category: cat.name,
      };
    });
  });

  // Merge fixed items with backend data
  const mergedItems = FIXED_MENU_ITEMS.map(fixed => {
    const backend = backendLookup[fixed.name.toLowerCase().trim()];
    return {
      ...fixed,
      backendId: backend?.id || null,
      categoryId: backend?.category_id || null,
      backendCategory: backend?.category || fixed.category,
      price: backend?.price ?? null,
      available: backend?.available ?? true,
      existsInBackend: !!backend,
    };
  });

  const handleSave = async (item, newPrice, newAvailable) => {
    setSaving(true);
    try {
      if (item.existsInBackend && item.backendId) {
        // ── Update existing item — only price and available ──────────────
        await menuAPI.updateItem(item.backendId, {
          name: item.name,
          description: item.description,
          price: parseFloat(newPrice),
          category: item.backendCategory,
          available: newAvailable,
          is_vegetarian: item.is_vegetarian,
          is_spicy: item.is_spicy,
          spicy: item.spicy,
        });
        toast.success(`"${item.name}" updated!`);
      } else {
        // ── Item not in backend yet ──────────────────────────────────────
        // Find matching category, or AUTO-CREATE it if it doesn't exist
        let matchCat = menuCategories.find(
          c => c.name.toLowerCase() === item.category.toLowerCase()
        );

        if (!matchCat) {
          // Auto-create the category so admin doesn't have to do it manually
          toast.loading(`Creating category "${item.category}"...`);
          const catDescriptions = {
            'Starters': 'Delicious appetizers to start your meal',
            'Main Course': 'Hearty and flavourful main dishes',
            'Breads & Rice': 'Fresh breads and aromatic rice dishes',
            'Desserts': 'Sweet treats to end your meal',
            'Drinks': 'Refreshing beverages and traditional drinks',
          };
          await menuAPI.createCategory({
            name: item.category,
            description: catDescriptions[item.category] || `${item.category} items`,
            items: [],
          });
          toast.dismiss();
          // Re-fetch categories to get the new category id
          const catRes = await menuAPI.getCategories();
          const updatedCategories = catRes.data || [];
          matchCat = updatedCategories.find(
            c => c.name.toLowerCase() === item.category.toLowerCase()
          );
        }

        if (!matchCat) {
          toast.error('Failed to create category. Please try again.');
          setSaving(false);
          return;
        }

        await menuAPI.createItem({
          name: item.name,
          description: item.description,
          price: parseFloat(newPrice),
          category: matchCat.name,
          available: newAvailable,
          is_vegetarian: item.is_vegetarian,
          is_spicy: item.is_spicy,
          spicy: item.spicy,
        }, matchCat.id);
        toast.success(`"${item.name}" saved with price ₹${newPrice}!`);
      }
      setEditingItem(null);
      await onRefresh();
    } catch (error) {
      console.error('Fixed menu save error:', error?.response?.data);
      toast.error(`Failed to save: ${error?.response?.data?.detail || error.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Group by category
  const grouped = FIXED_CATEGORIES.reduce((acc, cat) => {
    acc[cat] = mergedItems.filter(i => i.category === cat);
    return acc;
  }, {});

  const categoryEmoji = { Starters: '🥗', 'Main Course': '🍛', 'Breads & Rice': '🍚', Desserts: '🍮', Drinks: '🥤' };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Fixed Menu Items</CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Edit <strong>price</strong> and <strong>availability</strong> only. Images and names are fixed.
            </p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-700 max-w-xs">
            ⚠️ To activate items, first create matching categories in <strong>Custom Menu</strong> tab.
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-10">
          {FIXED_CATEGORIES.map(cat => (
            <div key={cat}>
              <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>{categoryEmoji[cat] || '🍽️'}</span> {cat}
                <span className="text-xs font-normal text-gray-400">({grouped[cat]?.length || 0} items)</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(grouped[cat] || []).map(item => (
                  <div
                    key={item.fixedId}
                    className={`border rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow ${
                      !item.available ? 'opacity-60' : ''
                    }`}
                  >
                    {/* Image */}
                    <div className="relative h-36 overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      {!item.existsInBackend && (
                        <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center">
                          <span className="text-white text-xs font-bold bg-gray-800/80 px-2 py-1 rounded-full">
                            Price not set
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-3">
                      <div className="flex items-start justify-between mb-1">
                        <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${item.available ? 'bg-green-500' : 'bg-red-400'}`} />
                      </div>

                      {editingItem?.fixedId === item.fixedId ? (
                        /* Edit Mode */
                        <EditPriceForm
                          item={item}
                          onSave={handleSave}
                          onCancel={() => setEditingItem(null)}
                          saving={saving}
                        />
                      ) : (
                        /* View Mode */
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-lg font-bold text-orange-600">
                              {item.price !== null ? `₹${item.price}` : 'No price set'}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              item.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {item.available ? 'Available' : 'Unavailable'}
                            </span>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => setEditingItem(item)}
                            className="w-full bg-orange-600 hover:bg-orange-700 text-white text-xs"
                          >
                            ✏️ Edit Price & Availability
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Inline edit form for price + availability only
const EditPriceForm = ({ item, onSave, onCancel, saving }) => {
  const [price, setPrice] = useState(item.price !== null ? String(item.price) : '');
  const [available, setAvailable] = useState(item.available);

  return (
    <div className="space-y-2">
      <div>
        <label className="text-xs text-gray-500 font-medium">Price (₹)</label>
        <input
          type="number"
          value={price}
          onChange={e => setPrice(e.target.value)}
          placeholder="e.g. 350"
          min="1"
          className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm mt-0.5 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>
      <div>
        <label className="text-xs text-gray-500 font-medium">Availability</label>
        <div className="flex gap-2 mt-1">
          <button
            onClick={() => setAvailable(true)}
            className={`flex-1 text-xs py-1.5 rounded-lg border font-medium transition-colors ${
              available ? 'bg-green-500 text-white border-green-500' : 'bg-white text-gray-600 border-gray-300 hover:border-green-400'
            }`}
          >
            ✓ Available
          </button>
          <button
            onClick={() => setAvailable(false)}
            className={`flex-1 text-xs py-1.5 rounded-lg border font-medium transition-colors ${
              !available ? 'bg-red-500 text-white border-red-500' : 'bg-white text-gray-600 border-gray-300 hover:border-red-400'
            }`}
          >
            ✗ Unavailable
          </button>
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        <Button
          size="sm"
          onClick={() => onSave(item, price, available)}
          disabled={saving || !price || parseFloat(price) <= 0}
          className="flex-1 bg-orange-600 hover:bg-orange-700 text-white text-xs py-1.5"
        >
          {saving ? 'Saving...' : 'Save'}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={onCancel}
          disabled={saving}
          className="flex-1 text-xs py-1.5"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

// ── AdminDashboard ────────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, pendingBookings: 0 });
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [menuCategories, setMenuCategories] = useState([]);

  const [addItemModal, setAddItemModal] = useState(false);
  const [editItemModal, setEditItemModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [addCategoryModal, setAddCategoryModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [preselectedCategoryId, setPreselectedCategoryId] = useState('');

  useEffect(() => {
    const isAdmin = localStorage.getItem('is_admin');
    if (!isAdmin || isAdmin === 'false') { navigate('/admin/login'); return; }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersRes, bookingsRes, menuRes] = await Promise.all([
        orderAPI.getAll(),
        bookingAPI.getAll(),
        menuAPI.getCategories(),
      ]);
      const ordersData = ordersRes.data || [];
      const bookingsData = bookingsRes.data || [];
      const menuData = menuRes.data || [];

      console.log('[Dashboard] Categories:', menuData.map(c => ({ id: c.id, name: c.name, itemCount: c.items?.length })));

      setOrders(ordersData);
      setBookings(bookingsData);
      setMenuCategories(menuData);
      setStats({
        totalOrders: ordersData.length,
        totalRevenue: ordersData
          .filter(o => o.payment_status === 'completed')
          .reduce((s, o) => s + Number(o.total_amount || 0), 0),
        pendingBookings: bookingsData.filter(b => b.status === 'pending').length,
      });
    } catch (error) {
      console.error('fetchData error:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    ['token', 'username', 'is_admin'].forEach(k => localStorage.removeItem(k));
    navigate('/admin/login');
    toast.success('Logged out successfully');
  };

  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    try {
      await orderAPI.updateStatus(orderId, newStatus);
      toast.success('Order status updated');
      fetchData();
    } catch (error) {
      toast.error(`Failed to update order: ${parseError(error)}`);
    }
  };

  const handleBookingStatusUpdate = async (bookingId, newStatus) => {
    try {
      await bookingAPI.updateStatus(bookingId, newStatus);
      toast.success('Booking status updated');
      fetchData();
    } catch (error) {
      toast.error(`Failed to update booking: ${parseError(error)}`);
    }
  };

  // ── Category ──────────────────────────────────────────────────────────────
  const handleAddCategory = async (categoryData) => {
    try {
      console.log('[Dashboard] Creating category:', categoryData);
      await menuAPI.createCategory(categoryData);
      toast.success(`Category "${categoryData.name}" added!`);
      setAddCategoryModal(false);
      await fetchData();
    } catch (error) {
      console.error('[Dashboard] Add category error:', error?.response?.data);
      toast.error(`Failed to add category: ${parseError(error)}`);
    }
  };

  // ── Menu Items ────────────────────────────────────────────────────────────
  // onSubmit from MenuItemForm now passes (body, category_id) separately
  const handleAddItem = async (body, categoryId) => {
    try {
      console.log('[Dashboard] POST /menu/item?category_id=' + categoryId, '| body:', body);
      await menuAPI.createItem(body, categoryId);
      toast.success(`"${body.name}" added to menu! Live on your website.`);
      setAddItemModal(false);
      setPreselectedCategoryId('');
      await fetchData();
    } catch (error) {
      console.error('[Dashboard] Add item error:', error?.response?.data);
      toast.error(`Failed to add menu item: ${parseError(error)}`);
    }
  };

  const handleEditItem = async (body, categoryId) => {
    try {
      console.log('[Dashboard] PUT /menu/item/' + selectedItem.id, '| body:', body);
      await menuAPI.updateItem(selectedItem.id, body);
      toast.success(`"${body.name}" updated! Live on your website.`);
      setEditItemModal(false);
      setSelectedItem(null);
      await fetchData();
    } catch (error) {
      console.error('[Dashboard] Edit item error:', error?.response?.data);
      toast.error(`Failed to update item: ${parseError(error)}`);
    }
  };

  const handleDeleteItem = async () => {
    setDeleteLoading(true);
    try {
      await menuAPI.deleteItem(selectedItem.id);
      toast.success(`"${selectedItem.name}" removed from menu.`);
      setDeleteModal(false);
      setSelectedItem(null);
      await fetchData();
    } catch (error) {
      console.error('[Dashboard] Delete item error:', error?.response?.data);
      toast.error(`Failed to delete item: ${parseError(error)}`);
    } finally {
      setDeleteLoading(false);
    }
  };

  const openAddItemModal = (categoryId = '') => {
    setPreselectedCategoryId(String(categoryId));
    setSelectedItem(null);
    setAddItemModal(true);
  };

  const openEditModal = (item, categoryId) => {
    setSelectedItem({ ...item, category_id: String(categoryId) });
    setEditItemModal(true);
  };

  const openDeleteModal = (item) => {
    setSelectedItem(item);
    setDeleteModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const totalMenuItems = menuCategories.reduce((s, c) => s + (c.items?.length || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-500">Indian Spices Restaurant</p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="h-4 w-4 mr-2" />Logout
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Orders', value: stats.totalOrders, icon: <ShoppingBag className="h-4 w-4 text-orange-600" /> },
            { label: 'Total Revenue', value: `₹${stats.totalRevenue.toFixed(2)}`, icon: <DollarSign className="h-4 w-4 text-green-600" /> },
            { label: 'Pending Bookings', value: stats.pendingBookings, icon: <Calendar className="h-4 w-4 text-blue-600" /> },
            { label: 'Menu Items', value: totalMenuItems, icon: <MenuIcon className="h-4 w-4 text-purple-600" /> },
          ].map(({ label, value, icon }) => (
            <Card key={label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{label}</CardTitle>
                {icon}
              </CardHeader>
              <CardContent><div className="text-2xl font-bold">{value}</div></CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-4">
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="menu">Custom Menu</TabsTrigger>
            <TabsTrigger value="fixed">Fixed Menu</TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader><CardTitle>Recent Orders</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No orders yet</p>
                  ) : orders.slice(0, 10).map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold">{order.order_number}</p>
                          <p className="text-sm text-gray-600">{order.customer_name}</p>
                          <p className="text-sm text-gray-500">{order.customer_phone}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-orange-600">₹{order.total_amount}</p>
                          <p className="text-sm text-gray-500">{order.items?.length || 0} items</p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3 flex-wrap">
                        <Badge className={getStatusColor(order.order_status)}>{order.order_status}</Badge>
                        <Badge className={getStatusColor(order.payment_status)}>{order.payment_status}</Badge>
                      </div>
                      <div className="flex gap-2 mt-3 flex-wrap">
                        <Button size="sm" onClick={() => handleOrderStatusUpdate(order.id, 'preparing')} disabled={order.order_status !== 'received'}>Start Preparing</Button>
                        <Button size="sm" variant="outline" onClick={() => handleOrderStatusUpdate(order.id, 'ready')} disabled={order.order_status !== 'preparing'}>Mark Ready</Button>
                        <Button size="sm" variant="outline" onClick={() => handleOrderStatusUpdate(order.id, 'delivered')} disabled={order.order_status !== 'ready'}>Delivered</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <Card>
              <CardHeader><CardTitle>Table Bookings</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookings.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No bookings yet</p>
                  ) : bookings.slice(0, 10).map((booking) => (
                    <div key={booking.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold">{booking.name}</p>
                          <p className="text-sm text-gray-600">{booking.email}</p>
                          <p className="text-sm text-gray-500">{booking.phone}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{booking.date}</p>
                          <p className="text-sm text-gray-500">{booking.time}</p>
                          <p className="text-sm text-gray-500">{booking.guests} guests</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" onClick={() => handleBookingStatusUpdate(booking.id, 'confirmed')} disabled={booking.status !== 'pending'}>Confirm</Button>
                        <Button size="sm" variant="destructive" onClick={() => handleBookingStatusUpdate(booking.id, 'cancelled')}>Cancel</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Menu Tab */}
          <TabsContent value="menu">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center flex-wrap gap-3">
                  <CardTitle>Menu Management</CardTitle>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setAddCategoryModal(true)} className="border-orange-300 text-orange-700 hover:bg-orange-50">
                      <Plus className="h-4 w-4 mr-1" />Add Category
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => openAddItemModal()}
                      className="bg-orange-600 hover:bg-orange-700 text-white"
                      disabled={menuCategories.length === 0}
                      title={menuCategories.length === 0 ? 'Add a category first' : ''}
                    >
                      <Plus className="h-4 w-4 mr-1" />Add Menu Item
                    </Button>
                  </div>
                </div>
                {menuCategories.length === 0 && (
                  <div className="mt-3 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-sm text-amber-800">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span><strong>Step 1:</strong> Click "Add Category" first (e.g. "Starters"), then add menu items.</span>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                {menuCategories.length === 0 ? (
                  <div className="text-center py-12">
                    <MenuIcon className="h-12 w-12 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 mb-4">Your menu is empty. Start by adding a category.</p>
                    <Button onClick={() => setAddCategoryModal(true)} className="bg-orange-600 hover:bg-orange-700 text-white">
                      <Plus className="h-4 w-4 mr-2" />Add First Category
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {menuCategories.map((category) => (
                      <div key={category.id}>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-orange-500 inline-block" />
                            {category.name}
                            <span className="text-xs font-normal text-gray-400">({category.items?.length || 0} items)</span>
                          </h3>
                          <Button size="sm" variant="ghost" onClick={() => openAddItemModal(category.id)} className="text-xs text-orange-600 hover:bg-orange-50">
                            <Plus className="h-3 w-3 mr-1" />Add to this category
                          </Button>
                        </div>

                        {(!category.items || category.items.length === 0) ? (
                          <p className="text-sm text-gray-400 italic pl-4 py-2">No items yet — click "Add to this category".</p>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {category.items.map((item) => (
                              <div key={item.id} className="border rounded-lg p-3 flex justify-between items-start bg-white hover:shadow-sm transition-shadow">
                                <div className="flex-1 min-w-0 pr-2">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <p className="font-medium text-gray-900">{item.name}</p>
                                    {item.is_vegetarian && <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-medium">Veg</span>}
                                    {item.is_spicy && <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-medium">🌶 Spicy</span>}
                                  </div>
                                  {item.description && <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{item.description}</p>}
                                  <p className="text-sm font-bold text-orange-600 mt-1">₹{item.price}</p>
                                </div>
                                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                  <Badge variant={item.available ? 'default' : 'destructive'} className="text-xs">
                                    {item.available ? 'Available' : 'Unavailable'}
                                  </Badge>
                                  <div className="flex gap-1">
                                    <button onClick={() => openEditModal(item, category.id)} className="p-1.5 rounded-md text-blue-600 hover:bg-blue-50 transition-colors" title="Edit">
                                      <Pencil className="h-3.5 w-3.5" />
                                    </button>
                                    <button onClick={() => openDeleteModal(item)} className="p-1.5 rounded-md text-red-500 hover:bg-red-50 transition-colors" title="Delete">
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Fixed Menu Tab ── */}
          <TabsContent value="fixed">
            <FixedMenuManager menuCategories={menuCategories} onRefresh={fetchData} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <Modal isOpen={addCategoryModal} onClose={() => setAddCategoryModal(false)} title="Add New Category">
        <AddCategoryForm onSubmit={handleAddCategory} onClose={() => setAddCategoryModal(false)} />
      </Modal>

      <Modal isOpen={addItemModal} onClose={() => { setAddItemModal(false); setPreselectedCategoryId(''); }} title="Add Menu Item">
        <MenuItemForm
          categories={menuCategories}
          initialData={{ category_id: preselectedCategoryId }}
          onSubmit={handleAddItem}
          onClose={() => { setAddItemModal(false); setPreselectedCategoryId(''); }}
          isEdit={false}
        />
      </Modal>

      <Modal isOpen={editItemModal} onClose={() => { setEditItemModal(false); setSelectedItem(null); }} title="Edit Menu Item">
        <MenuItemForm
          categories={menuCategories}
          initialData={selectedItem || {}}
          onSubmit={handleEditItem}
          onClose={() => { setEditItemModal(false); setSelectedItem(null); }}
          isEdit={true}
        />
      </Modal>

      <ConfirmDeleteModal
        isOpen={deleteModal}
        onClose={() => { setDeleteModal(false); setSelectedItem(null); }}
        onConfirm={handleDeleteItem}
        itemName={selectedItem?.name}
        loading={deleteLoading}
      />
    </div>
  );
};

export default AdminDashboard;