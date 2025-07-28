
import { useState } from "react";
import { Link, useForm, usePage } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
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
import Layout from "@/Layouts/Layout";

export default function FAQPage() {
  const { faqs } = usePage().props;
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

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>{editingId ? "Edit FAQ" : "Add FAQ"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Question"
                  value={data.question}
                  onChange={(e) => setData("question", e.target.value)}
                  className="w-full"
                />
                {errors.question && (
                  <span className="text-red-500 text-sm">{errors.question}</span>
                )}
              </div>
              <div>
                <Input
                  type="text"
                  placeholder="Answer"
                  value={data.answer}
                  onChange={(e) => setData("answer", e.target.value)}
                  className="w-full"
                />
                {errors.answer && (
                  <span className="text-red-500 text-sm">{errors.answer}</span>
                )}
              </div>
              <Button type="submit" disabled={processing}>
                {editingId ? "Update FAQ" : "Add FAQ"}
              </Button>
              {editingId && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingId(null);
                    reset();
                  }}
                >
                  Cancel
                </Button>
              )}
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 grid gap-4">
          {faqs?.map((faq) => (
            <Card key={faq.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">{faq.question}</h3>
                  <p className="text-sm text-gray-500">{faq.answer}</p>
                </div>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => handleEdit(faq)}
                    disabled={processing}
                  >
                    Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(faq.id)}
                        disabled={processing}
                      >
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this FAQ? This action
                          cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}