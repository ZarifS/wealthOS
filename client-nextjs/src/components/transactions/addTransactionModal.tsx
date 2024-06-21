import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from 'components/dialog';
import { SUB_CATEGORIES, TOP_LEVEL_CATEGORIES } from '../../types/transactions';
import { Label } from '@radix-ui/react-label';
import Button from 'components/button';
import Input from 'components/input';
import { ChangeEvent, useState } from 'react';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from 'components/select';
import TransactionsService from '../../services/transactionsService';
import { useToast } from 'components/toast';

interface CreateTransactionDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    spaceId: string;
    userId: string;
}

const AddTransactionModal = ({ open, setOpen, spaceId, userId }: CreateTransactionDialogProps) => {
    const [type, setType] = useState('expense');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState<string>('');
    const [category, setCategory] = useState<string>('');
    const [subCategory, setSubCategory] = useState<string>('');
    const [date, setDate] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const token = localStorage.getItem('authToken');
    const { toast } = useToast();

    const handleOnClick = async () => {
        try {
            if (!amount || !category || !date) {
                setError('Amount, Category and Date are required.');
                return;
            }
            if (token) {
                setLoading(true);
                await TransactionsService.createTransaction(token, {
                    spaceId: spaceId,
                    ownerId: userId,
                    type: type,
                    amount: parseFloat(amount),
                    description: description,
                    category: [category, ...(subCategory ? [subCategory] : [])],
                    date: new Date(date),
                });
                setLoading(false);
                setOpen(false);
                toast({
                    title: 'Transaction added successfully',
                    description: `You have added a new transaction of $${amount} in ${category} on ${date}`,
                    variant: 'success'
                })
                setAmount('');
            }
        } catch (error: any) {
            console.log('Error creating transaction:', error);
            toast({
                title: 'Error creating transaction',
                description: error.message,
                variant: 'destructive'
            });
        }
    };

    // Handle input change for amount, only allow numbers with up to 2 decimal places
    const handleAmountInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value || '';

        // Regular expression to match the number with up to 2 decimal places
        const regex = /^\d*\.?\d{0,2}$/;

        // Only update the state if the value matches the regex
        if (regex.test(value)) {
            setAmount(value);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="" onInteractOutside={(event) => event.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>Add a new Transaction</DialogTitle>
                    <DialogDescription>
                        Transactions are where you track your spendings.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type">
                            Type
                        </Label>
                        <Select onValueChange={(value) => setType(value)} defaultValue='expense'>
                            <SelectTrigger className='col-span-3'>
                                <SelectValue placeholder={'Select a type'} />
                            </SelectTrigger>
                            <SelectContent className='col-span-3'>
                                <SelectGroup>
                                    <SelectItem value='expense'>
                                        Expense
                                    </SelectItem>
                                    <SelectItem value='income'>
                                        Income
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="amount">
                            Amount
                        </Label>
                        <Input
                            id="amount"
                            placeholder="$.."
                            className="col-span-3"
                            type='text'
                            value={amount}
                            onChange={(event) => handleAmountInputChange(event)}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description">
                            Description
                        </Label>
                        <Input
                            id="description"
                            placeholder="..."
                            className="col-span-3"
                            type='text'
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category">
                            Category
                        </Label>
                        <Select onValueChange={(value) => setCategory(value)}>
                            <SelectTrigger className='col-span-3'>
                                <SelectValue placeholder={'Select a category'} />
                            </SelectTrigger>
                            <SelectContent className='col-span-3'>
                                <SelectGroup>
                                    {TOP_LEVEL_CATEGORIES.map((subCategory) => (
                                        <SelectItem value={subCategory}>
                                            {subCategory}
                                        </SelectItem>

                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="subCategory">
                            Sub Category
                        </Label>
                        <Select disabled={!category} onValueChange={(value) => setSubCategory(value)}>
                            <SelectTrigger className='col-span-3'>
                                <SelectValue placeholder={'Select a sub-category (optional)'} />
                            </SelectTrigger>
                            <SelectContent className='col-span-3'>
                                {SUB_CATEGORIES[category]?.map((subCategoryOption: string) => (
                                    <SelectItem key={subCategoryOption} value={subCategoryOption}>
                                        {subCategoryOption}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="date">
                            Date
                        </Label>
                        <Input
                            id="date"
                            type="date"
                            className="col-span-3"
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                    {/* Render error if shown */}
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                </div>
                <DialogFooter>
                    <Button disabled={!amount || !category || !date || loading} onClick={handleOnClick}>
                        {loading ? 'Adding..' : 'Add Transaction'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
};

export default AddTransactionModal;
