import { useState, useRef, useEffect } from 'react';
import { useForm, usePage, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import Layout from '@/Layouts/Layout'; // Adjust path to your layout

// Quill Rich Text Editor Component
const QuillEditor = ({ value, onChange, placeholder = 'Start writing...' }) => {
    const editorRef = useRef(null);
    const quillRef = useRef(null);

    useEffect(() => {
        if (!document.querySelector('#quill-css')) {
            const link = document.createElement('link');
            link.id = 'quill-css';
            link.rel = 'stylesheet';
            link.href = 'https://cdnjs.cloudflare.com/ajax/libs/quill/1.3.7/quill.snow.min.css';
            document.head.appendChild(link);
        }

        if (!window.Quill) {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/quill/1.3.7/quill.min.js';
            script.onload = initializeQuill;
            document.head.appendChild(script);
        } else {
            initializeQuill();
        }

        return () => {
            if (quillRef.current) {
                quillRef.current = null;
            }
        };
    }, []);

    const initializeQuill = () => {
        if (window.Quill && editorRef.current && !quillRef.current) {
            quillRef.current = new window.Quill(editorRef.current, {
                theme: 'snow',
                placeholder: placeholder,
                modules: {
                    toolbar: [
                        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        ['link', 'image'],
                        ['clean']
                    ]
                }
            });

            if (value) {
                quillRef.current.root.innerHTML = value;
            }

            quillRef.current.on('text-change', () => {
                const html = quillRef.current.root.innerHTML;
                onChange(html);
            });
        }
    };

    useEffect(() => {
        if (quillRef.current && value !== quillRef.current.root.innerHTML) {
            quillRef.current.root.innerHTML = value || '';
        }
    }, [value]);

    return (
        <div className="quill-wrapper">
            <div ref={editorRef} style={{ minHeight: '200px' }} />
        </div>
    );
};

export default function Highlight() {
    const { props } = usePage();
    const { seo_highlights, flash } = props;
    const [editingHighlight, setEditingHighlight] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('');
    const [imagePreview, setImagePreview] = useState('');
    const imageRef = useRef(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        image: null,
        heading: '',
        description: '',
    });

    const showAlert = (message, type = 'success') => {
        setAlertMessage(message);
        setAlertType(type);
        setTimeout(() => {
            setAlertMessage('');
            setAlertType('');
        }, 4000);
    };

    const resetForm = () => {
        reset();
        setData({
            image: null,
            heading: '',
            description: '',
        });
        clearErrors();
        setEditingHighlight(null);
        setImagePreview('');
        if (imageRef.current) imageRef.current.value = '';
    };

    const handleEdit = (highlight) => {
        setEditingHighlight(highlight);
        setData({
            image: null,
            heading: highlight.heading,
            description: highlight.description,
        });
        setImagePreview(highlight.image ? `/${highlight.image}` : '');
        clearErrors();
        document.getElementById('highlightForm').scrollIntoView({ behavior: 'smooth' });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image', file);
            const reader = new FileReader();
            reader.onload = (e) => setImagePreview(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = () => {
        if (editingHighlight) {
            put(route('seo-highlights.update', editingHighlight.id), {
                data,
                forceFormData: true,
                onSuccess: () => {
                    resetForm();
                    showAlert('SEO highlight updated successfully!');
                },
                onError: () => {
                    showAlert('Failed to update SEO highlight. Please check the form.', 'error');
                },
            });
        } else {
            post(route('seo-highlights.store'), {
                data,
                forceFormData: true,
                onSuccess: () => {
                    resetForm();
                    showAlert('SEO highlight created successfully!');
                },
                onError: () => {
                    showAlert('Failed to create SEO highlight. Please check the form.', 'error');
                },
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this SEO highlight?')) {
            router.delete(route('seo-highlights.destroy', id), {
                onSuccess: () => showAlert('SEO highlight deleted successfully!'),
                onError: () => showAlert('Failed to delete SEO highlight.', 'error'),
            });
        }
    };

    return (
        <Layout>
            <div className="p-6 max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">SEO Highlights Management</h1>
                    <Button onClick={resetForm} as="a" href="#highlightForm">
                        <Plus className="w-4 h-4 mr-2" /> Add SEO Highlight
                    </Button>
                </div>

                {/* Alerts */}
                {alertMessage && (
                    <div className={`mb-4 p-4 rounded-lg ${alertType === 'success' ? 'bg-green-100 border border-green-400 text-green-700' : 'bg-red-100 border border-red-400 text-red-700'}`}>
                        {alertMessage}
                    </div>
                )}
                {flash?.success && (
                    <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                        {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                        {flash.error}
                    </div>
                )}

                {/* Highlights Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {seo_highlights.length === 0 ? (
                        <div className="col-span-full text-center py-12">
                            <p className="text-gray-500 text-lg mb-2">No SEO highlights found</p>
                            <p className="text-sm">Click "Add SEO Highlight" to create one</p>
                        </div>
                    ) : (
                        seo_highlights.map((highlight) => (
                            <div key={highlight.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                {highlight.image && (
                                    <div className="relative">
                                        <img src={`/${highlight.image}`} alt={highlight.heading} className="w-full h-48 object-cover" />
                                        <div className="absolute top-2 right-2 flex gap-2">
                                            <Button size="icon" onClick={() => handleEdit(highlight)} title="Edit Highlight">
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button size="icon" variant="destructive" onClick={() => handleDelete(highlight.id)} title="Delete Highlight">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                                <div className="p-4">
                                    <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">{highlight.heading}</h3>
                                    <div
                                        className="text-gray-600 text-sm mb-3 line-clamp-3"
                                        dangerouslySetInnerHTML={{ __html: highlight.description }}
                                    />
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Highlight Form */}
                <div id="highlightForm" className="bg-white rounded-xl shadow-lg border border-gray-200">
                    <div className="p-8">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{editingHighlight ? 'Edit SEO Highlight' : 'Add New SEO Highlight'}</h2>
                                <p className="text-gray-600 mt-1">{editingHighlight ? 'Update the SEO highlight details' : 'Create a new SEO highlight'}</p>
                            </div>
                            {editingHighlight && (
                                <Button variant="ghost" onClick={resetForm}>
                                    <X className="w-4 h-4 mr-2" /> Cancel
                                </Button>
                            )}
                        </div>

                        {/* Form Errors */}
                        {Object.keys(errors).length > 0 && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <h3 className="text-sm font-medium text-red-800 mb-2">Please fix the following errors:</h3>
                                <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                                    {Object.values(errors).map((error, index) => (
                                        <li key={index}>{error}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Form Fields */}
                        <div className="space-y-6">
                            <div>
                                <Label className="block text-sm font-semibold text-gray-700 mb-2">Image (400x400, optional)</Label>
                                <Input
                                    ref={imageRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                                {imagePreview && (
                                    <div className="mt-3">
                                        <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover rounded-lg border" />
                                    </div>
                                )}
                                {errors.image && <p className="text-sm text-red-600 mt-1">{errors.image}</p>}
                            </div>
                            <div>
                                <Label className="block text-sm font-semibold text-gray-700 mb-2">Heading *</Label>
                                <Input
                                    value={data.heading}
                                    onChange={(e) => setData('heading', e.target.value)}
                                    placeholder="SEO highlight heading"
                                />
                                {errors.heading && <p className="text-sm text-red-600 mt-1">{errors.heading}</p>}
                            </div>
                            <div>
                                <Label className="block text-sm font-semibold text-gray-700 mb-2">Description *</Label>
                                <QuillEditor
                                    value={data.description}
                                    onChange={(content) => setData('description', content)}
                                    placeholder="Write a compelling description..."
                                />
                                {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                            <Button variant="outline" onClick={resetForm} disabled={processing}>
                                {editingHighlight ? 'Cancel' : 'Reset'}
                            </Button>
                            <Button onClick={handleSubmit} disabled={processing}>
                                {processing ? (editingHighlight ? 'Updating...' : 'Creating...') : (editingHighlight ? 'Update Highlight' : 'Create Highlight')}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}