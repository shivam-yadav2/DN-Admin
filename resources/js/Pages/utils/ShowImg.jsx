import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { ImagePlus, Plus } from "lucide-react";

export default function ShowImg({ img, setImg }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="mr-3">
                    View Reference Page: <ImagePlus className="w-4 h-4 mr-2" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Reference Page Image</DialogTitle>
                    <DialogDescription>
                        <img src={img} alt="Reference Page" />
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
