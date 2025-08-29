import React, { useState, useEffect } from "react";
import {
    Users,
    FileText,
    TrendingUp,
    Eye,
    Calendar,
    Bell,
    Settings,
    Activity,
    DollarSign,
    ShoppingCart,
    Download,
    Search,
    Filter,
    Plus,
    Edit3,
    Trash2,
    MoreHorizontal,
} from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area,
} from "recharts";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Layout from "@/Layouts/Layout";

const DashboardPage = () => {
    const [selectedTimeframe, setSelectedTimeframe] = useState("7d");
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            message: "New user registration",
            time: "2 min ago",
            type: "info",
        },
        {
            id: 2,
            message: "Page content updated",
            time: "15 min ago",
            type: "success",
        },
        {
            id: 3,
            message: "Server maintenance scheduled",
            time: "1 hour ago",
            type: "warning",
        },
    ]);

    // Sample data for charts
    const visitorsData = [
        { name: "Mon", visitors: 1200, pageViews: 2400 },
        { name: "Tue", visitors: 1900, pageViews: 3200 },
        { name: "Wed", visitors: 800, pageViews: 1600 },
        { name: "Thu", visitors: 1600, pageViews: 2800 },
        { name: "Fri", visitors: 2200, pageViews: 3600 },
        { name: "Sat", visitors: 1400, pageViews: 2200 },
        { name: "Sun", visitors: 1000, pageViews: 1800 },
    ];

    const revenueData = [
        { name: "Jan", revenue: 45000 },
        { name: "Feb", revenue: 52000 },
        { name: "Mar", revenue: 48000 },
        { name: "Apr", revenue: 61000 },
        { name: "May", revenue: 55000 },
        { name: "Jun", revenue: 67000 },
    ];

    const deviceData = [
        { name: "Desktop", value: 45, color: "#3B82F6" },
        { name: "Mobile", value: 35, color: "#10B981" },
        { name: "Tablet", value: 20, color: "#F59E0B" },
    ];

    const recentPages = [
        {
            id: 1,
            title: "Home Page",
            lastModified: "2 hours ago",
            status: "Published",
        },
        {
            id: 2,
            title: "About Us",
            lastModified: "1 day ago",
            status: "Draft",
        },
        {
            id: 3,
            title: "Services",
            lastModified: "3 days ago",
            status: "Published",
        },
        {
            id: 4,
            title: "Contact",
            lastModified: "1 week ago",
            status: "Published",
        },
    ];

    const StatCard = ({ icon: Icon, title, value, change, changeType }) => (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div
                        className={`p-3 rounded-lg ${
                            changeType === "positive"
                                ? "bg-green-100 text-green-600"
                                : changeType === "negative"
                                ? "bg-red-100 text-red-600"
                                : "bg-blue-100 text-blue-600"
                        }`}
                    >
                        <Icon size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-600">
                            {title}
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                            {value}
                        </p>
                    </div>
                </div>
                <div
                    className={`text-sm font-medium ${
                        changeType === "positive"
                            ? "text-green-600"
                            : changeType === "negative"
                            ? "text-red-600"
                            : "text-gray-600"
                    }`}
                >
                    {change}
                </div>
            </div>
        </div>
    );

    const ChartCard = ({ title, children, className = "" }) => (
        <div
            className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${className}`}
        >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {title}
            </h3>
            {children}
        </div>
    );

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white border-b border-gray-200">
                    <div className="px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Dashboard
                                </h1>
                                <p className="text-sm text-gray-600 mt-1">
                                    Welcome back, Admin. Here's what's happening
                                    with your website.
                                </p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="relative">
                                    <Search
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                        size={16}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                                    <Bell size={20} />
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        3
                                    </span>
                                </button>
                                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                                    <Settings size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            icon={Users}
                            title="Total Users"
                            value="12,543"
                            change="+12.5%"
                            changeType="positive"
                        />
                        <StatCard
                            icon={Eye}
                            title="Page Views"
                            value="45,210"
                            change="+8.3%"
                            changeType="positive"
                        />
                        <StatCard
                            icon={FileText}
                            title="Total Pages"
                            value="234"
                            change="+5"
                            changeType="positive"
                        />
                        <StatCard
                            icon={DollarSign}
                            title="Revenue"
                            value="$67,340"
                            change="+15.2%"
                            changeType="positive"
                        />
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <ChartCard title="Website Traffic">
                            <div className="flex space-x-4 mb-4">
                                {["7d", "30d", "90d"].map((period) => (
                                    <button
                                        key={period}
                                        onClick={() =>
                                            setSelectedTimeframe(period)
                                        }
                                        className={`px-3 py-1 text-sm rounded-lg ${
                                            selectedTimeframe === period
                                                ? "bg-blue-100 text-blue-700"
                                                : "text-gray-600 hover:bg-gray-100"
                                        }`}
                                    >
                                        {period}
                                    </button>
                                ))}
                            </div>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={visitorsData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Area
                                        type="monotone"
                                        dataKey="visitors"
                                        stackId="1"
                                        stroke="#3B82F6"
                                        fill="#3B82F6"
                                        fillOpacity={0.6}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="pageViews"
                                        stackId="1"
                                        stroke="#10B981"
                                        fill="#10B981"
                                        fillOpacity={0.6}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </ChartCard>

                        <ChartCard title="Revenue Overview">
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={revenueData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip
                                        formatter={(value) => [
                                            `$${value.toLocaleString()}`,
                                            "Revenue",
                                        ]}
                                    />
                                    <Bar
                                        dataKey="revenue"
                                        fill="#3B82F6"
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartCard>
                    </div>

                    {/* Lower Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Recent Pages */}
                        <div className="lg:col-span-2">
                            <ChartCard title="Recent Pages">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <div className="flex space-x-2">
                                            <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg">
                                                All
                                            </button>
                                            <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
                                                Published
                                            </button>
                                            <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
                                                Draft
                                            </button>
                                        </div>
                                        <button className="flex items-center space-x-2 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                                            <Plus size={16} />
                                            <span>Add Page</span>
                                        </button>
                                    </div>
                                    <div className="space-y-3">
                                        {recentPages.map((page) => (
                                            <div
                                                key={page.id}
                                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                            >
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {page.title}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        Modified{" "}
                                                        {page.lastModified}
                                                    </p>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <span
                                                        className={`px-2 py-1 text-xs rounded-full ${
                                                            page.status ===
                                                            "Published"
                                                                ? "bg-green-100 text-green-700"
                                                                : "bg-yellow-100 text-yellow-700"
                                                        }`}
                                                    >
                                                        {page.status}
                                                    </span>
                                                    <div className="flex space-x-1">
                                                        <button className="p-1 text-gray-600 hover:bg-gray-200 rounded">
                                                            <Edit3 size={14} />
                                                        </button>
                                                        <button className="p-1 text-gray-600 hover:bg-gray-200 rounded">
                                                            <Trash2 size={14} />
                                                        </button>
                                                        <button className="p-1 text-gray-600 hover:bg-gray-200 rounded">
                                                            <MoreHorizontal
                                                                size={14}
                                                            />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </ChartCard>
                        </div>

                        {/* Device Analytics & Notifications */}
                        <div className="space-y-6">
                            <ChartCard title="Device Analytics">
                                <ResponsiveContainer width="100%" height={200}>
                                    <PieChart>
                                        <Pie
                                            data={deviceData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {deviceData.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={entry.color}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value) => [
                                                `${value}%`,
                                                "Usage",
                                            ]}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="space-y-2 mt-4">
                                    {deviceData.map((device) => (
                                        <div
                                            key={device.name}
                                            className="flex items-center justify-between"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <div
                                                    className="w-3 h-3 rounded-full"
                                                    style={{
                                                        backgroundColor:
                                                            device.color,
                                                    }}
                                                />
                                                <span className="text-sm text-gray-600">
                                                    {device.name}
                                                </span>
                                            </div>
                                            <span className="text-sm font-medium">
                                                {device.value}%
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </ChartCard>

                            <ChartCard title="Recent Activity">
                                <div className="space-y-3">
                                    {notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                                        >
                                            <div
                                                className={`w-2 h-2 rounded-full mt-2 ${
                                                    notification.type === "info"
                                                        ? "bg-blue-500"
                                                        : notification.type ===
                                                          "success"
                                                        ? "bg-green-500"
                                                        : "bg-yellow-500"
                                                }`}
                                            />
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-900">
                                                    {notification.message}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {notification.time}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 py-2">
                                        View all activities
                                    </button>
                                </div>
                            </ChartCard>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <ChartCard title="Quick Actions">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <button className="flex flex-col items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                                <Plus
                                    className="text-blue-600 mb-2"
                                    size={24}
                                />
                                <span className="text-sm font-medium text-blue-600">
                                    Add Content
                                </span>
                            </button>
                            <button className="flex flex-col items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                                <Users
                                    className="text-green-600 mb-2"
                                    size={24}
                                />
                                <span className="text-sm font-medium text-green-600">
                                    Manage Users
                                </span>
                            </button>
                            <button className="flex flex-col items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                                <Activity
                                    className="text-purple-600 mb-2"
                                    size={24}
                                />
                                <span className="text-sm font-medium text-purple-600">
                                    Analytics
                                </span>
                            </button>
                            <button className="flex flex-col items-center p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
                                <Download
                                    className="text-orange-600 mb-2"
                                    size={24}
                                />
                                <span className="text-sm font-medium text-orange-600">
                                    Export Data
                                </span>
                            </button>
                        </div>
                    </ChartCard>
                </div>
            </div>
        </Layout>
    );
};

export default DashboardPage;