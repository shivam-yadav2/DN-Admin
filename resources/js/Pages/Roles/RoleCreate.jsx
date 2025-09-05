// resources/js/Pages/Roles/RoleCreate.jsx
import { useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";
import Layout from "@/Layouts/Layout";
// import { MultiSelect } from "react-multi-select-component";
import { useState } from "react";
import { usePage } from "@inertiajs/react";
import Multiselect from "multiselect-react-dropdown";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
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
} from "@/components/ui/alert-dialog";

const options = [
    { name: "Option 1️⃣", id: 1 },
    { name: "Option 2️⃣", id: 2 },
];

export default function RoleCreate() {
    const { props } = usePage();
    const { permissions } = props;
    console.log(props);
    const [selected, setSelected] = useState();
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        permissions: [],
    });

    useEffect(() => {
        return () => {
            reset();
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        data.permissions = selected.map((s) => s.name);
        post("/roles");
    };

    return (
        <Layout>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Create Role</h1>
                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            required
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm">
                                {errors.name}
                            </p>
                        )}
                    </div>
                    <div>
                        <Label htmlFor="guard_name">Add Permissions</Label>
                        {/* <pre>{JSON.stringify(selected)}</pre> */}
                        
                        <Multiselect
                            options={permissions?.data} // Options to display in the dropdown
                            selectedValues={selected} // Preselected value to persist in dropdown
                            onSelect={setSelected} // Function will trigger on select event
                            onRemove={setSelected} // Function will trigger on remove event
                            displayValue="name" // Property name to display in the dropdown options
                        />
                        
                    </div>
                    <Button type="submit" disabled={processing}>
                        Create
                    </Button>
                </form>
            </div>
        </Layout>
    );
}
