import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import SpacesService from '../../services/spacesService';
import UserService from '../../services/userService';
import TransactionsService from '../../services/transactionsService';
import Button from 'components/button';
import AddTransactionModal from 'components/transactions/addTransactionModal';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from 'components/table';
import ThemeToggle from 'components/themeToggle';
import { DataTable, columns } from "components/transactions/transactionsDataTable";


const SpacesDashboard: React.FC = () => {
    const router = useRouter();
    const { pid } = router.query;
    const [space, setSpace] = useState<any>(null);
    const [user, setUser] = useState<any>(null);
    const [loadingTransactions, setLoadingTransactions] = useState<boolean>(false);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [openAddTransaction, setOpenAddTransaction] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchSpaceAndUser = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('authToken');
                if (token && pid) {
                    const responses = await Promise.all([await SpacesService.getSpaceById(token, pid as string), await UserService.getUserData(token)])
                    const spaceResponse = responses[0];
                    const userResponse = responses[1];
                    setSpace(spaceResponse.data);
                    setUser(userResponse.data);
                    setLoading(false);
                }
            } catch (error) {
                console.log('Error fetching space:', error);
                router.push('/login');
            }
        };
        fetchSpaceAndUser();
    }, [pid]);

    useEffect(() => {
        if (user && space) {
            const fetchTransactions = async () => {
                try {
                    setLoadingTransactions(true);
                    const token = localStorage.getItem('authToken');
                    if (token) {
                        const response = await TransactionsService.getTransactions(token, space.id, {});
                        setTransactions(response.data);
                        setLoadingTransactions(false);
                    }
                } catch (error) {
                    console.log('Error fetching transactions:', error);
                }
            };
            fetchTransactions();
        }
    }, [user, space]);

    if (loading || !space || !user) {
        return <p>Loading space...</p>;
    }

    return (
        <>
            <div className='p-8 flex flex-col'>
                <div className='flex'>
                    <div>
                        <h1 className='text-3xl font-li mb-1'>Spaces / <span className='text-slate-400 font-light'>{space?.name}</span></h1>
                        <p className='text-sm text-slate-400'>{space?.description}</p>
                    </div>
                    <div className='ml-auto'>
                        <ThemeToggle />
                    </div>
                </div>
                <div className='mt-4'>
                    <Button size='sm' onClick={() => setOpenAddTransaction(true)}>Add Transaction</Button>
                </div>
            </div>
            <AddTransactionModal open={openAddTransaction} setOpen={setOpenAddTransaction} userId={user.uuid} spaceId={space.id} />
            <div className='p-8'>
                {loadingTransactions && (
                    <p>Loading transactions...</p>
                )}
                {!loadingTransactions && transactions.length === 0 && (
                    <p>No transactions found.</p>
                )}
                {!loadingTransactions && transactions.length > 0 && (
                    <DataTable data={transactions} columns={columns} />
                )}
            </div>
        </>
    );
};

export default SpacesDashboard;