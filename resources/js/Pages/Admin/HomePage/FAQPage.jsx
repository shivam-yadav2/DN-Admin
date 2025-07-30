import { useState } from "react";
import { Link, useForm, usePage } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/Components/ui/alert-dialog";
import { Badge } from "@/Components/ui/badge";
import { Separator } from "@/Components/ui/separator";
import Layout from "@/Layouts/Layout";
import {
  HelpCircle,
  Plus,
  Edit3,
  Trash2,
  Calendar,
  CheckCircle2,
  XCircle,
  Save,
  X,
  MessageCircleQuestion,
  MessageSquare
} from "lucide-react";

export default function FAQPage() {
  const { faqs, flash } = usePage().props;
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const {
    data,
    setData,
    post,
    put,
    delete: destroy,
    processing,
    errors,
    reset,
  } = useForm({
    question: "",
    answer: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      put(`/faqs/${editingId}`, {
        onSuccess: () => {
          setEditingId(null);
          reset();
        },
      });
    } else {
      post("/faqs", {
        onSuccess: () => reset(),
      });
    }
  };

  const handleEdit = (faq) => {
    setEditingId(faq.id);
    setData({
      question: faq.question,
      answer: faq.answer,
    });
  };

  const handleDelete = (id) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      destroy(`/faqs/${deleteId}`, {
        onSuccess: () => {
          setDeleteId(null);
        },
      });
    }
  };

  const isFormValid = data.question && data.answer;

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-100">
        <div className="container mx-auto p-6 max-w-7xl">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
              <HelpCircle className="h-10 w-10 text-purple-600" />
              FAQ Management
            </h1>
            <p className="text-lg text-gray-600">
              Create and manage frequently asked questions for your users
            </p>
          </div>

          {/* Flash Messages */}
          {flash?.message && (
            <Alert className="mb-6 border-green-200 bg-green-50 max-w-4xl mx-auto">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {flash.message}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <div className="space-y-6">
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    {editingId ? (
                      <>
                        <Edit3 className="h-5 w-5" />
                        Edit FAQ
                      </>
                    ) : (
                      <>
                        <Plus className="h-5 w-5" />
                        Add New FAQ
                      </>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Question Field */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <MessageCircleQuestion className="h-4 w-4 text-purple-600" />
                        Question
                      </label>
                      <Input
                        type="text"
                        placeholder="Enter your question here..."
                        value={data.question}
                        onChange={(e) => setData("question", e.target.value)}
                        className="w-full transition-all duration-200 focus:ring-2 focus:ring-purple-500"
                      />
                      {errors.question && (
                        <p className="text-red-500 text-sm flex items-center gap-1">
                          <XCircle className="h-3 w-3" />
                          {errors.question}
                        </p>
                      )}
                    </div>

                    {/* Answer Field */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-pink-600" />
                        Answer
                      </label>
                      <Textarea
                        placeholder="Provide a detailed answer..."
                        value={data.answer}
                        onChange={(e) => setData("answer", e.target.value)}
                        className="w-full min-h-[120px] transition-all duration-200 focus:ring-2 focus:ring-purple-500"
                        rows={5}
                      />
                      {errors.answer && (
                        <p className="text-red-500 text-sm flex items-center gap-1">
                          <XCircle className="h-3 w-3" />
                          {errors.answer}
                        </p>
                      )}
                    </div>

                    {/* Form Actions */}
                    <div className="flex gap-3 pt-4">
                      <Button
                        type="submit"
                        disabled={processing || !isFormValid}
                        className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 transition-all duration-200"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {processing ? "Processing..." : editingId ? "Update FAQ" : "Add FAQ"}
                      </Button>
                      {editingId && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setEditingId(null);
                            reset();
                          }}
                          className="hover:bg-gray-50"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* FAQ List Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  All FAQs ({faqs?.length || 0})
                </h2>
              </div>

              <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2">
                {faqs?.length === 0 ? (
                  <Card className="shadow-md">
                    <CardContent className="p-8 text-center">
                      <div className="text-gray-400 mb-4">
                        <HelpCircle className="h-12 w-12 mx-auto mb-2" />
                      </div>
                      <p className="text-gray-500 text-lg">No FAQs found</p>
                      <p className="text-gray-400 text-sm mt-2">
                        Add your first FAQ using the form on the left
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  faqs?.map((faq, index) => (
                    <Card key={faq.id} className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start gap-3">
                            <Badge 
                              variant="secondary" 
                              className="bg-purple-100 text-purple-700 px-2 py-1 text-xs font-semibold mt-1"
                            >
                              Q{index + 1}
                            </Badge>
                            <div className="flex-1">
                              <div className="flex items-start gap-2 mb-3">
                                <MessageCircleQuestion className="h-4 w-4 text-purple-600 mt-1 flex-shrink-0" />
                                <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                                  {faq.question}
                                </h3>
                              </div>
                              
                              <Separator className="my-3" />
                              
                              <div className="flex items-start gap-2">
                                <MessageSquare className="h-4 w-4 text-pink-600 mt-1 flex-shrink-0" />
                                <p className="text-gray-700 leading-relaxed text-sm">
                                  {faq.answer}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-2 ml-4 flex-shrink-0">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(faq)}
                              disabled={processing}
                              className="hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700 transition-colors"
                            >
                              <Edit3 className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDelete(faq.id)}
                                  disabled={processing}
                                  className="hover:bg-red-600 transition-colors"
                                >
                                  <Trash2 className="h-3 w-3 mr-1" />
                                  Delete
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="flex items-center gap-2">
                                    <Trash2 className="h-5 w-5 text-red-500" />
                                    Confirm Deletion
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this FAQ?
                                    <div className="mt-3 p-3 bg-gray-50 rounded text-sm">
                                      <strong>Q:</strong> {faq.question}
                                    </div>
                                    This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={confirmDelete}
                                    className="bg-red-500 hover:bg-red-600"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>

                        {/* Footer with metadata */}
                        {faq.created_at && (
                          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
                            <Calendar className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              Created: {new Date(faq.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}