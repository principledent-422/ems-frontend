
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

const DynamicDialog = ({ trigger, title, description, content, footer, className }) => {
    return (

        <Dialog>
            <DialogTrigger asChild>
                {trigger}

            </DialogTrigger>
            <DialogContent className={className}>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>
                {content && <div className="grid gap-4 py-4">
                    {content}
                </div>}
                {footer && <DialogFooter>
                    {footer}
                </DialogFooter>}
            </DialogContent>
        </Dialog>

    )
}


export default DynamicDialog;