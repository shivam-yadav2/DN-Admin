import React, { useState, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { Plus, Edit, Trash2,  Settings, Eye, EyeOff } from 'lucide-react';

// shadcn/ui components (you'll need to install these)
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Layout from '@/Layouts/Layout';

export default function Package({ packages, packageTypes , flash }) {
   
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showFeatureModal, setShowFeatureModal] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [selectedTab, setSelectedTab] = useState('all');
    const [showFeatures, setShowFeatures] = useState({});

    // Package form
    const packageForm = useForm({
        icon: '',
        package_for: '',
        package_name: '',
        price: '',
        description: '',
        label: '',
        audience: ''
    });

    // Feature form
    const featureForm = useForm({
        package_id: '',
        features: [{ key: '', value: '' }]
    });

    // Filter packages based on selected tab
    const filteredPackages = selectedTab === 'all' 
        ? packages 
        : packages.filter(pkg => pkg.package_for === selectedTab);

    // Handle package creation
    const handleCreatePackage = (e) => {
        e.preventDefault();
        packageForm.post('/packages', {
            onSuccess: () => {
                setShowCreateModal(false);
                packageForm.reset();
            }
        });
    };

    // Handle package update
    const handleUpdatePackage = (e) => {
        e.preventDefault();
        packageForm.put(`/packages/${selectedPackage.id}`, {
            onSuccess: () => {
                setShowEditModal(false);
                packageForm.reset();
                setSelectedPackage(null);
            }
        });
    };

    // Handle package deletion
    const handleDeletePackage = (packageId) => {
        if (confirm('Are you sure you want to delete this package?')) {
            router.delete(`/packages/${packageId}`);
        }
    };

    // Handle feature creation
    const handleCreateFeature = (e) => {
        e.preventDefault();
        featureForm.post('/package-features', {
            onSuccess: () => {
                setShowFeatureModal(false);
                featureForm.reset();
                featureForm.setData('features', [{ key: '', value: '' }]);
            }
        });
    };

    // Handle feature deletion
    const handleDeleteFeature = (featureId) => {
        if (confirm('Are you sure you want to delete this feature?')) {
            router.delete(`/package-features/${featureId}`);
        }
    };

    // Add feature field
    const addFeatureField = () => {
        featureForm.setData('features', [...featureForm.data.features, { key: '', value: '' }]);
    };

    // Remove feature field
    const removeFeatureField = (index) => {
        const newFeatures = featureForm.data.features.filter((_, i) => i !== index);
        featureForm.setData('features', newFeatures);
    };

    // Update feature field
    const updateFeatureField = (index, field, value) => {
        const newFeatures = featureForm.data.features.map((feature, i) => 
            i === index ? { ...feature, [field]: value } : feature
        );
        featureForm.setData('features', newFeatures);
    };

    // Open edit modal
    const openEditModal = (pkg) => {
        setSelectedPackage(pkg);
        packageForm.setData({
            icon: pkg.icon,
            package_for: pkg.package_for,
            package_name: pkg.package_name,
            price: pkg.price,
            description: pkg.description,
            label: pkg.label,
            audience: pkg.audience
        });
        setShowEditModal(true);
    };

    // Open feature modal
    const openFeatureModal = (pkg) => {
        featureForm.setData('package_id', pkg.id);
        setShowFeatureModal(true);
    };

    // Toggle feature visibility
    const toggleFeatures = (packageId) => {
        setShowFeatures(prev => ({
            ...prev,
            [packageId]: !prev[packageId]
        }));
    };

    return (
        <Layout>
            <Head title="Package Management" />
            
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-4xl font-bold text-gray-900 mb-2">Package Management</h1>
                                <p className="text-gray-600">Manage your company's service packages and features</p>
                            </div>
                            <Button 
                                onClick={() => setShowCreateModal(true)}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                Create Package
                            </Button>
                        </div>
                    </div>

                    {/* Flash Messages */}
                    {flash?.success && (
                        <Alert className="mb-6 border-green-200 bg-green-50 text-green-800">
                            <AlertDescription>{flash.success}</AlertDescription>
                        </Alert>
                    )}

                    {/* Package Filter Tabs */}
                    <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-6">
                        <TabsList className="grid grid-cols-7 w-full bg-white shadow-sm">
                            <TabsTrigger value="all" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                                All Packages
                            </TabsTrigger>
                            {packageTypes.map(type => (
                                <TabsTrigger 
                                    key={type} 
                                    value={type}
                                    className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                                >
                                    {type}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        <TabsContent value={selectedTab} className="mt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredPackages.map((pkg) => (
                                    <Card key={pkg.id} className="hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-white/80 backdrop-blur-sm">
                                        <CardHeader className="pb-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <div className="text-2xl">{pkg.icon}</div>
                                                    <div>
                                                        <CardTitle className="text-lg">{pkg.package_name}</CardTitle>
                                                        <Badge variant="secondary" className="mt-1">
                                                            {pkg.package_for}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-2xl font-bold text-blue-600">{pkg.price}</div>
                                                    <Badge variant="outline" className="text-xs">
                                                        {pkg.label}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="space-y-3">
                                            <p className="text-gray-600 text-sm">{pkg.description}</p>
                                            <div className="flex items-center text-sm text-gray-500">
                                                <span className="font-medium">Target Audience:</span>
                                                <span className="ml-2">{pkg.audience}</span>
                                            </div>

                                            {/* Features Section */}
                                            {pkg.features && pkg.features.length > 0 && (
                                                <div className="border-t pt-3">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-medium text-gray-700">
                                                            Features ({pkg.features.length})
                                                        </span>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => toggleFeatures(pkg.id)}
                                                        >
                                                            {showFeatures[pkg.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                        </Button>
                                                    </div>
                                                    
                                                    {showFeatures[pkg.id] && (
                                                        <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
                                                            {pkg.features.map((feature) => (
                                                                <div key={feature.id} className="flex justify-between items-center text-xs bg-gray-50 p-2 rounded">
                                                                    <span className="font-medium">{feature.feature_key}:</span>
                                                                    <div className="flex items-center space-x-2">
                                                                        <span>{feature.feature_value}</span>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() => handleDeleteFeature(feature.id)}
                                                                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                                                        >
                                                                            <Trash2 className="w-3 h-3" />
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </CardContent>

                                        <CardFooter className="flex justify-between">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => openFeatureModal(pkg)}
                                                className="flex items-center space-x-1"
                                            >
                                                <Settings className="w-4 h-4" />
                                                <span>Add Features</span>
                                            </Button>
                                            
                                            <div className="flex space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => openEditModal(pkg)}
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDeletePackage(pkg.id)}
                                                    className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </CardFooter>
                                    </Card>
                                ))}

                                {filteredPackages.length === 0 && (
                                    <div className="col-span-full text-center py-12">
                                        <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-600 mb-2">No packages found</h3>
                                        <p className="text-gray-400">Create your first package to get started</p>
                                    </div>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>

                    {/* Create Package Modal */}
                    <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>Create New Package</DialogTitle>
                                <DialogDescription>Add a new service package to your portfolio</DialogDescription>
                            </DialogHeader>
                            
                            <form onSubmit={handleCreatePackage} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="icon">Icon (Emoji)</Label>
                                        <Input
                                            id="icon"
                                            value={packageForm.data.icon}
                                            onChange={(e) => packageForm.setData('icon', e.target.value)}
                                            placeholder="📦"
                                            className="text-lg"
                                        />
                                        {packageForm.errors.icon && <span className="text-red-500 text-sm">{packageForm.errors.icon}</span>}
                                    </div>
                                    
                                    <div>
                                        <Label htmlFor="package_for">Package Type</Label>
                                        <Select onValueChange={(value) => packageForm.setData('package_for', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {packageTypes.map(type => (
                                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {packageForm.errors.package_for && <span className="text-red-500 text-sm">{packageForm.errors.package_for}</span>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="package_name">Package Name</Label>
                                        <Input
                                            id="package_name"
                                            value={packageForm.data.package_name}
                                            onChange={(e) => packageForm.setData('package_name', e.target.value)}
                                            placeholder="Basic SEO Package"
                                        />
                                        {packageForm.errors.package_name && <span className="text-red-500 text-sm">{packageForm.errors.package_name}</span>}
                                    </div>
                                    
                                    <div>
                                        <Label htmlFor="price">Price</Label>
                                        <Input
                                            id="price"
                                            value={packageForm.data.price}
                                            onChange={(e) => packageForm.setData('price', e.target.value)}
                                            placeholder="$99/month"
                                        />
                                        {packageForm.errors.price && <span className="text-red-500 text-sm">{packageForm.errors.price}</span>}
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={packageForm.data.description}
                                        onChange={(e) => packageForm.setData('description', e.target.value)}
                                        placeholder="Describe your package..."
                                        rows={3}
                                    />
                                    {packageForm.errors.description && <span className="text-red-500 text-sm">{packageForm.errors.description}</span>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="label">Label</Label>
                                        <Input
                                            id="label"
                                            value={packageForm.data.label}
                                            onChange={(e) => packageForm.setData('label', e.target.value)}
                                            placeholder="Popular, Premium, etc."
                                        />
                                        {packageForm.errors.label && <span className="text-red-500 text-sm">{packageForm.errors.label}</span>}
                                    </div>
                                    
                                    <div>
                                        <Label htmlFor="audience">Target Audience</Label>
                                        <Input
                                            id="audience"
                                            value={packageForm.data.audience}
                                            onChange={(e) => packageForm.setData('audience', e.target.value)}
                                            placeholder="Small businesses, Startups, etc."
                                        />
                                        {packageForm.errors.audience && <span className="text-red-500 text-sm">{packageForm.errors.audience}</span>}
                                    </div>
                                </div>

                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={packageForm.processing}>
                                        {packageForm.processing ? 'Creating...' : 'Create Package'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>

                    {/* Edit Package Modal */}
                    <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>Edit Package</DialogTitle>
                                <DialogDescription>Update package information</DialogDescription>
                            </DialogHeader>
                            
                            <form onSubmit={handleUpdatePackage} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="edit_icon">Icon (Emoji)</Label>
                                        <Input
                                            id="edit_icon"
                                            value={packageForm.data.icon}
                                            onChange={(e) => packageForm.setData('icon', e.target.value)}
                                            className="text-lg"
                                        />
                                    </div>
                                    
                                    <div>
                                        <Label htmlFor="edit_package_for">Package Type</Label>
                                        <Select value={packageForm.data.package_for} onValueChange={(value) => packageForm.setData('package_for', value)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {packageTypes.map(type => (
                                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="edit_package_name">Package Name</Label>
                                        <Input
                                            id="edit_package_name"
                                            value={packageForm.data.package_name}
                                            onChange={(e) => packageForm.setData('package_name', e.target.value)}
                                        />
                                    </div>
                                    
                                    <div>
                                        <Label htmlFor="edit_price">Price</Label>
                                        <Input
                                            id="edit_price"
                                            value={packageForm.data.price}
                                            onChange={(e) => packageForm.setData('price', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="edit_description">Description</Label>
                                    <Textarea
                                        id="edit_description"
                                        value={packageForm.data.description}
                                        onChange={(e) => packageForm.setData('description', e.target.value)}
                                        rows={3}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="edit_label">Label</Label>
                                        <Input
                                            id="edit_label"
                                            value={packageForm.data.label}
                                            onChange={(e) => packageForm.setData('label', e.target.value)}
                                        />
                                    </div>
                                    
                                    <div>
                                        <Label htmlFor="edit_audience">Target Audience</Label>
                                        <Input
                                            id="edit_audience"
                                            value={packageForm.data.audience}
                                            onChange={(e) => packageForm.setData('audience', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => setShowEditModal(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={packageForm.processing}>
                                        {packageForm.processing ? 'Updating...' : 'Update Package'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>

                    {/* Add Features Modal */}
                    <Dialog open={showFeatureModal} onOpenChange={setShowFeatureModal}>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Add Package Features</DialogTitle>
                                <DialogDescription>Add multiple features to the package</DialogDescription>
                            </DialogHeader>
                            
                            <form onSubmit={handleCreateFeature} className="space-y-4">
                                <div className="space-y-4">
                                    {featureForm.data.features.map((feature, index) => (
                                        <div key={index} className="flex items-end space-x-2 p-4 border rounded-lg bg-gray-50">
                                            <div className="flex-1">
                                                <Label htmlFor={`feature_key_${index}`}>Feature Name</Label>
                                                <Input
                                                    id={`feature_key_${index}`}
                                                    value={feature.key}
                                                    onChange={(e) => updateFeatureField(index, 'key', e.target.value)}
                                                    placeholder="e.g., Keywords Research"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <Label htmlFor={`feature_value_${index}`}>Feature Value</Label>
                                                <Input
                                                    id={`feature_value_${index}`}
                                                    value={feature.value}
                                                    onChange={(e) => updateFeatureField(index, 'value', e.target.value)}
                                                    placeholder="e.g., Up to 50 keywords"
                                                />
                                            </div>
                                            {featureForm.data.features.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => removeFeatureField(index)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={addFeatureField}
                                    className="w-full"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Another Feature
                                </Button>

                                {featureForm.errors.features && (
                                    <div className="text-red-500 text-sm">
                                        {typeof featureForm.errors.features === 'string' 
                                            ? featureForm.errors.features 
                                            : JSON.stringify(featureForm.errors.features)
                                        }
                                    </div>
                                )}

                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => setShowFeatureModal(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={featureForm.processing}>
                                        {featureForm.processing ? 'Adding...' : 'Add Features'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </Layout>
    );
}