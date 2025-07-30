import { useState } from "react";
import { useForm, usePage, router } from "@inertiajs/react";
import { Plus, Edit, Trash2, X, Mail, Phone, MessageCircle, MapPin, Building } from "lucide-react";
import Layout from "@/Layouts/Layout";

const ContactDetail = () => {
    const { contactDetails, flash } = usePage().props;
    const [editingContact, setEditingContact] = useState(null);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("");

    // Single form for both create and edit
    const form = useForm({
        email: [],
        phone_no: [],
        whatsapp_no: [],
        location: "",
    });

    const showAlert = (message, type = 'success') => {
        setAlertMessage(message);
        setAlertType(type);
        setTimeout(() => {
            setAlertMessage("");
            setAlertType("");
        }, 4000);
    };

    const resetForm = () => {
        form.reset();
        form.setData({
            email: [""],
            phone_no: [""],
            whatsapp_no: [""],
            location: "",
        });
        form.clearErrors();
        setEditingContact(null);
    };

    const handleEdit = (contact) => {
        setEditingContact(contact);
        form.setData({
            email: contact.email || [""],
            phone_no: contact.phone_no || [""],
            whatsapp_no: contact.whatsapp_no || [""],
            location: contact.location || "",
        });
        form.clearErrors();
        
        // Scroll to form
        document.getElementById('contactForm').scrollIntoView({ behavior: 'smooth' });
    };

    const handleSubmit = () => {
        const cleanedData = {
            ...form.data,
            email: form.data.email.filter((e) => e.trim()),
            phone_no: form.data.phone_no.filter((p) => p.trim()),
            whatsapp_no: form.data.whatsapp_no.filter((w) => w.trim()),
        };

        if (editingContact) {
            // Update existing contact
            form.put(route("contact-details.update", editingContact.id), {
                data: cleanedData,
                onSuccess: () => {
                    resetForm();
                    showAlert("Contact details updated successfully!");
                },
                onError: (errors) => {
                    showAlert("Failed to update contact details. Please check the form.", errors);
                },
            });
        } else {
            // Create new contact
            form.post(route("contact-details.store"), {
                data: cleanedData,
                onSuccess: () => {
                    resetForm();
                    showAlert("Contact details created successfully!");
                },
                onError: (errors) => {
                    showAlert("Failed to create contact details. Please check the form.", errors);
                },
            });
        }
    };

    const handleDelete = (id) => {
        router.delete(route("contact-details.destroy", id), {
            onSuccess: () => {
                showAlert("Contact details deleted successfully!");
            },
            onError: (errors) => {
                showAlert("Failed to delete contact details.", "error");
            },
        });
    };

    return (
        <Layout>
            <div className="p-6 max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Contact Details Management
                    </h1>
                    <a href="#contactForm">
                        <button 
                            onClick={() => resetForm()}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Add Contact Details
                        </button>
                    </a>
                </div>

                {/* Alert Box */}
                {alertMessage && (
                    <div className={`mb-4 p-4 rounded-lg ${
                        alertType === 'success' 
                            ? 'bg-green-100 border border-green-400 text-green-700'
                            : 'bg-red-100 border border-red-400 text-red-700'
                    }`}>
                        {alertMessage}
                    </div>
                )}

                {/* Flash Messages */}
                {flash?.message && (
                    <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                        {flash.message}
                    </div>
                )}

                {/* Contact Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {contactDetails && contactDetails.length === 0 ? (
                        <div className="col-span-full text-center py-12">
                            <div className="text-gray-500">
                                <Building className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                <div className="text-lg mb-2">No contact details found</div>
                                <div className="text-sm">Click "Add Contact Details" to create your first contact entry</div>
                            </div>
                        </div>
                    ) : (
                        contactDetails?.map((contact) => (
                            <div key={contact.id} className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-2">
                                            <Building className="w-5 h-5 text-blue-600" />
                                            <h3 className="font-semibold text-lg text-gray-900">
                                                Contact Details #{contact.id}
                                            </h3>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(contact)}
                                                className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
                                                title="Edit Contact"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(contact.id)}
                                                className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                                                title="Delete Contact"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Location */}
                                    <div className="mb-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <MapPin className="w-4 h-4 text-gray-500" />
                                            <span className="text-sm font-medium text-gray-700">Location</span>
                                        </div>
                                        <p className="text-gray-600 text-sm pl-6">
                                            {contact.location}
                                        </p>
                                    </div>

                                    {/* Emails */}
                                    <div className="mb-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Mail className="w-4 h-4 text-gray-500" />
                                            <span className="text-sm font-medium text-gray-700">
                                                Email Addresses ({contact.email?.length || 0})
                                            </span>
                                        </div>
                                        <div className="space-y-1 pl-6">
                                            {contact.email?.map((email, index) => (
                                                <div key={index} className="text-sm text-blue-600 hover:text-blue-800">
                                                    <a href={`mailto:${email}`}>{email}</a>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Phone Numbers */}
                                    <div className="mb-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Phone className="w-4 h-4 text-gray-500" />
                                            <span className="text-sm font-medium text-gray-700">
                                                Phone Numbers ({contact.phone_no?.length || 0})
                                            </span>
                                        </div>
                                        <div className="space-y-1 pl-6">
                                            {contact.phone_no?.map((phone, index) => (
                                                <div key={index} className="text-sm text-green-600 hover:text-green-800">
                                                    <a href={`tel:${phone}`}>{phone}</a>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* WhatsApp Numbers */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <MessageCircle className="w-4 h-4 text-gray-500" />
                                            <span className="text-sm font-medium text-gray-700">
                                                WhatsApp Numbers ({contact.whatsapp_no?.length || 0})
                                            </span>
                                        </div>
                                        <div className="space-y-1 pl-6">
                                            {contact.whatsapp_no?.map((whatsapp, index) => (
                                                <div key={index} className="text-sm text-green-600 hover:text-green-800">
                                                    <a href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer">
                                                        {whatsapp}
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Created Date */}
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <span className="text-xs text-gray-500">
                                            Created: {new Date(contact.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Contact Form */}
                <div id="contactForm" className="bg-white rounded-xl shadow-lg border border-gray-200">
                    <div className="p-8">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {editingContact ? "Edit Contact Details" : "Add New Contact Details"}
                                </h2>
                                <p className="text-gray-600 mt-1">
                                    {editingContact 
                                        ? "Update the contact information" 
                                        : "Create new contact details for your organization"
                                    }
                                </p>
                            </div>
                            {editingContact && (
                                <button
                                    onClick={resetForm}
                                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                                    title="Cancel Edit"
                                >
                                    <X className="w-4 h-4" />
                                    Cancel
                                </button>
                            )}
                        </div>

                        {/* Display Form Errors */}
                        {Object.keys(form.errors).length > 0 && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <h3 className="text-sm font-medium text-red-800 mb-2">Please fix the following errors:</h3>
                                <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                                    {Object.values(form.errors).map((error, index) => (
                                        <li key={index}>{error}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Form Fields */}
                        <div className="space-y-6">
                            {/* Location */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    <MapPin className="w-4 h-4 inline mr-1" />
                                    Business Location *
                                </label>
                                <textarea
                                    value={form.data.location}
                                    onChange={(e) => form.setData("location", e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                    placeholder="Enter your complete business address..."
                                />
                                {form.errors.location && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {form.errors.location}
                                    </p>
                                )}
                            </div>

                            {/* Email Addresses */}
                            <SingleInputArray
                                form={form}
                                field="email"
                                label="Email Addresses"
                                placeholder="Add an email address"
                                icon={<Mail className="w-4 h-4" />}
                                inputType="email"
                            />

                            {/* Phone Numbers */}
                            <SingleInputArray
                                form={form}
                                field="phone_no"
                                label="Phone Numbers"
                                placeholder="Add a phone number"
                                icon={<Phone className="w-4 h-4" />}
                                inputType="tel"
                            />

                            {/* WhatsApp Numbers */}
                            <SingleInputArray
                                form={form}
                                field="whatsapp_no"
                                label="WhatsApp Numbers"
                                placeholder="Add a WhatsApp number"
                                icon={<MessageCircle className="w-4 h-4" />}
                                inputType="tel"
                            />
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                            <button
                                onClick={resetForm}
                                disabled={form.processing}
                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
                            >
                                {editingContact ? "Cancel" : "Reset"}
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={form.processing}
                                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {form.processing
                                    ? (editingContact ? "Updating..." : "Creating...")
                                    : (editingContact ? "Update Contact Details" : "Create Contact Details")
                                }
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ContactDetail;

// Enhanced SingleInputArray component with icons and input types
const SingleInputArray = ({ form, field, label, placeholder, icon, inputType = "text" }) => {
    const [tempValue, setTempValue] = useState("");

    const handleAdd = () => {
        if (tempValue.trim() !== "") {
            form.setData({
                ...form.data,
                [field]: [...form.data[field], tempValue.trim()]
            });
            setTempValue("");
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAdd();
        }
    };

    const handleRemove = (index) => {
        const updated = form.data[field].filter((_, i) => i !== index);
        form.setData({
            ...form.data,
            [field]: updated
        });
    };

    const getActionIcon = (item, field) => {
        if (field === 'email') {
            return <Mail className="w-3 h-3" />;
        } else if (field === 'phone_no') {
            return <Phone className="w-3 h-3" />;
        } else if (field === 'whatsapp_no') {
            return <MessageCircle className="w-3 h-3" />;
        }
        return null;
    };

    const getActionLink = (item, field) => {
        if (field === 'email') {
            return `mailto:${item}`;
        } else if (field === 'phone_no') {
            return `tel:${item}`;
        } else if (field === 'whatsapp_no') {
            return `https://wa.me/${item.replace(/[^0-9]/g, '')}`;
        }
        return '#';
    };

    return (
        <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                {icon}
                {label} *
            </label>
            <div className="flex gap-3">
                <input
                    type={inputType}
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={placeholder}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <button
                    type="button"
                    onClick={handleAdd}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                    Add
                </button>
            </div>

            {/* Show added items */}
            <div className="space-y-2">
                {form.data[field].map((item, index) => (
                    item.trim() && (
                        <div
                            key={index}
                            className="flex justify-between items-center px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg"
                        >
                            <div className="flex items-center gap-2 flex-1">
                                {getActionIcon(item, field)}
                                <a 
                                    href={getActionLink(item, field)}
                                    target={field === 'whatsapp_no' ? '_blank' : undefined}
                                    rel={field === 'whatsapp_no' ? 'noopener noreferrer' : undefined}
                                    className="text-gray-800 hover:text-blue-600 transition-colors"
                                >
                                    {item}
                                </a>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleRemove(index)}
                                className="text-red-600 hover:text-red-800 transition-colors font-medium"
                            >
                                Remove
                            </button>
                        </div>
                    )
                ))}
            </div>
            
            {form.errors[field] && (
                <p className="text-sm text-red-600">
                    {form.errors[field]}
                </p>
            )}
        </div>
    );
};